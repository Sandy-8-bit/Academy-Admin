import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "../../../components/common/Input";
import { useCreateCourse, useUpdateCourse } from "@/queries/courseQuery";
import type { CourseResponse } from "@/types/courseTypes";
import ButtonSm from "@/components/common/Button";
import ImageUploader, {
  type ImageUploaderValue,
} from "@/components/common/ImageUploader";

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

const emptyFormState: CourseFormState = {
  courseName: "",
  totalHours: "",
  price: "",
  description: "",
};

const getEmptyFormState = (): CourseFormState => ({ ...emptyFormState });

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
  const [form, setForm] = useState<CourseFormState>(getEmptyFormState);
  const [initialFormSnapshot, setInitialFormSnapshot] =
    useState<CourseFormState>(getEmptyFormState);
  const [thumbnailInitialPreview, setThumbnailInitialPreview] = useState<
    string | null
  >(null);
  const [imageResetSignal, setImageResetSignal] = useState(0);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<File | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  const { mutate: createCourse, isPending: creating } = useCreateCourse();
  const { mutate: updateCourse, isPending: updating } = useUpdateCourse();

  /* ------------------------------ RESET LOGIC ------------------------------ */

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      const base = getEmptyFormState();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(base);
      setInitialFormSnapshot(base);
      setThumbnailInitialPreview(null);
      setUploadedThumbnail(null);
      setImageChanged(false);
      setRemoveThumbnail(false);
      setImageResetSignal((prev) => prev + 1);
      return;
    }

    if (mode === "edit" && course) {
      const hydrated: CourseFormState = {
        courseName: course.course_name ?? "",
        totalHours: course.total_hours,
        price: Number(course.price),
        description: course.description ?? "",
      };

      setForm(hydrated);
      setInitialFormSnapshot(hydrated);
      setThumbnailInitialPreview(course.thumbnail_url || null);
      setUploadedThumbnail(null);
      setImageChanged(false);
      setRemoveThumbnail(false);
      setImageResetSignal((prev) => prev + 1);
    }
  }, [open, mode, course]);

  const handleThumbnailChange = (value: ImageUploaderValue) => {
    if (value instanceof File) {
      setUploadedThumbnail(value);
      setImageChanged(true);
      setRemoveThumbnail(false);
    } else if (value === null) {
      setUploadedThumbnail(null);
      setImageChanged(false);
    }
  };

  const handleThumbnailRemove = () => {
    if (isEdit) {
      setRemoveThumbnail(true);
    }
  };

  /* ------------------------------ SUBMIT ------------------------------ */
  const handleSubmit = () => {
    if (!form.courseName || !form.totalHours || !form.price) return;

    const trimmedName = form.courseName.trim();
    const trimmedDescription = form.description.trim();

    if (isEdit && course) {
      const payload = new FormData();
      let hasChanges = false;

      if (trimmedName !== initialFormSnapshot.courseName) {
        payload.append("course_name", trimmedName);
        hasChanges = true;
      }

      if (form.totalHours !== initialFormSnapshot.totalHours) {
        payload.append("total_hours", String(form.totalHours));
        hasChanges = true;
      }

      if (form.price !== initialFormSnapshot.price) {
        payload.append("price", String(form.price));
        hasChanges = true;
      }

      if (trimmedDescription !== initialFormSnapshot.description) {
        payload.append("description", trimmedDescription);
        hasChanges = true;
      }

      if (imageChanged && uploadedThumbnail) {
        payload.append("file", uploadedThumbnail);
        hasChanges = true;
      }

      if (removeThumbnail) {
        payload.append("remove_thumbnail", "true");
        hasChanges = true;
      }

      if (!hasChanges) {
        onClose();
        return;
      }

      updateCourse({ courseId: course.id, payload }, { onSuccess: onClose });

      return;
    }

    const payload = new FormData();
    payload.append("course_name", trimmedName);
    payload.append("total_hours", String(form.totalHours));
    payload.append("price", String(form.price));
    payload.append("description", trimmedDescription);

    if (uploadedThumbnail) {
      payload.append("file", uploadedThumbnail);
    }

    createCourse(payload, { onSuccess: onClose });
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
              maxLength={500}
              type="str"
              inputValue={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            />

            <ImageUploader
              initialPreview={thumbnailInitialPreview}
              resetSignal={imageResetSignal}
              onChange={handleThumbnailChange}
              onRemove={handleThumbnailRemove}
            />
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
    </>
  );
};

export default CourseFormModal;
