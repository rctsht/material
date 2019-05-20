// @flow strict-local
import * as React from 'react';
import {Platform, StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Touchable} from '../touchable';

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
});

type Props = {
  allowOverflow: boolean,
  containerStyle: ViewStyleProp,
  icon: React.Node,
  onPress: ?(PressEvent) => void,
  onPressIn: ?(PressEvent) => void,
  onPressOut: ?(PressEvent) => void,
  onLongPress: ?(PressEvent) => void,
  rctshtTheme: ThemeProps,
  useForeground: boolean,
};

class CircleButton extends React.PureComponent<Props> {
  static defaultProps = {
    allowOverflow: false,
    containerStyle: null,
    icon: null,
    useForeground: false,
  };

  render() {
    const {
      allowOverflow,
      icon,
      onPress,
      rctshtTheme,
      containerStyle,
      useForeground: maybeUseForeground,
      onPressIn,
      onPressOut,
      onLongPress,
      ...rest
    } = this.props;

    const background = Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackgroundBorderless() : null;

    const useForeground =
      Platform.OS === 'android' && TouchableNativeFeedback.canUseNativeForeground() ? maybeUseForeground : false;

    return (
      <View
        style={[
          styles.container,
          allowOverflow ? null : styles.overflowHidden,
          ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]),
        ]}
      >
        <Touchable
          background={background}
          style={[
            styles.container,
            allowOverflow ? null : styles.overflowHidden,
            ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]),
          ]}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onLongPress={onLongPress}
          useForeground={useForeground}
        >
          {/* $FlowFixMe */}
          {icon || <Icon size={24} color={rctshtTheme.colors.primary} {...rest} />}
        </Touchable>
      </View>
    );
  }
}

export default withTheme(CircleButton);
