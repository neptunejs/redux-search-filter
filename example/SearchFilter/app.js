import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './store';

import SearchFilter from './components/SearchFilter';

ReactDOM.render(
    <Provider store={store}>
        <SearchFilter />
    </Provider>,
    document.getElementById('example')
);
