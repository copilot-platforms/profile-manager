import { Box } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';

export const NoPreviewSupport = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '24px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: '0.8' }}>
        <Box sx={{ display: 'flex' }}>
          <AnnouncementIcon />
        </Box>
        <div>CRM preview is currently not supported for Profile Manager</div>{' '}
      </Box>
    </Box>
  );
};
