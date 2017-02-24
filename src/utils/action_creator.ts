import * as _ from 'lodash';
export interface Action<T> {
  readonly type:string;
  readonly payload:T;
  error?:boolean;
  meta?:any;
}

export interface ActionCreator<T> {
  readonly type:string;
  (payload:T):Action<T>;
}

export const ACTION_CREATOR = <T>(type:string):ActionCreator<T> =>
  _.assign((payload:T):any => ({type, payload}), {type});

export const ACTION_API_CREATOR = <RequestType, SuccessType, ErrorType>( type:string ) => {
  return {
    request: ACTION_CREATOR<RequestType>(type + '_REQUEST'),
    success: ACTION_CREATOR<SuccessType>(type + '_SUCCESS'),
    error: ACTION_CREATOR<ErrorType>(type + '_ERROR'),
    callback: (res) => {},
  };
};

export const IS_TYPE = <T>(action:Action<any>, action_creator:ActionCreator<T>):
  action is Action<T> => action.type === action_creator.type;

export function update_state<StateType>(old_value:StateType, new_value:Partial<StateType>):StateType {
  return _.assign({}, old_value, new_value);
}