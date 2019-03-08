// @flow strict-local
import * as React from 'react';
import {Animated, BackHandler, Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import type {CompositeAnimation} from 'react-native/Libraries/Animated/src/AnimatedImplementation';

import {type ThemeProps, withTheme} from '../theme';

import DialogOverlay from './DialogOverlay';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  containerFullScreen: {
    elevation: 24,
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
    elevation: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    margin: 40,
    padding: 0,
    borderRadius: 3,
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

type Props = {
  children: React.Node,
  getOverlayRef: ((DialogOverlay) => void) => void,
  id: string,
  isVisible: boolean,
  maxWidth: ?number,
  noPadding: boolean,
  onClose: ?() => void,
  rctshtTheme: ThemeProps,
  fullScreen: boolean,
  renderToolbar: ?() => React.Node,
  noScrollView: boolean,
  scrollViewProps: {},
};

type State = {
  visible: boolean,
};

class Dialog extends React.PureComponent<Props, State> {
  static defaultProps = {
    children: null,
    isVisible: false,
    maxWidth: null,
    noPadding: false,
    onClose: null,
    fullScreen: false,
    renderToolbar: null,
    noScrollView: false,
    scrollViewProps: {},
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
          duration: rctshtTheme.animations.dialog.in,
          easing: rctshtTheme.animations.decelerateEasing,
          useNativeDriver: true,
        }).start(() => {
          this.animation = null;
        });
      },
    );
  }

  animation: ?CompositeAnimation;

  closing: boolean;

  startCloseAnimation() {
    if (this.animation) {
      this.animation.stop();
    }
    const {rctshtTheme} = this.props;
    this.animation = Animated.timing(this.animationProgress, {
      toValue: 0,
      duration: rctshtTheme.animations.dialog.out,
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
    } = this.props;
    const {visible} = this.state;

    if (!visible) {
      return null;
    }

    let translateAnimationX;
    let translateAnimationY;

    if (fullScreen) {
      const {width, height} = Dimensions.get('window');

      translateAnimationX = isVisible
        ? this.animationProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0],
          })
        : 0;

      translateAnimationY = this.animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
      });
    }

    return (
      <View style={styles.container} collapsable={false}>
        {fullScreen ? null : (
          <TouchableWithoutFeedback
            key="overlay"
            onPress={() => {
              this.onClose();
            }}
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
          <View style={styles.containerFullScreen}>
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
                  opacity: this.animationProgress,
                },
              ]}
            >
              {noScrollView ? (
                children
              ) : (
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollViewContent}
                  {...scrollViewProps}
                >
                  {children}
                </ScrollView>
              )}
            </Animated.View>
          </View>
        ) : (
          <Animated.View
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

export default withTheme(Dialog);
