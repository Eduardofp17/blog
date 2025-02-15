export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}