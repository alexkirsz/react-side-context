import React from 'react';
import shallowEqual from 'react/lib/shallowEqual'
import { broadcasts, masks, observes } from '../src';

const linkKey = '__link';

@broadcasts([linkKey])
class Broadcaster extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      [linkKey]: true,
    };

    // Replaces initial `getChildContext`
    this.broadcast(props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    // Replaces subsequent `getChildContext`
    this.broadcast(nextProps, nextState);
  }

  broadcast(props, state) {
    props.broadcast(state);
  }

  render() {
    return (
      <Subscriber />
    );
  }

}

@observes([linkKey])
@broadcasts([linkKey]) // Mask `linkKey` to children
class Subscriber {

  render() {
    return (
      <ul>
        <li>Received link: {String(!!this.props[linkKey])}</li>

        {this.props[linkKey] && <Subscriber />}
      </ul>
    );
  }

}

React.render(<Broadcaster />, document.body);
