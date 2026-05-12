'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { ArticleForm, ArticleFormData } from '../../components/editor/ArticleForm';
import { RevisionHistoryPanel } from '../../components/editor/RevisionHistoryPanel';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useDirtyState } from '../../hooks/useDirtyState';
import { articleService } from '../../services/article-service';
import { UserRole } from '../../generated/com/yuelin/user/v1/user';

export default function WritePage() {
  const [articleId, setArticleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showRevisionPanel, setShowRevisionPanel] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { isDirty, markDirty, markClean } = useDirtyState();

  const autoSaveCallback = useCallback(async (content: string) => {
    if (!articleId) return;
    
    try {
      await articleService.updateArticle({
        id: articleId,
        updateMask: ['content'],
        title: '',
        content: content,
        columnId: '',
        seriesId: '',
        tagIds: [],
        topicId: '',
        state: 0,
      });
      markClean();
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [articleId, markClean]);

  const { lastSaved, setContent: setAutoSaveContent } = useAutoSave({
    interval: 30000,
    onSave: autoSaveCallback,
    enabled: !!articleId,
  });

  const handleContentChange = useCallback((data: ArticleFormData) => {
    setCurrentContent(data.content);
    setAutoSaveContent(data.content);
    markDirty();
  }, [setAutoSaveContent, markDirty]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSubmit = async (data: ArticleFormData) => {
    if (!data.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await articleService.createArticle({
        title: data.title,
        content: data.content,
        columnId: data.columnId || '',
        seriesId: '',
        tagIds: data.tagIds,
        topicId: data.topicId || '',
      });
      if (response.article?.id) {
        setArticleId(response.article.id);
        setCurrentContent(data.content);
      }
      alert('Article published successfully!');
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async (data: ArticleFormData) => {
    if (!data.title.trim() && !data.content.trim()) return;
    
    setIsSaving(true);
    try {
      if (articleId) {
        await articleService.updateArticle({
          id: articleId,
          updateMask: ['title', 'content'],
          title: data.title,
          content: data.content,
          columnId: data.columnId || '',
          seriesId: '',
          tagIds: data.tagIds,
          topicId: data.topicId || '',
          state: 1,
        });
      } else {
        const response = await articleService.createArticle({
          title: data.title,
          content: data.content,
          columnId: data.columnId || '',
          seriesId: '',
          tagIds: data.tagIds,
          topicId: data.topicId || '',
        });
        if (response.article?.id) {
          setArticleId(response.article.id);
          setCurrentContent(data.content);
        }
      }
      markClean();
    } catch (error) {
      console.error('Save draft failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = (content: string) => {
    setCurrentContent(content);
    setAutoSaveContent(content);
  };

  return (
    <AuthGuard requiredRoles={[UserRole.USER_ROLE_ADMIN, UserRole.USER_ROLE_AUTHOR]} fallbackPath="/auth/login">
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <h1 className="text-xl font-semibold text-gray-900">New Article</h1>
              {isDirty && (
                <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded">Unsaved</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isSaving && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
              {!isSaving && lastSaved && (
                <span className="text-sm text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {articleId && (
                <button
                  onClick={() => setShowRevisionPanel(!showRevisionPanel)}
                  className={`px-3 py-2 text-sm rounded-lg border ${
                    showRevisionPanel
                      ? 'bg-primary-100 text-primary-700 border-primary-300'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  History
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <ArticleForm
                  onSubmit={handleSubmit}
                  onSaveDraft={handleSaveDraft}
                  isLoading={isSaving}
                  initialData={{ title: '', content: currentContent, tagIds: [] }}
                  onContentChange={handleContentChange}
                />
              </div>
            </div>

            {showRevisionPanel && articleId && (
              <div className="w-80">
                <RevisionHistoryPanel
                  articleId={articleId}
                  currentContent={currentContent}
                  onRestore={handleRestore}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}