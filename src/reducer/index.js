import {combineReducers} from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import profilereducer from '../slices/profileSlice';
import cartReducer from '../slices/cartSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    profile:profilereducer,
    cart:cartReducer,
})

export default rootReducer;