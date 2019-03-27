// @flow strict-local
import {isFunction} from 'lodash-es';
import * as React from 'react';
import {Animated, BackHandler, Dimensions, PanResponder, ScrollView, StyleSheet, View} from 'react-native';
import type {CompositeAnimation} from 'react-native/Libraries/Animated/src/AnimatedImplementation';
import type {GestureState} from 'react-native/Libraries/Interaction/PanResponder';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {isPhone} from '../device';
import {Scrim} from '../scrim';
import {type ThemeProps, withTheme} from '../theme';

const types = {
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const styles = {
  wrapper: {
    zIndex: 16900,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    elevation: 16,
  },
  wrapper2: {
    zIndex: 16800,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    elevation: 16,
  },
  common: StyleSheet.create({
    container: {
      elevation: 16,
      backgroundColor: '#fff',
    },
  }),
  BOTTOM: StyleSheet.create({
    container: {
      minHeight: 56,
    },
    wrapperPhone: {
      justifyContent: 'flex-end',
    },
    wrapperTablet: {
      justifyContent: 'flex-end',
    },
  }),
  LEFT: StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    wrapperPhone: {
      right: 56,
    },
    wrapperTablet: {
      width: 320,
    },
  }),
  RIGHT: StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    wrapperPhone: {
      left: 56,
    },
    wrapperTablet: {
      width: 320,
    },
  }),
};

const deviceIsPhone = isPhone();

type Props = {
  children: React.Node,
  initialIsVisible: boolean,
  style: ViewStyleProp,
  type: $Values<typeof types>,
  modal: boolean,
  rctshtTheme: ThemeProps,
  onClose: () => void,
};

type State = {
  isVisible: boolean,
};

class Sheet extends React.PureComponent<Props, State> {
  static types = types;

  static defaultProps = {
    // Default to modal for non-tablets
    modal: deviceIsPhone,
    initialIsVisible: false,
  };

  swipe = new Animated.Value(0);

  scrollView = null;

