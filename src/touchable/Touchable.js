// @flow
import React from 'react';
import type {Node} from 'react';
import {Platform, TouchableOpacity, TouchableNativeFeedback, View} from 'react-native';
import type {StyleObj} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type Props = {
  children?: Node,
  pointerEvents?: string,
  style: StyleObj,
};

function Touchable(props: Props) {
  if (Platform.OS === 'android') {
    const {children, pointerEvents, style} = props;

    return (
      <TouchableNativeFeedback {...props}>
        <View style={style} pointerEvents={pointerEvents}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return <TouchableOpacity {...props} />;
}

Touchable.defaultProps = {
  children: null,
  pointerEvents: undefined,
};

export default Touchable;
