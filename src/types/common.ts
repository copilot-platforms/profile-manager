import { z } from 'zod';

export interface Token {
  clientId?: string;
  companyId?: string;
  internalUserId?: string;
  workspaceId: string;
}

export const MeResponseSchema = z.object({
  id: z.string(),
  givenName: z.string(),
  familyName: z.string(),
  email: z.string(),
  portalName: z.string().optional(),
});
export type MeResponse = z.infer<typeof MeResponseSchema>;

// Response schema for `/workspace` endpoint
export const WorkspaceResponseSchema = z.object({
  id: z.string(),
  isCompaniesEnabled: z.boolean().optional(),
  // For future use
  // industry: z.string().optional(),
  // isClientDirectSignUpEnabled: z.boolean().optional(),
  // logOutUrl: z.string().optional(),
  // brandName: z.string().optional(),
  // squareIconUrl: z.string().optional(),
  // fullLogoUrl: z.string().optional(),
  // squareLoginImageUrl: z.string().optional(),
  // socialSharingImageUrl: z.string().optional(),
  // colorSidebarBackground: z.string().optional(),
  // colorSidebarText: z.string().optional(),
  // colorAccent: z.string().optional(),
  // font: z.string().optional(),
  // metaTitle: z.string().optional(),
  // metaDescription: z.string().optional(),
});
export type WorkspaceResponse = z.infer<typeof WorkspaceResponseSchema>;

export const ClientResponseSchema = z.object({
  id: z.string(),
  givenName: z.string(),
  familyName: z.string(),
  email: z.string(),
  companyId: z.string(),
  status: z.string(),
  avatarImageUrl: z.string().nullable(),
  customFields: z.record(z.string(), z.union([z.string(), z.array(z.string())])).nullable(),
});
export type ClientResponse = z.infer<typeof ClientResponseSchema>;

export const ClientsResponseSchema = z.object({
  data: z.array(ClientResponseSchema).nullable(),
});
export type ClientsResponse = z.infer<typeof ClientsResponseSchema>;

export const CompanyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  iconImageUrl: z.string().nullable(),
  fallbackColor: z.string().nullish(),
});
export type CompanyResponse = z.infer<typeof CompanyResponseSchema>;

export const CompaniesResponseSchema = z.object({
  data: z.array(CompanyResponseSchema).nullable(),
});
export type CompaniesResponse = z.infer<typeof CompaniesResponseSchema>;

export const CustomFieldSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  type: z.string(),
  order: z.number(),
  object: z.string(),
  options: z
    .array(
      z.object({
        id: z.string(),
        key: z.string(),
        label: z.string(),
        color: z.string(),
      }),
    )
    .optional(),
});
export type CustomField = z.infer<typeof CustomFieldSchema>;
export const CustomFieldResponseSchema = z.object({
  data: z.array(CustomFieldSchema).nullable(),
});
export type CustomFieldResponse = z.infer<typeof CustomFieldResponseSchema>;

export const ClientRequestSchema = z.object({
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  companyId: z.string().uuid().optional(),
  customFields: z.record(z.union([z.string(), z.array(z.string())])).optional(),
});
export type ClientRequest = z.infer<typeof ClientRequestSchema>;
