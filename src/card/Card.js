// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import {ShadowUtil} from '../util';

const styles = StyleSheet.create({
  container: {
    ...ShadowUtil.getStylesForElevation(1),
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  containerNoElevation: {
    ...ShadowUtil.getStylesForElevation(0),
  },
});

type Props = {
  elevation?: boolean,
  children: React.Node,
  style: ViewStyleProp,
};

class Card extends React.PureComponent<Props> {
  static defaultProps = {
    elevation: true,
  };

  render() {
    const {elevation, children, style} = this.props;

    return (
      <View
        style={[
          styles.container,
          elevation ? null : styles.containerNoElevation,
          ...(Array.isArray(style) ? style : [style]),
        ]}
      >
        {children}
      </View>
    );
  }
}

export default Card;
