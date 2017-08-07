import {Map} from 'immutable';

import {
    RESET,
    UPDATE_FILTER,
    SET_OPERATOR,
    SET_NEGATED
} from './constants/actionTypes';
import * as kinds from './constants/kinds';
import {AND, OR} from './constants/operators';

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

export default function (state = new Map(), action) {
    let name, filter;
    if (action.meta && action.meta.name) {
        name = action.meta.name;
        filter = state.get(name) || new Map();
    }
    switch (action.type) {
        case RESET: {
            return state.set(name, filter.clear());
        }
        case UPDATE_FILTER: {
            if (action.payload === null) {
                return state.set(name, filter.delete(action.meta.prop));
            } else {
                return state.set(name, filter.set(action.meta.prop, formatValue(action.meta.kind, filter.get(action.meta.prop), action.payload)));
            }
        }
        case SET_NEGATED: {
            const oldValue = filter.get(action.meta.prop);
            if (oldValue && oldValue.negated === action.payload) {
                return state;
            } else {
                return state.set(name, filter.set(action.meta.prop, setNegated(action.meta.kind, oldValue, action.payload)));
            }
        }
        case SET_OPERATOR: {
            const oldValue = filter.get(action.meta.prop);
            if (oldValue && oldValue.operator === action.payload) {
                return state;
            } else {
                return state.set(name, filter.set(action.meta.prop, setOperator(action.meta.kind, oldValue, action.payload)));
            }
        }
        default:
            return state;
    }
}

function setNegated(kind, filter, payload) {
    if (typeof payload !== 'boolean') {
        throw new TypeError(`SET_NEGATED expects a boolean value. Received ${typeof payload}`);
    }
    switch (kind) {
        case kinds.value:
        case kinds.multiple: {
            return Object.assign({}, getDefaultFilter(kind), filter, {
                negated: payload
            });
        }
        default:
            throw unexpectedKind(kind);
    }
}

function setOperator(kind, filter, payload) {
    if (payload !== AND && payload !== OR) {
        throw new RangeError(`wrong operator: ${payload}`);
    }
    switch (kind) {
        case kinds.value:
        case kinds.multiple: {
            return Object.assign({}, getDefaultFilter(kind), filter, {
                operator: payload
            });
        }
        default:
            throw unexpectedKind(kind);
    }
}

function formatValue(kind, filter, payload) {
    switch (kind) {
        case kinds.value:
        case kinds.multiple:
            return Object.assign({}, getDefaultFilter(kind), filter, {
                value: Array.isArray(payload) ? payload : [payload]
            });
        case kinds.range: {
            if (typeof payload !== 'object' || payload === null || typeof payload.min !== 'number' || typeof payload.max !== 'number') {
                throw new TypeError('range value must have a min and a max');
            }
            if (payload.min >= payload.max) {
                throw new RangeError('range min must be smaller than range max');
            }
            return payload;
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
