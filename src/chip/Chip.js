// @flow strict-local
import isFunction from 'lodash.isfunction';
import isString from 'lodash.isstring';
import * as React from 'react';
import {LayoutAnimation, StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import {Icon} from '../icon';
import {withTheme, type ThemeProps} from '../theme';
import {Touchable} from '../touchable';
import {Type} from '../type';

const styles = StyleSheet.create({
  container2: {
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  container: {
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerOutlined: {
    borderWidth: 1,
    borderColor: '#b3b3b3',
  },
  containerFilled: {
    backgroundColor: '#eaeaea',
  },
  containerSelected: {
    backgroundColor: '#eaeaea',
  },
  containerFilledAndSelected: {
    backgroundColor: '#d2d2d2',
  },
  containerLeftPad: {
    paddingLeft: 12,
  },
  containerRightPad: {
    paddingRight: 12,
  },
  labelWrapper: {
    flexShrink: 1,
  },
  labelText: {
    color: '#212121',
  },
  thumbnailWrapper: {
    flex: 0,
    paddingLeft: 4,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicatorWrapper: {
    paddingLeft: 4,
    paddingRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 0,
    width: 32,
    height: 32,
    padding: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    width: 24,
    height: 24,
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Props = {
  highlighted?: boolean,
  icon?: string | React.Node,
  label?: string | React.Node,
  onPress?: Function,
  onPressRemove?: Function,
  outline?: boolean,
  rctshtTheme: ThemeProps,
  selected?: boolean,
  thumbnail?: string | React.Node,
  value?: any,
};

class Chip extends React.PureComponent<Props> {
  static defaultProps = {
    highlighted: false,
    icon: null,
    label: null,
    onPress: null,
    onPressRemove: null,
    outline: false,
    selected: false,
    thumbnail: null,
    value: null,
  };

  onPress = () => {
    const {onPress, rctshtTheme, value} = this.props;

    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        rctshtTheme.animations.control.selection,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleY,
      ),
    );

    if (onPress && isFunction(onPress)) {
      onPress(value);
    }
  };

  onPressRemove = () => {
    const {onPressRemove, rctshtTheme, value} = this.props;

    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        rctshtTheme.animations.control.selection,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleY,
      ),
    );

    if (onPressRemove && isFunction(onPressRemove)) {
      onPressRemove(value);
    }
  };

  render() {
    const {highlighted, icon, label, outline, selected, thumbnail, rctshtTheme} = this.props;

    // eslint-disable-next-line babel/new-cap
    const background = TouchableNativeFeedback.SelectableBackgroundBorderless();

    const thumb = thumbnail ? <View style={styles.thumbnailWrapper}>{thumbnail}</View> : null;
    const selectedIndicator = selected ? (
      <View style={styles.selectedIndicatorWrapper}>
        <Icon name="check" size={18} />
      </View>
    ) : null;

    return (
      <View style={styles.container2}>
        <Touchable
          onPress={this.onPress}
          style={[
            styles.container,
            outline ? styles.containerOutlined : styles.containerFilled,
            !thumbnail && !selected ? styles.containerLeftPad : null,
            !icon ? styles.containerRightPad : null,
            selected ? styles.containerSelected : null,
            highlighted ? {backgroundColor: `${rctshtTheme.colors.primary}`} : null,
          ]}
        >
          {selectedIndicator || thumb}
          <View style={styles.labelWrapper}>
            {isString(label) ? (
              <Type
                style={[styles.labelText, highlighted ? {color: rctshtTheme.colors.onPrimary} : null]}
                numberOfLines={1}
              >
                {label}
              </Type>
            ) : (
              label
            )}
          </View>
          {icon ? (
            <View style={styles.buttonWrapper}>
              <Touchable style={styles.button} background={background} onPress={this.onPressRemove}>
                {/* $FlowFixMe: isString not recognised as determining type */}
                {isString(icon) ? <Icon name={icon} size={18} /> : icon}
              </Touchable>
            </View>
          ) : null}
        </Touchable>
      </View>
    );
  }
}

export default withTheme(Chip);
