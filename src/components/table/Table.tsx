import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme
import './table.css';
import { useEffect, useMemo, useState } from 'react';
import { ClientCellRenderer } from './cellRenderers/ClientCellRenderer';
import { CompanyCellRenderer } from './cellRenderers/CompanyCellRenderer';
import { HistoryCellRenderer } from './cellRenderers/HistoryCellRenderer';
import { useAppState } from '@/hooks/useAppState';
import { getTimeAgo } from '@/utils/getTimeAgo';
import { arraysHaveSameElements, sliceTillElement } from '@/utils/array';
import { order } from '@/utils/orderable';
import copilotTheme from '@/utils/copilotTheme';
import NoRowsOverlay from './NoRowsOverlay';
import Loading from '@/app/loading';

export const TableCore = () => {
  const appState = useAppState();

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<any>([]);
  //
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<any>([]);

  const comparatorTypeI = (valueA: any, valueB: any) => {
    if (valueA.name < valueB.name) {
      return -1;
    }
    if (valueA.name > valueB.name) {
      return 1;
    }

    return 0;
  };

  const comparatorTypeII = (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) => {
    const _valueA = valueA.row[valueA.key].value;
    const _valueB = valueB.row[valueB.key].value;
    if (_valueA === null && _valueB === null) {
      return 0; // Both are considered equal
    } else if (_valueA === null) {
      return isInverted ? -1 : 1; // Null comes before a non-null string/number
    } else if (_valueB === null) {
      return isInverted ? 1 : -1; // Non-null string/number comes before null
    }

    // Convert values to strings for consistent comparison
    const stringA: any = String(_valueA);
    const stringB: any = String(_valueB);

    // Perform lexicographical comparison for strings, numeric comparison for numbers
    if (!isNaN(stringA) && !isNaN(stringB)) {
      return parseFloat(stringA) - parseFloat(stringB);
    } else {
      return stringA.localeCompare(stringB);
    }
  };

  useEffect(() => {
    setRowData(appState?.clientProfileUpdates);

    let colDefs: any = [];
    if (appState?.clientProfileUpdates?.length) {
      const col = appState?.clientProfileUpdates[0];
      delete col.id;

      let keys = [
        // This destructure is for essential meta info fields: client, company, last updated
        ...sliceTillElement(Object.keys(col), 'lastUpdated'),
        // Rest of these cols are for profile custom fields
        ...order(appState?.mutableCustomFieldAccess).map((field: { name: string }) => field.name),
      ];
      if (!appState.workspace?.isCompaniesEnabled) {
        keys = keys.filter((key: string) => key !== 'company');
      }
      keys.map((el: string) => {
        if (el === 'client') {
          colDefs = [
            ...colDefs,
            {
              field: 'client',
              cellRenderer: ClientCellRenderer,
              flex: 1,
              comparator: comparatorTypeI,
              getQuickFilterText: (params: any) => {
                const data = params.data[el];
                if (data && data.name !== null) {
                  return data.name.toString().toLowerCase();
                }
                return '';
              },
              minWidth: 250,
              valueGetter: (params: any) => {
                const client = params.data[el];
                const company = params.data['company'];
                return {
                  avatarImageUrl: client?.avatarImageUrl,
                  name: client?.name,
                  email: client?.email,
                  fallbackColor: company?.fallbackColor || copilotTheme.colors.primary,
                };
              },
            },
          ];
          return;
        }
        if (el === 'company') {
          colDefs = [
            ...colDefs,
            {
              field: 'company',
              cellRenderer: CompanyCellRenderer,
              flex: 1,
              comparator: comparatorTypeI,
              getQuickFilterText: (params: any) => {
                const data = params.data[el];
                if (data && data.name !== null) {
                  return data.name.toString().toLowerCase();
                }
                return '';
              },
              valueGetter: (params: any) => {
                const company = params.data[el];
                return {
                  iconImageUrl: company?.iconImageUrl,
                  name: company?.name || '',
                  fallbackColor: company?.fallbackColor || copilotTheme.colors.primary,
                };
              },
            },
          ];
          return;
        }
        if (el === 'lastUpdated') {
          colDefs = [
            ...colDefs,
            {
              field: 'lastUpdated',
              flex: 1,
              valueGetter: (params: any) => {
                const lastUpdated = params.data[el];
                const timeAgo = getTimeAgo(lastUpdated);
                return timeAgo === 'just now' ? timeAgo : `${timeAgo} ago`;
              },
            },
          ];
          return;
        }

        colDefs = [
          ...colDefs,
          {
            field: el,
            flex: 1,
            sortable: col[el] ? (col[el].type === 'multiSelect' ? false : true) : false,
            comparator: comparatorTypeII,
            getQuickFilterText: (params: any) => {
              const data = params.data[el];
              if (data?.type === 'multiSelect') {
                if (data && data.value !== null) {
                  return data.value[0]?.label;
                }
                return '';
              } else {
                if (data && data.value !== null) {
                  return data.value.toString().toLowerCase();
                }
                return '';
              }
            },
            cellRenderer: HistoryCellRenderer,
            valueGetter: (params: any) => {
              return {
                row: params.data,
                key: el,
              };
            },
          },
        ];
      });
      setColDefs(colDefs);
    }
  }, [appState?.clientProfileUpdates]);

  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
      minWidth: 200,
    };
  }, []);

  return (
    <Box
      className="ag-theme-quartz"
      sx={{
        height:
          arraysHaveSameElements(appState?.mutableSettings, appState?.settings) &&
          JSON.stringify(appState?.customFieldAccess) === JSON.stringify(appState?.mutableCustomFieldAccess)
            ? '90vh'
            : '82vh',
        width: '100%',
        padding: { xs: 0, sm: '8px 24px 0 24px' },
      }}
    >
      {rowData?.length ? (
        <AgGridReact
          className="on-scroll"
          rowData={rowData || []}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          suppressMovableColumns={true}
          quickFilterText={appState?.searchKeyword}
        />
      ) : appState?.isClientProfileUpdatesLoading ? (
        <Loading />
      ) : (
        <NoRowsOverlay />
      )}
    </Box>
  );
};
