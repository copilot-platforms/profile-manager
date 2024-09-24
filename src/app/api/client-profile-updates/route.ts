import { NextRequest, NextResponse } from 'next/server';
import { ClientProfileUpdatesRequestSchema, ParsedClientProfileUpdatesResponse } from '@/types/clientProfileUpdates';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import { handleError, respondError } from '@/utils/common';
import { ClientProfileUpdatesService } from '@/app/api/client-profile-updates/services/clientProfileUpdates.service';
import { ClientResponse, CompanyResponse } from '@/types/common';
import { z } from 'zod';
import { createLookup, createMapLookup, getObjectDifference, getSelectedOptions } from '@/lib/helper';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const clientProfileUpdateRequest = ClientProfileUpdatesRequestSchema.safeParse(data);
  if (!clientProfileUpdateRequest.success) {
    return NextResponse.json(clientProfileUpdateRequest.error.issues, { status: 422 });
  }
  try {
    //todo: check access
    const copilotClient = new CopilotAPI(clientProfileUpdateRequest.data.token);
    const client: ClientResponse = await copilotClient.getClient(clientProfileUpdateRequest.data.clientId);
    const clientUpdateResponse = await copilotClient.updateClient(clientProfileUpdateRequest.data.clientId, {
      customFields: clientProfileUpdateRequest.data.form,
    });
    // NOTE: If you pass empty string as value to a custom field, that key will be deleted from the copilot api
    // (Probably because it's built in Go and Go does the weird zero value cast thing)
    // So sending an empty "" is the same as nil
    clientUpdateResponse.customFields = { ...clientProfileUpdateRequest.data.form, ...clientUpdateResponse.customFields };

    const changedFields = getObjectDifference(
      (clientUpdateResponse.customFields ?? {}) as Record<string, any>,
      (client.customFields ?? {}) as Record<string, any>,
    );
    if (Object.keys(changedFields).length === 0) {
      return NextResponse.json({ message: 'No changed fields detected' });
    }

    const service = new ClientProfileUpdatesService();

    console.log(`Processing profile update for client: ${client}`);

    // First, check if the copilot's custom fields and our recent history are in sync
    for (const key of Object.keys(changedFields)) {
      const updateHistory = await new ClientProfileUpdatesService().getUpdateHistory(key, client.id, new Date());
      console.log('Processing updateHistory:', updateHistory);
      const lastHistory = updateHistory?.[0]?.changedFields?.[key];
      console.log('Last history:', lastHistory);

      const areHistoriesEmpty =
        // Case where both have empty values. Make sure to strict check so we don't consider 0 input as empty history
        (lastHistory === undefined || lastHistory === null || lastHistory === '') &&
        client.customFields?.[key] === undefined;
      if (areHistoriesEmpty) continue;

      if (client.customFields?.[key] !== lastHistory) {
        // If not, fix it.
        await service.save({
          clientId: clientProfileUpdateRequest.data.clientId,
          companyId: clientProfileUpdateRequest.data.companyId,
          portalId: clientProfileUpdateRequest.data.portalId,
          customFields: { ...(clientUpdateResponse.customFields ?? {}), [key]: client.customFields?.[key] } as Record<
            string,
            any
          >,
          // @ts-expect-error inject key
          changedFields: { [key]: client.customFields?.[key] },
          wasUpdatedByIU: true,
        });
      }
    }
    await service.save({
      clientId: clientProfileUpdateRequest.data.clientId,
      companyId: clientProfileUpdateRequest.data.companyId,
      portalId: clientProfileUpdateRequest.data.portalId,
      customFields: (clientUpdateResponse.customFields ?? {}) as Record<string, any>,
      changedFields,
    });

    return NextResponse.json({ message: 'Saved client profile updates along with changed fields' });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const portalId = request.nextUrl.searchParams.get('portalId');

  if (!token) {
    return respondError('Missing token', 422);
  }
  if (!portalId) {
    return respondError('Missing portalId', 422);
  }

  try {
    const copilotClient = new CopilotAPI(z.string().parse(token));

    const [clients, companies, portalCustomFields] = await Promise.all([
      copilotClient.getClients(),
      copilotClient.getCompanies(),
      copilotClient.getCustomFields(),
    ]);
    //todo:: filter companyIds based on currentUser restrictions
    const clientProfileUpdates = await new ClientProfileUpdatesService().findMany(portalId, []);

    const clientLookup = createLookup(clients.data, 'id');
    const companyLookup = createMapLookup(companies.data, 'id');

    const parsedClientProfileUpdates: ParsedClientProfileUpdatesResponse[] = clientProfileUpdates.map((update) => {
      const client = clientLookup[update.clientId];
      const company = companyLookup.get(update.companyId);

      let parsedClientProfileUpdate: ParsedClientProfileUpdatesResponse = {
        id: update?.id,
        client: getClientDetails(client),
        company: company ? getCompanyDetails(company) : undefined,
        lastUpdated: update.createdAt,
      };

      portalCustomFields.data?.forEach((portalCustomField) => {
        const value = update.customFields[portalCustomField.key] ?? null;
        const options = getSelectedOptions(portalCustomField, value || '');

        // @ts-ignore
        parsedClientProfileUpdate[portalCustomField.name] = {
          name: portalCustomField.name,
          type: portalCustomField.type,
          key: portalCustomField.key,
          value: options.length > 0 ? options : value,
          isChanged: update.changedFields[portalCustomField.key] === '' || !!update.changedFields[portalCustomField.key],
        };
      });

      return parsedClientProfileUpdate;
    });

    return NextResponse.json(parsedClientProfileUpdates);
  } catch (error) {
    return handleError(error);
  }
}

function getClientDetails(client: ClientResponse) {
  return {
    id: client?.id,
    name: `${client?.givenName} ${client?.familyName}`,
    email: client?.email,
    avatarImageUrl: client?.avatarImageUrl,
  };
}

function getCompanyDetails(company: CompanyResponse) {
  return {
    id: company?.id,
    name: company?.name,
    iconImageUrl: company?.iconImageUrl,
    fallbackColor: company?.fallbackColor,
  };
}
