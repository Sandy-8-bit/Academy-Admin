import { useFetchTierContents } from "@/queries/contentQuery";
import { ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ContentManagement = () => {
  const { courseId, tierId } = useParams<{
    courseId: string;
    tierId: string;
  }>();

  const { data, isLoading, isError } = useFetchTierContents(tierId);

  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Auto-select first week & day
  useMemo(() => {
    if (!data) return;

    const weeks = Object.keys(data.weeks);
    if (!selectedWeek && weeks.length > 0) {
      setSelectedWeek(weeks[0]);
    }
  }, [data, selectedWeek]);

  useMemo(() => {
    if (!data || !selectedWeek) return;

    const days = Object.keys(data.weeks[selectedWeek]);
    if (!selectedDay && days.length > 0) {
      setSelectedDay(days[0]);
    }
  }, [data, selectedWeek, selectedDay]);

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

  const weeks = Object.keys(data.weeks);
  const days = selectedWeek ? Object.keys(data.weeks[selectedWeek]) : [];

  const contents =
    selectedWeek && selectedDay ? data.weeks[selectedWeek][selectedDay] : [];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1f2937]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[#6b7280] hover:text-[#1f2937] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-medium text-[#1f2937]">Course Library</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar 1: Weeks */}
        <div className="w-64 bg-white border-r border-[#e5e7eb] overflow-y-auto">
          <div className="px-4 py-3 border-b border-[#e5e7eb]">
            <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Weeks
            </h2>
          </div>
          <div className="py-1">
            {weeks.map((week) => (
              <button
                key={week}
                onClick={() => {
                  setSelectedWeek(week);
                  setSelectedDay(null);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  week === selectedWeek
                    ? "bg-blue-900 text-white font-medium"
                    : "text-[#1f2937] hover:bg-[#f3f4f6]"
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar 2: Days */}
        <div className="w-64 bg-[#fafafa] border-r border-[#e5e7eb] overflow-y-auto">
          <div className="px-4 py-3 border-b border-[#e5e7eb]">
            <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Days
            </h2>
          </div>
          <div className="py-1">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  day === selectedDay
                    ? "bg-blue-900 text-white font-medium"
                    : "text-[#1f2937] hover:bg-[#f3f4f6]"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa]">
          <div className="px-6 py-3 border-b border-[#e5e7eb] bg-white">
            <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Contents
            </h2>
          </div>

          <div className="p-6">
            {contents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6b7280] text-sm">No content available</p>
              </div>
            )}

            <div className="space-y-3">
              {contents.map((item) => {
                if (item.module_type === "video") {
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-[#e5e7eb] rounded-lg p-4 hover:border-blue-600    transition-colors shadow-sm"
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
                    className="bg-white border border-[#e5e7eb] rounded-lg p-4 hover:border-blue-600    transition-colors shadow-sm"
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
