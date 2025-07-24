interface BackendErrorResponse {
  statusCode: number;
  message: string | {
    message: string;
    error: string;
    statusCode: number;
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractErrorMessage = (error: any): string => {
  // Nếu error có response data
  if (error?.response?.data) {
    const responseData = error.response.data as BackendErrorResponse;
    
    // Nếu message là object có chứa message
    if (typeof responseData.message === 'object' && responseData.message?.message) {
      return responseData.message.message;
    }
    
    // Nếu message là string
    if (typeof responseData.message === 'string') {
      return responseData.message;
    }
  }
  
  // Nếu error có message trực tiếp
  if (error?.message) {
    return error.message;
  }
  
  // Fallback message
  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (error: any): string => {
  return extractErrorMessage(error);
}; 