// @flow
import isFunction from 'lodash.isfunction';
import * as React from 'react';
import {LayoutAnimation, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {type ThemeProps, withTheme} from '../theme';

const styles = StyleSheet.create({
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00000089',
    marginRight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 0,
    height: 0,
    borderRadius: 5,
  },
  innerCircleSelected: {
    width: 10,
    height: 10,
  },
});

type Props = {
  onPress?: Function,
  rctshtTheme: ThemeProps,
  selected?: boolean,
  value?: any,
};

class Checkbox extends React.PureComponent<Props> {
  static defaultProps = {
    onPress: null,
    selected: false,
    value: null,
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
      // $FlowFixMe
      onPress(value);
    }
  };

  render() {
    const {onPress, rctshtTheme, selected} = this.props;

    const checkbox = (
      <View style={[styles.outerCircle, selected ? {borderColor: rctshtTheme.colors.secondary} : null]}>
        <View
          style={[
            styles.innerCircle,
            {backgroundColor: rctshtTheme.colors.secondary},
            selected ? styles.innerCircleSelected : null,
          ]}
        />
      </View>
    );

    if (isFunction(onPress)) {
      return <TouchableWithoutFeedback onPress={this.onPress}>{checkbox}</TouchableWithoutFeedback>;
    }

    return checkbox;
  }
}

export default withTheme(Checkbox);
