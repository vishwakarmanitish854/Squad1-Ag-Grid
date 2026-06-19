import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.code,
      status: error.response?.status,
      details: error.response?.data?.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};
