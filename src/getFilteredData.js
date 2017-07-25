import {createSelector} from 'reselect';

import filterData from './filterData';

export default function getFilteredData(name, getData) {
    const getFilter = (state) => state.searchFilter.get(name);
    return createSelector(
        getData,
        getFilter,
        (data, filter) => {
            let filteredData = data;
            if (filter !== undefined && filter.size > 0) {
                filteredData = filterData(data, filter);
            }
            return filteredData;
        }
    );
}
