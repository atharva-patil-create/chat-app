import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PresenceState {
  userStatus: "active" | "offline" | "typing";
}

const initialState: PresenceState = {
  userStatus: "offline", // ✅ Ensures userStatus is always defined
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setUserStatus: (
      state,
      action: PayloadAction<PresenceState["userStatus"]>
    ) => {
      state.userStatus = action.payload;
    },
  },
});

export const { setUserStatus } = presenceSlice.actions;
export default presenceSlice.reducer;
