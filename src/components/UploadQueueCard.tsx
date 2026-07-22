import React from "react";
import { QueueItem, DuplicateAction } from "../services/uploadQueue";
import { X, RotateCcw, AlertCircle, CheckCircle2, Pause, Play, Copy, RefreshCw, Trash2 } from "lucide-react";

interface UploadQueueCardProps {
  item: QueueItem;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onResolveDuplicate: (id: string, action: DuplicateAction) => void;
}

export const UploadQueueCard = React.memo(function UploadQueueCard({
  item,
  onCancel,
  onRetry,
  onResolveDuplicate
}: UploadQueueCardProps) {
  return (
    <div className="flex flex-col bg-neutral-900/90 border border-neutral-800/90 p-2.5 text-xs relative overflow-hidden rounded-sm transition-all">
      <div className="flex items-center gap-3">
        {/* Instant Object URL Preview Thumbnail */}
        <img
          src={item.previewUrl}
          alt={item.file.name}
          className="w-12 h-12 object-cover border border-neutral-800 shrink-0 bg-neutral-950 rounded-xs"
        />

        {/* Info & Status */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[11px] text-neutral-200 font-medium">
              {item.file.name}
            </span>
            <span className="font-mono text-[9px] text-neutral-400 shrink-0">
              {(item.file.size / (1024 * 1024)).toFixed(1)} MB
            </span>
          </div>

          {/* Status state */}
          {item.status === "waiting" && (
            <span className="font-mono text-[9px] text-neutral-500">Waiting in background queue...</span>
          )}

          {item.status === "paused" && (
            <span className="font-mono text-[9px] text-amber-500/80">Upload paused</span>
          )}

          {(item.status === "uploading" || item.status === "processing") && (
            <div className="flex flex-col gap-1">
              <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-150"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between font-mono text-[9px] text-amber-400">
                <span>{item.status === "uploading" ? "Streaming binary bytes..." : "Processing..."}</span>
                <span>{item.progress}%</span>
              </div>
            </div>
          )}

          {item.status === "success" && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[9px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Imported & EXIF extracted</span>
            </div>
          )}

          {item.status === "duplicate" && (
            <div className="flex flex-col gap-1 text-amber-400 font-mono text-[9px]">
              <div className="flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Identical photo exists in library</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => onResolveDuplicate(item.id, "replace")}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xs transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  onClick={() => onResolveDuplicate(item.id, "keep")}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xs transition-colors cursor-pointer"
                >
                  Keep Both
                </button>
                <button
                  onClick={() => onResolveDuplicate(item.id, "skip")}
                  className="px-2 py-0.5 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 rounded-xs transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {item.status === "failed" && (
            <div className="flex items-center gap-1 text-red-400 font-mono text-[9px]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.error || "Upload failed"}</span>
            </div>
          )}
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-1 shrink-0">
          {item.status === "failed" && (
            <button
              onClick={() => onRetry(item.id)}
              title="Retry Upload"
              className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 transition-colors rounded-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {(item.status === "waiting" ||
            item.status === "paused" ||
            item.status === "uploading" ||
            item.status === "processing" ||
            item.status === "failed") && (
            <button
              onClick={() => onCancel(item.id)}
              title="Cancel Upload"
              className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors rounded-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
