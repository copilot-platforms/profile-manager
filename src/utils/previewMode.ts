import { Token } from '@/types/common';

export type PreviewMode = 'client' | 'company' | null;

export const getPreviewMode = (tokenPayload: Token): PreviewMode => {
  const isClientPreview = tokenPayload.internalUserId && tokenPayload.clientId;
  // For a company to be alongside IU token, it shouldn't be "default" or undefined
  // Older workspaces in Copilot have "default" as companyId, while newer ones have undefined for IUs
  const isDefaultCompany = tokenPayload.companyId === 'default';
  const isCompanyPreview = tokenPayload.internalUserId && !isDefaultCompany && !!tokenPayload.companyId;
  const previewMode: PreviewMode = isClientPreview ? 'client' : isCompanyPreview ? 'company' : null;
  return previewMode;
};
