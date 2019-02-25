// @flow strict-local
import * as React from 'react';

import {getNavigation} from './navigation';

const EventNameToPropName = {
  willFocus: 'onWillFocus',
  didFocus: 'onDidFocus',
  willBlur: 'onWillBlur',
  didBlur: 'onDidBlur',
};

const EventNames = Object.keys(EventNameToPropName);

type Props = {
  onWillFocus?: Function,
  onDidFocus?: Function,
  onWillBlur?: Function,
  onDidBlur?: Function,
};

class NavigationEvents extends React.PureComponent<Props> {
  static defaultProps = {
    onWillFocus: null,
    onDidFocus: null,
    onWillBlur: null,
    onDidBlur: null,
  };

  subscriptions = {};

  componentDidMount() {
    EventNames.forEach(this.addListener);
  }

  componentDidUpdate(prevProps: Props) {
    EventNames.forEach(eventName => {
      const {[EventNameToPropName[eventName]]: prevProp} = prevProps;
      const {[EventNameToPropName[eventName]]: prop} = this.props;
      const listenerHasChanged = prop !== prevProp;
      if (listenerHasChanged) {
        this.removeListener(eventName);
        this.addListener(eventName);
      }
    });
  }

  componentWillUnmount() {
    EventNames.forEach(this.removeListener);
  }

  addListener = (eventName: string) => {
    const {[EventNameToPropName[eventName]]: listener} = this.props;
    const navigation = getNavigation();
    if (listener) {
      this.subscriptions[eventName] = navigation.addListener(eventName, listener);
    }
  };

  removeListener = (eventName: string) => {
    if (this.subscriptions[eventName]) {
      this.subscriptions[eventName].remove();
      this.subscriptions[eventName] = undefined;
    }
  };

  render() {
    return null;
  }
}

export default NavigationEvents;
