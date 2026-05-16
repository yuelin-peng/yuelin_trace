import { tokenStorage } from '../lib/token-storage';

export interface Revision {
  id: string;
  articleId: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface RevisionWithPreview extends Revision {
  preview?: string;
}

async function apiCall<T>(endpoint: string, method: string = 'GET', body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = tokenStorage.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.displayMessage || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

class RevisionService {
  async listRevisions(articleId: string, options?: {
    pageSize?: number;
    pageToken?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    revisions: RevisionWithPreview[];
    hasMore: boolean;
    nextPageToken?: string;
  }> {
    const query = new URLSearchParams();
    if (options?.pageSize) query.append('page_size', String(options.pageSize));
    if (options?.pageToken) query.append('page_token', options.pageToken);

    const queryString = query.toString();
    const response = await apiCall<{ revisions: Revision[]; pageResponse: { nextPageToken?: string; hasMore: boolean } }>(`/api/articles/${articleId}/revisions${queryString ? `?${queryString}` : ''}`);

    const revisions: RevisionWithPreview[] = (response.revisions || []).map((r) => ({
      ...r,
      preview: this.generatePreview(r.content),
    }));

    return {
      revisions,
      hasMore: response.pageResponse?.hasMore || false,
      nextPageToken: response.pageResponse?.nextPageToken || undefined,
    };
  }

  async getRevision(id: string): Promise<Revision | undefined> {
    try {
      return await apiCall<Revision>(`/api/revisions/${id}`);
    } catch {
      return undefined;
    }
  }

  async restoreRevision(revisionId: string, title?: string): Promise<{
    articleId: string;
    revisionId: string;
    restoredAt: Date;
  }> {
    const response = await apiCall<{ articleId: string; revisionId: string; restoredAt: string }>(`/api/revisions/${revisionId}`, 'POST', { title: title || undefined });

    return {
      articleId: response.articleId,
      revisionId: response.revisionId,
      restoredAt: new Date(response.restoredAt),
    };
  }

  private generatePreview(content: string, maxLength: number = 100): string {
    if (!content) return '';
    const plainText = content.replace(/[#*`_[\]]/g, '').replace(/\n+/g, ' ').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  }

  compareRevisions(rev1: Revision, rev2: Revision): {
    added: string[];
    removed: string[];
    modified: string[];
  } {
    const lines1 = (rev1.content || '').split('\n');
    const lines2 = (rev2.content || '').split('\n');

    const set1 = new Set(lines1);
    const set2 = new Set(lines2);

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    for (const line of lines2) {
      if (!set1.has(line)) {
        added.push(line);
      }
    }

    for (const line of lines1) {
      if (!set2.has(line)) {
        removed.push(line);
      }
    }

    const commonLines = lines1.filter(l => set2.has(l));
    const similarCount = Math.min(commonLines.length, 3);
    for (let i = 0; i < similarCount; i++) {
      modified.push(commonLines[i]);
    }

    return { added, removed, modified };
  }
}

export const revisionService = new RevisionService();
