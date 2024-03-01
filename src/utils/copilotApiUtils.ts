import { copilotApi } from 'copilot-node-sdk';
import { DefaultService as Copilot } from 'copilot-node-sdk/codegen/api/services/DefaultService';
import {
  ClientResponse,
  ClientResponseSchema,
  ClientsResponseSchema,
  CompanyResponse,
  CompanyResponseSchema,
  ClientRequest,
  CustomFieldResponse,
  CustomFieldResponseSchema,
  MeResponse,
  MeResponseSchema,
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

export type CopilotApi = typeof Copilot & { getTokenPayload?: () => Promise<Token> };

export class CopilotAPI {
  copilot: CopilotApi;

  constructor(apiToken: string) {
    this.copilot = copilotApi({
      apiKey: copilotAPIKey,
      token: apiToken,
    });
  }

  async me(): Promise<MeResponse> {
    return MeResponseSchema.parse(await this.copilot.getUserInfo());
  }

  async getWorkspace(): Promise<WorkspaceResponse> {
    return WorkspaceResponseSchema.parse(await this.copilot.getWorkspaceInfo());
  }

  private async getTokenPayload(): Promise<Token> {
    return TokenSchema.parse(await this.copilot.getTokenPayload?.());
  }

  async getClientTokenPayload(): Promise<ClientToken> {
    return ClientTokenSchema.parse(await this.getTokenPayload());
  }

  async getIUTokenPayload(): Promise<IUToken> {
    return IUTokenSchema.parse(await this.getTokenPayload());
  }

  async getClient(clientId: string): Promise<ClientResponse> {
    return ClientResponseSchema.parse(await this.copilot.retrieveAClient({ id: clientId }));
  }

  async getClients() {
    return ClientsResponseSchema.parse(await this.copilot.listClients({}));
  }

  async updateClient(clientId: string, requestBody: ClientRequest): Promise<ClientResponse> {
    // @ts-ignore
    return ClientResponseSchema.parse(await this.copilot.updateAClient({ id: clientId, requestBody }));
  }

  async getCompany(companyId: string): Promise<CompanyResponse> {
    return CompanyResponseSchema.parse(await this.copilot.retrieveACompany({ id: companyId }));
  }

  async getCompanies(): Promise<CompaniesResponse> {
    return CompaniesResponseSchema.parse(await this.copilot.listCompanies({}));
  }

  async getCustomFields(): Promise<CustomFieldResponse> {
    return CustomFieldResponseSchema.parse(await this.copilot.listCustomFields());
  }
}
