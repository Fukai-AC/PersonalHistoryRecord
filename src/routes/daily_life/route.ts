export let daily_life = {
  path: 'daily_life',
  getComponent(nextState:any, cb:any) {
    require.ensure([], function (require:any) {
      cb(null, require('./index').default);
    });
  },
};