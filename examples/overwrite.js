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
    return (
      <Overwrite />
    );
  }

}

@broadcasts(['language'])
class Overwrite extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.props.broadcast({
      language: 'de',
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <Subscriber />;
  }

}

@observes(['language', 'name'])
class Subscriber extends React.Component {

  render() {
    return (
      <ul>
        <li>Language: {this.props.language}</li>
        <li>Name: {this.props.name}</li>
      </ul>
    );
  }

}

React.render(<Broadcaster />, document.body);
