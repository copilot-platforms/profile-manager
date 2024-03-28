import { Box, Stack, Typography } from '@mui/material';
import { ManagePageContainer } from './views/ManagePageContainer';
import { apiUrl } from '@/config';
import { CustomAccessField, CustomFieldAccessResponse, ModifiedPermissionAccessField } from '@/types/customFieldAccess';
import { ProfileLinks } from '@/types/settings';
import { PortalRoutes } from '@/types/copilotPortal';
import RedirectButton from '@/components/atoms/RedirectButton';
import { z } from 'zod';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import InvalidToken from '@/components/atoms/InvalidToken';

export const revalidate = 0;

async function getSettings({ token, portalId }: { token: string; portalId: string }) {
  const res = await fetch(`${apiUrl}/api/settings?token=${token}&portalId=${portalId}`);

  if (!res.ok) {
    throw new Error('Something went wrong in getSettings');
  }

  const { data } = await res.json();

  return data;
}

async function getCustomFieldAccess({
  token,
  portalId,
}: {
  token: string;
  portalId: string;
}): Promise<CustomFieldAccessResponse> {
  const res = await fetch(`${apiUrl}/api/custom-field-access?token=${token}&portalId=${portalId}`);

  if (!res.ok) {
    throw new Error('Something went wrong in getCustomFieldAccess');
  }

  const { data } = await res.json();

  return data;
}

async function getClient(clientId: string, token: string) {
  const res = await fetch(`${apiUrl}/api/client?clientId=${clientId}&token=${token}`);
  if (!res.ok) {
    throw new Error(`No client found with '${token}' token`);
  }
  const { data } = await res.json();
  return data;
}

export default async function ManagePage({ searchParams }: { searchParams: { token: string; portalId: string } }) {
  const tokenParsed = z.string().safeParse(searchParams.token);
  if (!tokenParsed.success) {
    return <InvalidToken />;
  }

  const token = tokenParsed.data;

  const copilotClient = new CopilotAPI(token);

  const { id: portalId } = await copilotClient.getWorkspace();
  const { clientId, companyId } = await copilotClient.getClientTokenPayload();
  const [settings, customFieldAccess, client] = await Promise.all([
    getSettings({ token, portalId }).then((s) => s?.profileLinks || []),
    getCustomFieldAccess({ token, portalId }),
    getClient(clientId, token),
  ]);
  const isAccessProvided = customFieldAccess.some(
    (field) => (field as unknown as ModifiedPermissionAccessField).permission.length > 0,
  );

  return (
    <Box
      sx={{
        padding: { xs: '32px 16px', md: '90px 236px' },
      }}
    >
      {isAccessProvided ? <Typography variant="xl">Manage your profile</Typography> : <></>}
      <ManagePageContainer
        customFieldAccess={customFieldAccess}
        client={client}
        token={token}
        companyId={companyId}
        clientId={clientId}
        portalId={portalId}
      />

      <Stack direction="column" mt={16} rowGap={4}>
        {settings && (settings.includes(ProfileLinks.PaymentMethod) || settings.includes(ProfileLinks.ProfileSetting)) && (
          <Typography variant="xl">Other settings</Typography>
        )}
        <Stack direction="row" columnGap={4}>
          {settings && settings.includes(ProfileLinks.PaymentMethod) && (
            <RedirectButton route={PortalRoutes.Billing}>Set a payment method</RedirectButton>
          )}
          {settings && settings.includes(ProfileLinks.ProfileSetting) && (
            <RedirectButton route={PortalRoutes.Profile}>Go to account settings</RedirectButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
