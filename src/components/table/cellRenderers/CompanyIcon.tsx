import copilotTheme from '@/utils/copilotTheme';
import { Box } from '@mui/material';

interface CompanyIconProps {
  label: string;
  iconImageUrl: string;
  fallbackColor?: string;
}

const CompanyIcon = ({ label, iconImageUrl, fallbackColor }: CompanyIconProps) => {
  return iconImageUrl ? (
    <Box component="img" src={iconImageUrl} alt="avatar" sx={{ width: '20px', height: '20px' }} />
  ) : (
    <Box
      sx={{
        width: '20px',
        height: '20px',
        borderRadius: '100%',
        // Use the primary color for copilot as a final fallback when fallbackColor is not provided
        backgroundColor: fallbackColor || copilotTheme.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.8em',
      }}
    >
      {label}
    </Box>
  );
};

export default CompanyIcon;
