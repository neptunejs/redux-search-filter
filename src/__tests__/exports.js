import {
    searchFilter,
    reducer,
    Filter,
    actionTypes,
    reset,
    updateFilter,
    getFilteredData
} from '../index';

test('check exports', () => {
    expect(searchFilter).toBeInstanceOf(Function);
    expect(reducer).toBeInstanceOf(Function);
    expect(Filter).toBeInstanceOf(Function);
    expect(actionTypes).not.toEqual(undefined);
    expect(reset).toBeInstanceOf(Function);
    expect(updateFilter).toBeInstanceOf(Function);
    expect(getFilteredData).toBeInstanceOf(Function);
});
