import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Edit3,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useFetchCourses, useDeleteCourse } from "../../../queries/courseQuery";
import type { CourseResponse } from "@/types/courseTypes";
import CourseFormModal from "./CourseFormModal";
import ConfirmDeletePopup from "@components/common/ConfirmDeletePopup";

const CourseManagement = () => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<CourseResponse | null>(
    null
  );
  const { data: courses = [], isLoading, isError, refetch } = useFetchCourses();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  );

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCourse(null);
    setModalOpen(true);
  };

  const openEditModal = (course: CourseResponse) => {
    setModalMode("edit");
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleEdit = (course: CourseResponse) => {
    setActiveMenuId(null);
    openEditModal(course);
  };

  useEffect(() => {
    if (!activeMenuId) return;
    const closeMenu = () => setActiveMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [activeMenuId]);

  const formatDate = (value: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value));
    } catch {
      return "--";
    }
  };

  const handleDelete = (course: CourseResponse) => {
    setActiveMenuId(null);
    setCourseToDelete(course);
  };

  const confirmCourseDeletion = () => {
    if (!courseToDelete) return;

    const courseId = String(courseToDelete.id);
    setPendingDeleteId(courseId);

    deleteCourse(courseId, {
      onSettled: () => {
        setPendingDeleteId(null);
        setCourseToDelete(null);
      },
    });
  };

  const renderMenu = (course: CourseResponse) => {
    if (activeMenuId !== course.id) return null;
    return (
      <div className="absolute right-3 top-12 z-20 w-48 rounded-md border border-[#e5e7eb] bg-white shadow-md overflow-hidden">
        <button
          type="button"
          className="flex cursor-pointer w-full text-[#6b7280] font-medium items-center gap-3 px-4 py-2.5 text-left text-sm  transition hover:bg-[#f3f4f6]"
          onClick={(event) => {
            event.stopPropagation();
            handleEdit(course);
          }}
        >
          <Edit3 className="h-4 w-4 text-[#6b7280]" />
          Edit course
        </button>
        <button
          type="button"
          className="flex w-full cursor-pointer text-[#6b7280] font-medium items-center gap-3 px-4 py-2.5 text-left text-sm  transition hover:bg-red-50"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(course);
          }}
          disabled={isDeleting && pendingDeleteId === course.id}
        >
          <Trash2 className="h-4 w-4 text-[#6b7280]" />
          {isDeleting && pendingDeleteId === course.id
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    );
  };

  const CourseCard = ({ course }: { course: CourseResponse }) => {
    const priceLabel = course.price || 0;
    const hasThumbnail = Boolean(course.thumbnail_url?.trim());

    const handleCardClick = () => {
      navigate(`/course/${course.id}`);
    };

    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        }}
        className="group relative cursor-pointer rounded-lg border border-[#e5e7eb] bg-white hover:border-blue-600    transition-all shadow-sm hover:shadow-md"
      >
        <button
          type="button"
          className="absolute cursor-pointer right-3 top-3 z-30 rounded-md border border-[#e5e7eb] bg-white p-1.5 text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#1f2937]"
          onClick={(event) => {
            event.stopPropagation();
            setActiveMenuId((prev) => (prev === course.id ? null : course.id));
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {renderMenu(course)}

        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-[#f3f4f6]">
          {hasThumbnail ? (
            <img
              src={course.thumbnail_url}
              alt={course.course_name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/images/course-placeholder.png";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f3f4f6] text-[#9ca3af]">
              <BookOpen className="h-12 w-12" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-[#1f2937] shadow-sm">
            <Clock3 className="h-3.5 w-3.5 text-[#6b7280]" />
            {course.total_hours} hrs
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-[#1f2937] mb-1 line-clamp-1">
              {course.course_name}
            </h3>
            <p className="text-xs text-[#6b7280]">
              Published {formatDate(course.created_at)}
            </p>
          </div>

          <p className="text-sm text-[#6b7280] line-clamp-2">
            {course.description || "No description provided."}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[#e5e7eb]">
            <span className="text-lg font-semibold text-[#1f2937]">
              ₹{priceLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#ecfdf5] px-2.5 py-1 text-xs font-medium text-[#059669]">
              Updated {formatDate(course.updated_at)}
            </span>
          </div>
        </div>
      </article>
    );
  };

  const renderSkeletons = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-lg border border-[#e5e7eb] bg-white overflow-hidden"
        >
          <div className="h-48 w-full bg-[#f3f4f6]" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 rounded bg-[#f3f4f6]" />
            <div className="h-3 w-1/2 rounded bg-[#f3f4f6]" />
            <div className="h-4 w-full rounded bg-[#f3f4f6]" />
            <div className="h-4 w-5/6 rounded bg-[#f3f4f6]" />
            <div className="flex justify-between pt-2">
              <div className="h-6 w-20 rounded bg-[#f3f4f6]" />
              <div className="h-6 w-24 rounded bg-[#f3f4f6]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-[#6b7280] hover:text-[#1f2937] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-sm font-medium text-[#1f2937]">
              Course Library
            </h1>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            New course
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="p-6">
        {isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
            <p className="font-medium">Unable to load courses.</p>
            <button
              type="button"
              className="mt-2 text-sm font-semibold underline hover:no-underline"
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading && renderSkeletons()}
            {!isLoading && courses.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f3f4f6] mb-4">
                  <BookOpen className="h-8 w-8 text-[#9ca3af]" />
                </div>
                <p className="text-base font-semibold text-[#1f2937] mb-1">
                  No courses yet
                </p>
                <p className="text-sm text-[#6b7280] mb-4">
                  Start by creating your first course to populate this
                  dashboard.
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Create a course
                </button>
              </div>
            )}
            {!isLoading &&
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        )}

        <CourseFormModal
          open={modalOpen}
          mode={modalMode}
          course={selectedCourse}
          onClose={() => setModalOpen(false)}
        />

        <ConfirmDeletePopup
          open={Boolean(courseToDelete)}
          title="Delete course?"
          description={`Are you sure you want to delete "${courseToDelete?.course_name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isConfirming={isDeleting}
          confirmDisabled={isDeleting}
          onConfirm={confirmCourseDeletion}
          onCancel={() => setCourseToDelete(null)}
        />
      </section>
    </div>
  );
};

export default CourseManagement;
