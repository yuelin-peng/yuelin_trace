import { grpcClient } from './grpc-client';
import {
  Revision,
  ListRevisionsRequest,
  ListRevisionsResponse,
  GetRevisionRequest,
  GetRevisionResponse,
  RestoreRevisionRequest,
  RestoreRevisionResponse,
} from '../generated/com/yuelin/revision/v1/revision';

export interface RevisionWithPreview extends Revision {
  preview?: string;
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
    try {
      const request: ListRevisionsRequest = {
        articleId,
        pageRequest: {
          pageSize: options?.pageSize || 20,
          pageToken: options?.pageToken || '',
        },
        sortOrder: options?.sortOrder || 'desc',
      };

      const response = await grpcClient.call<ListRevisionsResponse>(
        'com.yuelin.revision.v1.RevisionService',
        'ListRevisions',
        ListRevisionsRequest.toJSON(request)
      );

      const revisions: RevisionWithPreview[] = (response?.revisions || []).map((r) => {
        const revision = Revision.fromJSON(r);
        return {
          ...revision,
          preview: this.generatePreview(revision.content),
        };
      });

      return {
        revisions,
        hasMore: response?.pageResponse?.hasMore || false,
        nextPageToken: response?.pageResponse?.nextPageToken || undefined,
      };
    } catch (error) {
      console.error('ListRevisions failed:', error);
      throw error;
    }
  }

  async getRevision(id: string): Promise<Revision | undefined> {
    try {
      const request: GetRevisionRequest = { id };
      const response = await grpcClient.call<GetRevisionResponse>(
        'com.yuelin.revision.v1.RevisionService',
        'GetRevision',
        GetRevisionRequest.toJSON(request)
      );
      return response?.revision ? Revision.fromJSON(response.revision) : undefined;
    } catch (error) {
      console.error('GetRevision failed:', error);
      throw error;
    }
  }

  async restoreRevision(revisionId: string, title?: string): Promise<{
    articleId: string;
    revisionId: string;
    restoredAt: Date;
  }> {
    try {
      const request: RestoreRevisionRequest = {
        revisionId,
        title: title || '',
      };

      const response = await grpcClient.call<RestoreRevisionResponse>(
        'com.yuelin.revision.v1.RevisionService',
        'RestoreRevision',
        RestoreRevisionRequest.toJSON(request)
      );

      return {
        articleId: response?.articleId || '',
        revisionId: response?.revisionId || '',
        restoredAt: response?.restoredAt ? new Date(response.restoredAt) : new Date(),
      };
    } catch (error) {
      console.error('RestoreRevision failed:', error);
      throw error;
    }
  }

  private generatePreview(content: string, maxLength: number = 100): string {
    if (!content) return '';
    const plainText = content.replace(/[#*`_\[\]]/g, '').replace(/\n+/g, ' ').trim();
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