import { createElement, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SearchFilter from './SearchFilter';
import { reset } from './actions';

export default function searchFilter(options) {
  const searchFilterInstance = new SearchFilter(options);

  return function (UserComponent) {
    class SearchFilterComponent extends Component {
      render() {
        const props = Object.assign({}, this.props);
        return createElement(UserComponent, props);
      }

      getChildContext() {
        return {
          searchFilter: searchFilterInstance
        };
      }
    }

    SearchFilterComponent.childContextTypes = {
      searchFilter: PropTypes.object
    };

    const connector = connect(
      (state) => {
        return {
          data: searchFilterInstance.getData(state)
        };
      },
      {
        reset: () => reset(searchFilterInstance.name)
      }
    );

    return connector(SearchFilterComponent);
  };
}
