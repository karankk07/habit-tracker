import { ApiResponse, ApiError, ApiException } from '@/types/api'

export async function handleApiError(error: unknown): Promise<ApiError> {
  if (error instanceof ApiException) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    }
  }

  return {
    message: 'An unexpected error occurred',
    status: 500,
  }
}

export function createApiResponse<T>(
  data: T | null = null,
  error: string | null = null,
  status: number = 200
): ApiResponse<T> {
  return {
    data,
    error,
    status,
  }
} 