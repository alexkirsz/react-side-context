import React from 'react';
import createContext from '../src';

const { observes, WithContext } = createContext('app');

class LangBroadcaster extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'en',
    };
  }

  render() {
    return (
      <WithContext context={this.state}>
        {() => <SwitchLanguage onSwitch={lang => this.setState({ lang })} />}
      </WithContext>
    );
  }
}

@observes(['lang'])
class SwitchLanguage {
  render() {
    let { lang } = this.props;
    let labels = {
      en: 'Switch language',
      fr: 'Changer de langue',
    };
    return (
      <button
        onClick={() => this.props.onSwitch(lang === 'en' ? 'fr' : 'en')}
      >
        {labels[lang]}
      </button>
    );
  }
}

React.render(<LangBroadcaster />, document.body);
