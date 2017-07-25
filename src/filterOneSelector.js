import countBy from 'lodash-es/countBy';
import min from 'ml-array-min';
import max from 'ml-array-max';

import filterData from './filterData';

export default function filterOneSelector(data, prop, kind, filters) {
    switch (kind) {
        case 'value':
            return filterValue(data, prop, filters);
        case 'multiple':
            return filterMultiple(data, prop, filters);
        case 'range':
            return filterRange(data, prop, filters);
        default:
            throw new Error(`invalid filter kind: ${kind}`);
    }
}

function filterValue(data, prop, filters) {
    data = filterDataFor(data, prop, filters);
    return makeArray(countBy(data, prop));
}

function filterMultiple(data, prop, filters) {
    data = filterDataFor(data, prop, filters);
    return makeArray(countMultiple(data, prop));
}

function filterRange(data, prop, filters) {
    data = filterDataFor(data, prop, filters);
    if (data.length === 0) {
        return {
            min: 0,
            max: 1
        };
    }
    data = data.map((item) => item[prop]);
    return {
        min: min(data),
        max: max(data)
    };
}

function filterDataFor(data, prop, filters) {
    if (!filters) return data;
    filters = filters.filter((item, key) => {
        return key !== prop;
    });
    if (filters.size > 0) {
        data = filterData(data, filters);
    }
    return data;
}

function makeArray(map) {
    const result = [];
    for (const value in map) {
        if (value !== 'null' && value !== 'undefined') {
            result.push({
                value,
                count: map[value]
            });
        }
    }
    result.sort((a, b) => b.count - a.count);
    return result;
}

function countMultiple(data, prop) {
    const counts = {};
    for (const item of data) {
        const value = item[prop];
        for (const str of value) {
            if (counts[str] === undefined) {
                counts[str] = 1;
            } else {
                counts[str]++;
            }
        }
    }
    return counts;
}