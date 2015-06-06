import React, { PropTypes } from 'react';

import Broadcaster from './Broadcaster';

const broadcasterKey = '__broadcaster';

const broadcasterTypes = {
  [broadcasterKey]: PropTypes.instanceOf(Broadcaster),
};

export function broadcasts(keys) {
  return function(Composed) {
    return class BroadcasterWrapper {
      static contextTypes = broadcasterTypes;
      static childContextTypes = broadcasterTypes;

      constructor(props, context) {
        this.props = props;
        this._broadcaster = new Broadcaster(keys, context[broadcasterKey]);
        this._broadcast = this._broadcaster.broadcast.bind(this._broadcaster);
      }

      getChildContext() {
        return { [broadcasterKey]: this._broadcaster };
      }

      render() {
        return <Composed {...this.props} broadcast={this._broadcast} />;
      }
    };
  }
}

export function observes(keys) {
  return function(Composed) {
    return class ObserverWrapper extends React.Component {
      static contextTypes = broadcasterTypes;

      constructor(props, context) {
        super(props, context);
        let contextValues = {};
        let broadcaster = this.context[broadcasterKey];
        this._unsubscribeHandles = keys.map(key => {
          contextValues[key] = broadcaster.getValue(key);
          return broadcaster.subscribe(key, newValue => {
            this.setState({ [key]: newValue });
          });
        });
        this.state = contextValues;
      }

      componentWillUnmount() {
        this._unsubscribeHandles.forEach(handle => handle());
      }

      render() {
        return <Composed {...this.props} {...this.state} />;
      }
    }
  }
}
