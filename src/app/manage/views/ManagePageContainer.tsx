'use client';

import { FooterSave } from '@/components/footerSave/FooterSave';
import { MultiSelect } from '@/components/multiSelect/MultiSelect';
import { StyledTextInput } from '@/components/styled/StyledTextInput';
import { Box, Stack, Tooltip, Typography, styled } from '@mui/material';
import { FC, ReactElement, useMemo, useState } from 'react';
import { EmptyStateFallback } from './EmptyStateFallback';

export const ManagePageContainer = ({
  customFieldAccess,
  client,
  token,
  clientId,
  companyId,
  portalId,
}: {
  customFieldAccess: any;
  client: any;
  token: string;
  clientId: string;
  companyId: string;
  portalId: string;
}) => {
  const [_customFieldAccess, setCustomFieldAccess] = useState<any>(customFieldAccess);

  const [loading, setLoading] = useState(false);

  const [allowedCustomField, setAllowedCustomField] = useState<any>(null);

  const [customFieldsValue, setCustomFieldsValue] = useState<any>(client.customFields);

  const [profileData, setProfileData] = useState<any>({});

  const [originalProfileData, setOriginalProfileData] = useState<any>({});

  useMemo(() => {
    if (_customFieldAccess.length > 0) {
      const allowedFields = _customFieldAccess.filter((field: any) => field.permission?.length > 0);
      const getSelectedValuesForMultiSelect = (key: string) => {
        const values = customFieldsValue[key];
        if (!values) {
          return [];
        }
        const customFieldObject = allowedFields.find((el: any) => el.key === key);
        const selectedValues = customFieldObject.options.filter((el: any) => values.includes(el.key));

        return selectedValues;
      };
      allowedFields.map((field: any) => {
        profileData[field.key] =
          field.type === 'multiSelect'
            ? [...getSelectedValuesForMultiSelect(field.key)]
            : customFieldsValue[field.key] || '';
      });
      setOriginalProfileData(profileData);
      setAllowedCustomField(allowedFields);
    } else {
      setAllowedCustomField([]);
    }
  }, [_customFieldAccess]);

  const handleCancel = () => {
    setProfileData({
      ...originalProfileData,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    function transformObject(obj: any) {
      const result: any = {};
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          result[key] = obj[key].map((item: any) => item.key);
        } else {
          result[key] = obj[key];
        }
      }
      return result;
    }
    const form = transformObject(profileData);

    await fetch('/api/client-profile-updates', {
      method: 'POST',
      body: JSON.stringify({
        token: token,
        companyId: companyId,
        clientId: clientId,
        portalId: portalId,
        form: form,
      }),
    });

    const res = await fetch(`/api/custom-field-access?token=${token}&portalId=${portalId}`);

    const { data } = await res.json();

    const client = await fetch(`/api/client?clientId=${clientId}&token=${token}`);

    const updatedClientData = await client.json();

    setCustomFieldsValue(updatedClientData.data.customFields);

    setCustomFieldAccess(data);

    setLoading(false);
  };

  if (allowedCustomField && allowedCustomField.length === 0) {
    return <EmptyStateFallback />;
  }

  return (
    <>
      <Stack
        direction="column"
        sx={{
          padding: { xs: 4, sm: 6 },
          rowGap: 6,
          border: (theme) => `1px solid ${theme.color.borders.border}`,
          borderRadius: (theme) => theme.shape.radius100,
          mt: 4,
        }}
      >
        {allowedCustomField &&
          allowedCustomField.map((field: any, key: number) => {
            if (field.type !== 'multiSelect') {
              return (
                <InputContainer key={key}>
                  <Typography variant="md">{field.name}</Typography>
                  <ToolTipDecider show={!field.permission.includes('EDIT')}>
                    <StyledTextInput
                      value={profileData && profileData[field.key]}
                      variant="outlined"
                      padding="8px 12px"
                      disabled={!field.permission.includes('EDIT')}
                      key={key}
                      onChange={(e) => {
                        setProfileData((prev: any) => {
                          return { ...prev, [field.key]: e.target.value };
                        });
                      }}
                      type="text"
                    />
                  </ToolTipDecider>
                </InputContainer>
              );
            }
            if (field.type === 'multiSelect') {
              return (
                <InputContainer key={key}>
                  <Typography variant="md">{field.name}</Typography>
                  <ToolTipDecider show={!field.permission.includes('EDIT')}>
                    <Box>
                      <MultiSelect<{ label: string }>
                        key={key}
                        data={field.options}
                        nameField={(item) => item.label}
                        value={profileData && profileData[field.key]}
                        getSelectedValue={(value) => {
                          setProfileData((prev: any) => {
                            return { ...prev, [field.key]: value };
                          });
                        }}
                        disabled={!field.permission.includes('EDIT')}
                      />
                    </Box>
                  </ToolTipDecider>
                </InputContainer>
              );
            }
          })}
      </Stack>
      {JSON.stringify(originalProfileData) === JSON.stringify(profileData) ? null : (
        <FooterSave type="2" loading={loading} handleSave={handleSave} handleCancel={handleCancel} />
      )}
    </>
  );
};

const InputContainer = styled(Stack)({
  flexDirection: 'column',
  rowGap: 1.33,
});

const ToolTipDecider: FC<{ children: ReactElement; show: boolean }> = ({ children, show }) => {
  if (show)
    return (
      <Tooltip title="This field cannot be updated." placement="bottom-start">
        {children}
      </Tooltip>
    );

  return children;
};
