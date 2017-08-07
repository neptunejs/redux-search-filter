import {
    RESET,
    UPDATE_FILTER,
    SET_NEGATED,
    SET_OPERATOR
} from './constants/actionTypes';

export function updateFilter(name, prop, kind, value) {
    if (value && value.target) { // convert react event to a value
        value = value.target.value;
    }
    if (!value) value = null;
    return getAction(UPDATE_FILTER, name, prop, kind, value);
}

export function setNegated(name, prop, kind, value) {
    if (value && value.target) {
        value = value.target.checked;
    }
    value = !!value;
    return getAction(SET_NEGATED, name, prop, kind, value);
}

export function setOperator(name, prop, kind, value) {
    if (value && value.target) {
        value = value.target.value;
    }
    return getAction(SET_OPERATOR, name, prop, kind, value);
}


export const reset = (name) => ({
    type: RESET,
    meta: {name}
});

function getAction(type, name, prop, kind, value) {
    return {
        type,
        meta: {
            name, prop, kind
        },
        payload: value
    };
}
