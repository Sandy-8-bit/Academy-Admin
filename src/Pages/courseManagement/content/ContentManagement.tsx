import ButtonSm from "@/components/common/Button";
import DialogBox from "@/components/common/DialogBox";
import { useFetchTierContents } from "@/queries/contentQuery";
import { useContentStore } from "@/store/contentStore";
import type { TierContentItem } from "@/types/courseContent";
import { AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MoreVerticalIcon,
  TableOfContentsIcon,
  VideoIcon,
  NotebookIcon,
  Video,
  Ellipsis,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddVideoDrawer from "./AddVideoDrawer";
import AddTestDrawer from "./AddTestDrawer";
import EditVideoDrawer from "./EditVideoDrawer";
import EditTestDrawer from "./EditTestDrawer";
import VideoPreviewSidebar from "./VideoPreviewSidebar";
import type { VideoContent } from "@/types/courseContent";

export const ContentManagement = () => {
  const { tierId } = useParams<{
    courseId: string;
    tierId: string;
  }>();
  const [previewContentId, setPreviewContentId] = useState<string | null>(null);
  const { data, isLoading, isError } = useFetchTierContents(tierId);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );
  const [contentWidth, setContentWidth] = useState<string>("800px");
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const weeks = useContentStore((state) => state.weeks);
  const selectedWeek = useContentStore((state) => state.selectedWeek);
  const selectedDay = useContentStore((state) => state.selectedDay);
  const selectWeek = useContentStore((state) => state.selectWeek);
  const selectDay = useContentStore((state) => state.selectDay);
  const setWeeks = useContentStore((state) => state.setWeeks);
  const addWeek = useContentStore((state) => state.addWeek);
  const addDay = useContentStore((state) => state.addDay);
  const reset = useContentStore((state) => state.reset);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoContent | null>(null);
  const handleAddWeek = () => {
    addWeek();
  };

  const handleAddDay = () => {
    if (!selectedWeek) return;
    addDay(selectedWeek);
  };

  useEffect(() => {
    if (data?.weeks) {
      setWeeks(data.weeks);
    }
  }, [data, setWeeks]);

  useEffect(() => () => reset(), [reset]);

  useEffect(() => {
    const updateWidth = () => {
      if (contentContainerRef.current) {
        const width = contentContainerRef.current.offsetWidth;
        setContentWidth(`${width}px`);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const weeksList = useMemo<string[]>(() => Object.keys(weeks), [weeks]);
  const daysList = useMemo<string[]>(
    () => (selectedWeek ? Object.keys(weeks[selectedWeek] ?? {}) : []),
    [weeks, selectedWeek]
  );
  const contents = useMemo<TierContentItem[]>(() => {
    if (!selectedWeek || !selectedDay) return [];
    return weeks[selectedWeek]?.[selectedDay] ?? [];
  }, [weeks, selectedWeek, selectedDay]);

  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <div className="text-[#1f2937] text-sm">Loading course content...</div>
      </div>
    );

  if (isError || !data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <div className="text-[#1f2937] text-sm">Failed to load content</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1f2937]">
      {/* Header */}
      <header className="bg-white border-b border-[#d1d3d9]  px-3 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ButtonSm
              state="outline"
              onClick={() => navigate(-1)}
              className="bg-transparent border-none px-0! py-0! "
            >
              <ArrowLeft size={20} />
            </ButtonSm>
            <h1 className="text-md font-medium text-[#1f2937]">
              Course Library
            </h1>
          </div>
          <ButtonSm
            type="button"
            state="default"
            className="text-sm opacity-0! font-medium"
          >
            <TableOfContentsIcon className="h-4 w-4" />
            Add New Content
          </ButtonSm>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar 1: Weeks */}
        <div className="w-64 bg-white border-r border-[#d1d3d9] overflow-y-auto">
          <div className="px-4 flex flex-col py-3 border-b border-[#d1d3d9] ">
            <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Weeks
            </h2>
          </div>
          <div>
            {weeksList.map((week) => (
              <button
                key={week}
                onClick={() => selectWeek(week)}
                className={`w-full flex overflow-clip cursor-pointer  relative items-center gap-3 text-left px-4 py-2 text-sm transition-colors ${
                  week === selectedWeek
                    ? "bg-gray-100 text-black font-medium"
                    : "text-[#1f2937] hover:bg-[#f3f4f6]"
                }`}
              >
                <div
                  className={`h-16 absolute top-0 left-0 w-1  transition-colors ${
                    week === selectedWeek && "bg-gray-800"
                  }`}
                />
                <span className="flex-1">{week}</span>

                <MoreVerticalIcon size={16} />
              </button>
            ))}
            <ButtonSm
              type="button"
              state="outline"
              onClick={handleAddWeek}
              className="mt-4 mx-3 justify-center border-dashed px-3! py-2! text-xs font-semibold text-[#1f2937]"
            >
              + Add Week
            </ButtonSm>
          </div>
        </div>

        {/* Sidebar 2: Days */}
        <div className="w-64 bg-[#fafafa] border-r border-[#d1d3d9]  overflow-y-auto">
          <div className="px-4 flex flex-col py-3 border-b border-[#d1d3d9] ">
            <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Days
            </h2>
          </div>
          <div>
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => selectDay(day)}
                className={`w-full flex items-center cursor-pointer overflow-clip relative gap-3 text-left px-4 py-2 text-sm transition-colors ${
                  day === selectedDay
                    ? "bg-gray-100 text-black font-medium"
                    : "text-[#1f2937] hover:bg-[#f3f4f6]"
                }`}
              >
                <div
                  className={`h-16 w-1 absolute top-0 left-0  transition-colors ${
                    day === selectedDay && "bg-gray-800"
                  }`}
                />
                <span className="flex-1">{day}</span>
                <MoreVerticalIcon size={16} />
              </button>
            ))}
            <ButtonSm
              type="button"
              state="outline"
              onClick={handleAddDay}
              disabled={!selectedWeek}
              className="mt-4 mx-3 justify-center border-dashed py-2! text-xs font-semibold text-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Day
            </ButtonSm>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className="flex-1 overflow-y-auto bg-[#f8f9fa]"
          ref={contentContainerRef}
        >
          {/* drawer items */}
          <AnimatePresence mode="wait">
            {isAddVideoOpen && (
              <DialogBox
                setToggleDialogueBox={setIsAddVideoOpen}
                isSideDrawer={true}
                width={contentWidth}
              >
                <AddVideoDrawer
                  tierId={tierId}
                  weekLabel={selectedWeek}
                  dayLabel={selectedDay}
                  contentsCount={contents.length}
                  onClose={() => setIsAddVideoOpen(false)}
                />
              </DialogBox>
            )}
            {isAddTestOpen && (
              <DialogBox
                setToggleDialogueBox={setIsAddTestOpen}
                isSideDrawer={true}
                width={contentWidth}
              >
                <AddTestDrawer
                  tierId={tierId}
                  weekLabel={selectedWeek}
                  dayLabel={selectedDay}
                  contentsCount={contents.length}
                  onClose={() => setIsAddTestOpen(false)}
                />
              </DialogBox>
            )}
            {selectedContentId && (
              <>
                {contents.find((c) => c.id === selectedContentId)
                  ?.module_type === "video" && (
                  <DialogBox
                    setToggleDialogueBox={() => setSelectedContentId(null)}
                    isSideDrawer={true}
                    width={contentWidth}
                  >
                    {(() => {
                      const content = contents.find(
                        (c) => c.id === selectedContentId
                      );
                      return content?.module_type === "video" ? (
                        <EditVideoDrawer
                          tierId={tierId!}
                          contentId={selectedContentId}
                          video={content.video}
                          onClose={() => setSelectedContentId(null)}
                        />
                      ) : null;
                    })()}
                  </DialogBox>
                )}
                {contents.find((c) => c.id === selectedContentId)
                  ?.module_type === "test" && (
                  <DialogBox
                    setToggleDialogueBox={() => setSelectedContentId(null)}
                    isSideDrawer={true}
                    width={contentWidth}
                  >
                    {(() => {
                      const content = contents.find(
                        (c) => c.id === selectedContentId
                      );
                      return content?.module_type === "test" ? (
                        <EditTestDrawer
                          tierId={tierId!}
                          contentId={selectedContentId}
                          test={content.test}
                          onClose={() => setSelectedContentId(null)}
                        />
                      ) : null;
                    })()}
                  </DialogBox>
                )}
              </>
            )}
          </AnimatePresence>
          <div className="px-6 py-3 border-b border-[#d1d3d9] bg-white">
            <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Contents
            </h2>
          </div>

          <div className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsAddVideoOpen(true)}
                disabled={!selectedWeek || !selectedDay || !tierId}
                className="group cursor-pointer relative overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-all duration-200  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb]  p-6"
              >
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="relative w-16 h-16 rounded-lg bg-linear-to-br from-[#dcfce7] to-[#bbf7d0] flex items-center justify-center group transition-all">
                    <VideoIcon className="w-8 h-8 text-[#3ecf8e] " />
                  </div>
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-[#1f2937] group-hover:text-[#059669] transition-colors">
                      Add Video
                    </h3>
                    <p className="text-xs text-[#6b7280] mt-1">
                      Create a new video content
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsAddTestOpen(true)}
                disabled={!selectedWeek || !selectedDay || !tierId}
                className="group cursor-pointer relative overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-all duration-200  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb]  p-6"
              >
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="relative w-16 h-16 rounded-lg bg-linear-to-br from-[#fed7aa] to-[#fecaca] flex items-center justify-center group transition-all">
                    <NotebookIcon className="w-8 h-8 text-[#f97316] " />
                  </div>
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-[#1f2937] group-hover:text-[#d97706] transition-colors">
                      Add Test
                    </h3>
                    <p className="text-xs text-[#6b7280] mt-1">
                      Create a new test or quiz
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {contents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6b7280] text-sm">No content available</p>
              </div>
            )}

        {previewVideo && previewContentId && (
  <VideoPreviewSidebar
    open={previewOpen}
    video={previewVideo}
    contentId={previewContentId} // ✅ pass ID
    onClose={() => {
      setPreviewOpen(false);
      setPreviewVideo(null);
      setPreviewContentId(null);
    }}
  />
)}


            <div className="space-y-2">
              {contents.map((item) => {
                if (item.module_type === "video") {
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setPreviewVideo(item.video);
                        setPreviewOpen(true);
                        setPreviewContentId(item.id);
                      }}
                      className="group relative overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-[#d1d3d9]  cursor-pointer"
                    >
                      <div className="flex items-center gap-3 p-3">
                        {/* Thumbnail */}
                        <div className="relative shrink-0 bg-linear-to-br from-[#dcfce7] to-[#bbf7d0] flex w-24 h-16 items-center justify-center rounded-md overflow-hidden ">
                          {item.video.thumbnail_url ? (
                            <img
                              src={item.video.thumbnail_url}
                              alt={item.video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <Video className="w-6 h-6 text-[#3ecf8e] opacity-80 group-hover:scale-110 transition-transform duration-200" />
                          )}
                          {/* Duration badge */}
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs font-semibold px-1.5 py-0.5 rounded text-[10px]">
                            {Math.floor(item.video.duration / 60)}m
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#1f2937] line-clamp-2 group-hover:text-[#059669] transition-colors">
                            {item.video.title}
                          </h3>
                          <p className="text-xs text-[#6b7280] line-clamp-1 mt-0.5">
                            {item.video.description}
                          </p>
                        </div>

                        {/* Video Badge */}
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation(); // 🔥 important
                              setSelectedContentId(item.id);
                            }}
                          >
                            <Ellipsis className="h-4 w-4 cursor-pointer hover:text-green-500 transition" />
                          </div>
                          <span className="text-xs font-semibold text-white bg-[#3ecf8e] px-2.5 py-1 rounded-full whitespace-nowrap">
                            VIDEO
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedContentId(item.id)}
                    className="group relative overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-[#d1d3d9]  cursor-pointer"
                  >
                    <div className="flex items-center gap-3 p-3">
                      {/* Icon Container */}
                      <div className="relative shrink-0 w-24 h-16 rounded-md overflow-hidden bg-linear-to-br from-[#fef3c7] to-[#fed7aa] flex items-center justify-center group- transition-all">
                        <NotebookIcon className="w-6 h-6 text-[#f97316] opacity-80 group-hover:scale-110 transition-transform duration-200" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#1f2937] line-clamp-2 group-hover:text-[#d97706] transition-colors">
                          {item.test.title}
                        </h3>
                        <p className="text-xs text-[#6b7280] mt-0.5">
                          {item.test.quiz_count}{" "}
                          {item.test.quiz_count === 1 ? "Q" : "Qs"}
                        </p>
                      </div>

                      {/* Test Badge */}
                      <div className="shrink-0">
                        <span className="text-xs font-semibold text-white bg-[#f97316] px-2.5 py-1 rounded-full whitespace-nowrap">
                          TEST
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
