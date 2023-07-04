import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { APP_THEME_MODE, drawerWidth } from '../constants';

import { useRecoilState } from 'recoil';

import { drawerState } from './Drawer';
import ThemeUISwitch from './ThemeModeSwitch';
import { themeModeState, THEME_DARK, THEME_LIGHT } from '../state/theme_mode';

const AppBarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function AppBar({ open }) {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState)
  // const setDrawerState = useSetRecoilState(drawerState)
  const [drawerStateValue, setDrawerState] = useRecoilState(drawerState)

  function toggleDrawer() {
    setDrawerState(currentState => !currentState)
  }

  return (
    <AppBarStyled position="absolute" open={open || drawerStateValue} enableColorOnDark={true}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Math Hub
        </Typography>
        <Stack direction="row">
          <ThemeUISwitch checked={themeMode === THEME_DARK}
            onChange={(event, checked) => {
              const themeMode = checked ? THEME_DARK : THEME_LIGHT
              localStorage.setItem(APP_THEME_MODE, themeMode)
              setThemeMode(themeMode);
            }} />
        </Stack>
      </Toolbar>
    </AppBarStyled>
  )
}

export default AppBar