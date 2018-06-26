import min from 'ml-array-min';
import max from 'ml-array-max';

import filterData from './filterData';
import * as kinds from './constants/kinds';
import { MULTIPLE_EMPTY } from './constants/sentinels';

export default function filterOneSelector(data, name, propFunc, kind, filters) {
  switch (kind) {
    case kinds.value:
      return filterValue(data, name, propFunc, filters);
    case kinds.multiple:
      return filterMultiple(data, name, propFunc, filters);
    case kinds.range:
      return filterRange(data, name, propFunc, filters);
    default:
      throw new Error(`invalid filter kind: ${kind}`);
  }
}

function filterValue(data, name, propFunc, filters) {
  data = filterDataFor(data, name, filters);
  return makeArray(countBy(data, propFunc));
}

function filterMultiple(data, name, propFunc, filters) {
  data = filterDataFor(data, name, filters);
  const filter = filters && filters.get(name);
  if (filter && filter.negated) {
    return makeArray(countMultipleNegated(data, propFunc));
  } else {
    return makeArray(countMultiple(data, propFunc));
  }
}

function filterRange(data, name, propFunc, filters) {
  data = filterDataFor(data, name, filters);
  data = data.map((item) => propFunc(item)).filter(isNumber);
  if (data.length === 0) {
    return {
      min: 0,
      max: 0
    };
  }
  return {
    min: min(data),
    max: max(data)
  };
}

function filterDataFor(data, name, filters) {
  if (!filters) return data;
  filters = filters.filter((item, key) => {
    return key !== name;
  });
  if (filters.size > 0) {
    data = filterData(data, filters);
  }
  return data;
}

function makeArray(counts) {
  const result = [];
  for (const [value, count] of counts) {
    result.push({
      value,
      count
    });
  }
  result.sort((a, b) => b.count - a.count);
  return result;
}

function countMultiple(data, propFunc) {
  const counts = new Map();
  for (const item of data) {
    const value = propFunc(item);
    if (!value || !value[Symbol.iterator]) {
      continue;
    }
    if (value.length === 0) {
      if (!counts.has(MULTIPLE_EMPTY)) {
        counts.set(MULTIPLE_EMPTY, 1);
      } else {
        counts.set(MULTIPLE_EMPTY, counts.get(MULTIPLE_EMPTY) + 1);
      }
    }
    for (const el of value) {
      if (!counts.has(el)) {
        counts.set(el, 1);
      } else {
        counts.set(el, counts.get(el) + 1);
      }
    }
  }
  return counts;
}

function countMultipleNegated(data, propFunc) {
  const counts = countMultiple(data, propFunc);
  for (const [key, value] of counts) {
    counts.set(key, data.length - value);
  }
  return counts;
}

function countBy(array, accessor) {
  const counts = new Map();
  for (const element of array) {
    const value = accessor(element);
    if (!counts.has(value)) {
      counts.set(value, 1);
    } else {
      counts.set(value, counts.get(value) + 1);
    }
  }
  return counts;
}

function isNumber(x) {
  return typeof x === 'number';
}
