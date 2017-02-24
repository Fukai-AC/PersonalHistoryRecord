import * as React from 'react';
import {connect} from 'react-redux';
import {intlShape, injectIntl} from 'react-intl';

import DailyLife from './components';

// container
const map_state_to_props = (state:any) => {
  return {
    account_nav: state.account_nav_store,
  };
};

const DailyLifeContainer = connect(
  map_state_to_props,
)(DailyLife as any);

export default DailyLifeContainer;