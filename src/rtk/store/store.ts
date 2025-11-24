import {configureStore} from '@reduxjs/toolkit';
import * as apiReducers from '../api/base';
import {rootReducer} from '../reducers';
import {rtkQueryErrorLogger} from '../config';

const createStore = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['shared.pinAsyncFn'],
          ignoredActions: ['shared/setPinAsyncFn'],
        },
      }).concat(rtkQueryErrorLogger),
      /* @ts-ignore */
      ...Object.values(apiReducers).map(api => api.middleware),
    ] as ReturnType<typeof getDefaultMiddleware>,
});

export default createStore;
