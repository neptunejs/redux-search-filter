export default function filterData(data, filters) {
    return data.filter((item) => {
        main: for (const [filterProp, filterValue] of filters) {
            if (Array.isArray(item[filterProp])) {
                for (const value of item[filterProp]) {
                    if (filterValue.includes(value)) {
                        continue main;
                    }
                }
                return false;
            } else {
                if (Array.isArray(filterValue) && !filterValue.includes(item[filterProp])) {
                    return false;
                } else if (item[filterProp] < filterValue.min || item[filterProp] > filterValue.max) {
                    return false;
                }
            }
        }
        return true;
    });
}
