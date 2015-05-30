import React from 'react';
import { broadcasts, subscribeTo } from '../src';

const languageKey = '__language';
const nameKey = '__name';

@broadcasts([languageKey, nameKey])
class Broadcaster extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      [languageKey]: 'en',
      [nameKey]: 'World',
    };

    // Replaces initial `getChildContext`
    this.broadcast(props, this.state);

    setTimeout(() => this.setState({ [languageKey]: 'fr' }), 1000);
    setTimeout(() => this.setState({ [nameKey]: 'React' }), 2000);
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

@broadcasts([languageKey])
class Overwrite extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.props.broadcast({
      [languageKey]: 'de',
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <Subscriber />;
  }

}

@subscribeTo([languageKey, nameKey])
class Subscriber extends React.Component {

  render() {
    return (
      <ul>
        <li>Language: {this.props[languageKey]}</li>
        <li>Name: {this.props[nameKey]}</li>
      </ul>
    );
  }

}

React.render(<Broadcaster />, document.getElementById('container'));
