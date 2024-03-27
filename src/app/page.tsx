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
import InvalidToken from '@/components/atoms/InvalidToken';

export const revalidate = 0;

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
  const tokenParsed = z.string().safeParse(searchParams.token);

  if (!tokenParsed.success) {
    return <InvalidToken />;
  }

  const token = tokenParsed.data;
  const copilotClient = new CopilotAPI(token);
  const workspace = await copilotClient.getWorkspace();
  const { id: portalId } = workspace;

  const [customFieldAccess, settings] = await Promise.all([
    getCustomFieldAccess({ token, portalId }),
    getSettings({ token, portalId }),
  ]);

  return (
    <ContextUpdate
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
