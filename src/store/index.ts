import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import themeReducer from "./slices/themeSlice";

export type UserStatus = "active" | "offline";

interface RootState {
  chat: {
    messages: Array<{
      id: string;
      text: string;
      sender: "user" | "ai";
      status: "sent" | "delivered" | "read";
    }>;
    isTyping: boolean;
    userStatus: UserStatus;
  };
  theme: {
    mode: "light" | "dark";
  };
}

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    theme: themeReducer,
  },
});

export type { RootState };
export type AppDispatch = typeof store.dispatch;
