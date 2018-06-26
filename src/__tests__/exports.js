import {
  searchFilter,
  reducer,
  Filter,
  actionTypes,
  reset,
  updateFilter,
  setOperator,
  setNegated,
  getFilteredData
} from '../index';

test('check exports', () => {
  expect(searchFilter).toBeInstanceOf(Function);
  expect(reducer).toBeInstanceOf(Function);
  expect(Filter).toBeInstanceOf(Function);
  expect(actionTypes).not.toBeUndefined();
  expect(reset).toBeInstanceOf(Function);
  expect(updateFilter).toBeInstanceOf(Function);
  expect(setOperator).toBeInstanceOf(Function);
  expect(setNegated).toBeInstanceOf(Function);
  expect(getFilteredData).toBeInstanceOf(Function);
});
