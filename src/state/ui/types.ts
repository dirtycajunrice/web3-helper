import { PaletteMode } from '@mui/material';

export enum Component {
  None,
  NavDrawer
}

export interface UIState {
  component: Component,
  theme: PaletteMode
}
