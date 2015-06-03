import React from 'react';
import { broadcasts, subscribeTo } from '../src';

@broadcasts(['lang'])
class LangBroadcaster extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'en',
    };

    // Replaces initial `getChildContext`
    this.props.broadcast(this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    // Replaces subsequent `getChildContext`
    this.props.broadcast(nextState);
  }

  render() {
    return (
      <SwitchLanguage onSwitch={lang => this.setState({ lang })} />
    );
  }
}

@subscribeTo(['lang'])
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
