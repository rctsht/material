// @flow strict-local
import * as React from 'react';
import {Animated, BackHandler, Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {LayoutEvent, PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Touchable} from '../touchable';
import {Type} from '../type';
import type {DimensionsEvent} from '../types';

import PickerList from './PickerList';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  selectedItem: {
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
  items: Array<Item>,
  onChangeValue?: ?(value: ?string) => void,
  rctshtTheme: ThemeProps,
  renderListItem?: ?({item: Item, selected: boolean}) => React.Node,
  renderSelectedItem?: ?({item?: Item, selected: boolean}) => React.Node,
  style: ViewStyleProp,
  value: ?string,
};

type State = {
  open: boolean,
  pickerWidth: number,
  pickerX: number,
  pickerY: number,
  windowWidth: number,
  windowHeight: number,
};

class Picker extends React.PureComponent<Props, State> {
  backHandler: {
    remove: () => void,
  };

  scrimOpacity = new Animated.Value(0);

  viewRef: ?View;

  constructor(props: Props) {
    super(props);

    const {width, height} = Dimensions.get('window');

    this.state = {
      open: false,
      pickerWidth: 0,
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
    if (this.backHandler) {
      this.backHandler.remove();
    }
    Dimensions.removeEventListener('change', this.onChangeDimensions);
  }

  handleBackPress = () => {
    this.close();
    return true;
  };

  open = () => {
    if (this.viewRef) {
      this.viewRef.measureInWindow((x, y) => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.scrimOpacity.setValue(0);
        // eslint-disable-next-line react/no-did-update-set-state
        const {width, height} = Dimensions.get('window');
        this.setState(
          {
            open: true,
            pickerX: x,
            pickerY: y + StatusBar.currentHeight,
            windowWidth: width,
            windowHeight: height,
          },
          () => {
            const {rctshtTheme} = this.props;
            Animated.timing(this.scrimOpacity, {
              toValue: 1,
              duration: rctshtTheme.animations.dialog.in,
              easing: rctshtTheme.animations.decelerateEasing,
              useNativeDriver: true,
            }).start();
          },
        );
      });
    }
  };

  close = () => {
    const {rctshtTheme} = this.props;
    this.scrimOpacity.setValue(1);
    Animated.timing(this.scrimOpacity, {
      toValue: 0,
      duration: rctshtTheme.animations.dialog.out,
      easing: rctshtTheme.animations.accelerateEasing,
      useNativeDriver: true,
    }).start(() => {
      if (this.backHandler) {
        this.backHandler.remove();
      }
      this.setState({
        open: false,
      });
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
    const {width} = event.nativeEvent.layout;

    this.setState({
      pickerWidth: width,
    });
  };

  onPressListItem = (event: PressEvent, value?: string) => {
    const {onChangeValue} = this.props;

    if (value != null && typeof onChangeValue === 'function') {
      onChangeValue(value);
    }

    this.close();
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

    const {label, value} = item || {label: '', value: null};

    // Default renderer
    return (
      <View style={styles.selectedItem}>
        <Type.Body1 bold={selected} style={value == null ? styles.disabled : null} numberOfLines={1}>
          {label}
        </Type.Body1>
      </View>
    );
  };

  render() {
    const {items, renderListItem, style, value} = this.props;
    const {open, pickerWidth, pickerX, pickerY, windowWidth, windowHeight} = this.state;

    const selectedItem = items.find(item => item.value === value);

    return (
      <>
        <View ref={this.setViewRef} onLayout={this.onLayout}>
          <Touchable onPress={this.open} style={[styles.container, ...(Array.isArray(style) ? style : [style])]}>
            {this.renderSelectedItem({item: selectedItem, selected: selectedItem ? selectedItem.value != null : false})}
            <Icon name="menu-down" size={24} />
          </Touchable>
        </View>
        <PickerList
          isVisible={open}
          items={items}
          onClose={this.onClosePickerList}
          onPressListItem={this.onPressListItem}
          pickerWidth={pickerWidth}
          pickerX={pickerX}
          pickerY={pickerY}
          renderListItem={renderListItem}
          scrimOpacity={this.scrimOpacity}
          selectedValue={value}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
        />
      </>
    );
  }
}

export default withTheme(Picker);
