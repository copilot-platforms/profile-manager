import copilotTheme from '@/utils/copilotTheme';
import { Box, Stack, Typography } from '@mui/material';

export const ClientCellRenderer = ({
  value,
}: {
  value: { avatarImageUrl: string; email: string; name: string; fallbackColor?: string };
}) => {
  const { avatarImageUrl, email, name, fallbackColor } = value;

  if (!name) return <></>;

  return (
    <Stack direction="row" alignItems="center" gap={3} marginTop="10px">
      {avatarImageUrl ? (
        <Box component="img" src={avatarImageUrl} alt="avatar" sx={{ width: '28px', height: '28px' }} />
      ) : (
        <div
          style={{
            minWidth: '28px',
            height: '28px',
            borderRadius: '100%',
            background: fallbackColor || copilotTheme.colors.primary,
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {name[0]?.toUpperCase()}
        </div>
      )}
      <Stack direction="column">
        <Typography variant="sm" lineHeight={'16px'}>
          {name}
        </Typography>
        <Typography variant="bodySm" lineHeight={'16px'}>
          {email}
        </Typography>
      </Stack>
    </Stack>
  );
};
