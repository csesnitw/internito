import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null, // Store user details
  loading: true, // Add loading state
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      sessionStorage.setItem('isLoggedIn', 'true');
      state.loading = false;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null; // Clear user details
      sessionStorage.removeItem('isLoggedIn');
      state.loading = false;
    },
    loadSession(state) {
      const session = sessionStorage.getItem('isLoggedIn');
      state.isLoggedIn = session === 'true';
      // Don't change loading here
    },
    setUser(state, action) {
      state.user = action.payload; // Set user details
      state.isLoggedIn = !!action.payload;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, loadSession, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;