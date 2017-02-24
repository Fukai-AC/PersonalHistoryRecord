import * as React from 'react';
import {connect} from 'react-redux';
import {intlShape, injectIntl} from 'react-intl';

import Index from './components';

// container
const map_state_to_props = (state:any) => {
  return {
    account_nav: state.account_nav_store,
  };
};

const IndexContainer = connect(
  map_state_to_props,
)(Index as any);

export default IndexContainer;