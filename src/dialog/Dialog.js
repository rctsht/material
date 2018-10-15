// @flow
import * as React from 'react';
import {Animated, BackHandler, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {type ThemeProps, withTheme} from '../theme';

const styles = StyleSheet.create({
  container: {
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
    margin: 40,
    overflow: 'hidden',
    padding: 0,
    paddingBottom: 0,
    borderRadius: 3,
  },
  modalContainerNoPadding: {
    padding: 0,
  },
  modalContainerMaxWidth: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
});

type Props = {
  children?: React.Node,
  getOverlayRef: Function,
  id: string,
  isVisible?: boolean,
  maxWidth?: number,
  noPadding?: boolean,
  onClose?: Function,
  rctshtTheme: ThemeProps,
};

class Dialog extends React.PureComponent<Props> {
  static defaultProps = {
    children: null,
    isVisible: false,
    maxWidth: null,
    noPadding: false,
    onClose: null,
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
      visible: isVisible,
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
    const {children, noPadding, maxWidth} = this.props;
    const {visible} = this.state;

    if (!visible) {
      return null;
    }

    return (
      <View style={styles.container}>
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
        <Animated.View
          style={[
            styles.modalContainer,
            noPadding ? styles.modalContainerNoPadding : null,
            maxWidth ? styles.modalContainerMaxWidth : null,
            maxWidth ? {maxWidth} : null,
            {opacity: this.animationProgress},
          ]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
}

export default withTheme(Dialog);
