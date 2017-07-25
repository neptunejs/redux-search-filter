import React from 'react';
import {searchFilter, Filter} from '../../../redux-search-filter';

function SearchFilter({data, filteredData}) {
    return (
        <div>
            <h2>Search filter demonstration</h2>
            <h3>Data has {data.length} elements</h3>
            <h3>Filtered data has {filteredData.length} elements</h3>
            <div>
                <h4>Filters</h4>
                <Filter
                    prop="x"
                    kind="value"
                    component={renderFilter}
                />
            </div>
        </div>
    );
}

export default searchFilter({
    name: 'test',
    getData: (state) => state.data
})(SearchFilter);

function renderFilter(props) {
    return (
        <div>
            <span>Filtering X</span>
            <select onChange={props.onChange}>
                <option value="" />
                {props.options.map(renderOption)}
            </select>
        </div>
    );
}

function renderOption(option) {
    return <option key={option.value} value={option.value}>{option.value} ({option.count})</option>;
}
