'use client';

import { CustomFieldAccessTable } from '@/components/customFieldAccessTable/CustomFieldAccessTable';
import { Box, Stack, Typography } from '@mui/material';
import { Switch } from '@/components/switch/Switch';
import { useAppState } from '@/hooks/useAppState';
import { arraysHaveSameElements } from '@/utils/array';
import { ProfileLinks } from '@/types/settings';

export const Sidebar = () => {
  const appState = useAppState();

  const handleMutableSettings = (selected: boolean, type: string) => {
    if (!selected) {
      const newSettings = appState?.mutableSettings.filter((el: string) => el !== type);
      appState?.setAppState((prev) => ({ ...prev, mutableSettings: newSettings }));
    }
    if (selected) {
      appState?.setAppState((prev) => ({
        ...prev,
        mutableSettings: appState?.mutableSettings.includes(type)
          ? appState?.mutableSettings
          : [...appState?.mutableSettings, type],
      }));
    }
  };

  return (
    <Box
      sx={(theme) => ({
        width: { xs: '100%', sm: '400px' },
        borderTop: `1px solid ${theme.color.borders.border}`,
        borderLeft: `1px solid ${theme.color.borders.border}`,
        // height: '100vh',
        display: appState?.showSidebar ? 'block' : 'none',
        flexShrink: 0,
        zIndex: 1200,
        height:
          arraysHaveSameElements(appState?.mutableSettings, appState?.settings) &&
          JSON.stringify(appState?.customFieldAccess) === JSON.stringify(appState?.mutableCustomFieldAccess)
            ? '100vh'
            : '92vh',
      })}
    >
      <Box
        sx={{
          padding: '24px 20px 12px 20px',
        }}
      >
        <Typography variant="md">Custom field access</Typography>
      </Box>

      <Box sx={{ padding: '0px 20px' }}>
        <CustomFieldAccessTable />
      </Box>

      <Box
        sx={(theme) => ({
          padding: '12px 20px',
          borderTop: `1px solid ${theme.color.borders.border}`,
          borderBottom: `1px solid ${theme.color.borders.border}`,
        })}
      >
        <Typography variant="md">Show links to other settings</Typography>

        <Stack direction="row" justifyContent="space-between" p="12px 0px 6px 0px">
          <Typography variant="bodyMd">General profile settings</Typography>
          <Switch
            selected={appState?.mutableSettings.includes(ProfileLinks.ProfileSetting)}
            getValue={(selected) => {
              handleMutableSettings(selected, ProfileLinks.ProfileSetting);
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" p="6px 0px">
          <Typography variant="bodyMd">Manage payment method</Typography>
          <Switch
            selected={appState?.mutableSettings.includes(ProfileLinks.PaymentMethod)}
            getValue={(selected) => {
              handleMutableSettings(selected, ProfileLinks.PaymentMethod);
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};
