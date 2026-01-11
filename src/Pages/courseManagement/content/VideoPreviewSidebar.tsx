import { X } from "lucide-react";
import ButtonSm from "@/components/common/Button";
import type { VideoContent } from "@/types/courseContent";
import { useFetchVideoPlayUrl } from "@/queries/contentQuery";

interface VideoPreviewSidebarProps {
  video: VideoContent;
  open: boolean;
  onClose: () => void;
  contentId: string;
}

const formatDuration = (seconds?: number | null) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VideoPreviewSidebar = ({
  video,
  open,
  contentId,
  onClose,
}: VideoPreviewSidebarProps) => {
  const { data, isLoading } = useFetchVideoPlayUrl(contentId);

  if (!open) return null;

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading video...</div>;
  }
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Sidebar */}
      <aside className="w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Video Preview
            </p>
            <p className="text-sm text-gray-700">Watch and review content</p>
          </div>

          <X
            className="h-4 w-4 cursor-pointer hover:text-red-500 transition"
            onClick={onClose}
          />
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black">
          {video.video_url ? (
            <video
              src={data?.video_url}
              controls
              className="w-full h-full"
              autoPlay
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No video available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto">
          <div>
            <p className="text-sm font-semibold text-gray-900">{video.title}</p>
            <p className="mt-1 text-xs text-gray-500">
              Duration: {formatDuration(video.duration)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Description
            </p>
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
              {video.description || "No description provided."}
            </p>
          </div>

          {video.thumbnail_url && (
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">
                Thumbnail
              </p>
              <img
                src={video.thumbnail_url}
                alt="Video thumbnail"
                className="mt-2 rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <ButtonSm state="outline" className="w-full" onClick={onClose}>
            Close Preview
          </ButtonSm>
        </div>
      </aside>
    </div>
  );
};

export default VideoPreviewSidebar;
