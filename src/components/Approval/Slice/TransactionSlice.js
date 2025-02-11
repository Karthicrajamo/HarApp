import {createSlice} from '@reduxjs/toolkit';

const transactionSlice = createSlice({
  name: 'transferDetails',
  initialState: {data: null},
  reducers: {
    setTransferDetails: (state,action) => {
      state.data = action.payload;
    },
  },
});

export const {setTransferDetails} = transactionSlice.actions;
export default transactionSlice.reducer;
