import { configureStore } from '@reduxjs/toolkit';
import TransactionReducer from './Slice/TransactionSlice';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer:{
transaction:TransactionReducer
    },
    // middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concate(sagaMiddleware)
})

// sagaMiddleware.run()

export default store;
