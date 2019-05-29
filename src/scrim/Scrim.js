// @flow strict-local
import * as React from 'react';
import {Animated, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {type ThemeProps, withTheme} from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrim: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

type Props = {
  animated: boolean,
  elevation: number,
  isVisible: boolean,
  rctshtTheme: ThemeProps,
  opacity: number,
  onPress: ?() => void,
};

type DefaultProps = {
  animated: boolean,
  elevation: number,
  isVisible: boolean,
  opacity: number,
  onPress: ?() => void,
};

type State = {
  isVisible: boolean,
};

class Scrim extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    animated: true,
    elevation: 0,
    isVisible: false,
    opacity: 1,
    onPress: null,
  };

  animation: Animated.Value;

  constructor(props: Props) {
    super(props);

    const {isVisible} = props;

    this.animation = new Animated.Value(isVisible ? 1 : 0);
    this.state = {
      isVisible,
    };
  }

  // @TODO remove this or use if opacity prop is undefined
  componentDidUpdate(prevProps: Props) {
    const {isVisible: prevIsVisible} = prevProps;
    const {isVisible, rctshtTheme} = this.props;

    if (prevIsVisible && !isVisible) {
      this.animation.setValue(1);
      Animated.timing(this.animation, {
        toValue: 0,
        duration: rctshtTheme.animations.dialog.out,
        easing: rctshtTheme.animations.accelerateEasing,
        useNativeDriver: true,
      }).start(() => {
        this.setState({
          isVisible: false,
        });
      });
    } else if (!prevIsVisible && isVisible) {
      this.animation.setValue(0);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          isVisible: true,
        },
        () => {
          Animated.timing(this.animation, {
            toValue: 1,
            duration: rctshtTheme.animations.dialog.in,
            easing: rctshtTheme.animations.decelerateEasing,
            useNativeDriver: true,
          }).start();
        },
      );
    }
  }

  render() {
    const {animated, elevation, opacity, onPress} = this.props;
    const {isVisible} = this.state;

    if (!isVisible) {
      return null;
    }

    const scrim = (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.scrim} />
      </TouchableWithoutFeedback>
    );

    return animated ? (
      <Animated.View style={[styles.container, {elevation, opacity}]}>{scrim}</Animated.View>
    ) : (
      <View style={[styles.container, {elevation}]}>{scrim}</View>
    );
  }
}

export default withTheme<React.Config<Props, DefaultProps>, Scrim>(Scrim);
