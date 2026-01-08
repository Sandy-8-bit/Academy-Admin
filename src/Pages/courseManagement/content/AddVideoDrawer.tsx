import { useState, useMemo, type FormEvent } from "react";
import { X } from "lucide-react";
import ButtonSm from "@/components/common/Button";
import Input from "@/components/common/Input";
import ImageUploader, {
  type ImageUploaderValue,
} from "@/components/common/ImageUploader";
import VideoUploadDialog from "./VideoUploadDialog";
import { useCreateTierContent } from "@/queries/contentQuery";

interface AddVideoDrawerProps {
  tierId?: string;
  weekLabel: string | null;
  dayLabel: string | null;
  contentsCount: number;
  onClose: () => void;
}

const numberFromLabel = (label: string | null) => {
  if (!label) return null;
  const digitMatch = label.match(/\d+/);
  if (digitMatch) return Number(digitMatch[0]);
  const parsed = Number(label);
  return Number.isFinite(parsed) ? parsed : null;
};

const AddVideoDrawer = ({
  tierId,
  weekLabel,
  dayLabel,
  contentsCount,
  onClose,
}: AddVideoDrawerProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [thumbnailData, setThumbnailData] = useState<string | null>(null);
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);

  const { mutate: createTierContent, isPending } = useCreateTierContent();

  const contextReady = Boolean(tierId && weekLabel && dayLabel);

  const weekNumber = useMemo(() => numberFromLabel(weekLabel), [weekLabel]);
  const dayNumber = useMemo(() => numberFromLabel(dayLabel), [dayLabel]);

  const isFormValid =
    contextReady &&
    weekNumber !== null &&
    dayNumber !== null &&
    Boolean(title.trim()) &&
    Boolean(videoUrl) &&
    Boolean(description.trim()) &&
    (videoDuration ?? 0) > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || !tierId || weekNumber === null || dayNumber === null)
      return;

    createTierContent(
      {
        tierId,
        payload: {
          module_type: "video",
          week: weekNumber,
          day: dayNumber,
          position: contentsCount + 1,
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
          setTitle("");
          setDescription("");
          setVideoUrl(null);
          setVideoDuration(null);
          setThumbnailData(null);
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
            Add Video
          </p>
          <p className="text-sm text-[#4b5563]">
            {weekLabel ?? "Select a week"} · {dayLabel ?? "Select a day"}
          </p>
        </div>

        <X
          onClick={onClose}
          className="h-4 w-4 cursor-pointer hover:text-red-500 duration-150 ease-in-out transition-all"
        />
      </div>

      {!contextReady && (
        <div className="rounded-md border border-dashed border-[#d1d3d9] bg-[#f9fafb] p-3 text-xs text-[#6b7280]">
          Select a week and day from the sidebar to add content.
        </div>
      )}

      <Input
        required
        title="Video Title"
        placeholder="Intro to the course"
        inputValue={title}
        onChange={setTitle}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-[#6b7280]">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="rounded-xl border-2 border-[#F1F1F1] bg-white px-3 py-3 text-sm font-medium text-slate-600 focus:outline-none"
          rows={3}
          placeholder="Provide a short summary"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
            Video File
          </p>
          {videoUrl && (
            <span className="text-[11px] font-medium text-[#059669]">
              Uploaded
            </span>
          )}
        </div>
        <ButtonSm
          type="button"
          state="default"
          className="w-full justify-center"
          onClick={() => setIsVideoUploadOpen(true)}
        >
          {videoUrl ? "Replace Video" : "Upload Video File"}
        </ButtonSm>
        {videoDuration !== null && (
          <div className="rounded-md border border-[#d1d3d9] bg-white px-3 py-2 text-xs text-[#4b5563]">
            Duration: {Math.floor(videoDuration / 60)}m {videoDuration % 60}s
          </div>
        )}
      </div>

      <ImageUploader
        label="Upload thumbnail"
        returnType="dataUrl"
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

      <div className="mt-auto flex gap-3 pt-4">
        <ButtonSm
          type="button"
          state="outline"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </ButtonSm>
        <ButtonSm
          type="submit"
          state="default"
          className="flex-1"
          disabled={!isFormValid || isPending}
        >
          {isPending ? "Saving..." : "Save Video"}
        </ButtonSm>
      </div>
    </form>
  );
};

export default AddVideoDrawer;
