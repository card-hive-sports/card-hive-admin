import {
  apiClient,
  CreateMediaUploadPayload,
  MediaUploadProgress,
  MediaUploadResponse,
} from '@/lib';

const appendPayloadField = (formData: FormData, key: string, value?: string | number) => {
  if (value !== undefined && value !== null) {
    formData.append(key, String(value));
  }
};

export const mediaAPI = {
  uploadFile: async (
    file: Blob,
    payload?: CreateMediaUploadPayload,
  ): Promise<MediaUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    if (payload) {
      appendPayloadField(formData, 'title', payload.title);
      appendPayloadField(formData, 'description', payload.description);

      if (payload.tags) {
        formData.append('tags', JSON.stringify(payload.tags));
      }

      if (payload.metadata) {
        formData.append('metadata', JSON.stringify(payload.metadata));
      }

      appendPayloadField(formData, 'folder', payload.folder);
    }

    const response = await apiClient.post<MediaUploadResponse>('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  getFileUploadProgress: async (fileId: string): Promise<MediaUploadProgress> => {
    const response = await apiClient.get<MediaUploadProgress>(`/files/${fileId}/progress`);
    return response.data;
  },
};
