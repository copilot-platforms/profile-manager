import { NextRequest, NextResponse } from 'next/server';
import { CustomFieldAccessRequestSchema } from '@/types/customFieldAccess';
import { CustomFieldAccessService } from '@/app/api/custom-field-access/services/customFieldAccess.service';
import { respondError } from '@/utils/common';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import { z } from 'zod';

export const maxDuration = 60;

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
  const copilotClient = new CopilotAPI(z.string().parse(token));
  const customFields = (await copilotClient.getCustomFields()).data;

  const customFieldAccessService = new CustomFieldAccessService();
  const customFieldAccesses = await customFieldAccessService.findAll(z.string().parse(portalId));

  const customFieldsWithAccess = customFields?.map((customField) => {
    const customFieldAccess = customFieldAccesses.find((access) => access.customFieldId === customField.id);
    return {
      ...customField,
      permission: customFieldAccess ? customFieldAccess.permissions : [],
    };
  });

  return NextResponse.json({ data: customFieldsWithAccess });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const customFieldAccess = CustomFieldAccessRequestSchema.safeParse(data);
  if (!customFieldAccess.success) {
    return NextResponse.json(customFieldAccess.error.issues, { status: 422 });
  }
  const customFieldAccessService = new CustomFieldAccessService();
  await customFieldAccessService.save(customFieldAccess.data);

  return NextResponse.json({});
}
