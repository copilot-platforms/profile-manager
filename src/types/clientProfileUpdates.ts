import { z } from 'zod';

export const CustomFieldUpdatesSchema = z.record(z.union([z.string(), z.array(z.string())]).nullable());
export type CustomFieldUpdates = z.infer<typeof CustomFieldUpdatesSchema>;

export const ClientProfileUpdatesRequestSchema = z.object({
  token: z.string(),
  clientId: z.string().uuid(),
  companyId: z.string().uuid(),
  portalId: z.string(),
  form: CustomFieldUpdatesSchema,
});
export type ClientProfileUpdatesRequest = z.infer<typeof ClientProfileUpdatesRequestSchema>;

export const ClientProfileUpdatesSchema = z.object({
  clientId: z.string().uuid(),
  companyId: z.string().uuid(),
  portalId: z.string(),
  customFields: CustomFieldUpdatesSchema,
  changedFields: CustomFieldUpdatesSchema,
  wasUpdatedByIU: z.boolean().optional(),
});
export type ClientProfileUpdates = z.infer<typeof ClientProfileUpdatesSchema>;

export const ClientProfileUpdatesResponseSchema = z.array(
  z.object({
    id: z.string().uuid(),
    clientId: z.string().uuid(),
    companyId: z.string().uuid(),
    customFields: CustomFieldUpdatesSchema,
    changedFields: CustomFieldUpdatesSchema,
    createdAt: z.date(),
  }),
);
export type ClientProfileUpdatesResponse = z.infer<typeof ClientProfileUpdatesResponseSchema>;

export const ParsedClientProfileUpdatesResponseSchema = z.object({
  id: z.string().uuid(),
  client: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    avatarImageUrl: z.string().nullable(),
  }),
  company: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      iconImageUrl: z.string().nullable(),
    })
    .optional(),
  lastUpdated: z.date(),
});
export type ParsedClientProfileUpdatesResponse = z.infer<typeof ParsedClientProfileUpdatesResponseSchema>;

export const UpdateHistorySchema = z.object({
  changedFields: CustomFieldUpdatesSchema,
  wasUpdatedByIU: z.boolean(),
});
export type UpdateHistory = z.infer<typeof UpdateHistorySchema>;
