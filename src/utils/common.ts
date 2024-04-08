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
    const castedErr = error as {
      status: number;
      body: {
        message: string;
      };
    };
    apiError = {
      message: castedErr.body.message,
      status: castedErr.status,
    };
  }
  return respondError(apiError.message, apiError.status);
}
