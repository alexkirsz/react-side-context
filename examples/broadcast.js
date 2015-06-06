import React from 'react';
import createContext from '../src';

const { broadcasts, observes } = createContext('app');

@broadcasts(['language', 'name'])
class Broadcaster extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      language: 'en',
      name: 'World',
    };

    // Replaces initial `getChildContext`
    this.broadcast(props, this.state);

    setTimeout(() => this.setState({ language: 'fr' }), 1000);
    setTimeout(() => this.setState({ name: 'React' }), 2000);
  }

  componentWillUpdate(nextProps, nextState) {
    // Replaces subsequent `getChildContext`
    this.broadcast(nextProps, nextState);
  }

  broadcast(props, state) {
    props.broadcast(state);
  }

  render() {
    console.log('Broadcaster rendered');
    return (
      <Blocker>
        <Subscriber />
      </Blocker>
    );
  }

}

class Blocker {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    console.log('Blocker rendered');
    return React.Children.only(this.props.children);
  }

}

@observes(['language', 'name'])
class Subscriber {

  render() {
    console.log('Subscriber rendered');
    return (
      <ul>
        <li>Language: {this.props.language}</li>
        <li>Name: {this.props.name}</li>
      </ul>
    );
  }

}

React.render(<Broadcaster />, document.body);
