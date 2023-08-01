/**
 * Used for standardizing the format with which API
 * errors are returned for bad requests
 */
export interface ApiErrorResponse {
  message: string;
  error: string;
}
