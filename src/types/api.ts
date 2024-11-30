export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface ApiError {
  message: string
  code?: string
  status: number
}

export class ApiException extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiException'
  }
} 