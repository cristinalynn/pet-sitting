// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import ownerReducer from './reducers/ownerSlice';
import petReducer from './reducers/petSlice';

export default configureStore({
  reducer: {
    owner: ownerReducer,
    pets: petReducer,
  },
});


