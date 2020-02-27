// @flow strict-local
import * as React from 'react';
import {Animated, BackHandler, Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import type {CompositeAnimation} from 'react-native/Libraries/Animated/src/AnimatedImplementation';

import {type ThemeProps, withTheme} from '../theme';
import {ShadowUtil} from '../util';

import DialogOverlay from './DialogOverlay';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  containerFullScreen: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  modalContainer: {
    ...ShadowUtil.getStylesForElevation(24),
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 32,
    padding: 0,
    borderRadius: 3,
    flex: -1,
  },
  modalContainerFullScreen: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    flex: 1,
  },
  modalContainerNoPadding: {
    padding: 0,
  },
  modalContainerMaxWidth: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  toolbar: {
    zIndex: 100,
  },
});

type DefaultProps = {|
  animationOrigin: 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright',
  children: React.Node,
  isVisible: boolean,
  maxWidth: ?number,
  noPadding: boolean,
  onClose: ?() => void,
  fullScreen: boolean,
  renderToolbar: ?() => React.Node,
  noScrollView: boolean,
  scrollViewProps: {},
  preventOverlayTap: boolean,
|};

type Props = {
  ...DefaultProps,
  getOverlayRef: ((DialogOverlay) => void) => void,
  id: string,
  rctshtTheme: ThemeProps,
};

type State = {
  visible: boolean,
};

class Dialog extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    animationOrigin: 'bottomright',
    children: null,
    isVisible: false,
    maxWidth: null,
    noPadding: false,
    onClose: null,
    fullScreen: false,
    renderToolbar: null,
    noScrollView: false,
    scrollViewProps: {},
    preventOverlayTap: false,
  };

  static getDerivedStateFromProps(props: Props) {
    if (props.isVisible) {
      return {
        visible: true,
      };
    }

    return null;
  }

  animationProgress = new Animated.Value(0.1);

  animation: ?CompositeAnimation;

  closing: boolean;

  constructor(props: Props) {
    super(props);

    const {isVisible} = this.props;

    this.state = {
      visible: isVisible === true,
    };
  }

  componentDidMount() {
    const {isVisible} = this.props;

    if (isVisible) {
      this.startOpenAnimation();
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {isVisible: prevIsVisible} = prevProps;
    const {isVisible} = this.props;

    if (isVisible && !prevIsVisible) {
      this.startOpenAnimation();
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    } else if (!isVisible && prevIsVisible) {
      this.startCloseAnimation();
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
  }

  componentWillUnmount() {
    const {id, getOverlayRef} = this.props;

    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    getOverlayRef(overlay => {
      overlay.removeContent(id);
    });

    if (this.animation) {
      this.animation.stop();
    }
  }

  onClose() {
    const {onClose} = this.props;

    if (onClose) {
      onClose();
    }
  }

  onBackPress = () => {
    const {onClose} = this.props;

    if (onClose) {
      onClose();
    }
    return true;
  };

  startOpenAnimation() {
    const {fullScreen} = this.props;

    if (this.animation) {
      this.animation.stop();
    }
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState(
      {
        visible: true,
      },
      () => {
        const {rctshtTheme} = this.props;
        this.animation = Animated.timing(this.animationProgress, {
          toValue: 1,
          duration: fullScreen ? rctshtTheme.animations.large.in : rctshtTheme.animations.dialog.in,
          easing: rctshtTheme.animations.decelerateEasing,
          useNativeDriver: true,
        }).start(() => {
          this.animation = null;
        });
      },
    );
  }

  startCloseAnimation() {
    const {fullScreen} = this.props;

    if (this.animation) {
      this.animation.stop();
    }
    const {rctshtTheme} = this.props;
    this.animation = Animated.timing(this.animationProgress, {
      toValue: 0.1,
      duration: fullScreen ? rctshtTheme.animations.large.out : rctshtTheme.animations.dialog.out,
      easing: rctshtTheme.animations.accelerateEasing,
      useNativeDriver: true,
    }).start(() => {
      this.animation = null;
      this.setState(
        {
          visible: false,
        },
        () => {
          this.closing = false;
          this.onClose();
        },
      );
    });
  }

  render() {
    const {
      children,
      noPadding,
      maxWidth,
      fullScreen,
      renderToolbar,
      noScrollView,
      scrollViewProps,
      isVisible,
      animationOrigin,
      preventOverlayTap,
    } = this.props;
    const {visible} = this.state;

    if (!visible) {
      return null;
    }

    let translateAnimationX;
    let translateAnimationY;
    let opacityAnimation;

    if (fullScreen && animationOrigin) {
      const {width, height} = Dimensions.get('window');

      let xStart = 0;
      let yStart = 0;

      if (animationOrigin.includes('top')) {
        yStart = -height;
      } else if (animationOrigin.includes('bottom')) {
        yStart = height;
      }

      if (animationOrigin.includes('left')) {
        xStart = -width;
      } else if (animationOrigin.includes('right')) {
        xStart = width;
      }

      translateAnimationX = isVisible
        ? this.animationProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [xStart, xStart, 0],
          })
        : 0;

      translateAnimationY = this.animationProgress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [yStart, yStart, 0],
      });

      opacityAnimation = this.animationProgress.interpolate({
        inputRange: [0, 0.25, 1],
        outputRange: [0, 1, 1],
      });
    }

    return (
      <View style={styles.container} collapsable={false}>
        {fullScreen ? null : (
          <TouchableWithoutFeedback
            key="overlay"
            onPress={
              preventOverlayTap
                ? null
                : () => {
                    this.onClose();
                  }
            }
          >
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: this.animationProgress,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}
        {fullScreen ? (
          <Animated.View
            needsOffscreenAlphaCompositing
            style={[
              styles.containerFullScreen,
              {
                opacity: opacityAnimation,
              },
            ]}
          >
            {renderToolbar ? renderToolbar() : null}
            <Animated.View
              key="content"
              style={[
                styles.modalContainerFullScreen,
                {
                  transform: [
                    {
                      translateX: translateAnimationX,
                    },
                    {
                      translateY: translateAnimationY,
                    },
                  ],
                },
              ]}
            >
              {noScrollView ? (
                children
              ) : (
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollViewContent}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...scrollViewProps}
                >
                  {children}
                </ScrollView>
              )}
            </Animated.View>
          </Animated.View>
        ) : (
          <Animated.View
            needsOffscreenAlphaCompositing
            style={[
              styles.modalContainer,
              noPadding ? styles.modalContainerNoPadding : null,
              maxWidth != null ? styles.modalContainerMaxWidth : null,
              maxWidth != null ? {maxWidth} : null,
              {opacity: this.animationProgress},
            ]}
          >
            {children}
          </Animated.View>
        )}
      </View>
    );
  }
}

export default withTheme<React.Config<Props, DefaultProps>, Dialog>(Dialog);
