// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {TextStyleProp, ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  noShadow: {
    textShadowRadius: 0,
  },
});

type Props = {
  containerStyle: ?ViewStyleProp,
  halfWidth: boolean,
  inline: boolean,
  name: ?string,
  size: number,
  style: ?TextStyleProp,
  color: ?string,
};

class Icon extends React.PureComponent<Props> {
  static defaultProps = {
    containerStyle: null,
    halfWidth: false,
    inline: false,
    name: null,
    size: 24,
    style: null,
    color: undefined,
  };

  render() {
    const {containerStyle, halfWidth, inline, size: theSize, style} = this.props;

    // Stop flow complaining
    const size = parseInt(theSize, 10);

    const icon = (
      <MaterialIcon
        {...this.props}
        style={[
          styles.noShadow,
          {lineHeight: size},
          halfWidth ? {marginLeft: -size / 4} : null,
          ...(Array.isArray(style) ? style : [style]),
        ]}
      />
    );

    if (inline) {
      return icon;
    }

    let theContainerStyle = [];

    if (containerStyle != null) {
      theContainerStyle = Array.isArray(containerStyle) ? containerStyle : [containerStyle];
    }

    return (
      <View style={[styles.container, {width: halfWidth ? size / 2 : size, height: size}, ...theContainerStyle]}>
        {icon}
      </View>
    );
  }
}

export default Icon;
