import { useEffect, useState, useCallback } from "react";
import { X, ImagePlus, Trash2 } from "lucide-react";
import Cropper from "react-easy-crop";
import Input from "../../../components/common/Input";
import { useCreateCourse, useUpdateCourse } from "@/queries/courseQuery";
import type { CourseResponse } from "@/types/courseTypes";
import ButtonSm from "@/components/common/Button";

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

type CourseFormState = {
  courseName: string;
  totalHours: number | "";
  price: number | "";
  description: string;
};

type ImageState = {
  rawFile: File | null;
  finalFile: File | null;
  preview: string | null;
  showCropper: boolean;
  crop: { x: number; y: number };
  zoom: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  croppedPixels: any;
};

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [form, setForm] = useState<CourseFormState>({
    courseName: "",
    totalHours: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState<ImageState>({
    rawFile: null,
    finalFile: null,
    preview: null,
    showCropper: false,
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedPixels: null,
  });

  const { mutate: createCourse, isPending: creating } = useCreateCourse();
  const { mutate: updateCourse, isPending: updating } = useUpdateCourse();

  /* ------------------------------ RESET LOGIC ------------------------------ */
  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        courseName: "",
        totalHours: "",
        price: "",
        description: "",
      });

      if (image.preview) URL.revokeObjectURL(image.preview);

      setImage({
        rawFile: null,
        finalFile: null,
        preview: null,
        showCropper: false,
        crop: { x: 0, y: 0 },
        zoom: 1,
        croppedPixels: null,
      });
    }

    if (mode === "edit" && course) {
      setForm({
        courseName: course.course_name,
        totalHours: course.total_hours,
        price: Number(course.price),
        description: course.description ?? "",
      });

      setImage((prev) => ({
        ...prev,
        preview: course.thumbnail_url || null,
      }));
    }
  }, [open, mode, course]);

  /* ------------------------------ IMAGE HANDLERS ------------------------------ */
  const handleFile = (file?: File) => {
    if (!file) return;

    if (image.preview) URL.revokeObjectURL(image.preview);

    const previewUrl = URL.createObjectURL(file);

    setImage((prev) => ({
      ...prev,
      rawFile: file,
      finalFile: file,
      preview: previewUrl,
      showCropper: true,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback((_: any, pixels: any) => {
    setImage((prev) => ({ ...prev, croppedPixels: pixels }));
  }, []);

  const applyCrop = async () => {
    if (!image.preview || !image.croppedPixels) return;

    const cropped = await getCroppedImage(image.preview, image.croppedPixels);

    URL.revokeObjectURL(image.preview);

    setImage((prev) => ({
      ...prev,
      finalFile: cropped,
      preview: URL.createObjectURL(cropped),
      showCropper: false,
    }));
  };

  const removeImage = () => {
    if (image.preview) URL.revokeObjectURL(image.preview);

    setImage((prev) => ({
      ...prev,
      rawFile: null,
      finalFile: null,
      preview: null,
    }));
  };

  /* ------------------------------ SUBMIT ------------------------------ */
  const handleSubmit = () => {
    if (!form.courseName || !form.totalHours || !form.price) return;

    const formData = new FormData();
    formData.append("course_name", form.courseName);
    formData.append("total_hours", String(form.totalHours));
    formData.append("price", String(form.price));
    formData.append("description", form.description);

    if (image.finalFile) {
      formData.append("file", image.finalFile);
    }

    if (isEdit && course) {
      updateCourse(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { courseId: course.id, payload: formData as any },
        { onSuccess: onClose }
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createCourse(formData as any, { onSuccess: onClose });
    }
  };

  if (!open) return null;

  /* ------------------------------ UI ------------------------------ */
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

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
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 p-6">
            <Input
              title="Course name"
              required
              placeholder="Enter Course Name"
              inputValue={form.courseName}
              onChange={(v) => setForm((f) => ({ ...f, courseName: v }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                title="Total hours"
                placeholder="Enter Total Orders"
                type="num"
                inputValue={form.totalHours}
                onChange={(v) => setForm((f) => ({ ...f, totalHours: v }))}
              />
              <Input
                title="Price"
                placeholder="Enter Price"
                type="num"
                inputValue={form.price}
                onChange={(v) => setForm((f) => ({ ...f, price: v }))}
              />
            </div>

            <Input
              title="Description"
              placeholder="Enter Description"
              inputValue={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            />

            {/* Image Upload */}
            <div className="relative flex h-40 items-center justify-center rounded-xl border-2 border-dashed">
              {image.preview ? (
                <div className="relative h-full w-full">
                  <img
                    src={image.preview}
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute right-2 top-2 bg-white p-2 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <ImagePlus />
                  <span>Upload thumbnail</span>
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
            <ButtonSm state="outline" onClick={onClose}>
              Cancel
            </ButtonSm>
            <ButtonSm
              state="default"
              onClick={handleSubmit}
              disabled={creating || updating}
            >
              {creating || updating
                ? "Saving..."
                : isEdit
                  ? "Update"
                  : "Create"}
            </ButtonSm>
          </div>
        </div>
      </div>

      {/* Cropper */}
      {image.showCropper && image.preview && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-[90vw] max-w-md">
            <div className="relative h-72">
              <Cropper
                image={image.preview}
                crop={image.crop}
                zoom={image.zoom}
                aspect={16 / 9}
                onCropChange={(c) => setImage((prev) => ({ ...prev, crop: c }))}
                onZoomChange={(z) => setImage((prev) => ({ ...prev, zoom: z }))}
                onCropComplete={onCropComplete}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={image.zoom}
              onChange={(e) =>
                setImage((prev) => ({
                  ...prev,
                  zoom: Number(e.target.value),
                }))
              }
              className="mt-4 w-full"
            />

            <div className="mt-4 flex justify-end gap-3">
              <ButtonSm
                state="outline"
                onClick={() => setImage((p) => ({ ...p, showCropper: false }))}
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
    </>
  );
};

export default CourseFormModal;
