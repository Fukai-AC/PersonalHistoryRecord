import root_reducer from './reducer';
import {createStore, applyMiddleware, Middleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

let saga_middleware = createSagaMiddleware();
let create_store =  (initial_state = {}) => {
  let middlewares:Middleware[] = [
    saga_middleware,
  ].filter(Boolean);

  let create_store_with_midddleware = applyMiddleware(
    ...middlewares,
  )(createStore);

  const store = create_store_with_midddleware(
    root_reducer,
    DEBUG && (<any>window).__REDUX_DEVTOOLS_EXTENSION__
      && (<any>window).__REDUX_DEVTOOLS_EXTENSION__(),
  );
  return store;
};

export let saga_run = saga_middleware.run;
export default create_store;