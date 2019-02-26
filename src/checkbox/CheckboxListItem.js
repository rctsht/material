// @flow strict-local
import {isFunction, isString} from 'lodash-es';
import * as React from 'react';
import {LayoutAnimation, Platform, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import color from 'tinycolor2';

import {type ThemeProps, withTheme} from '../theme';
import {Touchable} from '../touchable';

import Checkbox from './Checkbox';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 56,
    padding: 16,
  },
  checkbox: {
    marginRight: 32,
  },
});

type Props = {
  label: string | React.Node,
  onPress: ?(mixed) => void,
  selected?: boolean,
  rctshtTheme: ThemeProps,
  value: mixed,
};

class CheckboxListItem extends React.PureComponent<Props> {
  static defaultProps = {
    onPress: null,
    selected: false,
  };

  onPress = () => {
    const {onPress, rctshtTheme, value} = this.props;

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
    const {label, selected, rctshtTheme} = this.props;

    let background;

    if (Platform.Version >= 21) {
      const rippleColor = color(rctshtTheme.colors.secondary);
      rippleColor.setAlpha(0.4);
      // eslint-disable-next-line babel/new-cap
      background = TouchableNativeFeedback.Ripple(rippleColor.toHex8String(), false);
    }

    return (
      <Touchable onPress={this.onPress} background={background}>
        <View style={styles.container}>
          <Checkbox selected={selected} style={styles.checkbox} />
          {isString(label) ? <Text numberOfLines={1}>{label}</Text> : label}
        </View>
      </Touchable>
    );
  }
}

export default withTheme(CheckboxListItem);
