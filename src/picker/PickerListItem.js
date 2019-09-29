// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {Touchable} from '../touchable';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  item: {
    padding: 8,
    flex: 1,
  },
  disabled: {
    color: '#999999',
  },
});

type Item = {
  disabled?: boolean,
  label: string,
  value: ?string,
};

type Props = {
  index: number,
  item: Item,
  onPressListItem?: ?(event: PressEvent, item: Item) => void,
  renderListItem?: ?({item: Item, selected: boolean}) => React.Node,
  selectedValue: ?string,
};

class PickerListItem extends React.PureComponent<Props> {
  onPress = (event: PressEvent) => {
    const {item, onPressListItem} = this.props;

    if (typeof onPressListItem === 'function') {
      onPressListItem(event, item);
    }
  };

  render() {
    const {index, item, renderListItem, selectedValue} = this.props;

    const selected = item.disabled !== true && selectedValue === item.value;

    let content;

    if (typeof renderListItem === 'function') {
      content = renderListItem({index, item, selected});
    } else {
      content = (
        <View style={styles.item}>
          <Type.Body1 bold={selected} style={item.disabled === true ? styles.disabled : null} numberOfLines={2}>
            {item.label}
          </Type.Body1>
        </View>
      );
    }

    return (
      <Touchable onPress={this.onPress} style={styles.container}>
        {content}
      </Touchable>
    );
  }
}

export default PickerListItem;
