// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

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
  pickerHeight: number,
  pickerX: number,
  pickerY: number,
  renderListItem?: ?({item: Item, selected: boolean}) => React.Node,
  selectedValue: ?string,
  windowWidth: number,
  windowHeight: number,
};

class PickerList extends React.PureComponent<Props> {
  renderItem = (item: Item) => {
    const {onPressListItem, renderListItem, selectedValue} = this.props;
    return (
      <PickerListItem
        item={item}
        selectedValue={selectedValue}
        renderListItem={renderListItem}
        onPressListItem={onPressListItem}
      />
    );
  };

  render() {
    const {
      isVisible,
      items,
      onClose,
      pickerWidth,
      pickerHeight,
      pickerX,
      pickerY,
      windowWidth,
      windowHeight,
    } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Scrim
          key="scrim"
          opacity={scrimOpacity}
          isVisible={isVisible}
          onPress={onClose}
          elevation={16}
          onStartShouldSetResponder={() => true}
          onStartShouldSetResponderCapture={() => true}
          onMoveShouldSetResponder={() => true}
          onMoveShouldSetResponderCapture={() => true}
        />
        <View
          style={[
            styles.pickerList,
            {
              position: 'absolute',
              top: pickerY + pickerHeight,
              left: pickerX,
              minWidth: pickerWidth,
              maxWidth: windowWidth,
              maxHeight: windowHeight,
            },
          ]}
        >
          {items && items.length > 0 ? items.map(this.renderItem) : null}
        </View>
      </View>
    );
  }
}

export default withGlobalOverlay(PickerList);
