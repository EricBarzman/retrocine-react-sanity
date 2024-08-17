import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    my_favorites: [],
}

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        updateFavorites: (state, action) => {
            return {
                ...state,
                my_favorites: action.payload
            };
        },
        removeFromStoreFavorites: (state, action) => {
            const newState = { ...state };
            console.log(newState.my_favorites);
            
            newState.my_favorites = newState.my_favorites.filter((favorite) => favorite._id !== action.payload)
            console.log(newState.my_favorites);
            
            return newState;
        }
    }
});

export const { updateFavorites, removeFromStoreFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;