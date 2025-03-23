import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import presenceReducer from "./slices/presenceSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    presence: presenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ FIX: Ensure Default Export
export default store;
