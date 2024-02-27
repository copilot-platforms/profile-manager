import { Box, Stack, Typography } from '@mui/material';
import { ManagePageContainer } from './views/ManagePageContainer';
import { apiUrl } from '@/config';
import { CustomFieldAccessResponse } from '@/types/customFieldAccess';
import { ProfileLinks } from '@/types/settings';
import Button from '@/components/atoms/Button';
import { getWorkspaceInfo } from '../../../services/workspace';

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
  const { token } = searchParams;

  const { id: portalId } = await getWorkspaceInfo({ token });
  const settings = await getSettings({ token, portalId }).then((s) => s?.profileLinks || []);
  const customFieldAccess = await getCustomFieldAccess({ token, portalId });

  // static for now, will be dynamic later after some API decisions are made
  const clientId = 'a583a0d0-de70-4d14-8bb1-0aacf7424e2c';
  const companyId = '52eb75a9-2790-4e37-aa7a-c13f7bc3aa91';
  // const clientId = '2b37da9b-73b9-4c28-b7ac-144cf39cb13b';
  // const companyId = 'b5b3883c-f3e7-40e2-98e8-4f4b195ba98e';
  const client = await getClient(clientId, token);

  return (
    <Box
      sx={{
        padding: { xs: '32px 16px', md: '90px 236px' },
      }}
    >
      <Typography variant="xl">Manage your profile</Typography>

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
            <Button route={'billing'}>Set a payment method</Button>
          )}
          {settings && settings.includes(ProfileLinks.ProfileSetting) && (
            <Button route={'settings'}>Go to account settings</Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
