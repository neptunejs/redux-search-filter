import { Map } from 'immutable';

import {
  RESET,
  UPDATE_FILTER,
  SET_OPERATOR,
  SET_NEGATED
} from './constants/actionTypes';
import * as kinds from './constants/kinds';
import { AND, OR } from './constants/operators';

const defaultMultipleFilter = {
  value: [],
  negated: false,
  operator: AND
};

const defaultValueFilter = {
  value: [],
  negated: false,
  operator: OR
};

export default function searchFilterReducer(state = new Map(), action) {
  let name, filters, filterName, filterProp;
  if (action.meta && action.meta.name) {
    name = action.meta.name;
    filters = state.get(name) || new Map();
    filterProp = action.meta.prop;
    filterName = action.meta.filterName || filterProp;
  }
  switch (action.type) {
    case RESET: {
      return state.set(name, filters.clear());
    }
    case UPDATE_FILTER: {
      if (action.payload === null) {
        return state.set(name, filters.delete(filterName));
      } else {
        return state.set(
          name,
          filters.set(
            filterName,
            formatValue(
              action.meta.kind,
              filterProp,
              filters.get(filterName),
              action.payload
            )
          )
        );
      }
    }
    case SET_NEGATED: {
      const oldValue = filters.get(filterName);
      if (oldValue && oldValue.negated === action.payload) {
        return state;
      } else {
        return state.set(
          name,
          filters.set(
            filterName,
            setNegated(action.meta.kind, filterProp, oldValue, action.payload)
          )
        );
      }
    }
    case SET_OPERATOR: {
      const oldValue = filters.get(filterName);
      if (oldValue && oldValue.operator === action.payload) {
        return state;
      } else {
        return state.set(
          name,
          filters.set(
            filterName,
            setOperator(action.meta.kind, filterProp, oldValue, action.payload)
          )
        );
      }
    }
    default:
      return state;
  }
}

function setNegated(kind, prop, filter, payload) {
  const result = { prop };
  if (typeof payload !== 'boolean') {
    throw new TypeError(
      `SET_NEGATED expects a boolean value. Received ${typeof payload}`
    );
  }
  switch (kind) {
    case kinds.value:
    case kinds.multiple: {
      return Object.assign(result, getDefaultFilter(kind), filter, {
        negated: payload
      });
    }
    default:
      throw unexpectedKind(kind);
  }
}

function setOperator(kind, prop, filter, payload) {
  const result = { prop };
  if (payload !== AND && payload !== OR) {
    throw new RangeError(`wrong operator: ${payload}`);
  }
  switch (kind) {
    case kinds.value:
    case kinds.multiple: {
      return Object.assign(result, getDefaultFilter(kind), filter, {
        operator: payload
      });
    }
    default:
      throw unexpectedKind(kind);
  }
}

function formatValue(kind, prop, filter, payload) {
  const result = { prop };
  switch (kind) {
    case kinds.value:
    case kinds.multiple:
      return Object.assign(result, getDefaultFilter(kind), filter, {
        value: Array.isArray(payload) ? payload : [payload]
      });
    case kinds.range: {
      if (
        typeof payload !== 'object' ||
        payload === null ||
        typeof payload.min !== 'number' ||
        typeof payload.max !== 'number'
      ) {
        throw new TypeError('range value must have a min and a max');
      }
      if (payload.min >= payload.max) {
        throw new RangeError('range min must be smaller than range max');
      }
      return Object.assign(result, payload);
    }
    default:
      throw unexpectedKind(kind);
  }
}

function getDefaultFilter(kind) {
  switch (kind) {
    case kinds.multiple:
      return defaultMultipleFilter;
    case kinds.value:
      return defaultValueFilter;
    default:
      throw unexpectedKind(kind);
  }
}

function unexpectedKind(kind) {
  return new Error(`unexpected kind: ${kind}`);
}
