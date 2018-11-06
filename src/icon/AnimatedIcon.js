// @flow
import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {type TextStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import {type ThemeProps} from '../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noShadow: {
    textShadowRadius: 0,
  },
});

type Props = {
  halfWidth?: boolean,
  name?: string,
  size?: number,
  style: TextStyleProp,
  rctshtTheme: ThemeProps,
};

type State = {
  oldProps: ?Props,
};

class Icon extends React.PureComponent<Props, State> {
  static defaultProps = {
    halfWidth: false,
    name: null,
    size: 24,
    style: null,
  };

  state = {
    oldProps: null,
  };

  rotation = new Animated.Value(0);

  oldRotation = new Animated.Value(0);

  opacity = new Animated.Value(1);

  oldOpacity = new Animated.Value(1);

  componentWillReceiveProps(nextProps: Props) {
    const {rctshtTheme} = nextProps;

    this.rotation.setValue(-1);
    this.opacity.setValue(0);

    this.oldRotation.setValue(0);
    this.oldOpacity.setValue(1);

    this.setState(
      {
        oldProps: this.props,
      },
      () => {
        Animated.parallel([
          Animated.timing(this.rotation, {
            toValue: 0,
            easing: rctshtTheme.animations.standardEasing,
            duration: rctshtTheme.animations.control.selection,
            useNativeDriver: true,
          }),
          Animated.timing(this.oldRotation, {
            toValue: 1,
            easing: rctshtTheme.animations.standardEasing,
            duration: rctshtTheme.animations.control.selection,
            useNativeDriver: true,
          }),
          Animated.timing(this.opacity, {
            toValue: 1,
            easing: rctshtTheme.animations.standardEasing,
            duration: rctshtTheme.animations.control.selection,
            useNativeDriver: true,
          }),
          Animated.timing(this.oldOpacity, {
            toValue: 0,
            easing: rctshtTheme.animations.standardEasing,
            duration: rctshtTheme.animations.control.selection,
            useNativeDriver: true,
          }),
        ]).start(() => {
          this.setState({
            oldProps: null,
          });
        });
      },
    );
  }

  render() {
    const {halfWidth, size: theSize, style} = this.props;
    const {oldProps} = this.state;
    const {size: theOldSize} = oldProps || {};

    // Stop flow complaining
    const size = parseInt(theSize, 10);
    const oldSize = parseInt(theOldSize, 10);

    return (
      <View style={[styles.container, {width: halfWidth ? size / 2 : size, height: size}]}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: this.opacity,
            transform: [
              {
                rotate: this.rotation.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ['-45deg', '0deg', '45deg'],
                }),
              },
            ],
          }}
        >
          <MaterialIcon {...this.props} style={[styles.noShadow, style, halfWidth ? {marginLeft: -size / 4} : null]} />
        </Animated.View>
        {oldProps ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: this.oldOpacity,
              transform: [
                {
                  rotate: this.oldRotation.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['-45deg', '0deg', '45deg'],
                  }),
                },
              ],
            }}
          >
            <MaterialIcon
              {...oldProps}
              style={[styles.noShadow, oldProps.style, oldProps.halfWidth ? {marginLeft: -oldSize / 4} : null]}
            />
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

export default Icon;
