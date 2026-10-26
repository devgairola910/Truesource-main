"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { cn, formatBytes, generateId } from "@/lib/utils";
import {
  ACCEPT_STRING,
  ACCEPTED_EXTENSIONS_LABEL,
  validateFiles,
  UploadFileItem,
  getMediaType,
  uploadFileToAPI,
  MAX_FILE_SIZE_LABEL,
} from "@/lib/upload";

export type FileUploaderProps = {
  onFilesChange?: (files: UploadFileItem[]) => void;
  maxFiles?: number;
};

export function FileUploader({ onFilesChange, maxFiles = 10 }: FileUploaderProps) {
  const [items, setItems] = useState<UploadFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const updateItem = useCallback((id: string, updates: Partial<UploadFileItem>) => {
    setItems((prev) => {
      return prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
    });
  }, []);

  const startUpload = useCallback(async (item: UploadFileItem) => {
    try {
      updateItem(item.id, { status: "uploading", progress: 0 });
      
      const result = await uploadFileToAPI(
        item.file,
        (progress) => updateItem(item.id, { progress })
      );

      updateItem(item.id, { 
        status: "done", 
        progress: 100, 
        url: result.url,
        fingerprintId: (result as any).fingerprintId,
        pHash: (result as any).pHash,
      });
      addToast({ type: "success", title: "Upload Complete", message: `Successfully uploaded ${item.name}` });

    } catch (err) {
      updateItem(item.id, { status: "error", error: err instanceof Error ? err.message : "Upload failed" });
      addToast({ type: "error", title: "Upload Failed", message: `Could not upload ${item.name}` });
    }
  }, [updateItem, addToast]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (items.length + fileArray.length > maxFiles) {
      addToast({ type: "error", message: `You can only upload up to ${maxFiles} files.` });
      return;
    }

    const { valid, errors } = validateFiles(fileArray);

    errors.forEach((err) => {
      addToast({ type: "error", title: "Validation Error", message: err.message });
    });

    const newItems: UploadFileItem[] = valid.map((file) => ({
      id: generateId("file"),
      file,
      name: file.name,
      size: file.size,
      mediaType: getMediaType(file),
      progress: 0,
      status: "queued",
    }));

    setItems((prev) => [...prev, ...newItems]);

    // Start uploads
    newItems.forEach((item) => startUpload(item));
  }, [items.length, maxFiles, addToast, onFilesChange, startUpload]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
    // Reset input so selecting the same file again works
    if (inputRef.current) inputRef.current.value = "";
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  useEffect(() => {
    onFilesChange?.(items);
  }, [items, onFilesChange]);

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_STRING}
        onChange={onFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 px-6 cursor-pointer transition",
          isDragging
            ? "border-[var(--brand)] bg-[var(--brand-surface)]"
            : "border-[var(--stroke)] hover:border-[var(--brand)] hover:bg-[var(--brand-surface)]"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn("mb-4 transition-colors", isDragging ? "text-[var(--brand)]" : "text-[var(--text-soft)]")}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm font-semibold text-[var(--text-strong)]">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-[var(--text-soft)] mt-1">
          {ACCEPTED_EXTENSIONS_LABEL} · {MAX_FILE_SIZE_LABEL} file size
        </p>
      </div>

      {/* File list */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-3"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                  item.mediaType === "video" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                )}
              >
                {item.mediaType === "video" ? "🎬" : "🖼️"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-strong)] truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--text-soft)]">{formatBytes(item.size)}</span>
                  {item.status === "error" && (
                    <span className="text-xs text-[var(--danger)] truncate flex-1">{item.error}</span>
                  )}
                </div>
                {item.status === "uploading" && (
                  <Progress value={item.progress} size="sm" className="mt-1.5" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    item.status === "done"
                      ? "success"
                      : item.status === "error"
                      ? "danger"
                      : "info"
                  }
                >
                  {item.status === "done"
                    ? "Uploaded"
                    : item.status === "error"
                    ? "Failed"
                    : `${item.progress}%`}
                </Badge>
                {item.status !== "uploading" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="p-1 rounded hover:bg-[var(--surface-2)] text-[var(--text-soft)] hover:text-[var(--danger)] transition"
                    aria-label="Remove file"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
