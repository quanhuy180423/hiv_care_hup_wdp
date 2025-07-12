export interface UploadFile {
  url: string;
}

export interface UploadFileResponse {
  data: UploadFile;
  statusCode: number;
  message: string;
}

export interface UploadMuitipleFileResponse {
  data: UploadFile[];
  statusCode: number;
  message: string;
}
