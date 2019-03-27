// @flow strict-local
import * as React from 'react';
import {PixelRatio, StyleSheet, Text} from 'react-native';
import {type TextStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

const styles = StyleSheet.create({
  defaults: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.87)',
    padding: 0,
    textShadowRadius: 0,
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
  bold: {
    fontWeight: '500',
  },
  italic: {
    fontStyle: 'italic',
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  strikeUnderline: {
    textDecorationLine: 'underline line-through',
  },
  center: {
    textAlign: 'center',
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
  children?: string | React.Node,
  preset?: $Values<typeof typePresets>,
  style?: TextStyleProp,
  bold?: boolean,
  italic?: boolean,
  strike?: boolean,
  underline?: boolean,
  center?: boolean,
};

class Type extends React.PureComponent<Props> {
  static defaultProps = {
    alignToBaseline: undefined,
    children: null,
    preset: null,
    style: null,
  };

  static H1 = class H1 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.h1};
  };

  static H2 = class H2 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.h2};
  };

  static H3 = class H3 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.h3};
  };

  static H4 = class H4 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.h4};
  };

  static H5 = class H5 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.h5};
  };

  static H6 = class H6 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.h6};
  };

  static Subtitle1 = class Subtitle1 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.subtitle1};
  };

  static Subtitle2 = class Subtitle2 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.subtitle2};
  };

  static Body1 = class Body1 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.body1};
  };

  static Body2 = class Body2 extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.body2};
  };

  static Button = class Button extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.button};
  };

  static Caption = class Caption extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.caption};
  };

  static Overline = class Overline extends Type {
    static defaultProps = {...Type.defaultProps, preset: typePresets.overline};
  };

  render() {
    const {alignToBaseline, children, preset, style, bold, italic, strike, underline, center} = this.props;

    const textStyle = StyleSheet.flatten([
      styles.defaults,
      !preset && (!style || (style.fontSize == null && style.lineHeight == null)) ? styles.defaultLineHeight : null,
      preset || null,
      bold ? styles.bold : null,
      italic ? styles.italic : null,
      strike && !underline ? styles.strike : null,
      underline && !strike ? styles.underline : null,
      strike && underline ? styles.strikeUnderline : null,
      center ? styles.center : null,
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
