import { useEffect, useState, useCallback } from "react";
import { X, ImagePlus, Trash2 } from "lucide-react";
import Cropper from "react-easy-crop";
import Input from "../../../components/Common/Input";
import { useCreateCourse, useUpdateCourse } from "@/queries/CourseQuery";
import type { CourseResponse } from "@/types/courseTypes";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type Mode = "create" | "edit";

interface CourseFormModalProps {
  open: boolean;
  mode: Mode;
  onClose: () => void;
  course?: CourseResponse | null;
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

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
  const ctx = canvas.getContext("2d")!;

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

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(
        new File([blob!], "thumbnail.jpg", {
          type: "image/jpeg",
        })
      );
    }, "image/jpeg");
  });
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const CourseFormModal = ({
  open,
  mode,
  onClose,
  course,
}: CourseFormModalProps) => {
  const isEdit = mode === "edit";

  /* ------------------------------ FORM STATE ------------------------------ */
  const [courseName, setCourseName] = useState("");
  const [totalHours, setTotalHours] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [rawFile, setRawFile] = useState<File | null>(null);

  /* ------------------------------ IMAGE STATE ------------------------------ */
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<any>(null);

  const { mutate: createCourse, isPending: creating } = useCreateCourse();
  const { mutate: updateCourse, isPending: updating } = useUpdateCourse();

  /* ------------------------------ RESET LOGIC ------------------------------ */
  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setCourseName("");
      setTotalHours("");
      setPrice("");
      setDescription("");
      setImageSrc(null);
      setFinalImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedPixels(null);
      setShowCropper(false);
    }

    if (isEdit && course) {
      setCourseName(course.course_name);
      setTotalHours(course.total_hours);
      setPrice(Number(course.price));
      setDescription(course.description ?? "");
      setImageSrc(course.thumbnail_url || null);
    }
  }, [open, mode, isEdit, course]);

  /* ------------------------------ IMAGE HANDLERS ------------------------------ */
const handleFile = (file?: File) => {
  if (!file) return;

  setRawFile(file);          // ✅ store original file
  setFinalImage(file);      // ✅ fallback if no crop
  setImageSrc(URL.createObjectURL(file));
  setShowCropper(true);
};


  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedPixels(pixels);
  }, []);

const applyCrop = async () => {
  if (!imageSrc || !croppedPixels) return;

  const cropped = await getCroppedImage(imageSrc, croppedPixels);
  setFinalImage(cropped);               // ✅ overwrite with cropped file
  setImageSrc(URL.createObjectURL(cropped));
  setShowCropper(false);
};

  const removeImage = () => {
    setImageSrc(null);
    setFinalImage(null);
  };

  /* ------------------------------ SUBMIT ------------------------------ */
const handleSubmit = () => {
  const formData = new FormData();

  formData.append("course_name", courseName);
  formData.append("total_hours", String(totalHours));
  formData.append("price", String(price));
  formData.append("description", description);

  // ✅ this will now ALWAYS work
  if (finalImage instanceof File) {
    formData.append("file", finalImage);
  }

  if (isEdit && course) {
    updateCourse(
      { courseId: course.id, payload: formData as any },
      { onSuccess: onClose }
    );
  } else {
    createCourse(formData as any, { onSuccess: onClose });
  }
};


  if (!open) return null;

  /* ------------------------------ UI ------------------------------ */
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 cursor-pointer" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit Course" : "Create Course"}
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-1 hover:bg-slate-100"
            >
              <X />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 p-6">
            <Input
              title="Course name"
              required
              inputValue={courseName}
              onChange={setCourseName}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                title="Total hours"
                type="num"
                inputValue={totalHours}
                onChange={setTotalHours}
              />
              <Input
                title="Price"
                type="num"
                inputValue={price}
                onChange={setPrice}
              />
            </div>

            <Input
              title="Description"
              inputValue={description}
              onChange={setDescription}
            />

            {/* Drag & Drop */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="relative flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-400"
            >
              {imageSrc ? (
                <div className="relative h-full w-full">
                  <img
                    src={imageSrc}
                    alt="Thumbnail preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute right-2 top-2 cursor-pointer rounded-full bg-white p-2 shadow hover:bg-slate-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2">
                  <ImagePlus />
                  <span className="text-sm">
                    Drag & drop or click to upload
                  </span>
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full border px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={creating || updating}
              className="cursor-pointer rounded-full bg-black px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating || updating
                ? "Saving..."
                : isEdit
                ? "Update"
                : "Create"}
            </button>
          </div>
        </div>
      </div>

      {/* Cropper */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
          <div className="w-[90vw] max-w-md rounded-xl bg-white p-4">
            <div className="relative h-72">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-4 w-full cursor-pointer"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCropper(false)}
                className="cursor-pointer rounded px-4 py-2 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="cursor-pointer rounded bg-black px-4 py-2 text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseFormModal;
