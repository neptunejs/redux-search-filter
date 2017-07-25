export default class SearchFilter {
    constructor(options) {
        if (typeof options.name !== 'string') {
            throw new TypeError('filter name must be a string');
        }
        if (typeof options.getData !== 'function') {
            throw new TypeError('getData must be a function');
        }
        this.name = options.name;
        this.getData = options.getData;
    }
}