  // Must be before panResponder declaration
  // eslint-disable-next-line react/sort-comp
  onReleaseOrTerminate = (event: PressEvent, gestureState: GestureState) => {
    const {width, height} = Dimensions.get('window');
    const {type, rctshtTheme} = this.props;

    switch (type) {
      case types.LEFT:
        if (gestureState.dx < -((deviceIsPhone ? width - 56 : 320) / 2) || gestureState.vx < -0.5) {
          Animated.timing(this.positionX, {
            toValue: deviceIsPhone ? -width : -320,
            useNativeDriver: true,
            duration: rctshtTheme.animations.medium.out,
          }).start(() => {
            this.setState(
              {
                isVisible: false,
              },
              () => {
                if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                  this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                }
              },
            );
          });
        } else {
          this.setState(
            {
              isVisible: true,
            },
            () => {
              Animated.timing(this.positionX, {
                toValue: 0,
                useNativeDriver: true,
                duration: rctshtTheme.animations.medium.in,
              }).start();
            },
          );
        }
        break;
      case types.RIGHT:
        if (gestureState.dx > (deviceIsPhone ? width - 56 : 320) / 2 || gestureState.vx > 0.5) {
          Animated.timing(this.positionX, {
            toValue: deviceIsPhone ? width : 320,
            useNativeDriver: true,
            duration: rctshtTheme.animations.medium.out,
          }).start(() => {
            this.setState(
              {
                isVisible: false,
              },
              () => {
                if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                  this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                }
              },
            );
          });
        } else {
          this.setState(
            {
              isVisible: true,
            },
            () => {
              Animated.timing(this.positionX, {
                toValue: 0,
                useNativeDriver: true,
                duration: rctshtTheme.animations.medium.in,
              }).start();
            },
          );
        }
        break;
      case types.BOTTOM:
        if (gestureState.dy < height / 4) {
          Animated.timing(this.positionX, {
            toValue: height / 2,
            useNativeDriver: true,
            duration: rctshtTheme.animations.medium.out,
          }).start(() => {
            this.setState(
              {
                isVisible: false,
              },
              () => {
                if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                  this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                }
              },
            );
          });
        } else {
          this.setState(
            {
              isVisible: true,
            },
            () => {
              Animated.timing(this.positionX, {
                toValue: 0,
                useNativeDriver: true,
                duration: rctshtTheme.animations.medium.in,
              }).start();
            },
          );
        }
        break;
      default:
        break;
    }
  };

  panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const {type} = this.props;
      Animated.event([
        {
          dx: type === types.BOTTOM ? null : this.positionX,
          dy: type === types.BOTTOM ? this.positionY : null,
        },
      ])(gestureState);
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: this.onReleaseOrTerminate,
    onPanResponderTerminate: this.onReleaseOrTerminate,
    onShouldBlockNativeResponder: () => true,
  });

  panResponder2 = PanResponder.create({
    onStartShouldSetPanResponder: evt => {
      const {type} = this.props;
      const {width} = Dimensions.get('window');
      return type === types.LEFT
        ? evt.nativeEvent.pageX < 16
        : type === types.RIGHT
        ? evt.nativeEvent.pageX > width - 16
        : false;
    },
    onStartShouldSetResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponderCapture: () => false,

    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const {width, height} = Dimensions.get('window');
      const {type} = this.props;

      Animated.event([
        {
          dx: type === types.BOTTOM ? null : this.positionX,
          dy: type === types.BOTTOM ? this.positionY : null,
        },
      ])({
        dx:
          type === types.LEFT
            ? deviceIsPhone
              ? -width
              : -320 + gestureState.dx
            : type === types.RIGHT
            ? (deviceIsPhone ? width : 320) + gestureState.dx
            : 0,
        dy: type === types.BOTTOM ? height / 2 + gestureState.dy : 0,
      });
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      const {width, height} = Dimensions.get('window');
      const {type, rctshtTheme} = this.props;

      if (Math.abs(gestureState.dx) < 10) {
        return;
      }

      switch (type) {
        case types.LEFT:
          if (gestureState.dx < (deviceIsPhone ? width - 56 : 320) / 2 && gestureState.vx < 0.5) {
            Animated.timing(this.positionX, {
              toValue: deviceIsPhone ? -width : -320,
              useNativeDriver: true,
              duration: rctshtTheme.animations.medium.out,
            }).start(() => {
              this.setState(
                {
                  isVisible: false,
                },
                () => {
                  if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                    this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                  }
                },
              );
            });
          } else {
            this.setState(
              {
                isVisible: true,
              },
              () => {
                Animated.timing(this.positionX, {
                  toValue: 0,
                  useNativeDriver: true,
                  duration: rctshtTheme.animations.medium.in,
                }).start();
              },
            );
          }
          break;
        case types.RIGHT:
          if (gestureState.dx < -(deviceIsPhone ? width - 56 : 320) / 2 && gestureState.vx > -0.5) {
            Animated.timing(this.positionX, {
              toValue: deviceIsPhone ? width : 320,
              useNativeDriver: true,
              duration: rctshtTheme.animations.medium.out,
            }).start(() => {
              this.setState(
                {
                  isVisible: false,
                },
                () => {
                  if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                    this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                  }
                },
              );
            });
          } else {
            this.setState(
              {
                isVisible: true,
              },
              () => {
                Animated.timing(this.positionX, {
                  toValue: 0,
                  useNativeDriver: true,
                  duration: rctshtTheme.animations.medium.in,
                }).start();
              },
            );
          }
          break;
        // @TODO this should probably be removed
        case types.BOTTOM:
          if (gestureState.dy > -height / 4) {
            Animated.timing(this.positionX, {
              toValue: height / 2,
              useNativeDriver: true,
              duration: rctshtTheme.animations.medium.out,
            }).start(() => {
              this.setState(
                {
                  isVisible: false,
                },
                () => {
                  if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                    this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                  }
                },
              );
            });
          } else {
            this.setState(
              {
                isVisible: true,
              },
              () => {
                Animated.timing(this.positionX, {
                  toValue: 0,
                  useNativeDriver: true,
                  duration: rctshtTheme.animations.medium.in,
                }).start();
              },
            );
          }
          break;
        default:
          break;
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      const {width, height} = Dimensions.get('window');
      const {type, rctshtTheme} = this.props;

      switch (type) {
        case types.LEFT:
          if (gestureState.dx < (deviceIsPhone ? width - 56 : 320) / 2 && gestureState.vx < 0.5) {
            Animated.timing(this.positionX, {
              toValue: deviceIsPhone ? -width : -320,
              useNativeDriver: true,
              duration: rctshtTheme.animations.medium.out,
            }).start(() => {
              this.setState(
                {
                  isVisible: false,
                },
                () => {
                  if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                    this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                  }
                },
              );
            });
          } else {
            this.setState(
              {
                isVisible: true,
              },
              () => {
                Animated.timing(this.positionX, {
                  toValue: 0,
                  useNativeDriver: true,
                  duration: rctshtTheme.animations.medium.in,
                }).start();
              },
            );
          }
          break;
        case types.RIGHT:
          if (gestureState.dx < -(deviceIsPhone ? width - 56 : 320) / 2 && gestureState.vx > -0.5) {
            Animated.timing(this.positionX, {
              toValue: deviceIsPhone ? width : 320,
              useNativeDriver: true,
              duration: rctshtTheme.animations.medium.out,
            }).start(() => {
              this.setState(
                {
                  isVisible: false,
                },
                () => {
                  if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                    this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                  }
                },
              );
            });
          } else {
            this.setState(
              {
                isVisible: true,
              },
              () => {
                Animated.timing(this.positionX, {
                  toValue: 0,
                  useNativeDriver: true,
                  duration: rctshtTheme.animations.medium.in,
                }).start();
              },
            );
          }
          break;
        case types.BOTTOM:
          if (gestureState.dy > -height / 4) {
            Animated.timing(this.positionX, {
              toValue: height / 2,
              useNativeDriver: true,
              duration: rctshtTheme.animations.medium.out,
            }).start(() => {
              this.setState(
                {
                  isVisible: false,
                },
                () => {
                  if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
                    this.scrollView.scrollTo({x: 0, y: 0, animated: false});
                  }
                },
              );
            });
          } else {
            this.setState(
              {
                isVisible: true,
              },
              () => {
                Animated.timing(this.positionX, {
                  toValue: 0,
                  useNativeDriver: true,
                  duration: rctshtTheme.animations.medium.in,
                }).start();
              },
            );
          }
          break;
        default:
          break;
      }
    },
    onShouldBlockNativeResponder: () => true,
  });

  constructor(props: Props) {
    super(props);

    const {initialIsVisible, type} = props;

    const {width, height} = Dimensions.get('window');

    this.positionX = new Animated.Value(
      initialIsVisible
        ? 0
        : type === types.LEFT
        ? deviceIsPhone
          ? -width
          : -320
        : type === types.RIGHT
        ? deviceIsPhone
          ? width
          : 320
        : 0,
    );

    this.positionY = new Animated.Value(initialIsVisible ? 0 : type === types.BOTTOM ? height / 2 : 0);

    this.state = {
      isVisible: initialIsVisible,
    };
  }

  componentDidMount() {
    const {isVisible} = this.state;

    if (isVisible) {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    if (this.animation) {
      this.animation.stop();
    }
  }

  onBackPress = () => {
    this.close();
    return true;
  };

  open = () => {
    const {type, rctshtTheme} = this.props;

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    if (this.animation) {
      this.animation.stop();
    }

    this.setState(
      {
        isVisible: true,
      },
      () => {
        this.animation = Animated.timing(type === types.BOTTOM ? this.positionY : this.positionX, {
          toValue: 0,
          useNativeDriver: true,
          duration: rctshtTheme.animations.medium.in,
        }).start();
      },
    );
  };

  close = () => {
    const {type, rctshtTheme} = this.props; // onClose
    const {width, height} = Dimensions.get('window');

    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    if (this.animation) {
      this.animation.stop();
    }

    this.animation = Animated.timing(type === types.BOTTOM ? this.positionY : this.positionX, {
      toValue:
        type === types.BOTTOM
          ? height / 2
          : type === types.LEFT
          ? deviceIsPhone
            ? -width
            : -320
          : type === types.RIGHT
          ? deviceIsPhone
            ? width
            : 320
          : 0,
      useNativeDriver: true,
      duration: rctshtTheme.animations.medium.out,
    }).start(() => {
      this.setState(
        {
          isVisible: false,
        },
        () => {
          if (this.scrollView && isFunction(this.scrollView.scrollTo)) {
            this.scrollView.scrollTo({x: 0, y: 0, animated: false});
          }

          // @TODO call onClose prop?
          // if (isFunction(onClose)) {
          //   onClose();
          // }
        },
      );
    });
  };

  setScrollView = (node: ScrollView) => {
    this.scrollView = node;
  };

  positionX: typeof Animated.Value;

  positionY: typeof Animated.Value;

  animation: CompositeAnimation;

  render() {
    const {width, height} = Dimensions.get('window');

    const {type, modal, style} = this.props;

    const {isVisible} = this.state;

    const userStyle = Array.isArray(style) ? style : [style];

    // TODO account for freeform / splitscreen modes?
    // if (isVisible) {
    //   StatusBar.setHidden(true);
    // } else {
    //   StatusBar.setHidden(false);
    // }

    const contentStyles = [
      styles.common.container,
      styles[type].container,
      deviceIsPhone ? styles[type].containerPhone : styles[type].containerTablet,
      type === types.BOTTOM ? {maxHeight: height / 2} : null,
      ...userStyle,
    ];

    const scrollView = (
      <ScrollView
        {...this.props}
        style={type !== types.BOTTOM ? contentStyles : null}
        onMoveShouldSetResponder={(event, gestureState) =>
          Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        }
        onMoveShouldSetResponderCapture={(event, gestureState) =>
          Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        }
        onStartShouldSetResponder={() => false}
        onStartShouldSetResponderCapture={() => false}
        ref={this.setScrollView}
        keyboardShouldPersistTaps="handled"
      />
    );

    return [
      isVisible ? null : (
        <View
          key="edgel"
          {...this.panResponder2.panHandlers}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 16,
            zIndex: 16400,
          }}
        />
      ),
      isVisible ? null : (
        <View
          key="edger"
          {...this.panResponder2.panHandlers}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 16,
            zIndex: 16400,
          }}
        />
      ),
      modal ? (
        <Scrim
          key="scrim"
          opacity={this.positionX.interpolate({
            inputRange:
              type === types.LEFT
                ? [deviceIsPhone ? -width : -320, 0]
                : type === types.RIGHT
                ? [0, deviceIsPhone ? width : 320]
                : [0, 0],
            outputRange: type === types.LEFT ? [0, 1] : type === types.RIGHT ? [1, 0] : [0, 0],
            extrapolate: 'clamp',
          })}
          isVisible={isVisible}
          onPress={this.close}
          elevation={16}
          onStartShouldSetResponder={() => true}
          onStartShouldSetResponderCapture={() => true}
          onMoveShouldSetResponder={() => true}
          onMoveShouldSetResponderCapture={() => true}
        />
      ) : null,
      <Animated.View
        key="sheet"
        pointerEvents="box-none"
        style={[
          styles.wrapper,
          deviceIsPhone ? styles[type].wrapperPhone : styles[type].wrapperTablet,
          {
            transform: [
              {
                translateX: this.positionX.interpolate({
                  inputRange:
                    type === types.LEFT
                      ? [deviceIsPhone ? -width : -320, 0]
                      : type === types.RIGHT
                      ? [0, deviceIsPhone ? width : 320]
                      : [0, 1],
                  outputRange:
                    type === types.LEFT
                      ? [deviceIsPhone ? -width : -320, 0]
                      : type === types.RIGHT
                      ? [0, deviceIsPhone ? width : 320]
                      : [0, 1],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY:
                  type === types.BOTTOM
                    ? this.positionY
                    : this.positionY.interpolate({
                        inputRange: [deviceIsPhone ? -width : -320, 0],
                        outputRange: [-250, 0],
                        extrapolate: 'clamp',
                      }),
              },
            ],
          },
        ]}
        {...this.panResponder.panHandlers}
      >
        {type !== types.BOTTOM ? scrollView : null}
        {type === types.BOTTOM ? <View style={contentStyles}>{scrollView}</View> : null}
      </Animated.View>,
    ];
  }
}

export default withTheme(Sheet);
