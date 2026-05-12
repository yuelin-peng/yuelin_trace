import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { RevisionWithPreview, revisionService } from '../../services/revision-service';
import RevisionListItem from './RevisionListItem';
import RevisionCompare from './RevisionCompare';

export interface RevisionHistoryPanelProps {
  articleId: string;
  currentContent: string;
  onRestore: (content: string) => void;
  className?: string;
}

export function RevisionHistoryPanel({
  articleId,
  currentContent,
  onRestore,
  className,
}: RevisionHistoryPanelProps) {
  const [revisions, setRevisions] = useState<RevisionWithPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRevisions, setSelectedRevisions] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareRevisions, setCompareRevisions] = useState<RevisionWithPreview[]>([]);

  useEffect(() => {
    const fetchRevisions = async () => {
      setIsLoading(true);
      try {
        const result = await revisionService.listRevisions(articleId, {
          sortOrder: 'desc',
        });
        setRevisions(result.revisions);
      } catch (error) {
        console.error('Failed to fetch revisions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRevisions();
  }, [articleId]);

  const handleSelectRevision = (revisionId: string) => {
    setSelectedRevisions((prev) => {
      if (prev.includes(revisionId)) {
        return prev.filter((id) => id !== revisionId);
      }
      if (prev.length >= 2) {
        return [prev[1], revisionId];
      }
      return [...prev, revisionId];
    });
  };

  const handleRestore = async (revisionId: string) => {
    if (!confirm('Are you sure you want to restore this revision? Current changes will be lost.')) {
      return;
    }
    try {
      const revision = await revisionService.getRevision(revisionId);
      if (revision) {
        onRestore(revision.content);
      }
    } catch (error) {
      console.error('Failed to restore revision:', error);
      alert('Failed to restore revision');
    }
  };

  const handleCompare = () => {
    if (selectedRevisions.length === 2) {
      const revs = revisions.filter((r) => selectedRevisions.includes(r.id));
      setCompareRevisions(revs);
      setShowCompare(true);
    }
  };

  if (isLoading) {
    return (
      <div className={clsx('p-4', className)}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className={clsx('bg-white rounded-lg border border-gray-200', className)}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Revision History</h3>
          {selectedRevisions.length === 2 && (
            <button
              onClick={handleCompare}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Compare
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">{revisions.length} saved revisions</p>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {revisions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No revisions yet</p>
            <p className="text-sm mt-1">Revisions are created automatically as you write</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {revisions.map((revision) => (
              <RevisionListItem
                key={revision.id}
                revision={revision}
                isSelected={selectedRevisions.includes(revision.id)}
                onSelect={() => handleSelectRevision(revision.id)}
                onRestore={() => handleRestore(revision.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCompare && compareRevisions.length === 2 && (
        <RevisionCompare
          revision1={compareRevisions[0]}
          revision2={compareRevisions[1]}
          onClose={() => {
            setShowCompare(false);
            setCompareRevisions([]);
          }}
        />
      )}
    </div>
  );
}

export default RevisionHistoryPanel;