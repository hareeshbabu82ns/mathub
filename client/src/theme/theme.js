import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';

import palette from './palette';
import { useRecoilState } from 'recoil';
import { themeModeState, THEME_DARK, THEME_LIGHT } from '../state/theme_mode';

// ----------------------------------------------------------------------

// REF: https://mui.com/customization/default-theme/

ThemeConfig.propTypes = {
  children: PropTypes.node
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...palette[mode],
  },
  // shape,
  // typography,
  // shadows,
  // customShadows
})

export default function ThemeConfig({ children }) {

  const [themeMode, setThemeMode] = useRecoilState(themeModeState)

  // const prefersDarkMode = false;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useMemo(() => {
    // console.log(themeMode, prefersDarkMode)
    if (prefersDarkMode && themeMode === THEME_LIGHT)
      setThemeMode(THEME_DARK)
  }, [prefersDarkMode])

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(themeMode)), [themeMode]);
  // theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}