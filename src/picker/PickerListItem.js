// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {Icon} from '../icon';
import {Touchable} from '../touchable';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
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
  label: string,
  value: ?string,
};

type Props = {
  showCaret: boolean,
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
    const {showCaret, item, renderListItem, selectedValue} = this.props;

    const selected = item.value != null && selectedValue === item.value;

    let content;

    if (typeof renderListItem === 'function') {
      content = renderListItem({item, selected});
    } else {
      content = (
        <View style={styles.item}>
          <Type.Body1 bold={selected} style={item.value == null ? styles.disabled : null} numberOfLines={2}>
            {item.label}
          </Type.Body1>
        </View>
      );
    }

    return (
      <Touchable onPress={this.onPress} style={styles.container}>
        {content}
        {showCaret ? <Icon name="menu-up" size={24} /> : null}
      </Touchable>
    );
  }
}

export default PickerListItem;
