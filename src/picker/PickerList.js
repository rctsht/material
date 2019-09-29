// @flow strict-local
import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import type AnimatedInterpolation from 'react-native/Libraries/Animated/src/nodes/AnimatedInterpolation';
import type {LayoutEvent, PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {withGlobalOverlay} from '../global';
import {Scrim} from '../scrim';

import PickerListItem from './PickerListItem';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pickerList: {
    backgroundColor: '#ffffff',
    elevation: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

type Item = {
  label: string,
  value: ?string,
};

type Props = {
  isVisible: boolean,
  items: Array<Item>,
  onClose?: ?() => void,
  onPressListItem?: ?(event: PressEvent, value: ?string) => void,
  pickerWidth: number,
  pickerX: number,
  pickerY: number,
  renderListItem?: ?({item: Item, selected: boolean}) => React.Node,
  scrimOpacity: number | AnimatedInterpolation,
  selectedValue: ?string,
  windowWidth: number,
  windowHeight: number,
};

type State = {
  width: number,
  height: number,
  listWidth: number,
  listHeight: number,
};

class PickerList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const {windowWidth, windowHeight} = props;

    this.state = {
      width: windowWidth,
      height: windowHeight,
      listWidth: 0,
      listHeight: 0,
    };
  }

  onLayout = (event: LayoutEvent) => {
    const {width, height} = event.nativeEvent.layout;

    this.setState({
      width,
      height,
    });
  };

  onLayoutList = (event: LayoutEvent) => {
    const {width: listWidth, height: listHeight} = event.nativeEvent.layout;

    this.setState({
      listWidth,
      listHeight,
    });
  };

  renderItem = (item: Item, index: number) => {
    const {onPressListItem, pickerX, pickerY, renderListItem, selectedValue} = this.props;

    const {width, height, listWidth, listHeight} = this.state;

    const showCaret = index === 0 && pickerY + listHeight <= height && pickerX + listWidth <= width;

    return (
      <PickerListItem
        key={item.value}
        showCaret={showCaret}
        item={item}
        selectedValue={selectedValue}
        renderListItem={renderListItem}
        onPressListItem={onPressListItem}
      />
    );
  };

  render() {
    const {isVisible, items, onClose, pickerWidth, pickerX, pickerY, scrimOpacity} = this.props;

    const {width, height, listWidth, listHeight} = this.state;

    if (!isVisible) {
      return null;
    }

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <Scrim
          key="scrim"
          opacity={scrimOpacity}
          isVisible={isVisible}
          onPress={onClose}
          elevation={8}
          onStartShouldSetResponder={() => true}
          onStartShouldSetResponderCapture={() => true}
          onMoveShouldSetResponder={() => true}
          onMoveShouldSetResponderCapture={() => true}
        />
        <ScrollView
          style={[
            styles.pickerList,
            {
              position: 'absolute',
              top: pickerY + listHeight > height ? undefined : pickerY,
              bottom: pickerY + listHeight > height ? 16 : undefined,
              left: pickerX + listWidth > width ? undefined : pickerX,
              right: pickerX + listWidth > width ? 16 : undefined,
              minWidth: pickerWidth,
              maxWidth: width - 32,
              maxHeight: height - 32,
            },
          ]}
          onLayout={this.onLayoutList}
          keyboardShouldPersistTaps="handled"
        >
          {items && items.length > 0 ? items.map(this.renderItem) : null}
        </ScrollView>
      </View>
    );
  }
}

export default withGlobalOverlay(PickerList, 'menu');
