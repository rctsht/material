// @flow strict-local
import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';

import {Button} from '../button';
import {Type} from '../type';

import withSnackbarOverlay from './withSnackbarOverlay';

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
    marginRight: 8,
    color: '#e5e5e5',
    fontSize: 14,
    lineHeight: labelLineHeight,
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
  action?: Button,
  duration?: number,
  label?: string,
  onClose?: Function,
};

class Snackbar extends React.PureComponent<Props> {
  static durations = durations;

  static defaultProps = {
    action: null,
    duration: durations.SHORT,
    label: '',
    onClose: null,
  };

  state = {
    fullWidth: false,
    numberOfLines: 3,
  };

  opacity = new Animated.Value(0);

  componentDidMount() {}

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
            if (duration !== 0 && !this.fadedOut) {
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
    const {action, label} = this.props;
    const {fullWidth, numberOfLines} = this.state;

    const onPress = event => {
      if (this.fadeOutAnimation) {
        this.fadeOutAnimation.stop();
      }

      this.fadedOut = true;

      this.fadeOut();

      if (action.onPress) {
        action.onPress(event);
      }
    };

    const actionNode = action ? <Button type={Button.types.TEXT} {...action} onPress={onPress} /> : null;

    return (
      <Animated.View
        style={[
          styles.snackbar,
          numberOfLines === 2 ? styles.snackbarMultilineDouble : null,
          fullWidth ? styles.snackbarMultilineTriple : null,
          {opacity: this.opacity},
        ]}
      >
        <Type.Default
          style={[styles.label, fullWidth ? styles.labelTriple : null]}
          numberOfLines={numberOfLines}
          alignToBaseline={numberOfLines === 2 ? 30 : undefined}
          onLayout={this.onLayoutText}
        >
          {label}
        </Type.Default>
        {actionNode ? (
          <View style={[styles.action, fullWidth ? styles.actionFullWidth : null]}>{actionNode}</View>
        ) : null}
      </Animated.View>
    );
  }
}

export default withSnackbarOverlay(Snackbar);
