import { Stack } from '@mui/material';
import { Sidebar } from './views/Sidebar';
import MainSection from './views/MainSection';
import { SidebarDecider } from '@/hoc/SidebarDecider';
import { apiUrl } from '@/config';
import { ParsedClientProfileUpdatesResponse } from '@/types/clientProfileUpdates';
import { CustomFieldAccessResponse } from '@/types/customFieldAccess';
import { ContextUpdate } from '@/hoc/ContextUpdate';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import { z } from 'zod';

export const revalidate = 0;

async function getClientProfileUpdates({
  token,
  portalId,
}: {
  token: string;
  portalId: string;
}): Promise<ParsedClientProfileUpdatesResponse[]> {
  const res = await fetch(`${apiUrl}/api/client-profile-updates?token=${token}&portalId=${portalId}`);

  if (!res.ok) {
    throw new Error('Something went wrong in getClientProfileUpdates');
  }

  const data = await res.json();

  return data;
}

async function getCustomFieldAccess({
  token,
  portalId,
}: {
  token: string;
  portalId: string;
}): Promise<CustomFieldAccessResponse> {
  const res = await fetch(`${apiUrl}/api/custom-field-access?token=${token}&portalId=${portalId}`, {
    next: { tags: ['customFieldAccess'] },
  });

  if (!res.ok) {
    throw new Error('Something went wrong in getCustomFieldAccess');
  }

  const { data } = await res.json();

  return data;
}

async function getSettings({ token, portalId }: { token: string; portalId: string }) {
  const res = await fetch(`${apiUrl}/api/settings?token=${token}&portalId=${portalId}`, {
    next: { tags: ['settings'] },
  });

  if (!res.ok) {
    throw new Error('Something went wrong in getSettings');
  }

  const { data } = await res.json();

  return data;
}

export default async function Home({ searchParams }: { searchParams: { token: string; portalId: string } }) {
  const token = z.string().parse(searchParams);
  const copilotClient = new CopilotAPI(token);
  const workspace = await copilotClient.getWorkspace();
  const { id: portalId } = workspace;

  const clientProfileUpdates = await getClientProfileUpdates({ token, portalId });
  const customFieldAccess = await getCustomFieldAccess({ token, portalId });
  const settings = await getSettings({ token, portalId });

  return (
    <ContextUpdate
      clientProfileUpdates={clientProfileUpdates}
      settings={settings?.profileLinks || []}
      access={customFieldAccess}
      token={token}
      portalId={portalId}
      workspace={workspace}
    >
      <Stack direction="row">
        <MainSection />

        <SidebarDecider>
          <Sidebar />
        </SidebarDecider>
      </Stack>
    </ContextUpdate>
  );
}
