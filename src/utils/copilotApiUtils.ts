import { copilotApi } from 'copilot-node-sdk';
import type { CopilotAPI as SDK } from 'copilot-node-sdk';
import {
  ClientResponse,
  ClientResponseSchema,
  ClientsResponseSchema,
  CompanyResponse,
  CompanyResponseSchema,
  ClientRequest,
  CustomFieldResponse,
  CustomFieldResponseSchema,
  CompaniesResponse,
  CompaniesResponseSchema,
  WorkspaceResponse,
  WorkspaceResponseSchema,
  Token,
  TokenSchema,
  ClientToken,
  ClientTokenSchema,
  IUTokenSchema,
  IUToken,
} from '@/types/common';
import { copilotAPIKey } from '@/config';

export class CopilotAPI {
  copilot: SDK;

  constructor(apiToken: string) {
    this.copilot = copilotApi({
      apiKey: copilotAPIKey,
      token: apiToken,
    });
  }

  async getWorkspace(): Promise<WorkspaceResponse> {
    return WorkspaceResponseSchema.parse(await this.copilot.retrieveWorkspace());
  }

  async getTokenPayload(): Promise<Token> {
    return TokenSchema.parse(await this.copilot.getTokenPayload?.());
  }

  async getClientTokenPayload(): Promise<ClientToken> {
    return ClientTokenSchema.parse(await this.getTokenPayload());
  }

  async getIUTokenPayload(): Promise<IUToken> {
    return IUTokenSchema.parse(await this.getTokenPayload());
  }

  async getClient(id: string): Promise<ClientResponse> {
    return ClientResponseSchema.parse(await this.copilot.retrieveClient({ id }));
  }

  async getClients() {
    return ClientsResponseSchema.parse(await this.copilot.listClients({}));
  }

  async updateClient(id: string, requestBody: ClientRequest): Promise<ClientResponse> {
    // @ts-ignore
    return ClientResponseSchema.parse(await this.copilot.updateClient({ id, requestBody }));
  }

  async getCompany(id: string): Promise<CompanyResponse> {
    return CompanyResponseSchema.parse(await this.copilot.retrieveCompany({ id }));
  }

  async getCompanies(): Promise<CompaniesResponse> {
    return CompaniesResponseSchema.parse(await this.copilot.listCompanies({}));
  }

  async getCustomFields(): Promise<CustomFieldResponse> {
    return CustomFieldResponseSchema.parse(await this.copilot.listCustomFields());
  }
}
