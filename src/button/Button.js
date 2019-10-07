// @flow strict-local
/* eslint-disable max-classes-per-file */
/* eslint-disable react/static-property-placement */
import {isString} from 'lodash-es';
import * as React from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import type {PressEvent} from 'react-native/Libraries/Types/CoreEventTypes'
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Touchable} from '../touchable';
import {Type, typePresets} from '../type';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  button: {
    height: 36,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containedButton: {
    minWidth: 64,
    elevation: 2,
  },
  outlinedButton: {
    minWidth: 64,
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
  icon?: string | React.Node,
  iconColor?: string,
  label?: string | React.Node,
  labelColor?: string,
  onPress: ?(event: PressEvent) => void,
  rctshtTheme: ThemeProps,
  type?: $Values<typeof types>,
  style: ViewStyleProp,
};

type DefaultProps = {
  backgroundColor?: string,
  borderColor?: string,
  disabled?: boolean,
  icon?: string | React.Node,
  iconColor?: string,
  label?: string | React.Node,
  labelColor?: string,
  onPress: ?(event: PressEvent) => void,
  type?: $Values<typeof types>,
  style: ViewStyleProp,
};

export type ButtonProps = $Diff<React.Config<Props, DefaultProps>, {rctshtTheme: ThemeProps | void}>;

class Button extends React.PureComponent<Props> {
  static types = types;

  static defaultProps: DefaultProps = {
    backgroundColor: undefined,
    borderColor: undefined,
    disabled: false,
    icon: null,
    iconColor: undefined,
    label: null,
    labelColor: undefined,
    onPress: null,
    style: null,
    type: types.TEXT,
  };

  render() {
    const {disabled, icon, label, onPress, rctshtTheme, type, style} = this.props;
    const defaultIconLabelColor =
      type === Button.types.CONTAINED ? rctshtTheme.colors.onPrimary : rctshtTheme.colors.primary;
    const {
      backgroundColor = rctshtTheme.colors.primary,
      borderColor = rctshtTheme.colors.primary,
      iconColor = defaultIconLabelColor,
      labelColor = defaultIconLabelColor,
    } = this.props;

    // $FlowFixMe
    const iconNode = isString(icon) ? <Icon name={icon} size={18} color={iconColor} /> : icon;
    const labelNode = isString(label) ? (
      <Type.Default preset={typePresets.button} style={{color: labelColor}}>
        {label.toUpperCase()}
      </Type.Default>
    ) : (
      label
    );

    let additionalStyles = null;

    switch (type) {
      case Button.types.CONTAINED:
        additionalStyles = {
          ...styles.containedButton,
          backgroundColor,
          borderRadius: rctshtTheme.components.button.contained.borderRadius,
          height: rctshtTheme.components.button.contained.height,
        };
        break;
      case Button.types.OUTLINED:
        additionalStyles = {
          ...styles.outlinedButton,
          borderColor,
          borderRadius: rctshtTheme.components.button.outlined.borderRadius,
          height: rctshtTheme.components.button.outlined.height,
        };
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

    const touchableStyles = [
      styles.button,
      additionalStyles,
      iconNode != null ? styles.iconButton : null,
      ...(Array.isArray(style) ? style : [style]),
    ]

    const {borderRadius, elevation} = StyleSheet.flatten(touchableStyles) || {};

    return (
      <View
        style={[styles.container, {borderRadius, elevation}, disabled ? {opacity: 0.25} : null]}
        needsOffscreenAlphaCompositing
      >
        <Touchable background={background} disabled={disabled} onPress={onPress} style={touchableStyles}>
          {iconNode != null ? <View style={styles.icon}>{iconNode}</View> : null}
          {labelNode != null ? <View style={styles.label}>{labelNode}</View> : null}
        </Touchable>
      </View>
    );
  }
}

const ButtonWithTheme = {
  Text: withTheme<React.Config<Props, DefaultProps>, Button>(
    class Text extends Button {
      static defaultProps = {...Button.defaultProps, type: Button.types.TEXT};
    },
  ),
  Contained: withTheme<React.Config<Props, DefaultProps>, Button>(
    class Contained extends Button {
      static defaultProps = {...Button.defaultProps, type: Button.types.CONTAINED};
    },
  ),
  Outlined: withTheme<React.Config<Props, DefaultProps>, Button>(
    class Outlined extends Button {
      static defaultProps = {...Button.defaultProps, type: Button.types.OUTLINED};
    },
  ),
  Toggle: withTheme<React.Config<Props, DefaultProps>, Button>(
    class Toggle extends Button {
      static defaultProps = {...Button.defaultProps, type: Button.types.TOGGLE};
    },
  ),
};

export default ButtonWithTheme;
