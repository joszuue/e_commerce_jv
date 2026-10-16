export interface ApiResponse<T = unknown> {
  data?: T;
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ApiValidationError {
  message: string;
  errors?: Record<string, string[]>;
}
