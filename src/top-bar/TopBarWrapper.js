// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {ShadowUtil} from '../util';

const styles = StyleSheet.create({
  container: {
    ...ShadowUtil.getStylesForElevation(4),
    backgroundColor: '#ffffff',
  },
  noElevation: {
    ...ShadowUtil.getStylesForElevation(0),
  },
});

type Props = {
  children: React.Node,
  elevation: boolean,
};

// eslint-disable-next-line react/prefer-stateless-function
class TopBarWrapper extends React.Component<Props> {
  static defaultProps = {
    elevation: true,
  };

  render() {
    const {children, elevation} = this.props;
    return <View style={[styles.container, elevation === false ? styles.noElevation : null]}>{children}</View>;
  }
}

export default TopBarWrapper;
