import { apiUrl } from '@/config';
import { APIProps } from '@/types/api';
import { WorkspaceResponse } from '@/types/common';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import { z } from 'zod';

// Fetch workspace from API
export async function getWorkspaceInfo({ token }: { token: string }): Promise<WorkspaceResponse> {
  const copilotClient = new CopilotAPI(z.string().parse(token));
  return await copilotClient.getWorkspace();
}
