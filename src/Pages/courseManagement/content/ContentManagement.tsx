import ButtonSm from "@/components/common/Button";
import DialogBox from "@/components/common/DialogBox";
import { useFetchTierContents } from "@/queries/contentQuery";
import { useContentStore } from "@/store/contentStore";
import type { TierContentItem } from "@/types/courseContent";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, MoreVerticalIcon, TableOfContentsIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddVideoDrawer from "./AddVideoDrawer";

export const ContentManagement = () => {
  const { tierId } = useParams<{
    courseId: string;
    tierId: string;
  }>();

  const { data, isLoading, isError } = useFetchTierContents(tierId);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const weeks = useContentStore((state) => state.weeks);
  const selectedWeek = useContentStore((state) => state.selectedWeek);
  const selectedDay = useContentStore((state) => state.selectedDay);
  const selectWeek = useContentStore((state) => state.selectWeek);
  const selectDay = useContentStore((state) => state.selectDay);
  const setWeeks = useContentStore((state) => state.setWeeks);
  const addWeek = useContentStore((state) => state.addWeek);
  const addDay = useContentStore((state) => state.addDay);
  const reset = useContentStore((state) => state.reset);

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
              className="bg-transparent border-none !px-0 !py-0 "
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
            className="text-sm font-medium"
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
              className="mt-4 mx-3 justify-center border-dashed !px-3 !py-2 text-xs font-semibold text-[#1f2937]"
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
              className="mt-4 mx-3 justify-center border-dashed !py-2 text-xs font-semibold text-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Day
            </ButtonSm>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa]">
          {/* drawer items */}
          <AnimatePresence mode="wait">
            {isAddVideoOpen && (
              <DialogBox
                setToggleDialogueBox={setIsAddVideoOpen}
                isSideDrawer={true}
                width="800px"
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
          </AnimatePresence>
          <div className="px-6 py-3 border-b border-[#d1d3d9] bg-white">
            <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Contents
            </h2>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {contents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6b7280] text-sm">No content available</p>
              </div>
            )}
            <div className="action-buttons flex flex-row gap-2 items-center">
              <ButtonSm
                onClick={() => setIsAddVideoOpen(true)}
                type="button"
                state="default"
                disabled={!selectedWeek || !selectedDay || !tierId}
              >
                + Add New Video
              </ButtonSm>
              <ButtonSm
                type="button"
                state="default"
                disabled={!selectedWeek || !selectedDay || !tierId}
              >
                + Add New Test
              </ButtonSm>
            </div>

            <div className="space-y-3">
              {contents.map((item) => {
                if (item.module_type === "video") {
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-[#d1d3d9]  rounded-lg p-4 hover:border-gray-300 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl">🎥</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-[#3ecf8e] uppercase tracking-wide">
                              Video
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-[#1f2937] mb-1">
                            {item.video.title}
                          </h3>
                          <p className="text-xs text-[#6b7280]">
                            {Math.floor(item.video.duration / 60)} min
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#d1d3d9]  rounded-lg p-4 hover:border-gray-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl">📝</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-[#f97316] uppercase tracking-wide">
                            Test
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-[#1f2937] mb-1">
                          {item.test.title}
                        </h3>
                        <p className="text-xs text-[#6b7280]">
                          {item.test.quiz_count} questions
                        </p>
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
