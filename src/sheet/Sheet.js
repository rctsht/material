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

  constructor(props: Props) {
    super(props);

    const {initialIsVisible, type} = props;

    const {width, height} = Dimensions.get('window');

    let positionX = 0;
    let positionY = 0;

    if (!initialIsVisible) {
      if (type === types.LEFT) {
        positionX = deviceIsPhone ? -width : -320;
      } else if (type === types.RIGHT) {
        positionX = deviceIsPhone ? width : 320;
      }
    }

    if (!initialIsVisible) {
      if (type === types.BOTTOM) {
        positionY = height / 2;
      }
    }

    this.positionX = new Animated.Value(positionX);

    this.positionY = new Animated.Value(positionY);

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

  // Must be after onReleaseOrTerminate declaration
  // eslint-disable-next-line react/sort-comp
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

      if (type === types.LEFT) {
        return evt.nativeEvent.pageX < 16;
      }
      if (type === types.RIGHT) {
        return evt.nativeEvent.pageX > width - 16;
      }

      return false;
    },
    onStartShouldSetResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponderCapture: () => false,

    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const {width, height} = Dimensions.get('window');
      const {type} = this.props;

      let dx = 0;

      if (type === types.LEFT) {
        dx = (deviceIsPhone ? -width : -320) + gestureState.dx;
      } else if (type === types.RIGHT) {
        dx = (deviceIsPhone ? width : 320) + gestureState.dx;
      }

      Animated.event([
        {
          dx: type === types.BOTTOM ? null : this.positionX,
          dy: type === types.BOTTOM ? this.positionY : null,
        },
      ])({
        dx,
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

    let toValue = 0;

    if (type === types.BOTTOM) {
      toValue = height / 2;
    } else if (type === types.LEFT) {
      toValue = deviceIsPhone ? -width : -320;
    } else if (type === types.RIGHT) {
      toValue = deviceIsPhone ? width : 320;
    }

    this.animation = Animated.timing(type === types.BOTTOM ? this.positionY : this.positionX, {
      toValue,
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

    let scrimOpacityInputRange = [0, 0];
    let scrimOpacityOutputRange = [0, 0];

    if (type === types.LEFT) {
      scrimOpacityInputRange = [deviceIsPhone ? -width : -320, 0];
      scrimOpacityOutputRange = [0, 1];
    } else if (type === types.RIGHT) {
      scrimOpacityInputRange = [0, deviceIsPhone ? width : 320];
      scrimOpacityOutputRange = [1, 0];
    }

    const scrimOpacity = this.positionX.interpolate({
      inputRange: scrimOpacityInputRange,
      outputRange: scrimOpacityOutputRange,
      extrapolate: 'clamp',
    });

    let translateXInputRange = [0, 1];
    let translateXOutputRange = [0, 1];

    if (type === types.LEFT) {
      translateXInputRange = [deviceIsPhone ? -width : -320, 0];
      translateXOutputRange = [deviceIsPhone ? -width : -320, 0];
    } else if (type === types.RIGHT) {
      translateXInputRange = [0, deviceIsPhone ? width : 320];
      translateXOutputRange = [0, deviceIsPhone ? width : 320];
    }

    const translateX = this.positionX.interpolate({
      inputRange: translateXInputRange,
      outputRange: translateXOutputRange,
      extrapolate: 'clamp',
    });

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
          opacity={scrimOpacity}
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
                translateX,
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
