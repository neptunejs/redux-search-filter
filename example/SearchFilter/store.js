import {createStore, applyMiddleware, compose} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from './reducers';

const middlewares = [
    promiseMiddleware()
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default createStore(
    rootReducer,
    enhancer
);
