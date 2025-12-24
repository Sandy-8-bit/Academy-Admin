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
import { useFetchCourses, useDeleteCourse } from "@/queries/CourseQuery";
import type { CourseResponse } from "@/types/courseTypes";
import CourseFormModal from "./CourseFormModal";

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
      <div className="absolute right-3 overflow-clip top-13 z-20 w-48 rounded-sm border border-slate-100 bg-white shadow-2xl">
        <button
          type="button"
          className="flex cursor-pointer w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-slate-50"
          onClick={(event) => {
            event.stopPropagation();
            handleEdit(course);
          }}
        >
          <Edit3 className="h-3.5 w-3.5 text-gray-600" />
          Edit course
        </button>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-red-50"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(course);
          }}
          disabled={isDeleting && pendingDeleteId === course.id}
        >
          <Trash2 className="h-3.5 w-3.5 text-gray-600" />
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
        className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white"
      >
        <button
          type="button"
          className="absolute cursor-pointer right-3 top-3 z-30 rounded-full border border-white/40 bg-white/80 p-2 text-slate-700  transition hover:bg-white"
          onClick={(event) => {
            event.stopPropagation();
            setActiveMenuId((prev) => (prev === course.id ? null : course.id));
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {renderMenu(course)}
        <span className="flex bg-white rounded-lg px-3 py-1.5 flex-row text-sm w-max absolute cursor-pointer right-3 top-3 left-3 z-30 items-center gap-1.5 font-medium  text-slate-700">
          <Clock3 className="h-4 w-4 text-slate-700" />
          {course.total_hours} hrs
        </span>

      <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-slate-100">
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
    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
      No Image
    </div>
  )}

  {hasThumbnail && (
    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
  )}

  <div className="absolute bottom-3 left-4 right-4 flex flex-col text-white">
    <p className="text-xs uppercase tracking-widest text-white/80">
      Published {formatDate(course.created_at)}
    </p>
    <h3 className="text-lg font-semibold leading-tight">
      {course.course_name}
    </h3>
  </div>
</div>


        <div className="space-y-4 p-4">
          <p className="text-sm text-slate-600 line-clamp-2 text-ellipsis">
            {course.description || "No description provided."}
          </p>

          <div className="flex flex-wrap items-center gap-3 w-full justify-between text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-xl font-medium py-1 text-gray-900">
              ₹ {priceLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md font-medium border border-emerald-100 bg-emerald-50/70 px-3 py-1 text-emerald-700">
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
          className="animate-pulse rounded-3xl border border-slate-200 bg-white"
        >
          <div className="h-56 w-full bg-slate-200" />
          <div className="space-y-4 p-5">
            <div className="h-6 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="flex gap-3">
              <div className="h-8 w-24 rounded-full bg-slate-100" />
              <div className="h-8 w-20 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <main className="layout-container m-4 flex min-h-[95vh] flex-col rounded-[12px] border-2 border-[#F1F1F1] bg-white">
      <header className="flex flex-row items-center justify-between gap-4 p-4">
        <h1 className="flex w-max flex-row items-center gap-2 text-start text-xl font-semibold text-zinc-800">
          <ArrowLeft
            onClick={() => navigate(-1)}
            size={24}
            className="cursor-pointer transition hover:scale-105 active:scale-110"
          />
          Course Library
        </h1>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
        >
          <BookOpen className="h-4 w-4" />
          New course
        </button>
      </header>
      <div className="divider min-w-full border border-[#F1F1F1]" />

      <section className="flex-1 overflow-auto p-4 md:p-6">
        {isError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
            Unable to load courses.{" "}
            <button
              type="button"
              className="font-semibold underline"
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading && renderSkeletons()}
            {!isLoading && courses.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
                <p className="text-lg font-semibold text-slate-800">
                  No courses yet
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Start by creating your first course to populate this
                  dashboard.
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
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
      </section>
    </main>
  );
};

export default CourseManagement;
