import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { ImagePlus, Trash2 } from "lucide-react";
import ButtonSm from "./Button";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

const getCroppedImage = async (src: string, crop: any): Promise<File> => {
  const image = await createImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to get canvas context");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Image crop failed"));
        return;
      }
      resolve(
        new File([blob], `thumbnail-${Date.now()}.jpg`, {
          type: "image/jpeg",
        })
      );
    }, "image/jpeg");
  });
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export type ImageUploaderValue = File | string | null;

interface ImageUploaderProps {
  label?: string;
  initialPreview?: string | null;
  aspectRatio?: number;
  heightClass?: string;
  disabled?: boolean;
  returnType?: "file" | "dataUrl";
  resetSignal?: number;
  onChange?: (value: ImageUploaderValue) => void;
  onRemove?: () => void;
}

const ImageUploader = ({
  label = "Upload thumbnail",
  initialPreview = null,
  aspectRatio = 16 / 9,
  heightClass = "h-40",
  disabled = false,
  returnType = "file",
  resetSignal,
  onChange,
  onRemove,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousUrlRef = useRef<string | null>(null);

  const emitChange = useCallback(
    async (file: File | null) => {
      if (!onChange) return;
      if (!file) {
        onChange(null);
        return;
      }

      if (returnType === "dataUrl") {
        const dataUrl = await fileToDataUrl(file);
        onChange(dataUrl);
        return;
      }

      onChange(file);
    },
    [onChange, returnType]
  );

  const resetState = useCallback((nextPreview: string | null) => {
    setPreview(nextPreview);
    setObjectUrl(null);
    setShowCropper(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    resetState(initialPreview ?? null);
  }, [initialPreview, resetSignal, resetState]);

  useEffect(() => {
    const previousUrl = previousUrlRef.current;
    if (
      previousUrl &&
      previousUrl !== objectUrl &&
      previousUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previousUrl);
    }
    previousUrlRef.current = objectUrl;

    return () => {
      if (
        previousUrlRef.current &&
        previousUrlRef.current.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [objectUrl]);

  const handleFileSelect = (file?: File) => {
    if (!file || disabled) return;
    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);
    setPreview(nextUrl);
    setShowCropper(true);
    setCroppedPixels(null);
    void emitChange(file);
  };

  const applyCrop = async () => {
    if (!preview || !croppedPixels) return;
    try {
      const croppedFile = await getCroppedImage(preview, croppedPixels);
      const nextUrl = URL.createObjectURL(croppedFile);
      setObjectUrl(nextUrl);
      setPreview(nextUrl);
      setShowCropper(false);
      setCroppedPixels(null);
      await emitChange(croppedFile);
    } catch (error) {
      console.error("Failed to crop image", error);
    }
  };

  const handleRemove = () => {
    resetState(null);
    onChange?.(null);
    onRemove?.();
  };

  const showEmptyState = useMemo(() => !preview, [preview]);

  return (
    <div className="w-full">
      <div
        className={`relative flex items-center justify-center rounded-xl border-2 border-dashed border-[#d1d3d9] bg-white ${heightClass}`}
      >
        {showEmptyState ? (
          <label
            className={`flex flex-col items-center gap-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <ImagePlus />
            <span className="text-sm text-[#4b5563]">{label}</span>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
          </label>
        ) : (
          <div className="relative h-full w-full">
            <img
              src={preview ?? ""}
              className="h-full w-full rounded-xl object-cover"
              alt="Uploaded thumbnail"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {showCropper && preview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80">
          <div className="w-[90vw] max-w-md rounded-xl bg-white p-4">
            <div className="relative h-72">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedArea) =>
                  setCroppedPixels(croppedArea)
                }
              />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-4 w-full"
            />
            <div className="mt-4 flex justify-end gap-3">
              <ButtonSm
                state="outline"
                onClick={() => {
                  setShowCropper(false);
                  setCroppedPixels(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Cancel
              </ButtonSm>
              <ButtonSm state="default" onClick={applyCrop}>
                Apply
              </ButtonSm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
