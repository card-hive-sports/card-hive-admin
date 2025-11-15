export interface CreateMediaUploadPayload {
  title?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  folder?: string;
}

export type MediaUploadStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface MediaUploadResponse {
  id: string;
  url?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  metadata?: Record<string, unknown>;
  bucket?: string;
  key?: string;
  updatedAt?: string;
  status?: MediaUploadStatus;
  progress?: number;
}

export interface MediaUploadProgress extends MediaUploadResponse {
  status: MediaUploadStatus;
  progress: number;
}
