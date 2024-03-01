import { ClientToken, ClientTokenSchema, IUToken, IUTokenSchema, Token, WorkspaceResponse } from '@/types/common';
import { CopilotAPI } from '@/utils/copilotApiUtils';
import { z } from 'zod';

interface Tokenable {
  token: string;
}

// Fetch workspace from API
export async function getWorkspaceInfo({ token }: Tokenable): Promise<WorkspaceResponse> {
  const copilotClient = new CopilotAPI(z.string().parse(token));
  return await copilotClient.getWorkspace();
}

const getTokenPayload = async ({ token }: Tokenable): Promise<Token> => {
  const copilotClient = new CopilotAPI(z.string().parse(token));
  return await copilotClient.getTokenPayload();
};

// Get parsed token info from copilot token for client
export const getClientTokenPayload = async ({ token }: Tokenable): Promise<ClientToken> => {
  return ClientTokenSchema.parse(await getTokenPayload({ token }));
};

// Get parsed token info from copilot token for internal user
export const getIUTokenPayload = async ({ token }: Tokenable): Promise<IUToken> => {
  return IUTokenSchema.parse(await getTokenPayload({ token }));
};
