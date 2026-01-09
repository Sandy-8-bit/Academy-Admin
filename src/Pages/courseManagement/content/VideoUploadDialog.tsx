import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import DialogBox from "@/components/common/DialogBox";
import { useRequestVideoUploadUrl } from "@/queries/mediaQuery";
import { X } from "lucide-react";

interface VideoUploadDialogProps {
  onClose: () => void;
  onUploaded: (payload: { videoUrl: string; duration: number }) => void;
}

const readVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.preload = "metadata";
    video.src = objectUrl;
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration)
        ? Math.round(video.duration)
        : 0;
      URL.revokeObjectURL(objectUrl);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read video metadata"));
    };
  });

const uploadToAzure = (
  url: string,
  file: File,
  onProgress: (value: number) => void
) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
    xhr.setRequestHeader("Content-Type", "video/mp4");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error("Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed. Please check your connection."));
    };

    xhr.send(file);
  });

const humanFileSize = (size: number) => {
  if (!size) return "0 B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const value = size / Math.pow(1024, i);
  const units = ["B", "KB", "MB", "GB", "TB"];
  return `${value.toFixed(1)} ${units[i]}`;
};

const VideoUploadDialog = ({ onClose, onUploaded }: VideoUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "requesting" | "uploading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: requestUploadUrl } = useRequestVideoUploadUrl();

  const disableClose = status === "requesting" || status === "uploading";
  const handleDialogToggle: Dispatch<SetStateAction<boolean>> = () => {
    if (!disableClose) onClose();
  };

  useEffect(() => {
    if (!selectedFile) return;

    const performUpload = async () => {
      setError(null);
      try {
        setStatus("requesting");
        const { uploadUrl, video_url } = await requestUploadUrl({
          contentType: selectedFile.type || "video/mp4",
          extension: "mp4",
        });

        setStatus("uploading");
        await uploadToAzure(uploadUrl, selectedFile, setProgress);
        const duration = await readVideoDuration(selectedFile);

        setStatus("success");
        onUploaded({ videoUrl: video_url, duration });
      } catch (err) {
        setStatus("error");
        setProgress(0);
        setSelectedFile(null);
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    };

    void performUpload();
  }, [requestUploadUrl, selectedFile, onUploaded]);

  const helperText = useMemo(() => {
    if (status === "uploading") {
      return "Do not close this window while the video is uploading.";
    }
    if (status === "requesting") {
      return "Requesting secure upload link...";
    }
    return "MP4 recommended.";
  }, [status]);

  return (
    <DialogBox setToggleDialogueBox={handleDialogToggle}>
      <div className="flex flex-col gap-6 min-w-full">
        <header className="flex flex-row  w-full justify-between items-start">
          <div className="lef flex flex-col ">
            <h3 className="text-base font-semibold text-[#111827]">
              Upload Video
            </h3>
            <p className="text-xs text-[#6b7280]">{helperText}</p>
          </div>
          <X
            onClick={onClose}
            className="h-4 w-4 cursor-pointer hover:text-red-500 duration-150 ease-in-out transition-all"
          />
        </header>

        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d1d3d9] bg-[#f9fafb] px-4 py-8 text-center text-sm font-medium text-[#4b5563]">
          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#111827]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-[#6b7280]">
                {humanFileSize(selectedFile.size)}
              </p>
            </div>
          ) : (
            <>
              <span>Click to choose a video file</span>
              <span className="text-xs text-[#9ca3af]">
                MP4 supported for now
              </span>
            </>
          )}
          <input
            type="file"
            accept="video/mp4"
            className="hidden"
            disabled={disableClose}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setSelectedFile(file);
              event.target.value = "";
            }}
          />
        </label>

        {(status === "uploading" || status === "requesting") && (
          <div>
            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <span>{status === "uploading" ? "Uploading" : "Preparing"}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[#111827] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}
      </div>
    </DialogBox>
  );
};

export default VideoUploadDialog;
