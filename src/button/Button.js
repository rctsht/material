// @flow
import isString from 'lodash.isstring';
import React, {PureComponent} from 'react';
import type {Node} from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Touchable} from '../touchable';
import {Type, typePresets} from '../type';

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    height: 36,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containedButton: {
    borderRadius: 3,
  },
  outlinedButton: {
    borderRadius: 3,
    borderWidth: 1,
  },
  textButton: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  toggleButton: {
    minWidth: 48,
    width: 48,
    height: 48,
    paddingLeft: 12,
    paddingRight: 12,
  },
  iconButton: {
    paddingLeft: 12,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  label: {},
});

const types = {
  CONTAINED: 'CONTAINED',
  OUTLINED: 'OUTLINED',
  TEXT: 'TEXT',
  TOGGLE: 'TOGGLE',
};

type Props = {
  backgroundColor?: string,
  borderColor?: string,
  disabled?: boolean,
  icon?: string | Node,
  iconColor?: string,
  label?: string | Node,
  labelColor?: string,
  onPress?: Function,
  rctshtTheme: ThemeProps,
  type?: $Values<typeof types>,
};

class Button extends PureComponent<Props> {
  static types = types;

  static defaultProps = {
    backgroundColor: undefined,
    borderColor: undefined,
    disabled: false,
    icon: null,
    iconColor: undefined,
    label: null,
    labelColor: undefined,
    onPress: null,
    type: types.TEXT,
  };

  render() {
    const {disabled, icon, label, onPress, rctshtTheme, type} = this.props;
    const defaultIconLabelColor =
      type === Button.types.CONTAINED ? rctshtTheme.colors.onSecondary : rctshtTheme.colors.secondary;
    const {
      backgroundColor = rctshtTheme.colors.secondary,
      borderColor = rctshtTheme.colors.secondary,
      iconColor = defaultIconLabelColor,
      labelColor = defaultIconLabelColor,
    } = this.props;

    // $FlowFixMe
    const iconNode = isString(icon) ? <Icon name={icon} size={18} color={iconColor} /> : icon;
    const labelNode = isString(label) ? (
      <Type preset={typePresets.button} style={{color: labelColor}}>
        {/* $FlowFixMe */}
        {label.toUpperCase()}
      </Type>
    ) : (
      label
    );

    let additionalStyles = null;

    switch (type) {
      case Button.types.CONTAINED:
        additionalStyles = {...styles.containedButton, backgroundColor};
        break;
      case Button.types.OUTLINED:
        additionalStyles = {...styles.outlinedButton, borderColor};
        break;
      case Button.types.TEXT:
        additionalStyles = styles.textButton;
        break;
      case Button.types.TOGGLE:
        additionalStyles = styles.toggleButton;
        break;
      default:
        break;
    }

    // eslint-disable-next-line babel/new-cap
    const background = TouchableNativeFeedback.SelectableBackground();

    return (
      <Touchable
        background={background}
        disabled={disabled}
        onPress={onPress}
        style={[styles.button, additionalStyles, iconNode ? styles.iconButton : null]}
      >
        {iconNode ? <View style={styles.icon}>{iconNode}</View> : null}
        {labelNode ? <View style={styles.label}>{labelNode}</View> : null}
      </Touchable>
    );
  }
}

export default withTheme(Button);
