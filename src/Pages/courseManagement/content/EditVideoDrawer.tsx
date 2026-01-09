import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import ButtonSm from "@/components/common/Button";
import Input from "@/components/common/Input";
import ImageUploader, {
  type ImageUploaderValue,
} from "@/components/common/ImageUploader";
import VideoUploadDialog from "./VideoUploadDialog";
import { useUpdateTierContent } from "@/queries/contentQuery";
import type { VideoContent } from "@/types/courseContent";

interface EditVideoDrawerProps {
  tierId: string;
  contentId: string;
  video: VideoContent;
  onClose: () => void;
}

const EditVideoDrawer = ({
  tierId,
  contentId,
  video,
  onClose,
}: EditVideoDrawerProps) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [videoUrl, setVideoUrl] = useState<string | null>(video.video_url);
  const [videoDuration, setVideoDuration] = useState<number | null>(
    video.duration
  );
  const [thumbnailData, setThumbnailData] = useState<string | null>(
    video.thumbnail_url
  );
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);

  const { mutate: updateTierContent, isPending } = useUpdateTierContent();

  const isFormValid = Boolean(
    title.trim() && videoUrl && description.trim() && (videoDuration ?? 0) > 0
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) return;

    updateTierContent(
      {
        tierId,
        contentId,
        payload: {
          module_type: "video",
          video: {
            title: title.trim(),
            description: description.trim(),
            video_url: videoUrl || "",
            thumbnail_url: thumbnailData ?? "",
            duration: videoDuration ?? 0,
          },
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 text-[#1f2937]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
            Edit Video
          </p>
          <p className="text-sm text-[#4b5563]">Modify the video details</p>
        </div>

        <X
          onClick={onClose}
          className="h-4 w-4 cursor-pointer hover:text-red-500 duration-150 ease-in-out transition-all"
        />
      </div>

      <Input
        required
        title="Video Title"
        placeholder="Enter video title"
        inputValue={title}
        onChange={setTitle}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#1f2937]">
          Video Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          className="rounded-lg border border-[#d1d3d9] bg-white px-3 py-2 text-sm focus:border-[#1f2937] focus:outline-none"
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#1f2937]">Video URL</label>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-[#d1d3d9] bg-gray-50 px-3 py-2 text-sm text-[#6b7280]">
            {videoUrl || "No video uploaded"}
          </div>
          <ButtonSm
            type="button"
            state="outline"
            onClick={() => setIsVideoUploadOpen(true)}
            className="whitespace-nowrap"
          >
            Change Video
          </ButtonSm>
        </div>
      </div>

      {videoDuration && (
        <Input
          required
          title="Duration (seconds)"
          type="num"
          placeholder="0"
          inputValue={videoDuration}
          onChange={(value) => setVideoDuration(Number(value) || 0)}
          min={1}
        />
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#1f2937]">Thumbnail</label>
        <ImageUploader
          label="Upload thumbnail"
          returnType="dataUrl"
          initialPreview={thumbnailData}
          onChange={(value: ImageUploaderValue) => {
            if (typeof value === "string") {
              setThumbnailData(value);
              return;
            }
            if (value === null) {
              setThumbnailData(null);
            }
          }}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <ButtonSm
          type="button"
          state="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </ButtonSm>
        <ButtonSm
          type="submit"
          state="default"
          disabled={!isFormValid || isPending}
          className="flex-1"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </ButtonSm>
      </div>

      {isVideoUploadOpen && (
        <VideoUploadDialog
          onClose={() => setIsVideoUploadOpen(false)}
          onUploaded={({ videoUrl: uploadedUrl, duration }) => {
            setVideoUrl(uploadedUrl);
            setVideoDuration(duration);
            setIsVideoUploadOpen(false);
          }}
        />
      )}
    </form>
  );
};

export default EditVideoDrawer;
