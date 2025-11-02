import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError!;
}

export function validateInput(data: unknown, schema: Record<string, (value: any) => boolean>) {
  if (typeof data !== 'object' || data === null) {
    throw new APIError(400, 'Invalid request data');
  }

  const errors: string[] = [];

  for (const [key, validator] of Object.entries(schema)) {
    const value = (data as Record<string, any>)[key];
    
    if (!validator(value)) {
      errors.push(`Invalid value for ${key}`);
    }
  }

  if (errors.length > 0) {
    throw new APIError(400, errors.join(', '));
  }
}
