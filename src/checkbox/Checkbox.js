// @flow strict-local
import {isFunction} from 'lodash-es';
import * as React from 'react';
import {LayoutAnimation, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';

const styles = StyleSheet.create({
  outerSquare: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#00000089',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerSquareDisabled: {
    opacity: 0.5,
  },
  innerSquare: {
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerSquareSelected: {
    width: 16,
    height: 16,
  },
});

type Props = {
  onPress: ?(mixed) => void,
  rctshtTheme: ThemeProps,
  selected?: boolean,
  value?: mixed,
  style: ViewStyleProp,
  disabled: boolean,
};

class Checkbox extends React.PureComponent<Props> {
  static defaultProps = {
    onPress: null,
    selected: false,
    value: null,
    style: null,
    disabled: false,
  };

  onPress = () => {
    const {disabled, onPress, rctshtTheme, value} = this.props;

    if (disabled) {
      return;
    }

    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        rctshtTheme.animations.control.selection,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleXY,
      ),
    );

    if (isFunction(onPress)) {
      onPress(value);
    }
  };

  render() {
    const {onPress, rctshtTheme, selected, disabled, style} = this.props;

    const checkbox = (
      <View
        style={[
          styles.outerSquare,
          selected ? {borderColor: rctshtTheme.colors.secondary} : null,
          ...(Array.isArray(style) ? style : [style]),
          disabled ? styles.outerSquareDisabled : null,
        ]}
        needsOffscreenAlphaCompositing
      >
        <View
          style={[
            styles.innerSquare,
            {backgroundColor: rctshtTheme.colors.secondary},
            selected ? styles.innerSquareSelected : null,
          ]}
        >
          <Icon name="check" color={selected ? rctshtTheme.colors.background : 'transparent'} size={16} />
        </View>
      </View>
    );

    if (isFunction(onPress) && !disabled) {
      return <TouchableWithoutFeedback onPress={this.onPress}>{checkbox}</TouchableWithoutFeedback>;
    }

    return checkbox;
  }
}

export default withTheme(Checkbox);
