import { NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Custom API Error class for structured error handling
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Common API error types
 */
export const APIErrors = {
  Unauthorized: (message = 'Unauthorized') => new APIError(message, 401, 'UNAUTHORIZED'),
  Forbidden: (message = 'Forbidden') => new APIError(message, 403, 'FORBIDDEN'),
  NotFound: (message = 'Not found') => new APIError(message, 404, 'NOT_FOUND'),
  BadRequest: (message = 'Bad request') => new APIError(message, 400, 'BAD_REQUEST'),
  Conflict: (message = 'Conflict') => new APIError(message, 409, 'CONFLICT'),
  UnprocessableEntity: (message = 'Unprocessable entity') => new APIError(message, 422, 'UNPROCESSABLE_ENTITY'),
  InternalServer: (message = 'Internal server error') => new APIError(message, 500, 'INTERNAL_SERVER_ERROR'),
} as const;

/**
 * Standardized error response interface
 */
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Handle API errors and return standardized NextResponse
 *
 * @param error - Error object (APIError, Error, or unknown)
 * @param context - Optional context for logging (e.g., route name)
 * @returns NextResponse with error details
 */
export function handleAPIError(error: unknown, context?: string): NextResponse<ErrorResponse> {
  // Handle APIError instances
  if (error instanceof APIError) {
    const errorContext = context ? `[${context}]` : '';
    logger.error(`${errorContext} API Error:`, {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    });

    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    const errorContext = context ? `[${context}]` : '';
    logger.error(`${errorContext} Unexpected error:`, {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Handle unknown errors
  const errorContext = context ? `[${context}]` : '';
  logger.error(`${errorContext} Unknown error:`, error);

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

/**
 * Assert that a condition is true, throw APIError if not
 *
 * @param condition - Condition to assert
 * @param error - APIError to throw if condition is false
 */
export function assert(condition: unknown, error: APIError): asserts condition {
  if (!condition) {
    throw error;
  }
}

/**
 * Type guard to check if error is APIError
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}
