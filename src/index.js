import React, { PropTypes } from 'react';

import ContextTree from './ContextTree';

const treeKey = '__contextTree';

const contextTreeTypes = {
  [treeKey]: PropTypes.instanceOf(ContextTree),
};

export function broadcasts(contract) {
  return function(Broadcaster) {
    return class BroadcasterWrapper extends React.Component {
      static contextTypes = contextTreeTypes;
      static childContextTypes = contextTreeTypes;

      constructor(props, context) {
        super(props, context);
        this._contract = contract;
        this._contextTree = new ContextTree(contract, this.context[treeKey]);
        this._broadcast = this._contextTree.broadcast.bind(this._contextTree);
      }

      getChildContext() {
        return {
          [treeKey]: this._contextTree,
        };
      }

      render() {
        return (
          <Broadcaster
            {...this.props}
            broadcast={this._broadcast}
          />
        );
      }
    };
  }
}

export function subscribeTo(contract) {
  return function(Subscriber) {
    return class SubscriberWrapper extends React.Component {
      static contextTypes = contextTreeTypes;

      constructor(props, context) {
        super(props, context);
        let state = {};
        let unsubscribeHandles = [];
        let contextTree = this.context[treeKey];
        contract.forEach(key => {
          state[key] = contextTree.getValue(key);
          unsubscribeHandles.push(contextTree.subscribe(key, newValue => {
            this.setState({
              [key]: newValue,
            });
          }));
        });
        this._unsubscribeHandles = unsubscribeHandles;
        this.state = state;
      }

      componentWillUnmount() {
        this._unsubscribeHandles.forEach(handle => handle());
      }

      render() {
        return <Subscriber {...this.props} {...this.state} />;
      }
    }
  }
}
