import { atom } from "recoil";
import { APP_THEME_MODE } from "../constants";

export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'
export const THEME_DEFAULT = THEME_LIGHT

export const themeModeState = atom({
  key: 'appTheme',
  default: localStorage.getItem(APP_THEME_MODE) || THEME_DEFAULT,
});