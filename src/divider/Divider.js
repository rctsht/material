// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {type ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  fullWidthDivider: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  dividerLine: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

type Props = {
  fullWidth?: boolean,
  color?: string,
  style?: ViewStyleProp,
};

class Divider extends React.PureComponent<Props> {
  static defaultProps = {
    fullWidth: false,
    color: '#e0e0e0',
    style: null,
  };

  render() {
    const {color, fullWidth, style} = this.props;

    return (
      <View
        style={[Array.isArray(style) ? style : [style], styles.divider, fullWidth ? styles.fullWidthDivider : null]}
      >
        <View style={[styles.dividerLine, {borderTopColor: color}]} />
      </View>
    );
  }
}

export default Divider;
