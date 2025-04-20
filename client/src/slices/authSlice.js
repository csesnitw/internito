import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null, // Store user details
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      sessionStorage.setItem('isLoggedIn', 'true');
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null; // Clear user details
      sessionStorage.removeItem('isLoggedIn');
    },
    loadSession(state) {
      const session = sessionStorage.getItem('isLoggedIn');
      state.isLoggedIn = session === 'true';
    },
    setUser(state, action) {
      state.user = action.payload; // Set user details
    },
  },
});

export const { login, logout, loadSession, setUser } = authSlice.actions;
export default authSlice.reducer;