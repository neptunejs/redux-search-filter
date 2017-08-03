import {Map} from 'immutable';

import {
    RESET,
    UPDATE_FILTER,
    SET_OPERATOR,
    SET_NEGATED
} from './actionTypes';

const defaultMultipleFilter = {
    value: [],
    negated: false,
    operator: 'AND'
};

const defaultValueFilter = {
    value: [],
    negated: false,
    operator: 'OR'
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
            if (oldValue && oldValue.inverted === action.payload) {
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
    switch (kind) {
        case 'value':
        case 'multiple': {
            return Object.assign({}, getDefaultFilter(kind), filter, {
                negated: payload
            });
        }
        default: {
            throw new Error(`unexpected kind: ${kind}`);
        }
    }
}

function setOperator(kind, filter, payload) {
    switch (kind) {
        case 'value':
        case 'multiple': {
            return Object.assign({}, getDefaultFilter(kind), filter, {
                operator: payload
            });
        }
        default: {
            throw new Error(`unexpected kind: ${kind}`);
        }
    }
}

function formatValue(kind, filter, payload) {
    switch (kind) {
        case 'value':
        case 'multiple':
            return Object.assign({}, getDefaultFilter(kind), filter, {
                value: Array.isArray(payload) ? payload : [payload]
            });
        case 'range':
            return payload;
        default:
            throw new Error(`unexpected kind: ${kind}`);
    }
}

function getDefaultFilter(kind) {
    switch (kind) {
        case 'multiple':
            return defaultMultipleFilter;
        case 'value':
            return defaultValueFilter;
        default:
            throw new Error(`unexpected kind: ${kind}`);
    }
}
