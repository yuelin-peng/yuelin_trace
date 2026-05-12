import React, { useMemo } from 'react';
import clsx from 'clsx';
import { RevisionWithPreview, revisionService } from '../../services/revision-service';

export interface RevisionCompareProps {
  revision1: RevisionWithPreview;
  revision2: RevisionWithPreview;
  onClose: () => void;
  className?: string;
}

export function RevisionCompare({
  revision1,
  revision2,
  onClose,
  className,
}: RevisionCompareProps) {
  const comparison = useMemo(() => {
    return revisionService.compareRevisions(revision1, revision2);
  }, [revision1, revision2]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={clsx('bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden', className)}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Compare Revisions</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-500">Older Version</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(revision1.createdAt)} - #{revision1.id.slice(-6)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-500">Newer Version</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(revision2.createdAt)} - #{revision2.id.slice(-6)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {comparison.added.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Added ({comparison.added.length})
                </h4>
                <div className="bg-green-50 rounded-lg p-3 space-y-1">
                  {comparison.added.slice(0, 5).map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-700 font-mono bg-white px-2 py-1 rounded">
                      + {line}
                    </p>
                  ))}
                  {comparison.added.length > 5 && (
                    <p className="text-sm text-gray-500">...and {comparison.added.length - 5} more</p>
                  )}
                </div>
              </div>
            )}

            {comparison.removed.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  Removed ({comparison.removed.length})
                </h4>
                <div className="bg-red-50 rounded-lg p-3 space-y-1">
                  {comparison.removed.slice(0, 5).map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-700 font-mono bg-white px-2 py-1 rounded">
                      - {line}
                    </p>
                  ))}
                  {comparison.removed.length > 5 && (
                    <p className="text-sm text-gray-500">...and {comparison.removed.length - 5} more</p>
                  )}
                </div>
              </div>
            )}

            {comparison.added.length === 0 && comparison.removed.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="mt-4">No differences found</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RevisionCompare;