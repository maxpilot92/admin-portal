"use client";

import type React from "react";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  imageHeight?: number;
  imageWidth?: number;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  imageHeight = 150,
  imageWidth,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // In a real application, this would upload to your storage service
  // For this example, we'll simulate an upload with a timeout
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create a local URL for the file
      const url = URL.createObjectURL(file);

      // In a real app, you would upload the file to your server or cloud storage
      // and get back a URL to use
      onChange(url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative">
          <Image
            width={42}
            height={42}
            src={value || "/placeholder.svg"}
            alt="Uploaded image"
            className="rounded-md object-contain"
            style={{
              height: imageHeight,
              width: imageWidth || "auto",
              maxWidth: "100%",
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center"
          style={{ minHeight: imageHeight }}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-muted p-2">
                <Upload className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-start">
        <label
          htmlFor={`image-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={isUploading}
            asChild
          >
            <span>{value ? "Change Image" : "Upload Image"}</span>
          </Button>
          <input
            id={`image-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
