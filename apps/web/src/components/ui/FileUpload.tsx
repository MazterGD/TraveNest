"use client";

import { useRef, useState } from "react";
import { FaUpload, FaCheckCircle, FaTimes, FaFile } from "react-icons/fa";
import { cn } from "@/lib/utils/cn";

export interface UploadedFile {
  file: File;
  preview?: string;
}

interface FileUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  value?: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  error?: string;
  helpText?: string;
  className?: string;
}

export function FileUpload({
  label,
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5,
  value,
  onChange,
  error,
  helpText,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setLocalError(null);

    if (!file) {
      onChange(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setLocalError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const fileMimeType = file.type.toLowerCase();

    const isValidType = allowedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileExtension === type;
      }
      return fileMimeType.includes(type.replace("*", ""));
    });

    if (!isValidType) {
      setLocalError(`Invalid file type. Allowed: ${accept}`);
      return;
    }

    // Create preview for images
    let preview: string | undefined;
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }

    onChange({ file, preview });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (value?.preview) {
      URL.revokeObjectURL(value.preview);
    }
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const displayError = error || localError;
  const isImage = value?.file.type.startsWith("image/");

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-lg font-semibold text-gray-800">
          {label} {required && "*"}
        </label>
        {value && (
          <span className="text-green-600 flex items-center gap-2 text-sm">
            <FaCheckCircle className="w-4 h-4" />
            Uploaded
          </span>
        )}
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-6 transition-all",
          dragActive
            ? "border-primary bg-primary/5"
            : displayError
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-primary/50",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="flex items-center gap-4">
            {/* File Preview */}
            <div className="flex-shrink-0">
              {isImage && value.preview ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FaFile className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {value.file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(value.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center cursor-pointer">
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all w-full">
              <FaUpload className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600 font-medium">
                Click to upload or drag and drop
              </span>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
              required={required && !value}
            />
          </label>
        )}
      </div>

      {displayError && (
        <p className="mt-2 text-sm text-red-600">{displayError}</p>
      )}

      {helpText && !displayError && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

// Multi-file upload for documents
interface DocumentUploadGroupProps {
  documents: {
    key: string;
    label: string;
    required: boolean;
    helpText?: string;
  }[];
  values: Record<string, UploadedFile | null>;
  onChange: (key: string, file: UploadedFile | null) => void;
  errors?: Record<string, string>;
}

export function DocumentUploadGroup({
  documents,
  values,
  onChange,
  errors,
}: DocumentUploadGroupProps) {
  return (
    <div className="space-y-6">
      {documents.map((doc) => (
        <FileUpload
          key={doc.key}
          label={doc.label}
          required={doc.required}
          value={values[doc.key]}
          onChange={(file) => onChange(doc.key, file)}
          error={errors?.[doc.key]}
          helpText={doc.helpText || "Accepted formats: PDF, JPG, PNG (Max 5MB)"}
        />
      ))}
    </div>
  );
}
