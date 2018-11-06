// @flow
import * as React from 'react';
import {Platform, TouchableOpacity, TouchableNativeFeedback, View} from 'react-native';
import {type ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
  children?: React.Node,
  pointerEvents?: string,
  style: ViewStyleProp,
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
