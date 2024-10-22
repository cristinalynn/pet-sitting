// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import ownerReducer from './reducers/ownerSlice'

const store = configureStore({
  reducer: {
    owner: ownerReducer,
  },
});

export default store;
