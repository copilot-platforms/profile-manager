import { NextResponse } from 'next/server';
import { matchesCopilotApiError } from '@/exceptions/copilot';

export function respondError(message: string, status: number = 500) {
  return NextResponse.json(
    { message },
    {
      status,
    },
  );
}

export function handleError(error: unknown) {
  console.error(error);
  let apiError = {
    message: 'Something went wrong',
    status: 500,
  };
  if (matchesCopilotApiError(error)) {
    apiError = {
      message: error.body.message,
      status: error.status,
    };
  }
  return respondError(apiError.message, apiError.status);
}
