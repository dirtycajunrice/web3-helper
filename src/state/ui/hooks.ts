import { createDraftSafeSelector } from '@reduxjs/toolkit';
import { RootState } from "@state/store";
import { Component } from '@state/ui/types';

export const selectUiComponent = (state: RootState) => state.ui.component
export const selectUiComponentActive = createDraftSafeSelector(
  [selectUiComponent, (state: RootState, component: Component) => component],
  (activeComponent, component) => activeComponent === component
)
export const selectUiComponentNavDrawerActive = (state: RootState) =>
  selectUiComponentActive(state, Component.NavDrawer);
