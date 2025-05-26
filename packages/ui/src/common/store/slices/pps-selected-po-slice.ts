import { createSlice } from '@reduxjs/toolkit';
import { SliceNamesEnum } from './redux-slice-names';

export interface PPSState {
    selectedPo: any | null;
}

const initialState: PPSState = {
    selectedPo: null
};

export const ppsSelectedPOSlice = createSlice({
    name: SliceNamesEnum.PPS_SELECTED_PO,
    initialState,
    reducers: {
        setSelectedPO: (state, action) => {
            state.selectedPo = action.payload;
        },
    }
});

export const { setSelectedPO } = ppsSelectedPOSlice.actions;
export default ppsSelectedPOSlice.reducer;