'use client';

import { useAppState } from '@/hooks/useAppState';
import { WorkspaceResponse } from '@/types/common';
import { CustomFieldAccessResponse } from '@/types/customFieldAccess';
import { fetcher } from '@/utils/fetcher';
import { ReactNode, useEffect } from 'react';
import useSWR from 'swr';

interface IContextUpdate {
  children: ReactNode;
  access: CustomFieldAccessResponse;
  settings: any;
  token: string;
  portalId: string;
  workspace: WorkspaceResponse;
}

export const ContextUpdate = ({ children, access, settings, token, portalId, workspace }: IContextUpdate) => {
  const appState = useAppState();
  const { data: clientProfileUpdates, isLoading: isClientProfileUpdatesLoading } = useSWR(
    `api/client-profile-updates?token=${token}&portalId=${portalId}`,
    fetcher,
    {
      // Don't sent requests if tab is inactive
      refreshInterval: 10000,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    },
  );

  useEffect(() => {
    appState?.setAppState((prev) => ({ ...prev, workspace }));
  }, [workspace]);

  useEffect(() => {
    appState?.setAppState((prev) => ({ ...prev, clientProfileUpdates }));
    // lag half second before setting isLoading to false so that noRows component doesn't flash No Rows Found before rendering data!
    const timeoutId = setTimeout(() => appState?.setAppState((prev) => ({ ...prev, isClientProfileUpdatesLoading })), 500);

    return () => clearTimeout(timeoutId);
  }, [clientProfileUpdates]);

  useEffect(() => {
    appState?.setAppState((prev) => ({ ...prev, customFieldAccess: access, mutableCustomFieldAccess: access }));
  }, [access]);

  useEffect(() => {
    appState?.setAppState((prev) => ({ ...prev, settings: settings, mutableSettings: settings }));
  }, [settings]);

  useEffect(() => {
    appState?.setAppState((prev) => ({ ...prev, token: token, portalId: portalId }));
  }, [token, portalId]);

  return children;
};
