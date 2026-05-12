import React, { useState } from 'react';
import clsx from 'clsx';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownPreview } from './MarkdownPreview';
import { ImageUploader } from './ImageUploader';
import { VideoEmbed, VideoPlayer } from './VideoEmbed';
import { ColumnSelector } from './ColumnSelector';
import { TagInput, Tag } from './TagInput';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export interface ArticleFormData {
  title: string;
  content: string;
  columnId?: string;
  tagIds: string[];
  topicId?: string;
}

export interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>;
  availableTags?: Tag[];
  availableColumns?: { id: string; name: string }[];
  onSubmit: (data: ArticleFormData) => Promise<void>;
  onSaveDraft?: (data: ArticleFormData) => Promise<void>;
  onContentChange?: (data: ArticleFormData) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export function ArticleForm({
  initialData,
  availableTags = [],
  availableColumns = [],
  onSubmit,
  onSaveDraft,
  onContentChange,
  isLoading = false,
  isDisabled = false,
  className,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [columnId, setColumnId] = useState(initialData?.columnId);
  const [tagIds, setTagIds] = useState<string[]>(initialData?.tagIds || []);
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploaderOpen, setImageUploaderOpen] = useState(false);
  const [videoEmbedOpen, setVideoEmbedOpen] = useState(false);

  const handleChange = (field: 'title' | 'content') => (value: string) => {
    setIsDirty(true);
    if (field === 'title') setTitle(value);
    if (field === 'content') {
      setContent(value);
      onContentChange?.({ title, content: value, columnId, tagIds, topicId: initialData?.topicId });
    }
  };

  const handleImageUpload = (url: string) => {
    const imageMarkdown = `![image](${url})`;
    setContent((prev) => prev + '\n' + imageMarkdown);
    setImageUploaderOpen(false);
    setIsDirty(true);
  };

  const handleVideoEmbed = (embedUrl: string) => {
    const videoMarkdown = `\n<video src="${embedUrl}"></video>\n`;
    setContent((prev) => prev + videoMarkdown);
    setVideoEmbedOpen(false);
    setIsDirty(true);
  };

  const insertCodeBlock = () => {
    const codeBlock = '\n```\n\n```\n';
    setContent((prev) => prev + codeBlock);
    setIsDirty(true);
  };

  const insertPlantUML = () => {
    const plantumlBlock = '\n```plantuml\nskinparam defaultFontName \"Verdana\"\n\n@startuml\n\n@enduml\n```\n';
    setContent((prev) => prev + plantumlBlock);
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }
    
    await onSubmit({ title, content, columnId, tagIds, topicId: initialData?.topicId });
  };

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      await onSaveDraft({ title, content, columnId, tagIds, topicId: initialData?.topicId });
      setIsDirty(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-4', className)}>
      <Input
        label="Title"
        value={title}
        onChange={(e) => handleChange('title')(e.target.value)}
        placeholder="Enter article title..."
        disabled={isDisabled || isLoading}
        className="text-lg font-semibold"
      />

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? 'Edit mode' : 'Preview mode'}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <span className="text-gray-300">|</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setImageUploaderOpen(true)}
              title="Upload image"
            >
              Image
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setVideoEmbedOpen(true)}
              title="Embed video"
            >
              Video
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertCodeBlock}
              title="Insert code block"
            >
              Code
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertPlantUML}
              title="Insert PlantUML diagram"
            >
              PlantUML
            </Button>
          </div>
          {isDirty && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-200">
          {!showPreview ? (
            <div className="p-4">
              <MarkdownEditor
                value={content}
                onChange={handleChange('content')}
                placeholder="Write your article in Markdown..."
                debounceMs={150}
                minHeight="500px"
                isDisabled={isDisabled || isLoading}
              />
            </div>
          ) : null}
          <div className={`p-4 ${showPreview ? 'col-span-2' : ''}`}>
            <MarkdownPreview content={content} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColumnSelector
          value={columnId}
          onChange={setColumnId}
          columns={availableColumns}
          isDisabled={isDisabled || isLoading}
        />
        <TagInput
          value={tagIds}
          onChange={setTagIds}
          availableTags={availableTags}
          isDisabled={isDisabled || isLoading}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        {onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            isDisabled={isDisabled || isLoading}
            isLoading={isLoading}
          >
            Save Draft
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isLoading}
          isDisabled={isDisabled || !title.trim() || !content.trim()}
        >
          Publish
        </Button>
      </div>

      {imageUploaderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
            <ImageUploader onUpload={handleImageUpload} />
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => setImageUploaderOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {videoEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Embed Video</h3>
            <VideoEmbed onEmbed={handleVideoEmbed} />
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => setVideoEmbedOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default ArticleForm;