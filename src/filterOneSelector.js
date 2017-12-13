import countBy from 'lodash-es/countBy';
import min from 'ml-array-min';
import max from 'ml-array-max';

import filterData from './filterData';
import * as kinds from './constants/kinds';

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
    if (data.length === 0) {
        return {
            min: 0,
            max: 1
        };
    }
    data = data.map((item) => propFunc(item));
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
        if (value !== null && value !== undefined) {
            result.push({
                value,
                count
            });
        }
    }
    result.sort((a, b) => b.count - a.count);
    return result;
}

function countMultiple(data, propFunc) {
    const counts = new Map();
    for (const item of data) {
        const value = propFunc(item);
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
