export default function filterData(data, filters) {
    return data.filter((item) => {
        main: for (const [filterProp, filterOptions] of filters) {
            const filterValue = filterOptions.value;
            const operator = filterOptions.operator;
            const negated = filterOptions.negated;
            const itemValue = item[filterProp];
            if (filterOptions.value.length) {
                if (Array.isArray(itemValue)) { // kind: multiple
                    if (operator === 'AND') {
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
                        const isIncluded = filterValue.includes(item[filterProp]);
                        if (operator === 'AND') {
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
                                if (isIncluded) {
                                    return false;
                                }
                            } else {
                                if (!isIncluded) {
                                    return false;
                                }
                            }
                        }
                    } else { // kind: range
                        if (item[filterProp] < filterValue.min || item[filterProp] > filterValue.max) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    });
}
