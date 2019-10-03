// @flow strict-local
import * as React from 'react';
import {ActivityIndicator, Animated, BackHandler, Dimensions, StatusBar, StyleSheet, View} from 'react-native';
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
    paddingHorizontal: 8,
    minHeight: 48,
    elevation: 1,
  },
  containerOpen: {
    elevation: 0,
  },
  containerDisabled: {
    opacity: 0.25,
  },
  containerLoading: {
    justifyContent: 'center',
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
  disabled?: boolean,
  label: string,
  value: ?string,
};

type Props = {
  disabled?: boolean,
  items: Array<Item>,
  loading: boolean,
  onChangeValue?: ?(value: ?string) => void,
  rctshtTheme: ThemeProps,
  renderFooter?: ?() => React.Node,
  renderListItem?: ?({index: number, item: Item, selected: boolean}) => React.Node,
  renderSelectedItem?: ?({index: number, item: Item, selected: boolean}) => React.Node,
  value: ?string,
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
    const {width, height} = event.nativeEvent.layout;

    this.setState({
      pickerWidth: width,
      pickerHeight: height,
    });
  };

  onPressListItem = (event: PressEvent, item: Item) => {
    const {onChangeValue} = this.props;

    if (item.disabled !== true && typeof onChangeValue === 'function') {
      onChangeValue(item.value);
    }

    this.close();
  };

  setViewRef = (node: ?View) => {
    this.viewRef = node;
  };

  renderSelectedItem = (options: {index: number, item?: Item, selected: boolean, open?: boolean}) => {
    const {index, item, selected, open = false} = options;
    const {disabled: pickerDisabled, renderSelectedItem} = this.props;

    let content;

    if (item == null) {
      content = null;
    } else if (typeof renderSelectedItem === 'function') {
      content = renderSelectedItem({index, item, selected, open});
    } else {
      const {label, disabled} = item || {label: '', value: null, disabled: false};

      // Default renderer
      content = (
        <View style={styles.selectedItem}>
          <Type.Body1 bold={selected && !disabled} style={disabled === true ? styles.disabled : null} numberOfLines={1}>
            {label}
          </Type.Body1>
        </View>
      );
    }

    return (
      <Touchable
        onPress={open ? this.close : this.open}
        style={[
          styles.container,
          open ? styles.containerOpen : null,
          pickerDisabled === true ? styles.containerDisabled : null,
        ]}
        needsOffscreenAlphaCompositing
      >
        {content}
        <Icon name={open ? 'menu-up' : 'menu-down'} size={24} />
      </Touchable>
    );
  };

  render() {
    const {disabled, items, loading, renderFooter, renderListItem, value} = this.props;
    const {open, pickerWidth, pickerHeight, pickerX, pickerY, windowWidth, windowHeight} = this.state;

    const selectedItem = items.find(item => item.value === value);

    return (
      <>
        <View ref={this.setViewRef} onLayout={this.onLayout} pointerEvents={disabled ? 'none' : 'auto'}>
          {loading ? (
            <View style={[styles.container, styles.containerLoading]}>
              <ActivityIndicator size="small" color="#3c3f43" />
            </View>
          ) : (
            this.renderSelectedItem({
              index: items.indexOf(selectedItem),
              item: selectedItem,
              selected: selectedItem ? selectedItem.disabled !== true : false,
            })
          )}
        </View>
        {disabled ? null : (
          <PickerList
            isVisible={open}
            items={items}
            onClose={this.onClosePickerList}
            onPressListItem={this.onPressListItem}
            pickerWidth={pickerWidth}
            pickerHeight={pickerHeight}
            pickerX={pickerX}
            pickerY={pickerY}
            renderFooter={renderFooter}
            renderListItem={renderListItem}
            renderSelectedItem={this.renderSelectedItem}
            scrimOpacity={this.scrimOpacity}
            selectedValue={value}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          />
        )}
      </>
    );
  }
}

export default withTheme(Picker);
