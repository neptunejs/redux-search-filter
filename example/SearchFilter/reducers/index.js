import {combineReducers} from 'redux';

import {reducer as searchFilter} from '../../../redux-search-filter';

import data from './dataReducer';

export default combineReducers({
    data,
    searchFilter
});
