import { NextRequest, NextResponse } from 'next/server';
import { SettingRequestSchema } from '@/types/settings';
import { SettingService } from '@/app/api/settings/services/setting.service';
import { respondError } from '@/utils/common';

export const maxDuration = 60;

export async function PUT(request: NextRequest) {
  const requestData = await request.json();
  const setting = SettingRequestSchema.safeParse(requestData);
  if (!setting.success) {
    return NextResponse.json(setting.error.issues, { status: 422 });
  }
  await new SettingService().save(setting.data);

  return NextResponse.json({});
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const portalId = searchParams.get('portalId');
  if (!token) {
    return respondError('Missing token', 422);
  }
  if (!portalId) {
    return respondError('Missing portalId', 422);
  }
  const setting = await new SettingService().findByPortalId(portalId);

  return NextResponse.json({ data: setting?.data });
}
