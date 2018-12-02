// @flow
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    elevation: 1,
    borderRadius: 4,
  },
  containerNoElevation: {
    elevation: 0,
  },
});

type Props = {
  elevation?: boolean,
  children: React.Node,
};

class Card extends React.PureComponent<Props> {
  static defaultProps = {
    elevation: true,
  };

  render() {
    const {elevation, children} = this.props;
    return <View style={[styles.container, elevation ? null : styles.containerNoElevation]}>{children}</View>;
  }
}

export default Card;
