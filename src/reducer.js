import {Map} from 'immutable';

import {
    RESET,
    UPDATE_FILTER
} from './actionTypes';

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
                return state.set(name, filter.set(action.meta.prop, formatValue(action.meta.kind, action.payload)));
            }
        }
        default:
            return state;
    }
}

function formatValue(kind, payload) {
    switch (kind) {
        case 'value':
        case 'multiple':
            return Array.isArray(payload) ? payload : [payload];
        case 'range':
            return payload;
        default:
            throw new Error(`unexpected kind: ${kind}`);
    }
}
