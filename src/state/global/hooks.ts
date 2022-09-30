import { RootState } from "@state/store";

export const selectGlobalLoading = (state: RootState) => state.global.loading;
