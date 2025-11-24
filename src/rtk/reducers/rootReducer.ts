import {combineReducers} from '@reduxjs/toolkit';
import {sharedReducer} from './shared';
import {baseApi} from 'rtk/api';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  ['shared']: sharedReducer,
});

export default rootReducer;
