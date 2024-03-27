'use client';

import { WorkspaceResponse } from '@/types/common';
import { FC, ReactNode, useState, createContext, Dispatch, SetStateAction } from 'react';

export interface IAppState {
  showSidebar: boolean;
  searchKeyword: string;
  clientProfileUpdates: any[];
  isClientProfileUpdatesLoading: boolean;
  customFieldAccess: any; //readonly
  mutableCustomFieldAccess: any;
  settings: any; //readonly
  mutableSettings: any;
  token: string;
  portalId: string;
  workspace?: WorkspaceResponse;
}

export interface IAppContext {
  showSidebar: boolean;
  searchKeyword: string;
  clientProfileUpdates: any[];
  isClientProfileUpdatesLoading: boolean;
  customFieldAccess: any; //readonly
  mutableCustomFieldAccess: any;
  settings: any; //readonly
  mutableSettings: any;
  token: string;
  portalId: string;
  workspace?: WorkspaceResponse;
  setAppState: Dispatch<SetStateAction<IAppState>>;
}

interface IAppCoreProvider {
  children: ReactNode;
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppContextProvider: FC<IAppCoreProvider> = ({ children }) => {
  const [state, setState] = useState<IAppState>({
    showSidebar: false,
    searchKeyword: '',
    clientProfileUpdates: [],
    isClientProfileUpdatesLoading: true,
    customFieldAccess: [],
    mutableCustomFieldAccess: [],
    settings: [],
    mutableSettings: [],
    token: '',
    portalId: '',
    workspace: { id: '' },
  });

  return (
    <AppContext.Provider
      value={{
        showSidebar: state.showSidebar,
        searchKeyword: state.searchKeyword,
        clientProfileUpdates: state.clientProfileUpdates,
        isClientProfileUpdatesLoading: state.isClientProfileUpdatesLoading,
        customFieldAccess: state.customFieldAccess,
        mutableCustomFieldAccess: state.mutableCustomFieldAccess,
        settings: state.settings,
        mutableSettings: state.mutableSettings,
        token: state.token,
        portalId: state.portalId,
        workspace: state.workspace,
        setAppState: setState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
