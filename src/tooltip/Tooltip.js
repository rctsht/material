// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import uuid from 'uuid';

import {GlobalOverlay, withGlobalOverlay} from '../global';
import {Type, typePresets} from '../type';

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    paddingHorizontal: 16,
    backgroundColor: '#616161e6',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

type Props = {
  text: string,
  pageX: number,
  pageY: number,
};

type State = {
  width: 'auto' | number,
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

  state = {
    width: 'auto',
  };

  onLayout = event => {
    const {width} = event.nativeEvent.layout;

    this.setState({
      width,
    });
  };

  render() {
    const {pageX, pageY, text} = this.props;
    const {width} = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            top: pageY - 32,
            left: pageX - (width === 'auto' ? 0 : width / 2),
            width,
            opacity: width === 'auto' ? 0 : 1,
          },
        ]}
        onLayout={this.onLayout}
      >
        <Type.Default preset={typePresets.body2}>{text}</Type.Default>
      </View>
    );
  }
}

export default withGlobalOverlay(Tooltip);
