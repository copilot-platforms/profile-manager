import { Stack, Typography } from '@mui/material';
import CompanyIcon from '@/components/table/cellRenderers/CompanyIcon';

export const CompanyCellRenderer = ({
  value,
}: {
  value: { iconImageUrl: string; name: string; fallbackColor?: string };
}) => {
  const { iconImageUrl, name, fallbackColor } = value;
  return (
    <Stack direction="row" alignItems="center" gap={3} marginTop="15px">
      <CompanyIcon label={name[0]} iconImageUrl={iconImageUrl} fallbackColor={fallbackColor} />
      <Typography variant="sm" lineHeight={'16px'}>
        {name}
      </Typography>
    </Stack>
  );
};
