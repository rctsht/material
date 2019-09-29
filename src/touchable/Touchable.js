// @flow strict-local
import * as React from 'react';
import {Platform, TouchableOpacity, TouchableNativeFeedback, View} from 'react-native';
import {type ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
  children: React.Node,
  pointerEvents?: ?('auto' | 'box-none' | 'box-only' | 'none'),
  style: ViewStyleProp,
};

function Touchable(props: Props) {
  if (Platform.OS === 'android') {
    const {children, pointerEvents, style} = props;

    return (
      <TouchableNativeFeedback
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        <View style={style} pointerEvents={pointerEvents}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    // $FlowFixMe
    <TouchableOpacity
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

Touchable.defaultProps = {
  children: null,
  pointerEvents: undefined,
  style: null,
};

export default Touchable;
