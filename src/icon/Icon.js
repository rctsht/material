// @flow
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

type Props = {
  halfWidth?: boolean,
  name?: string,
  size?: number,
  style?: TextStyle,
};

class Icon extends React.PureComponent<Props> {
  static defaultProps = {
    halfWidth: false,
    name: null,
    size: 24,
    style: null,
  };

  render() {
    const {halfWidth, size: theSize, style} = this.props;

    // Stop flow complaining
    const size = parseInt(theSize, 10);

    return (
      <View style={[styles.container, {width: halfWidth ? size / 2 : size, height: size}]}>
        <MaterialIcon
          {...this.props}
          style={[...(Array.isArray(style) ? style : [style]), halfWidth ? {marginLeft: -size / 4} : null]}
        />
      </View>
    );
  }
}

export default Icon;
