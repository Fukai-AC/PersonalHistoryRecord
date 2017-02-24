import Index from './index/index';
import { daily_life } from './daily_life/route';

export let routes = {
  childRoutes: [{
    path: '/',
    component: Index,
    childRoutes:[
      daily_life,
    ],
  }],
};