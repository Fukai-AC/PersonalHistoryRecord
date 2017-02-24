import * as ReactRouterRedux from 'react-router-redux';
import {combineReducers} from 'redux';

let root_reducer = combineReducers({
  routing: ReactRouterRedux.routerReducer,
});
export default root_reducer;