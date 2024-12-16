'use client';

import { Box, Stack, Typography, Divider } from '@mui/material';
import { StyledCheckBox } from '../styled/StyledCheckbox';
import { useAppState } from '@/hooks/useAppState';
import { iconsTypeMap } from './iconsTypeMap';
import { Permissions } from '@/types/settings';
import { order } from '@/utils/orderable';

export const CustomFieldAccessTable = () => {
  const appState = useAppState();

  const updateCustomFieldAccess = (checked: boolean, permission: string, id: string) => {
    let customField = appState?.mutableCustomFieldAccess.find((el: any) => el.id === id);

    if (checked) {
      if (permission === Permissions.View) {
        customField = {
          ...customField,
          permission: customField.permission.includes(Permissions.View)
            ? customField.permission
            : [...customField.permission, Permissions.View],
        };
      }
      if (permission === Permissions.Edit) {
        customField = {
          ...customField,
          permission: customField.permission.includes(Permissions.Edit)
            ? customField.permission
            : [...customField.permission, Permissions.Edit],
        };
      }
    }

    if (!checked) {
      if (permission === Permissions.View) {
        customField = {
          ...customField,
          permission: customField.permission.includes(Permissions.View) ? [] : customField.permission,
        };
      }
      if (permission === Permissions.Edit) {
        customField = {
          ...customField,
          permission: customField.permission.includes(Permissions.Edit)
            ? customField.permission.filter((item: string) => item !== Permissions.Edit)
            : customField.permission,
        };
      }
    }

    let indexToUpdate = appState?.mutableCustomFieldAccess.findIndex((item: any) => item.id === id);
    let allCustomFields = [...appState?.mutableCustomFieldAccess]; // Create a copy of the array

    allCustomFields[indexToUpdate] = customField;

    appState?.setAppState((prev) => ({ ...prev, mutableCustomFieldAccess: allCustomFields }));
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" pb={2}>
        <Box minWidth="215px">
          <Typography variant="bodySm">Field</Typography>
        </Box>
        <Stack direction="row" columnGap={12}>
          <Typography variant="bodySm">View</Typography>
          <Typography variant="bodySm">Edit</Typography>
        </Stack>
      </Stack>
      <Divider flexItem />
      {order(appState?.mutableCustomFieldAccess).map((field: any, key: number) => {
        return (
          <Stack direction="row" justifyContent="space-between" alignItems="center" p="8px 0px" key={key}>
            <Box minWidth="215px">
              <Stack direction="row" alignItems="center" columnGap={2}>
                {iconsTypeMap[field?.type]}
                <Typography variant="bodyMd">{field.name}</Typography>
              </Stack>
            </Box>
            <Stack direction="row" columnGap={12} alignItems="center">
              <StyledCheckBox
                checked={field.permission.includes(Permissions.View)}
                handleChange={(checked) => {
                  updateCustomFieldAccess(checked, Permissions.View, field.id);
                }}
              />
              {field.permission.includes(Permissions.View) ? (
                <StyledCheckBox
                  checked={field.permission.includes(Permissions.Edit)}
                  handleChange={(checked) => {
                    updateCustomFieldAccess(checked, Permissions.Edit, field.id);
                  }}
                />
              ) : (
                <Stack
                  direction="row"
                  justifyContent="end"
                  sx={{
                    width: '20px',
                  }}
                >
                  <Typography variant="sm">-</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        );
      })}
    </>
  );
};
