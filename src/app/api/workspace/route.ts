import { handleError, respondError } from '@/utils/common';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return respondError('Missing token', 422);
  }

  const copilotClient = new CopilotAPI(z.string().parse(token));

  try {
    return NextResponse.json(await copilotClient.getWorkspace());
  } catch (e) {
    return handleError(e);
  }
}