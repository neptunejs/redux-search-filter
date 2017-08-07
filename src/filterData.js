import {AND} from './constants/operators';

export default function filterData(data, filters) {
    return data.filter((item) => {
        main: for (const [filterProp, filterOptions] of filters) {
            const filterValue = filterOptions.value;
            let operator = filterOptions.operator;
            let negated = filterOptions.negated;
            const itemValue = item[filterProp];
            if (filterOptions.value) {
                if (filterOptions.value.length) {
                    if (Array.isArray(itemValue)) { // kind: multiple
                        operator = operator || AND;
                        if (operator === AND) {
                            for (const val of filterValue) {
                                if (!itemValue.includes(val)) {
                                    if (!negated) {
                                        return false;
                                    }
                                } else {
                                    if (negated) {
                                        return false;
                                    }
                                }
                            }
                        } else {
                            for (const value of filterValue) {
                                if (itemValue.includes(value)) {
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
                        if (Array.isArray(filterValue)) { // kind: value
                            operator = operator || 'OR';
                            const isIncluded = filterValue.includes(item[filterProp]);
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
                }
            } else { // kind: range
                if (item[filterProp] < filterOptions.min || item[filterProp] > filterOptions.max) {
                    return false;
                }
            }
        }
        return true;
    });
}
