import lodashProperty from 'lodash-es/property';

import { AND, OR } from './constants/operators';
import { MULTIPLE_EMPTY } from './constants/sentinels';

export default function filterData(data, filters) {
  filters = Array.from(filters);
  filters = filters.map(([name, filterOptions]) => [
    name,
    filterOptions,
    lodashProperty(filterOptions.prop)
  ]);
  return data.filter((item) => {
    main: for (const [, filterOptions, filterProp] of filters) {
      const filterValue = filterOptions.value;
      let operator = filterOptions.operator;
      let negated = filterOptions.negated;
      const itemValue = filterProp(item);
      if (filterValue) {
        if (filterValue.length > 0) {
          if (Array.isArray(itemValue)) {
            // kind: multiple
            operator = operator || AND;
            if (operator === AND) {
              for (const value of filterValue) {
                if (
                  itemValue.includes(value) ||
                  (value === MULTIPLE_EMPTY && itemValue.length === 0)
                ) {
                  if (negated) {
                    return false;
                  }
                } else {
                  if (!negated) {
                    return false;
                  }
                }
              }
            } else {
              for (const value of filterValue) {
                if (
                  itemValue.includes(value) ||
                  (value === MULTIPLE_EMPTY && itemValue.length === 0)
                ) {
                  if (!negated) {
                    continue main;
                  }
                } else {
                  if (negated) {
                    continue main;
                  }
                }
              }
              return false;
            }
          } else {
            // kind: value
            operator = operator || OR;
            const isIncluded = filterValue.includes(filterProp(item));
            if (operator === AND) {
              if (negated) {
                if (isIncluded) {
                  return false;
                }
              } else {
                if (filterValue.length > 1) return false;
                if (!isIncluded) {
                  return false;
                }
              }
            } else {
              if (negated) {
                if (filterValue.length > 1) {
                  continue;
                }
                if (isIncluded) {
                  return false;
                }
              } else {
                if (!isIncluded) {
                  return false;
                }
              }
            }
          }
        }
      } else {
        // kind: range
        const value = filterProp(item);
        if (
          typeof value !== 'number' ||
          value < filterOptions.min ||
          value > filterOptions.max ||
          Number.isNaN(value)
        ) {
          return false;
        }
      }
    }
    return true;
  });
}
