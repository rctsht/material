// @flow strict-local
import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import uuid from 'uuid';

import {Button} from '../button';
import {GlobalOverlay, withGlobalOverlay} from '../global';
import {Type} from '../type';

const labelLineHeight = 20;

const styles = StyleSheet.create({
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    backgroundColor: '#353535',
    borderRadius: 4,
    minHeight: 48,
    paddingLeft: 16,
    paddingRight: 8,
    elevation: 6,
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
  },
  snackbarMultilineDouble: {
    alignItems: 'flex-start',
    minHeight: 68,
  },
  snackbarMultilineTriple: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    minHeight: 112,
  },
  label: {
    flex: 1,
    color: '#e5e5e5',
    fontSize: 14,
    lineHeight: labelLineHeight,
    marginRight: 8,
  },
  labelTriple: {
    flex: 0,
    paddingBottom: 10,
  },
  action: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  actionFullWidth: {
    flex: 0,
    width: '100%',
    height: 52,
  },
});

const durations = {
  SHORT: 4000,
  LONG: 8000,
  MAX: 10000,
};

type Props = {
  id: string,
  action: ?{},
  duration: number,
  label: string,
  onClose: ?(string) => void,
  offsetY: number,
};

type State = {
  fullWidth: boolean,
  numberOfLines: number,
};

class Snackbar extends React.PureComponent<Props, State> {
  static durations = durations;

  static defaultProps = {
    action: null,
    duration: durations.SHORT,
    label: '',
    onClose: null,
    offsetY: 8,
  };

  static show = props => {
    const context = GlobalOverlay.getContext();

    if (!context) {
      return null;
    }

    const theProps = props;

    if (!theProps.id) {
      theProps.id = uuid.v4();
    }

    context.addOrUpdateSnackbar(Snackbar, props);

    return theProps.id;
  };

  static hide = id => {
    const context = GlobalOverlay.getContext();

    if (!context) {
      return;
    }

    context.removeSnackbar(id);
  };

  opacity = new Animated.Value(0);

  constructor(props: Props) {
    super(props);

    this.state = {
      fullWidth: false,
      numberOfLines: 3,
    };
  }

  // $FlowFixMe
  onLayoutText = (event: React.SyntheticEvent<Object>) => {
    const {height} = event.nativeEvent.layout;
    const {duration} = this.props;
    const {numberOfLines} = this.state;

    if (numberOfLines === 3) {
      const lines = Math.round(height / labelLineHeight);
      this.setState(
        {
          numberOfLines: Math.min(lines, 2),
          fullWidth: lines > 2,
        },
        () => {
          Animated.timing(this.opacity, {
            useNativeDriver: true,
            toValue: 1,
            duration: 300,
          }).start(() => {
            // $FlowFixMe
            if (duration !== 0 && !this.fadedOut) {
              // $FlowFixMe
              this.fadeOutAnimation = this.fadeOut(duration);
            }
          });
        },
      );
    }
  };

  fadeOut = (delay: number = 0) =>
    Animated.timing(this.opacity, {
      useNativeDriver: true,
      toValue: 0,
      delay: Math.min(delay, durations.MAX),
      duration: 150,
    }).start(({finished}) => {
      if (finished) {
        const {id, onClose} = this.props;
        if (onClose) {
          onClose(id);
        }
      }
    });

  render() {
    const {action, label, offsetY} = this.props;
    const {fullWidth, numberOfLines} = this.state;

    const onPress = event => {
      // $FlowFixMe
      if (this.fadeOutAnimation) {
        this.fadeOutAnimation.stop();
      }

      // $FlowFixMe
      this.fadedOut = true;

      this.fadeOut();

      // $FlowFixMe
      if (action.onPress) {
        action.onPress(event);
      }
    };

    const actionNode = action ? (
      <Button.Text
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...action}
        onPress={onPress}
      />
    ) : null;

    return (
      <Animated.View
        style={[
          styles.snackbar,
          numberOfLines === 2 ? styles.snackbarMultilineDouble : null,
          numberOfLines === 1 ? {flexWrap: 'nowrap'} : null,
          fullWidth && actionNode ? styles.snackbarMultilineTriple : null,
          {
            opacity: this.opacity,
            bottom: offsetY,
          },
        ]}
        pointerEvents="box-none"
      >
        <Type.Default
          style={[styles.label, fullWidth ? styles.labelTriple : null]}
          numberOfLines={numberOfLines}
          alignToBaseline={numberOfLines === 2 ? 30 : undefined}
          onLayout={this.onLayoutText}
          pointerEvents="none"
        >
          {label}
        </Type.Default>
        {actionNode ? (
          <View style={[styles.action, fullWidth ? styles.actionFullWidth : null]} pointerEvents="box-none">
            {actionNode}
          </View>
        ) : null}
      </Animated.View>
    );
  }
}

export default withGlobalOverlay(Snackbar, 'snackbar');
