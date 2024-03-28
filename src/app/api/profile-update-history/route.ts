import { handleError, respondError } from '@/utils/common';
import { NextRequest, NextResponse } from 'next/server';
import { ClientProfileUpdatesService } from '@/app/api/client-profile-updates/services/clientProfileUpdates.service';
import { z } from 'zod';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import { createLookup, getSelectedOptions } from '@/lib/helper';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const clientId = searchParams.get('clientId');
  const customFieldKey = searchParams.get('key');
  const lastUpdated = searchParams.get('lastUpdated');
  if (!token) {
    return respondError('Missing token', 422);
  }
  if (!clientId) {
    return respondError('Missing clientId', 422);
  }
  if (!customFieldKey) {
    return respondError('Missing customFieldKey', 422);
  }
  if (!lastUpdated) {
    return respondError('Missing lastUpdated', 422);
  }
  try {
    const copilotClient = new CopilotAPI(z.string().parse(token));
    const portalCustomFields = await copilotClient.getCustomFields();
    const selectedCustomField = portalCustomFields.data?.find(
      (portalCustomField) => portalCustomField.key === customFieldKey,
    );
    if (!selectedCustomField) {
      return respondError('Invalid customFieldKey.', 400);
    }
    const updateHistory = await new ClientProfileUpdatesService().getUpdateHistory(
      z.string().parse(customFieldKey),
      z.string().parse(clientId),
      new Date(lastUpdated),
    );
    const parsedUpdateHistory = updateHistory.map((update) => {
      const value = update.changedFields[customFieldKey];
      const options = getSelectedOptions(selectedCustomField, value || '');
      return {
        type: selectedCustomField.type,
        value: options.length > 0 ? options : value,
        wasUpdatedByIU: update.wasUpdatedByIU,
      };
    });
    // If update history contains fewer than 4 items we assume the oldest value to start from empty
    if (parsedUpdateHistory.length < 4) {
      if (!parsedUpdateHistory[parsedUpdateHistory.length - 1]?.wasUpdatedByIU) {
        parsedUpdateHistory.push({
          type: 'text',
          value: 'Empty',
          wasUpdatedByIU: false,
        });
      }
    }

    return NextResponse.json(parsedUpdateHistory);
  } catch (error) {
    return handleError(error);
  }
}
