// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    backgroundColor: '#ffffff',
  },
});

type Props = {
  children: React.Node,
};

// eslint-disable-next-line react/prefer-stateless-function
class TopBarWrapper extends React.Component<Props> {
  render() {
    const {children} = this.props;
    return <View style={styles.container}>{children}</View>;
  }
}

export default TopBarWrapper;
