import {
    RESET,
    UPDATE_FILTER
} from './actionTypes';

export function updateFilter(name, prop, kind, value) {
    if (value && value.target) { // convert react event to a value
        value = value.target.value;
    }
    if (!value) value = null;
    if (Array.isArray(value) && value.length === 0) value = null;
    return {
        type: UPDATE_FILTER,
        meta: {
            name,
            prop,
            kind
        },
        payload: value
    };
}

export const reset = (name) => ({
    type: RESET,
    meta: {name}
});
