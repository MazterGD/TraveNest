import React, { useState } from "react";
import { FaCamera, FaTimes, FaImage } from "react-icons/fa";

interface ImageUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  preview?: string; // URL for preview
  maxSize?: number; // in MB
  required?: boolean;
  helperText?: string;
  error?: string;
  aspectRatio?: "square" | "video" | "wide"; // aspect-[1/1], aspect-video, aspect-[16/9]
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  preview,
  maxSize = 5,
  required = false,
  helperText,
  error,
  aspectRatio = "video",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Image size must be less than ${maxSize}MB`);
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange(file);
  };

  const handleRemove = () => {
    if (previewUrl && !preview) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onChange(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          group relative overflow-hidden rounded-lg border-2 border-dashed transition-colors
          ${aspectClasses[aspectRatio]}
          ${dragActive ? "border-[#20B0E9] bg-blue-50" : error ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}
        `}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
            <input
              type="file"
              onChange={handleChange}
              accept="image/*"
              className="hidden"
            />
            <FaCamera className="mb-3 h-10 w-10 text-gray-400" />
            <div className="mb-1 font-medium text-gray-700">
              Click to upload or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </label>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
