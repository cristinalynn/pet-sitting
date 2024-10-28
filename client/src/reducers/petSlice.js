// // src/store/petSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // Thunk to fetch services
// export const fetchServices = createAsyncThunk('services/fetchServices', async (_, { rejectWithValue }) => {
//   try {
//     const response = await fetch('/api/services');
//     if (!response.ok) {
//       throw new Error('Failed to fetch services');
//     }
//     return await response.json();
//   } catch (error) {
//     return rejectWithValue(error.message);
//   }
// });

// // Thunk to add a new pet
// export const addPet = createAsyncThunk('pets/addPet', async (petData, { rejectWithValue }) => {
//   try {
//     const response = await fetch('/api/pets', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(petData),
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.error || 'Failed to add the pet.');
//     }
//     return await response.json();
//   } catch (error) {
//     return rejectWithValue(error.message);
//   }
// });

// const petSlice = createSlice({
//   name: 'pets',
//   initialState: {
//     services: [],
//     pets: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchServices.fulfilled, (state, action) => {
//         state.services = action.payload;
//         state.status = 'succeeded';
//       })
//       .addCase(fetchServices.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(addPet.fulfilled, (state, action) => {
//         state.pets.push(action.payload);
//         state.status = 'succeeded';
//       })
//       .addCase(addPet.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       });
//   },
// });

// export const selectServices = (state) => state.pets.services;
// export const selectStatus = (state) => state.pets.status;
// export const selectError = (state) => state.pets.error;

// export default petSlice.reducer;




// src/store/petSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to fetch pets for the current owner
export const fetchPets = createAsyncThunk('pets/fetchPets', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/check_session');
    if (!response.ok) {
      throw new Error('Failed to fetch pets');
    }
    const ownerData = await response.json();
    return ownerData.pets;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk to add a new pet
export const addPet = createAsyncThunk('pets/addPet', async (petData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.error || 'Failed to add pet');
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk to edit an existing pet
export const editPet = createAsyncThunk('pets/editPet', async (petData, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pets/${petData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });
    if (!response.ok) {
      throw new Error('Failed to update pet');
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk to delete a pet
export const deletePet = createAsyncThunk('pets/deletePet', async (petId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pets/${petId}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete pet');
    }
    return petId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const petSlice = createSlice({
  name: 'pets',
  initialState: {
    pets: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pets = action.payload;
        state.error = null;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.pets.push(action.payload);
      })
      .addCase(editPet.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter((pet) => pet.id !== action.payload);
      });
  },
});

export const selectPets = (state) => state.pets.pets;
export const selectPetsStatus = (state) => state.pets.status;
export const selectPetsError = (state) => state.pets.error;

export default petSlice.reducer;
