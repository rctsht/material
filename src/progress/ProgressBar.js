// @flow
import React, {PureComponent} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import color from 'tinycolor2';

import {type ThemeProps, withTheme} from '../theme';

const styles = StyleSheet.create({
  container: {
    height: 4,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  background: {
    height: 4,
  },
  progress: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

type Props = {
  rctshtTheme: ThemeProps,
};

class ProgressBar extends PureComponent<Props> {
  animation = new Animated.Value(0);

  animation2 = new Animated.Value(0);

  componentDidMount() {
    const {rctshtTheme} = this.props;
    Animated.loop(
      Animated.parallel([
        Animated.timing(this.animation, {
          toValue: 1,
          easing: rctshtTheme.animations.decelerateEasing,
          duration: 1750,
          delay: 250,
        }),
        Animated.timing(this.animation2, {
          toValue: 1,
          easing: rctshtTheme.animations.accelerateEasing,
          duration: 2000,
        }),
      ]),
    ).start();
  }

  render() {
    const {rctshtTheme, style} = this.props;

    const backgroundColor = color(rctshtTheme.colors.secondary);
    backgroundColor.setAlpha(0.4);

    return (
      <View {...this.props} style={[styles.container, style]}>
        <View style={[styles.background, {backgroundColor: backgroundColor.toHex8String()}]}>
          <Animated.View
            style={[
              styles.progress,
              {
                backgroundColor: rctshtTheme.colors.secondary,
                left: this.animation2.interpolate({
                  inputRange: [0, 0.15, 0.85, 1],
                  outputRange: ['0%', '0%', '100%', '100%'],
                }),
                right: this.animation.interpolate({
                  inputRange: [0, 0.95, 1],
                  outputRange: ['100%', '0%', '0%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    );
  }
}

export default withTheme(ProgressBar);
