import React from 'react';
import createContext from '../src';

const { WithContext, observes } = createContext('app');

class Broadcaster extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      language: 'en',
      name: 'World',
    };

    setTimeout(() => this.setState({ language: 'fr' }), 1000);
    setTimeout(() => this.setState({ name: 'React' }), 2000);
  }

  shouldBroadcast(context, nextContext) {
    return nextContext['name'] !== context['name'];
  }

  render() {
    console.log('Broadcaster rendered');
    return (
      <WithContext
        context={this.state}
        shouldBroadcast={(context, nextContext) => {
          return nextContext['name'] !== context['name'];
        }}
      >
        {() =>
          <Blocker>
            <Subscriber />
          </Blocker>
        }
      </WithContext>
    );
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

class Blocker {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    console.log('Blocker rendered');
    return React.Children.only(this.props.children);
  }

}

React.render(<Broadcaster />, document.body);
