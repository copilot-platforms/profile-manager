import { useAppState } from '@/hooks/useAppState';
import { updateColor } from '@/utils/updateColor';
import { FiberManualRecord } from '@mui/icons-material';
import { Box, CircularProgress, Popper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

export const HistoryCellRenderer = ({ value }: { value: { row: any; key: string } }) => {
  const appState = useAppState();

  const [loading, setLoading] = useState(false);

  const [updateHistory, setUpdateHistory] = useState<any>([]);

  const data = value.row[value.key];

  const clientId = value.row.client.id;
  const lastUpdated = value.row.lastUpdated;
  const token = appState?.token;
  const key = value.row[value.key].key;

  const showDot = data.isChanged;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [multiSelectAnchor, setMultiSelectAnchor] = React.useState<null | HTMLElement>(null);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/profile-update-history?token=${token}&clientId=${clientId}&key=${key}&lastUpdated=${lastUpdated}`,
    );
    const data = await res.json();
    setUpdateHistory(data);
    setLoading(false);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (showDot) {
      setAnchorEl(anchorEl ? null : event.currentTarget);
      fetchHistory();
    }
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    if (showDot && anchorEl === event.currentTarget) {
      setUpdateHistory([]);
      setAnchorEl(null);
    }
  };

  const handleMouseEnterMultiSelect = (event: React.MouseEvent<HTMLElement>) => {
    setMultiSelectAnchor(multiSelectAnchor ? null : event.currentTarget);
  };

  const handleMouseLeaveMultiSelect = (event: React.MouseEvent<HTMLElement>) => {
    if (multiSelectAnchor === event.currentTarget) {
      setMultiSelectAnchor(null);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const multiSelectAnchorOpen = Boolean(multiSelectAnchor);
  const multiSelectAnchorId = multiSelectAnchorOpen ? 'multiselect-popper' : undefined;

  // There are certain edge cases like with Phone Numbers where null is returned
  if (data.value === null) {
    data.value = '';
  }

  if (data.type === 'multiSelect') {
    return (
      <Box position="relative">
        {showDot && (
          <Typography
            aria-describedby={id}
            variant="bodyMd"
            fontSize={20}
            sx={{
              position: 'absolute',
              left: -15,
              top: 5,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            &#x2022;
          </Typography>
        )}
        {data?.value?.[0] ? (
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              marginTop: '10px',
            }}
            columnGap={'2px'}
          >
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                padding: '4px 8px',
                borderColor: updateColor(data.value[0].color, 0.3),
                border: '2px solid',
                backgroundColor: updateColor(data.value[0].color, 0.1),
                color: data.value[0].color,
                fontWeight: '600',
                borderRadius: '35px',
                width: 'fit-content',
                minWidth: '40px',
                columnGap: '6px',
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FiberManualRecord fontSize="small" />

              <Typography variant="bodySm" fontWeight={500}>
                {data.value ? data.value[0].label : ''}
              </Typography>
            </Stack>

            <Typography
              onMouseEnter={handleMouseEnterMultiSelect}
              onMouseLeave={handleMouseLeaveMultiSelect}
              variant="bodyMd"
            >
              {data.value.length > 1 && `+ ${data.value.length - 1}`}
            </Typography>
          </Stack>
        ) : (
          <></>
        )}
        <Popper id={id} open={open} anchorEl={anchorEl}>
          {loading ? <CircularProgress size={20} color="inherit" /> : <HistoryList updateHistory={updateHistory} />}
        </Popper>
        <Popper id={multiSelectAnchorId} open={multiSelectAnchorOpen} anchorEl={multiSelectAnchor}>
          <Stack
            direction="row"
            sx={(theme) => ({
              border: `1px solid ${theme.color.borders.border}`,
              borderRadius: theme.shape.radius100,
              backgroundColor: theme.color.base.white,
              boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.12)',
              padding: 4,
              minWidth: '200px',
              columnGap: '10px',
            })}
          >
            {data?.value &&
              data?.value?.map((el: any, key: number) => {
                if (key === 0) return null;
                return (
                  <Stack
                    key={key}
                    direction="row"
                    alignItems="center"
                    sx={{
                      padding: '4px 8px',
                      borderColor: updateColor(el.color, 0.3),
                      border: '2px solid',
                      backgroundColor: updateColor(el.color, 0.1),
                      color: el.color,
                      fontWeight: '600',
                      borderRadius: '35px',
                      width: 'fit-content',
                      minWidth: '40px',
                    }}
                  >
                    <FiberManualRecord fontSize="small" />

                    <Typography variant="bodySm" fontWeight={500}>
                      {el.label}
                    </Typography>
                  </Stack>
                );
              })}
          </Stack>
        </Popper>
      </Box>
    );
  }

  return (
    <Box position="relative">
      {showDot && (
        <Typography
          aria-describedby={id}
          variant="bodyMd"
          fontSize={20}
          sx={{
            position: 'absolute',
            left: -15,
            top: 15,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          &#x2022;
        </Typography>
      )}
      <Typography variant="bodyMd" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {data.value}
      </Typography>

      <Popper id={id} open={open} anchorEl={anchorEl}>
        {loading ? <CircularProgress size={20} color="inherit" /> : <HistoryList updateHistory={updateHistory} />}
      </Popper>
    </Box>
  );
};

const HistoryList = ({ updateHistory }: { updateHistory: any }) => {
  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.color.borders.border}`,
        borderRadius: theme.shape.radius100,
        backgroundColor: theme.color.base.white,
        boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.12)',
        padding: 4,
        minWidth: '400px',
        maxWidth: '400px',
      })}
    >
      <Typography variant="sm">Update history</Typography>
      <Stack direction="column" rowGap={1.5}>
        {updateHistory.map((history: any, key: number) => {
          if (history.type === 'multiSelect') {
            return (
              <Stack key={key} direction="row" alignItems="center" columnGap={3}>
                <Typography variant="bodyMd" fontSize={20}>
                  &#x2022;
                </Typography>
                <Stack direction="row" columnGap={2}>
                  {/* history.value can either be "" (empty state) or an array of multi tags */}
                  {!Array.isArray(history?.value)
                    ? history.value
                    : history.value.map((el: any, key: number) => {
                        return (
                          <Stack
                            key={key}
                            direction="row"
                            alignItems="center"
                            sx={{
                              padding: '4px 8px',
                              borderColor: updateColor(el.color, 0.3),
                              border: '2px solid',
                              backgroundColor: updateColor(el.color, 0.1),
                              color: el.color,
                              fontWeight: '600',
                              borderRadius: '35px',
                              width: 'fit-content',
                              minWidth: '40px',
                            }}
                          >
                            <FiberManualRecord fontSize="small" />

                            <Typography variant="bodySm" fontWeight={500}>
                              {el.label}
                            </Typography>
                          </Stack>
                        );
                      })}
                </Stack>
              </Stack>
            );
          }
          return (
            <Stack key={key} direction="row" alignItems="flex-start" columnGap={3}>
              <Typography variant="bodyMd" fontSize={20}>
                &#x2022;
              </Typography>
              <Typography variant="bodySm" key={key}>
                {history.value.slice(0, 700)}
                {history.value.length > 700 ? '...' : ''}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};
