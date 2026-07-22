import { API_URL } from "../lib/api";
import { Photo } from "../types";

export type UploadStatus =
  | "waiting"
  | "uploading"
  | "processing"
  | "success"
  | "failed"
  | "paused"
  | "cancelled"
  | "duplicate";

export type DuplicateAction = "check" | "skip" | "replace" | "keep";

export interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number; // 0 - 100
  status: UploadStatus;
  error?: string;
  xhr?: XMLHttpRequest;
  photo?: Photo;
  sha256?: string;
  duplicatePhoto?: Photo;
  speedMs?: number;
}

export type UploadEventType =
  | "validationStarted"
  | "validationCompleted"
  | "previewGenerated"
  | "uploadStarted"
  | "uploadProgress"
  | "uploadCompleted"
  | "uploadFailed"
  | "metadataExtracted"
  | "duplicateDetected";

export interface UploadEventPayload {
  itemId?: string;
  file?: File;
  progress?: number;
  photo?: Photo;
  error?: string;
  duplicatePhoto?: Photo;
}

type EventListener = (payload: UploadEventPayload) => void;

class UploadEventEmitter {
  private listeners: Map<UploadEventType, Set<EventListener>> = new Map();

  on(event: UploadEventType, callback: EventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: UploadEventType, callback: EventListener) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  emit(event: UploadEventType, payload: UploadEventPayload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in upload listener for ${event}:`, err);
        }
      });
    }
  }
}

export const uploadEventEmitter = new UploadEventEmitter();

/**
 * Fast client-side SHA-256 calculation for instant duplicate detection
 */
export async function calculateSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Upload original uncompressed binary photograph using multipart/form-data & XMLHttpRequest
 */
export function uploadPhotoFormData(
  item: QueueItem,
  authToken: string,
  duplicateAction: DuplicateAction = "check",
  onProgress: (progress: number) => void,
  onSuccess: (photo: Photo) => void,
  onError: (errorMsg: string) => void,
  onDuplicate: (existingPhoto: Photo) => void
): XMLHttpRequest {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  // Send original binary file intact without client compression loss
  formData.append("file", item.file, item.file.name);
  formData.append("status", "draft");

  uploadEventEmitter.emit("uploadStarted", { itemId: item.id, file: item.file });

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 90);
      onProgress(percent);
      uploadEventEmitter.emit("uploadProgress", { itemId: item.id, progress: percent });
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        onProgress(95);
        const res = JSON.parse(xhr.responseText);

        if (res.duplicate && res.action === "skipped") {
          onProgress(100);
          onSuccess(res.photo);
          uploadEventEmitter.emit("uploadCompleted", { itemId: item.id, photo: res.photo });
          return;
        }

        const photo: Photo = res.photo || res;
        onProgress(100);
        onSuccess(photo);
        uploadEventEmitter.emit("uploadCompleted", { itemId: item.id, photo });
        if (photo.camera || photo.lens || photo.iso) {
          uploadEventEmitter.emit("metadataExtracted", { itemId: item.id, photo });
        }
      } catch (e) {
        onError("Invalid response format from server");
        uploadEventEmitter.emit("uploadFailed", { itemId: item.id, error: "Invalid response" });
      }
    } else if (xhr.status === 409) {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.duplicate && res.existingPhoto) {
          onDuplicate(res.existingPhoto);
          uploadEventEmitter.emit("duplicateDetected", {
            itemId: item.id,
            duplicatePhoto: res.existingPhoto
          });
          return;
        }
      } catch {}
      onError("Duplicate photo detected");
      uploadEventEmitter.emit("uploadFailed", { itemId: item.id, error: "Duplicate detected" });
    } else {
      let msg = "Upload failed";
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.error) msg = res.error;
      } catch {}
      onError(msg);
      uploadEventEmitter.emit("uploadFailed", { itemId: item.id, error: msg });
    }
  };

  xhr.onerror = () => {
    const errorMsg = "Network connection error";
    onError(errorMsg);
    uploadEventEmitter.emit("uploadFailed", { itemId: item.id, error: errorMsg });
  };

  xhr.ontimeout = () => {
    const errorMsg = "Upload request timed out";
    onError(errorMsg);
    uploadEventEmitter.emit("uploadFailed", { itemId: item.id, error: errorMsg });
  };

  xhr.open("POST", `${API_URL}/api/photos`);
  if (authToken) {
    xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
  }
  xhr.setRequestHeader("X-Duplicate-Action", duplicateAction);

  xhr.send(formData);
  return xhr;
}
