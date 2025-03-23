import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchChatHistory } from "../../api/mockApi";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  status: "sent" | "delivered" | "read";
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

const initialState: ChatState = {
  messages: [],
  isTyping: false,
};

// ✅ Load chat history (Mock API Integration)
export const loadChatHistory = createAsyncThunk(
  "chat/loadHistory",
  async () => {
    return await fetchChatHistory();
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ id: string; status: "delivered" | "read" }>
    ) => {
      const message = state.messages.find(
        (msg) => msg.id === action.payload.id
      );
      if (message) {
        message.status = action.payload.status;
      }
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadChatHistory.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const { addMessage, updateMessageStatus, setTyping } = chatSlice.actions;
export default chatSlice.reducer;
