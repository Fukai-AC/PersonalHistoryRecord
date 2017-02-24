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

class Index extends React.Component<{intl?:InjectedIntl}, any> {
  constructor(props:any, context:any) {
    super(props, context);
    resolve_intl(this.props.intl);
  }
  render() {
    let intruduction = '首页内容';
    return (
      <div id="root-wrapper">
        <h1>React + Redux + React-Router + TypeScript</h1>
        <Tips />
        {this.props.children ? this.props.children : intruduction}
      </div>
    );
  }
}

export default injectIntl(Index);