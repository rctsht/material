// @flow
import * as React from 'react';
import {PixelRatio, StyleSheet, Text} from 'react-native';
import type {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';

const styles = StyleSheet.create({
  defaults: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.87)',
    padding: 0,
  },
  defaultLineHeight: {
    lineHeight: 20,
  },
  presetH1: {
    fontWeight: '300',
    fontSize: 48,
    lineHeight: 52,
  },
  presetH2: {
    fontWeight: '300',
    fontSize: 44,
    lineHeight: 48,
  },
  presetH3: {
    fontSize: 40,
    lineHeight: 44,
  },
  presetH4: {
    fontSize: 34,
    lineHeight: 40,
  },
  presetH5: {
    fontSize: 24,
    lineHeight: 32,
  },
  presetH6: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 32,
  },
  presetSubtitle1: {
    fontSize: 16,
    lineHeight: 28,
  },
  presetSubtitle2: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 24,
  },
  presetBody1: {
    fontSize: 16,
    lineHeight: 24,
  },
  presetBody2: {
    fontSize: 14,
    lineHeight: 20,
  },
  presetButton: {
    fontWeight: '500',
    fontSize: 14,
  },
  presetCaption: {
    fontSize: 12,
    lineHeight: 12,
  },
  presetOverline: {
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 10,
  },
});

const typePresets = {
  h1: styles.presetH1,
  h2: styles.presetH2,
  h3: styles.presetH3,
  h4: styles.presetH4,
  h5: styles.presetH5,
  h6: styles.presetH6,
  subtitle1: styles.presetSubtitle1,
  subtitle2: styles.presetSubtitle2,
  body1: styles.presetBody1,
  body2: styles.presetBody2,
  button: styles.presetButton,
  caption: styles.presetCaption,
  overline: styles.presetOverline,
};

type Props = {
  alignToBaseline?: number,
  children?: string | Node,
  preset?: $Values<typeof typePresets>,
  style?: TextStyle,
};

class Type extends React.PureComponent<Props> {
  static defaultProps = {
    alignToBaseline: undefined,
    children: null,
    preset: null,
    style: null,
  };

  render() {
    const {alignToBaseline, children, preset, style} = this.props;

    const textStyle = StyleSheet.flatten([
      styles.defaults,
      !preset && (!style || (style.fontSize == null && style.lineHeight == null)) ? styles.defaultLineHeight : null,
      preset || null,
      style,
    ]);

    // In order to support certain Material Design guidelines where a text block is offset N dp to the baseline, we can
    // set the alignToBaseline prop to N and the baseline of the text will be offset from the previous element by that
    // value. This alignment isn't pixel perfect due to the padding within the font itself, as well as the device font
    // scaling settings, but it's a good approximation.
    if (alignToBaseline != null && Number.isInteger(alignToBaseline)) {
      const {lineHeight, fontSize} = textStyle;

      const fontScale = PixelRatio.getFontScale();

      const adjustedLineHeight = lineHeight * fontScale;
      const adjustedFontSize = fontSize * fontScale;
      const adjustedLineToFontPadding = (adjustedLineHeight - adjustedFontSize) / 2;

      textStyle.marginTop = alignToBaseline - adjustedLineHeight + adjustedLineToFontPadding;
    }

    return (
      <Text {...this.props} style={textStyle}>
        {children}
      </Text>
    );
  }
}

export {Type, typePresets};
