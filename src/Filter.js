import {Component, createElement} from 'react';
import PropTypes from 'prop-types';

import ConnectedFilter from './ConnectedFilter';

export default class Filter extends Component {
    render() {
        const props = Object.assign({}, this.props, {searchFilter: this.context.searchFilter});
        return createElement(ConnectedFilter, props);
    }
}

Filter.contextTypes = {
    searchFilter: PropTypes.object
};

Filter.propTypes = {
    prop: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired
};
