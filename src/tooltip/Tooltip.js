// @flow strict-local
import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import uuid from 'uuid';

import {GlobalOverlay, withGlobalOverlay} from '../global';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#616161e6',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  text: {
    color: '#ffffff',
  },
});

type Props = {
  text: string,
  pageX: number,
  pageY: number,
};

type State = {
  width: 'auto' | number,
  height: 'auto' | number,
  windowWidth: number,
  windowHeight: number,
};

class Tooltip extends React.PureComponent<Props, State> {
  static handlers = (options: {} = {}) => {
    const id = uuid.v4();
    return {
      onLongPress: event => {
        const {touches} = event.nativeEvent;

        if (!touches) {
          return;
        }

        const [touch] = touches;

        if (!touch) {
          return;
        }

        const {pageX, pageY} = touch;

        Tooltip.show({pageX, pageY, id, ...options});
      },
      onPressOut: () => {
        Tooltip.hide(id);
      },
    };
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

    context.addOrUpdateTooltip(Tooltip, props);

    return theProps.id;
  };

  static hide = id => {
    const context = GlobalOverlay.getContext();

    if (!context) {
      return;
    }

    context.removeTooltip(id);
  };

  constructor(props: Props) {
    super(props);

    const {width, height} = Dimensions.get('window');

    this.state = {
      width: 'auto',
      height: 'auto',
      windowWidth: width,
      windowHeight: height,
    };
  }

  onLayout = event => {
    const {width, height} = event.nativeEvent.layout;

    this.setState({
      width,
      height,
    });
  };

  render() {
    const {pageX, pageY, text} = this.props;
    const {width, height, windowWidth, windowHeight} = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            maxWidth: Math.min(320, windowWidth - 32),
            bottom: Math.min(
              windowHeight - (height === 'auto' ? 0 : height + 16),
              Math.max(16, windowHeight - pageY + 32),
            ),
            left: Math.min(
              windowWidth - (width === 'auto' ? 0 : width + 16),
              Math.max(16, pageX - (width === 'auto' ? 0 : width / 2)),
            ),
            width,
            opacity: width === 'auto' ? 0 : 1,
          },
        ]}
        onLayout={this.onLayout}
      >
        <Type.Body2 style={styles.text}>{text}</Type.Body2>
      </View>
    );
  }
}

export default withGlobalOverlay(Tooltip, 'tooltip');
