"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  existingImages?: string[];
  onExistingImageDelete?: (imageUrl: string) => void;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export function MultiImageUpload({
  images,
  onChange,
  existingImages = [],
  onExistingImageDelete,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
}: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalImages = images.length + existingImages.length;
  const canAddMoreImages = totalImages < maxFiles;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    processFiles(newFiles);

    // Reset the input value so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFiles = (files: File[]) => {
    setError(null);

    // Check if adding these files would exceed the max
    if (totalImages + files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    // Filter out files that are too large or not images
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        setError(
          `File "${file.name}" is too large. Maximum size is ${
            maxSize / 1024 / 1024
          }MB.`
        );
        return false;
      }

      if (!file.type.startsWith("image/")) {
        setError(`File "${file.name}" is not an image.`);
        return false;
      }

      return true;
    });

    onChange([...images, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const removeExistingImage = (imageUrl: string) => {
    if (onExistingImageDelete) {
      onExistingImageDelete(imageUrl);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drag and drop area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          !canAddMoreImages && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => canAddMoreImages && fileInputRef.current?.click()}
        style={{ cursor: canAddMoreImages ? "pointer" : "not-allowed" }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          disabled={!canAddMoreImages}
        />
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-1">
          {canAddMoreImages
            ? "Drag and drop your images here"
            : `Maximum of ${maxFiles} images reached`}
        </p>
        {canAddMoreImages && (
          <>
            <p className="text-xs text-muted-foreground mb-2">or</p>
            <Button type="button" variant="outline" size="sm">
              Browse Files
            </Button>
          </>
        )}
      </div>

      {/* Error message */}
      {error && <div className="text-sm text-destructive">{error}</div>}

      {/* Preview of existing images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Existing Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div
                key={`existing-${index}`}
                className="group relative aspect-video bg-muted rounded-md overflow-hidden"
              >
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Existing image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
                {onExistingImageDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExistingImage(imageUrl);
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview of new images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">New Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((file, index) => (
              <div
                key={`new-${index}`}
                className="group relative aspect-video bg-muted rounded-md overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`New image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove image</span>
                </Button>
                <div className="absolute bottom-1 left-1 right-1 text-xs bg-background/80 rounded px-1 py-0.5 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no images */}
      {totalImages === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p>No images selected</p>
        </div>
      )}
    </div>
  );
}
