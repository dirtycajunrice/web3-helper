import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '@state/ui/reducer';

const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false}),
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
