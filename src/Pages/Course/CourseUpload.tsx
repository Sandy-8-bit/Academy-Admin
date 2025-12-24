import React, { useState } from "react";
import { X } from "lucide-react";
import {
  useFetchCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "../../queries/courseQuery";
import type { CourseRequest, CourseResponse } from "../../types/courseTypes";
import Input from "../../components/Common/Input";
import ButtonSm from "../../components/Common/Button";
import GenericTable from "../../components/Common/GenericTable";
import type { DataCell } from "../../components/Common/GenericTable";
import ConfirmDeletePopup from "@components/Common/ConfirmDeletePopup";

/* -------------------- initial state -------------------- */

const emptyCourse: CourseRequest = {
  course_name: "",
  total_hours: 0,
  price: 0,
  description: "",
  thumbnail_url: "",
};

const CourseUpload: React.FC = () => {
  const { data: courses, isLoading } = useFetchCourses();
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutate: deleteCourse } = useDeleteCourse();

  const [formData, setFormData] = useState<CourseRequest>(emptyCourse);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* -------------------- table columns -------------------- */

  const courseColumns: DataCell[] = [
    {
      headingTitle: "Course",
      accessVar: "course_name",
      searchable: true,
      sortable: true,
      render: (_val, row: CourseResponse) => (
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">
            {row.course_name}
          </span>
        </div>
      ),
    },
    {
      headingTitle: "Duration",
      accessVar: "total_hours",
      sortable: true,
      render: (val) => (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
          {Number(val)} hours
        </span>
      ),
    },
    {
      headingTitle: "Price",
      accessVar: "price",
      sortable: true,
      render: (val) => (
        <span className="font-semibold">₹{Number(val).toLocaleString()}</span>
      ),
    },
    {
      headingTitle: "Description",
      accessVar: "course_description",
      searchable: true,
      render: (val) => (
        <p className="text-sm text-slate-600 line-clamp-2">{String(val)}</p>
      ),
    },
  ];

  /* -------------------- handlers -------------------- */

  const handleChange = <K extends keyof CourseRequest>(
    key: K,
    value: CourseRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData(emptyCourse);
    setEditingCourseId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCourseId) {
      updateCourse(
        { courseId: String(editingCourseId), payload: formData },
        { onSuccess: resetForm }
      );
    } else {
      createCourse(formData, { onSuccess: resetForm });
    }
  };

  const handleEdit = (course: CourseResponse) => {
    setEditingCourseId(String(course.id));
    setFormData({
      course_name: course.course_name,
      total_hours: course.total_hours,
      price: course.price,
      description: course.description,
      thumbnail_url: course.thumbnail_url ?? "",
    });
    setShowForm(true);
  };

  /* -------------------- render -------------------- */

  return (
    <div className="flex flex-col gap-4 px-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div></div>
        {!showForm && (
          <ButtonSm
            state="default"
            text="Create New Course"
            onClick={() => setShowForm(true)}
          />
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingCourseId ? "Edit Course" : "Create Course"}
            </h2>
            <button onClick={resetForm}>
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                title="Course Name"
                inputValue={formData.course_name}
                onChange={(v) => handleChange("course_name", String(v))}
                required
              />

              <Input
                title="Total Hours"
                type="num"
                inputValue={formData.total_hours}
                onChange={(v) => handleChange("total_hours", Number(v))}
                required
              />

              <Input
                title="Price (₹)"
                type="num"
                inputValue={formData.price}
                onChange={(v) => handleChange("price", Number(v))}
                required
              />

              <Input
                title="Thumbnail URL"
                inputValue={formData.thumbnail_url ?? ""}
                onChange={(v) => handleChange("thumbnail_url", String(v))}
              />
            </div>

            <Input
              title="Course Description"
              inputValue={formData.description}
              onChange={(v) => handleChange("description", String(v))}
              required
            />

            <div className="flex gap-3">
              <ButtonSm
                type="submit"
                state="default"
                text={editingCourseId ? "Update" : "Create"}
                isPending={isCreating || isUpdating}
              />
              <ButtonSm
                type="button"
                state="outline"
                text="Cancel"
                onClick={resetForm}
              />
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <GenericTable
        data={courses || []}
        dataCell={courseColumns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(row) => setDeleteId(row.id)}
        noDataMsg="No courses found"
      />

      {/* Delete Popup */}
      <ConfirmDeletePopup
        open={deleteId !== null}
        title="Delete Course?"
        description="Are you sure you want to delete this course?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteCourse(String(deleteId));
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
};

export default CourseUpload;
