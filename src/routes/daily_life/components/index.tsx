import * as React from 'react';
import Tips from 'src/components/tips';
let style = ('./index.scss');
import {
  FormattedMessage,
  InjectedIntl,
  injectIntl,
  defineMessages,
} from 'react-intl';
import { resolve_intl } from 'src/utils/i18n';

class DailyLife extends React.Component<{}, {}> {
  constructor(props:any, context:any) {
    super(props, context);
  }
  render() {
    return (
      <div id="root-wrapper">
        <h1>Daily Life</h1>
      </div>
    );
  }
}

export default DailyLife;