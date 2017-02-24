import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Store} from 'redux';
import {Provider} from 'react-redux';
import * as _ from 'lodash';
import { IntlProvider } from 'react-intl';
import * as I18nTools from 'src/utils/i18n';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, browserHistory } from 'react-router';
import create_store from 'src/redux/store';
import { routes } from './routes/index';

let root_element = document.getElementById('root');
let store = create_store();
let history = syncHistoryWithStore(browserHistory, store);
let rootRoute = _.assign({}, routes);

let render_dom = () => {
  console.log(config);
  if (config.both.offline) {
    let runtime = require('offline-plugin/runtime');
    runtime.install({
      onUpdating: ():any => undefined,
      onUpdateReady: () => runtime.applyUpdate(),
      onUpdated: () => window.location.reload(),
      onUpdateFailed: ():any => undefined,
    });
    runtime.applyUpdate();
  }
  I18nTools.add_local_data();
  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider locale={ I18nTools.language  } messages={ I18nTools.getLocal() }>
      <Router history={history} routes={rootRoute} />
      </IntlProvider>
    </Provider>,
    root_element,
  );
};

if (!(window as any).Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/zh.js',
  ], (require:any) => {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/zh.js');
    render_dom();
  });
} else {
  render_dom();
}
