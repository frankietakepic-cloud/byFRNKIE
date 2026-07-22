import { useState, useEffect, useRef, useCallback } from "react";
import {
  QueueItem,
  DuplicateAction,
  uploadPhotoFormData,
  calculateSha256,
  uploadEventEmitter
} from "../services/uploadQueue";
import { Photo } from "../types";

const MAX_CONCURRENT_UPLOADS = 3;

interface UseUploadQueueOptions {
  onPhotoUploaded?: (photo: Photo) => void;
}

export function useUploadQueue(options: UseUploadQueueOptions = {}) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const queueRef = useRef<QueueItem[]>([]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  // Clean up Object URLs on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  // Enqueue new files instantly with URL.createObjectURL previews
  const enqueueFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    const newItems: QueueItem[] = fileArray.map((file) => {
      const id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      uploadEventEmitter.emit("validationStarted", { itemId: id, file });
      const previewUrl = URL.createObjectURL(file);
      uploadEventEmitter.emit("previewGenerated", { itemId: id, file });
      uploadEventEmitter.emit("validationCompleted", { itemId: id, file });

      return {
        id,
        file,
        previewUrl,
        progress: 0,
        status: "waiting"
      };
    });

    setQueue((prev) => [...prev, ...newItems]);
  }, []);

  // Cancel specific upload
  const cancelUpload = useCallback((id: string) => {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item) {
        if (item.xhr) {
          try {
            item.xhr.abort();
          } catch {}
        }
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
      return prev.filter((q) => q.id !== id);
    });
  }, []);

  // Retry failed upload
  const retryUpload = useCallback((id: string) => {
    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: "waiting",
            progress: 0,
            error: undefined,
            duplicatePhoto: undefined
          };
        }
        return item;
      })
    );
  }, []);

  // Resolve duplicate conflict (skip / replace / keep copy)
  const resolveDuplicate = useCallback((id: string, action: DuplicateAction) => {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (!item) return prev;

      if (action === "skip") {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        return prev.filter((q) => q.id !== id);
      }

      // Re-trigger upload with chosen action header
      return prev.map((q) =>
        q.id === id ? { ...q, status: "waiting", progress: 0, error: undefined } : q
      );
    });
  }, []);

  // Pause queue
  const pauseQueue = useCallback(() => {
    setIsPaused(true);
    setQueue((prev) =>
      prev.map((item) => {
        if (item.status === "waiting") {
          return { ...item, status: "paused" };
        }
        return item;
      })
    );
  }, []);

  // Resume queue
  const resumeQueue = useCallback(() => {
    setIsPaused(false);
    setQueue((prev) =>
      prev.map((item) => {
        if (item.status === "paused") {
          return { ...item, status: "waiting" };
        }
        return item;
      })
    );
  }, []);

  // Clear completed items from queue and free memory
  const clearCompleted = useCallback(() => {
    setQueue((prev) => {
      prev.forEach((item) => {
        if ((item.status === "success" || item.status === "cancelled") && item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      return prev.filter((item) => item.status !== "success" && item.status !== "cancelled");
    });
  }, []);

  // Main Queue Processor Loop
  useEffect(() => {
    if (isPaused) return;

    const waitingItems = queue.filter((item) => item.status === "waiting");
    const activeItems = queue.filter(
      (item) => item.status === "uploading" || item.status === "processing"
    );

    if (waitingItems.length === 0 || activeItems.length >= MAX_CONCURRENT_UPLOADS) {
      return;
    }

    const slotsAvailable = MAX_CONCURRENT_UPLOADS - activeItems.length;
    const itemsToStart = waitingItems.slice(0, slotsAvailable);

    itemsToStart.forEach((item) => {
      // Mark as uploading immediately
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "uploading", progress: 2 } : q))
      );

      (async () => {
        const authToken = sessionStorage.getItem("officina_token") || "";

        // Send binary FormData directly via XHR
        const xhr = uploadPhotoFormData(
          item,
          authToken,
          "check",
          (progress) => {
            setQueue((prev) =>
              prev.map((q) => (q.id === item.id ? { ...q, progress } : q))
            );
          },
          (photo) => {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? { ...q, status: "success", progress: 100, photo, xhr: undefined }
                  : q
              )
            );
            if (options.onPhotoUploaded) {
              options.onPhotoUploaded(photo);
            }
          },
          (errorMsg) => {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? { ...q, status: "failed", error: errorMsg, xhr: undefined }
                  : q
              )
            );
          },
          (existingPhoto) => {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? {
                      ...q,
                      status: "duplicate",
                      duplicatePhoto: existingPhoto,
                      xhr: undefined
                    }
                  : q
              )
            );
          }
        );

        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, xhr } : q))
        );
      })();
    });
  }, [queue, isPaused, options]);

  const isUploading = queue.some(
    (item) => item.status === "uploading" || item.status === "processing" || item.status === "waiting"
  );

  return {
    queue,
    enqueueFiles,
    cancelUpload,
    retryUpload,
    resolveDuplicate,
    pauseQueue,
    resumeQueue,
    clearCompleted,
    isUploading,
    isPaused
  };
}
