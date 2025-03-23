import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Message structure
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  status: "sending" | "sent" | "delivered" | "read";
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

// Mock API request for sending messages
export const sendMessageAPI = createAsyncThunk(
  "chat/sendMessage",
  async ({ id, text }: { id: string; text: string }) => {
    return new Promise<Message>((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          text,
          sender: "user",
          status: "sent",
          timestamp: Date.now(),
        });
      }, 500);
    });
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Add a message (used for optimistic UI updates)
    addMessage: (state, action: PayloadAction<Message>) => {
      const exists = state.messages.some((msg) => msg.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },

    // Update a message's status (sent → delivered → read)
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

    // Toggle typing indicator
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },

  // Handle async actions
  extraReducers: (builder) => {
    builder.addCase(sendMessageAPI.fulfilled, (state, action) => {
      const message = state.messages.find(
        (msg) => msg.id === action.payload.id
      );
      if (message) {
        message.status = "sent";
      }
    });
  },
});

// Export actions and reducer
export const { addMessage, updateMessageStatus, setTyping } = chatSlice.actions;
export default chatSlice.reducer;
