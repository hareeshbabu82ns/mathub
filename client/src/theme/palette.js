import { lighten, darken } from '@mui/material/styles';
import { deepPurple, blue, grey, green, amber } from '@mui/material/colors';

// function createGradient(color1, color2) {
//   return `linear-gradient(to bottom, ${color1}, ${color2})`;
// }

const PRIMARY = {
  ...blue,
  main: blue[500],
  contrastText: '#fff'
};
const SECONDARY = {
  ...deepPurple,
  main: deepPurple[500],
  contrastText: '#fff'
};
const GREY = {
  ...grey,
  main: grey[500],
  contrastText: '#fff'
};
const SUCCESS = {
  ...green,
  main: green[500],
  contrastText: '#fff'
};
const WARNING = {
  ...amber,
  main: amber[500],
  contrastText: '#fff'
};

const paletteLight = {
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  divider: GREY[300],
  text: {
    primary: GREY[900],
    secondary: GREY[800],
    // disabled: grey[300],
  },
  background: {
    default: GREY[100],
    paper: GREY[100],
  },
}

function reverseColorPalette({ colorPalette, mode = 'light', by = 0 }) {
  const funcMode = mode === 'light' ? lighten : darken

  const res = {
    ...colorPalette,
    main: funcMode(colorPalette['400'], by),
    50: funcMode(colorPalette['900'], by),
    100: funcMode(colorPalette['800'], by),
    200: funcMode(colorPalette['700'], by),
    300: funcMode(colorPalette['600'], by),
    400: funcMode(colorPalette['500'], by),
    500: funcMode(colorPalette['400'], by),
    600: funcMode(colorPalette['300'], by),
    700: funcMode(colorPalette['200'], by),
    800: funcMode(colorPalette['100'], by),
    900: funcMode(colorPalette['50'], by),
    A100: funcMode(colorPalette['A700'], by),
    A200: funcMode(colorPalette['A400'], by),
    A400: funcMode(colorPalette['A200'], by),
    A700: funcMode(colorPalette['A100'], by),
  }
  return res
}

const GREY_DARK = reverseColorPalette({ colorPalette: GREY, mode: 'dark', by: 0.1 })

const paletteDark = {
  primary: { ...reverseColorPalette({ colorPalette: PRIMARY, mode: 'dark', by: 0.4 }) },
  secondary: { ...reverseColorPalette({ colorPalette: SECONDARY, mode: 'dark', by: 0.3 }) },
  success: { ...reverseColorPalette({ colorPalette: SUCCESS, mode: 'dark', by: 0.2 }) },
  warning: { ...reverseColorPalette({ colorPalette: WARNING, mode: 'dark', by: 0.2 }) },
  grey: { ...GREY_DARK },
  divider: GREY_DARK[200],
  text: {
    primary: GREY_DARK[900],
    secondary: GREY_DARK[800],
  },
  background: {
    default: '#0A1929',//GREY_DARK[100],
    paper: '#0A1929',//GREY_DARK[100],
  },
}

const palette = { 'light': paletteLight, 'dark': paletteDark }
export default palette