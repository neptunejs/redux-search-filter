import {Component, createElement} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {
    updateFilter,
    setOperator,
    setNegated
} from './actions';
import filterOneSelector from './filterOneSelector';
import * as kinds from './constants/kinds';

const specialProps = new Set([
    'component',
    'data',
    'filterUpdate',
    'filters'
]);

class ConnectedFilter extends Component {
    constructor(props) {
        super(props);
        this.setupSelector();
    }

    setupSelector() {
        const data = (props) => props.data;
        const name = (props) => props.name;
        const prop = (props) => props.prop;
        const kind = (props) => props.kind;
        const filters = (props) => props.filters;
        this.selector = createSelector(
            data,
            name,
            prop,
            kind,
            filters,
            filterOneSelector
        );
    }

    render() {
        const currentFilter = this.props.filters ? this.props.filters.get(this.props.name) : null;
        const newProps = {
            onChange: this.props.filterUpdate
        };

        for (var propName in this.props) {
            if (!specialProps.has(propName)) {
                newProps[propName] = this.props[propName];
            }
        }

        if (this.props.kind === kinds.range) {
            newProps.range = this.selector(this.props);
            newProps.value = currentFilter ? currentFilter : newProps.range;
        } else {
            newProps.options = this.selector(this.props);
            newProps.filter = currentFilter;
        }
        return createElement(this.props.component, newProps);
    }
}

export default connect(
    (state, props) => {
        const searchFilterName = props.searchFilter.name;
        return {
            data: props.searchFilter.getData(state),
            filters: state.searchFilter.get(searchFilterName)
        };
    },
    (dispatch, props) => {
        const name = props.searchFilter.name;
        return {
            filterUpdate: (value) => dispatch(updateFilter(name, props.name, props.prop, props.kind, value)),
            setOperator: (value) => dispatch(setOperator(name, props.name, props.prop, props.kind, value)),
            setNegated: (value) => dispatch(setNegated(name, props.name, props.prop, props.kind, value))
        };
    }
)(ConnectedFilter);
