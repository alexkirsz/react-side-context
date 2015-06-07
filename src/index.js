import React, { PropTypes } from 'react';
import uuid from 'node-uuid';

import Context from './Context';

export default function createContext(contextName) {
  const contextKey = uuid.v4();

  const contextTypes = {
    [contextKey]: PropTypes.instanceOf(Context),
  };

  const topContext = {
    subscribe(key) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `\`subscribe\` for \`${key}\` of \`${contextName}\` bubbled to the top`
        );
      }
    },

    getValue(key) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `\`getValue\` for \`${key}\` of \`${contextName}\` bubbled to the top`
        );
      }
    },
  };

  function broadcasts(keys) {
    return function(Composed) {
      return class BroadcasterWrapper {
        static contextTypes = contextTypes;
        static childContextTypes = contextTypes;

        constructor(props, context) {
          this.props = props;
          this._context = new Context(keys, context[contextKey] || topContext);
          this._broadcast = this._context.broadcast.bind(this._context);
        }

        getChildContext() {
          return { [contextKey]: this._context };
        }

        render() {
          return <Composed {...this.props} broadcast={this._broadcast} />;
        }
      };
    }
  }

  function observes(keys) {
    return function(Composed) {
      return class ObserverWrapper extends React.Component {
        static contextTypes = contextTypes;

        constructor(props, context) {
          super(props, context);
          let contextValues = {};
          let broadcaster = this.context[contextKey];
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

  return { broadcasts, observes };
}
