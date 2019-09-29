// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {Touchable} from '../touchable';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {},
});

type Item = {
  label: string,
  value: ?string,
};

type Props = {
  item: Item,
  onPressListItem?: ?(event: PressEvent, value: ?string) => void,
  renderListItem?: ?({item: Item, selected: boolean}) => React.Node,
  selectedValue: ?string,
};

class PickerListItem extends React.PureComponent<Props> {
  onPress = (event: PressEvent) => {
    const {item, onPressListItem} = this.props;
    const {value} = item;

    if (typeof onPressListItem === 'function') {
      onPressListItem(event, value);
    }
  };

  render() {
    const {item, renderListItem, selectedValue} = this.props;

    const selected = selectedValue === item.value;

    let content;

    if (typeof renderListItem === 'function') {
      content = renderListItem({item, selected});
    } else {
      content = (
        <View>
          <Type.Body1>{item.label}</Type.Body1>
        </View>
      );
    }

    return (
      <Touchable onPress={selected ? null : this.onPress} style={[styles.container]}>
        {content}
      </Touchable>
    );
  }
}

export default PickerListItem;
