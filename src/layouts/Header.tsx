import SearchBar from '@/components/searchBar/SearchBar';
import { Toggle } from '@/components/toggle/Toggle';
import { useAppState } from '@/hooks/useAppState';
import { getWorkspaceLabels } from '@/utils/getWorkspaceLabels';
import { Stack, Typography } from '@mui/material';

export const Header = () => {
  const appState = useAppState();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.color.borders.border}`,
        borderTop: `1px solid ${theme.color.borders.border}`,
        padding: { xs: '12px 16px', sm: '20px 24px' },
      })}
    >
      <Typography variant="lg" fontSize="13px" sx={{ overflow: 'hidden', textWrap: 'nowrap', textOverflow: 'ellipsis' }}>
        {getWorkspaceLabels(appState?.workspace, true).individualTerm} profile updates
      </Typography>
      <Stack direction="row" columnGap={4} alignItems="center">
        <SearchBar
          value={appState?.searchKeyword as string}
          getSearchKeyword={(keyword) => appState?.setAppState((prev) => ({ ...prev, searchKeyword: keyword }))}
        />
        <Toggle
          selected={appState?.showSidebar as boolean}
          handleClick={() => appState?.setAppState((prev) => ({ ...prev, showSidebar: !appState.showSidebar }))}
        />
      </Stack>
    </Stack>
  );
};
