// @flow strict-local
import {find} from 'lodash-es';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {getCurrentNavigationKey} from '../navigation';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

type Props = {};

type State = {
  // $FlowFixMe
  contents: Array<{Component: React.ComponentType<any>, props: {}}>,
};

class SheetOverlay extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      contents: [],
    };
  }

  addOrUpdateSheet = (options: {} = {}) => {
    // $FlowFixMe
    const {type, Component, props = {}, overlayId, navigationKey} = options;
    this.setState(currentState => ({
      contents: [
        // $FlowFixMe
        ...currentState.contents.filter(content => content.overlayId !== overlayId),
        {overlayId, navigationKey, type, Component, props},
      ],
    }));
  };

  removeSheet = (overlayId: string) => {
    this.setState(currentState => ({
      // $FlowFixMe
      contents: currentState.contents.filter(content => content.overlayId !== overlayId),
    }));
  };

  render() {
    const {contents} = this.state;

    const currentNavigationKey = getCurrentNavigationKey() || 'RCTSHT_UNKNOWN_NAVIGATION_KEY';

    // $FlowFixMe
    const activeContent = find(contents, content => content.navigationKey === currentNavigationKey);
    // $FlowFixMe
    const globalContent = find(contents, content => content.navigationKey === 'GLOBAL');
    const {Component, props} = activeContent || globalContent || contents[0] || {}; // XXX remove contents[0]

    return (
      <View style={styles.container} pointerEvents="box-none">
        {Component ? (
          <Component
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        ) : null}
      </View>
    );
  }
}

export default SheetOverlay;
