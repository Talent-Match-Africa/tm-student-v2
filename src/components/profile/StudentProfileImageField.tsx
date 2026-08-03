"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { Delete02Icon, ImageUploadIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import styles from "./StudentProfileImageField.module.css";

interface StudentProfileImageFieldProps {
  apiError?: string;
  existingUrl: string | null;
  onChange: (file: File | null, removeExisting: boolean) => void;
  previewUrl: string | null;
}

export function StudentProfileImageField({
  apiError,
  existingUrl,
  onChange,
  previewUrl,
}: StudentProfileImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(file?: File): void {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Choose a JPEG, PNG, or WebP image smaller than 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setError(null);
    onChange(file, false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>): void {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span>Profile image</span>
        <span>Optional</span>
      </div>

      <label
        className={styles.dropzone}
        data-dragging={isDragging}
        data-has-image={Boolean(previewUrl)}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          accept="image/jpeg,image/png,image/webp"
          className={styles.input}
          onChange={(event) => selectFile(event.target.files?.[0])}
          ref={inputRef}
          type="file"
        />
        {previewUrl ? (
          <Image
            alt="Student profile preview"
            className={styles.preview}
            fill
            loading="eager"
            sizes="(max-width: 980px) 100vw, 280px"
            src={previewUrl}
            unoptimized
          />
        ) : (
          <span className={styles.placeholder}>
            <HugeIcon icon={ImageUploadIcon} size={25} />
            <strong>Add a profile image</strong>
            <small>JPEG, PNG, or WebP up to 5 MB</small>
          </span>
        )}
        <span className={styles.overlay}>
          {previewUrl ? "Choose another image" : "Choose image"}
        </span>
      </label>

      {previewUrl ? (
        <button
          className={styles.removeButton}
          onClick={() => {
            onChange(null, Boolean(existingUrl));
            if (inputRef.current) inputRef.current.value = "";
          }}
          type="button"
        >
          <HugeIcon icon={Delete02Icon} size={14} />
          Remove image
        </button>
      ) : null}
      {error || apiError ? <p role="alert">{error ?? apiError}</p> : null}
    </div>
  );
}
