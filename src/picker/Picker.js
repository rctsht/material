// @flow strict-local
import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import type {LayoutEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {Touchable} from '../touchable';
import {Type} from '../type';
import type {DimensionsEvent} from '../types';

import PickerList from './PickerList';

const styles = StyleSheet.create({
  container: {},
});

type Item = {
  label: string,
  value: ?string,
};

type Props = {
  items: Array<Item>,
  onChangeValue: (value: ?string) => void,
  renderListItem: ({item: Item, selected: boolean}) => React.Node,
  renderSelectedItem: ({item?: Item, selected: boolean}) => React.Node,
  selectedValue: string,
};

type State = {
  open: boolean,
  pickerWidth: number,
  pickerHeight: number,
  pickerX: number,
  pickerY: number,
  windowWidth: number,
  windowHeight: number,
};

class Picker extends React.PureComponent<Props, State> {
  viewRef: ?View;

  constructor(props: Props) {
    super(props);

    const {width, height} = Dimensions.get('window');

    this.state = {
      open: false,
      pickerWidth: 0,
      pickerHeight: 0,
      pickerX: 0,
      pickerY: 0,
      windowWidth: width,
      windowHeight: height,
    };
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onChangeDimensions);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onChangeDimensions);
  }

  open = () => {
    if (this.viewRef) {
      this.viewRef.measureInWindow((x, y) => {
        this.setState({
          open: true,
          pickerX: x,
          pickerY: y,
        });
      });
    }
  };

  close = () => {
    this.setState({
      open: false,
    });
  };

  onClosePickerList = () => {
    this.close();
  };

  onChangeDimensions = (event: DimensionsEvent) => {
    const {width, height} = event.window;

    this.setState({
      windowWidth: width,
      windowHeight: height,
    });
  };

  onLayout = (event: LayoutEvent) => {
    const {width, height} = event.nativeEvent.layout;

    this.setState({
      pickerWidth: width,
      pickerHeight: height,
    });
  };

  setViewRef = (node: ?View) => {
    this.viewRef = node;
  };

  renderSelectedItem = (options: {item?: Item, selected: boolean}) => {
    const {item, selected} = options;
    const {renderSelectedItem} = this.props;

    if (typeof renderSelectedItem === 'function') {
      return renderSelectedItem(options);
    }

    const {label} = item || {label: ''};

    // Default renderer
    return <Type.Body1 bold={selected}>{label}</Type.Body1>;
  };

  renderListItem = (options: {item: Item, selected: boolean}) => {
    const {item, selected} = options;
    const {renderListItem} = this.props;

    const {label, value} = item;

    let content = null;
    if (typeof renderListItem === 'function') {
      content = renderListItem(options);
    } else {
      content = <Type.Body1 bold={selected}>{label}</Type.Body1>;
    }

    const onPress = () => {
      const {onChangeValue} = this.props;

      if (typeof onChangeValue === 'function') {
        onChangeValue(value);
      }
    };

    // Default renderer
    return <Touchable onPress={onPress}>{content}</Touchable>;
  };

  render() {
    const {selectedValue, items} = this.props;
    const {open, pickerWidth, pickerHeight, pickerX, pickerY, windowWidth, windowHeight} = this.state;

    const selectedItem = items.find(item => item.value === selectedValue);

    return (
      <>
        <View ref={this.setViewRef} onLayout={this.onLayout} style={styles.container}>
          {this.renderSelectedItem({item: selectedItem, selected: true})}
        </View>
        <PickerList
          isVisible={open}
          items={items}
          onClose={this.onClosePickerList}
          pickerWidth={pickerWidth}
          pickerHeight={pickerHeight}
          pickerX={pickerX}
          pickerY={pickerY}
          renderListItem={this.renderListItem}
          selectedValue={selectedValue}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
        />
      </>
    );
  }
}

export default Picker;
