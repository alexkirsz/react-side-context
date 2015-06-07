import React from 'react';
import createContext from '../src';

const { broadcasts, observes } = createContext('app');

@broadcasts(['link'])
class Broadcaster extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      link: true,
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

@observes(['link'])
@broadcasts(['link']) // Mask link to children
class Subscriber {

  render() {
    return (
      <ul>
        <li>Received link: {String(!!this.props.link)}</li>

        {this.props.link && <Subscriber />}
      </ul>
    );
  }

}

React.render(<Broadcaster />, document.body);
