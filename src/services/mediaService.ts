import type {
  UploadFileResponse,
  UploadMuitipleFileResponse,
} from "@/types/media";
import { apiClient } from "./apiClient";

export const mediaService = {
  uploadFile: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<UploadFileResponse>(
      "/media/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  uploadMultipleFiles: async (
    files: File[]
  ): Promise<UploadMuitipleFileResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await apiClient.post<UploadMuitipleFileResponse>(
      "/media/images/upload-multi",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  getFileByFilename: async (filename: string): Promise<Blob> => {
    const res = await apiClient.get(`/media/static/${filename}`, {
      responseType: "blob",
    });
    return res.data; // Là Blob
  },
};
