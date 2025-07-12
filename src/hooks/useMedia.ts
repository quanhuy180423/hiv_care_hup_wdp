import { useMutation, useQuery } from "@tanstack/react-query";
import { mediaService } from "@/services/mediaService";
import type {
  UploadFileResponse,
  UploadMuitipleFileResponse,
} from "@/types/media";

/**
 * Hook để upload 1 file đơn
 */
export const useUploadFile = () => {
  return useMutation<UploadFileResponse, Error, File>({
    mutationFn: (file) => mediaService.uploadFile(file),
  });
};

/**
 * Hook để upload nhiều file
 */
export const useUploadMultipleFiles = () => {
  return useMutation<UploadMuitipleFileResponse, Error, File[]>({
    mutationFn: (files) => mediaService.uploadMultipleFiles(files),
  });
};

/**
 * Hook để lấy file từ filename (trả về Blob)
 */
export const useGetFileByFilename = (filename?: string) => {
  return useQuery({
    queryKey: ["file", filename],
    queryFn: () => mediaService.getFileByFilename(filename!),
    enabled: !!filename,
  });
};
