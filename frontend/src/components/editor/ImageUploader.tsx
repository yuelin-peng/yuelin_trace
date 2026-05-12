import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { ossService } from '@/services/oss-service';
import { showErrorToast, showSuccessToast } from '@/lib/error-handler';

export interface ImageUploaderProps {
  onUpload: (url: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  maxSize?: number;
  acceptTypes?: string[];
}

const DEFAULT_ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

export function ImageUploader({
  onUpload,
  onError,
  className,
  maxSize = DEFAULT_MAX_SIZE,
  acceptTypes = DEFAULT_ACCEPT_TYPES,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!acceptTypes.includes(file.type)) {
        const error = new Error(`Invalid file type. Accepted: ${acceptTypes.join(', ')}`);
        showErrorToast(error);
        onError?.(error);
        return;
      }

      if (file.size > maxSize) {
        const error = new Error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
        showErrorToast(error);
        onError?.(error);
        return;
      }

      setIsUploading(true);
      setProgress(0);

      try {
        const publicUrl = await ossService.uploadFile(file, (p) => {
          setProgress(p);
        });
        onUpload(publicUrl);
        showSuccessToast('Image uploaded successfully');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        showErrorToast(error);
        onError?.(error);
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [acceptTypes, maxSize, onUpload, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((f) => acceptTypes.includes(f.type));
      if (imageFile) {
        handleUpload(imageFile);
      }
    },
    [acceptTypes, handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
      e.target.value = '';
    },
    [handleUpload]
  );

  return (
    <div
      className={clsx(
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isUploading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            <span className="ml-3 text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">Uploading image...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">Drag & drop an image, or</p>
          <label className="cursor-pointer">
            <span className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Browse Files
            </span>
            <input
              type="file"
              className="hidden"
              accept={acceptTypes.join(',')}
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">
            Max {maxSize / 1024 / 1024}MB. Formats: JPEG, PNG, GIF, WebP
          </p>
        </>
      )}
    </div>
  );
}

export default ImageUploader;