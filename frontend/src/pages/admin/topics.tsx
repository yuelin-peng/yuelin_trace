import { useState, useEffect, useCallback } from 'react';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { TopicList } from '../../components/topic/TopicList';
import { TopicForm } from '../../components/topic/TopicForm';
import { topicService, Topic } from '../../services/topic-service';

type DialogState = 'none' | 'create' | 'edit';

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogState, setDialogState] = useState<DialogState>('none');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await topicService.listTopics({
        search: searchQuery,
        pageSize: 100,
      });
      setTopics(result.topics);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      setError('Failed to load topics');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleCreate = async (name: string) => {
    setIsSaving(true);
    setError('');
    try {
      await topicService.createTopic({ name });
      setDialogState('none');
      fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topic');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (name: string) => {
    if (!editingTopic) return;
    
    setIsSaving(true);
    setError('');
    try {
      await topicService.updateTopic(editingTopic.id, { name });
      setDialogState('none');
      setEditingTopic(null);
      fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update topic');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (topic: Topic) => {
    if (!confirm(`Are you sure you want to delete "${topic.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await topicService.deleteTopic(topic.id);
      fetchTopics();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete topic');
    }
  };

  const openEditDialog = (topic: Topic) => {
    setEditingTopic(topic);
    setDialogState('edit');
    setError('');
  };

  const closeDialog = () => {
    setDialogState('none');
    setEditingTopic(null);
    setError('');
  };

  return (
    <AuthGuard requiredRoles={[1]} fallbackPath="/">
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <h1 className="text-xl font-semibold text-gray-900">Manage Topics</h1>
            </div>
            <button
              onClick={() => setDialogState('create')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Topic
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <TopicList
            topics={topics}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        </div>

        {(dialogState === 'create' || dialogState === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {dialogState === 'create' ? 'Create New Topic' : 'Edit Topic'}
                </h2>
                <button
                  onClick={closeDialog}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <TopicForm
                initialName={editingTopic?.name || ''}
                onSubmit={dialogState === 'create' ? handleCreate : handleEdit}
                onCancel={closeDialog}
                isLoading={isSaving}
                error={error}
              />

              {dialogState === 'create' && (
                <p className="mt-4 text-xs text-gray-500">
                  The slug will be automatically generated from the topic name.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
