import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../types';
import { wishlistService } from '../services/wishlistService';

interface WishlistState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const items = await wishlistService.getWishlist();
    return items;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async (product: Product, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wishlist: WishlistState };
      const exists = state.wishlist.items.some((i) => i._id === product._id);

      if (exists) {
        await wishlistService.removeFromWishlist(product._id);
        return { productId: product._id, action: 'removed' };
      } else {
        await wishlistService.addToWishlist(product._id);
        return { product, action: 'added' };
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(toggleWishlistItem.fulfilled, (state, action) => {
      if (action.payload.action === 'removed') {
        state.items = state.items.filter((i) => i._id !== action.payload.productId);
      } else if (action.payload.action === 'added' && action.payload.product) {
        state.items.push(action.payload.product);
      }
    });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
