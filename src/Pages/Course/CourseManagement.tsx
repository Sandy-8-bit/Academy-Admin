import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  DollarSign,
  Edit3,
  IndianRupee,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useFetchCourses, useDeleteCourse } from "@/queries/CourseQuery";
import type { CourseResponse } from "@/types/courseTypes";

export const CourseManagement = () => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { data: courses = [], isLoading, isError, refetch } = useFetchCourses();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

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

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  }, []);

  const handleEdit = (course: CourseResponse) => {
    setActiveMenuId(null);
    navigate(`/management/course/${course.id}/edit`, {
      state: { course },
    });
  };

  const handleDelete = (courseId: string) => {
    setActiveMenuId(null);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );
    if (!confirmDelete) return;
    setPendingDeleteId(courseId);
    deleteCourse(courseId, {
      onSettled: () => setPendingDeleteId(null),
    });
  };

  const renderMenu = (course: CourseResponse) => {
    if (activeMenuId !== course.id) return null;
    return (
      <div className="absolute right-3 overflow-clip top-13 z-20 w-48 rounded-md border border-slate-100 bg-white shadow-2xl ">
        <button
          type="button"
          className="flex cursor-pointer w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          onClick={(event) => {
            event.stopPropagation();
            handleEdit(course);
          }}
        >
          <Edit3 className="h-4 w-4 text-blue-600" />
          Edit course
        </button>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(course.id);
          }}
          disabled={isDeleting && pendingDeleteId === course.id}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting && pendingDeleteId === course.id
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    );
  };

  const CourseCard = ({ course }: { course: CourseResponse }) => {
    const priceLabel = course.price || 0;
    const hasThumbnail = Boolean(course.thumbnail_url);

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
        className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white  "
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

        <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-slate-100">
          {!hasThumbnail ? (
            <img
              src={course.thumbnail_url}
              alt={course.course_name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-slate-200 to-slate-50" />
          )}
          {hasThumbnail && (
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          )}
          <div className="absolute bottom-3 left-4 right-4 flex flex-col text-white">
            <p className="text-xs uppercase tracking-widest text-white/80">
              Published {formatDate(course.createdAt)}
            </p>
            <h3 className="text-lg font-semibold leading-tight">
              {course.course_name}
            </h3>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <p className="text-sm text-slate-600">
            {course.course_description || "No description provided."}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/80 px-3 py-1 text-slate-700">
              <Clock3 className="h-4 w-4 text-slate-500" />
              {course.total_hours} hrs
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50/60 px-3 py-1 text-blue-700">
              <IndianRupee className="h-4 w-4 text-blue-600" />
              {priceLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50/70 px-3 py-1 text-emerald-700">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              Updated {formatDate(course.updatedAt)}
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
          key={`skeleton-₹{index}`}
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
          onClick={() => navigate("/management/course")}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
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
                  onClick={() => navigate("/management/course")}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
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
      </section>
    </main>
  );
};
