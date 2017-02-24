import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import * as PubSub from 'pubsub-js';
import * as cx from 'classnames';
import * as _ from 'lodash';
let style = require('./index.scss');


interface TipsItemData {
  id:number;
  type:string;
  content:string;
}
type TipsList = Array<TipsItemData>;
interface TipsState {
  tips_list:TipsList;
  show: Boolean;
}
let timer:any;

export default class Tips extends React.Component<any, Partial<TipsState>> {
  private tips_pubsub:Function;
  constructor(props:any, context:any) {
    super(props, context);
    this.state = {
      tips_list: [],
      show: false,
    };
  }
  componentDidMount() {
    let id = 0;
    this.tips_pubsub = PubSub.subscribe('showTips', (type:string, msg:TipsItemData) => {
      msg.id = id++;
      this.state.tips_list.unshift(msg);
      this.setState({tips_list: this.state.tips_list, show: true});
    });
  }
  componentWillUnMount() {
    PubSub.unsubscribe(this.tips_pubsub);
  }
  remove_tips_item(id:number) {
    _.remove(this.state.tips_list, (item) => {
      return item.id === id;
    });
    this.setState({tips_list: this.state.tips_list});
    if (this.state.tips_list.length === 0) {
      this.setState({show: false});
    }
  }
  render() {
    return (
      <div className={cx(style.tips_wrap, {[style.show]: this.state.show === true})}>
        {
          this.state.tips_list.map((item, key) => {
            return (
              <TipsItem
                key={item.id}
                data={item}
                remove_item={this.remove_tips_item.bind(this)}
              />
            );
          })
        }
      </div>
    );
  }
}

class TipsItem extends React.Component<{
  data:TipsItemData,
  remove_item:Function,
}, any> {
  componentDidMount() {
    setTimeout(() => {
      this.props.remove_item(this.props.data.id);
    }, 3000);
  }
  render() {
    return (
      <div className={cx(style.tips_item)}>
        <i className={cx(
          style.tips_icon,
          {[style.error]: this.props.data.type === 'error'},
          {[style.success]: this.props.data.type === 'success'},
        )}></i>
        <span className={style.tips_content}>{this.props.data.content}</span>
      </div>
    );
  }
}