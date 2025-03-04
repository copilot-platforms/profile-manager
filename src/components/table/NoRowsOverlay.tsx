import { ClientsIcon } from '@/icons';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

const NoRowsOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25em',
      alignItems: 'flex-start',
      margin: '20% auto',
      maxWidth: '640px',
    }}
  >
    <Box sx={{ padding: '1.2rem', borderRadius: '10px', backgroundColor: '#e8eaf1' }}>
      <ClientsIcon style={{ scale: '2' }} />
    </Box>
    <div>
      <Typography variant="h5" sx={{ fontSize: '1.75em', fontWeight: '500' }}>
        Let clients view and update custom fields
      </Typography>
    </div>
    <div>
      <Typography variant="body1" color={'#60606A'} align="left">
        With Profile Manager, you can let clients view and edit their own custom fields. Configure custom field access on the
        right. Then if clients make updates, they will show directly on this page.
      </Typography>
      <Box textAlign={'left'}>
        <Link
          href="https://www.copilot.app/guide/profile-manager-app"
          style={{ lineHeight: '3.75em', textDecoration: 'none', textAlign: 'left' }}
          target="_blank"
        >
          Learn More
        </Link>
      </Box>
    </div>
  </Box>
);

export default NoRowsOverlay;
