// @flow
import * as React from 'react';
import {Platform, StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Touchable} from '../touchable';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Props = {
  icon?: Icon,
  onPress: Function,
  rctshtTheme: ThemeProps,
};

class CircleButton extends React.PureComponent<Props> {
  static defaultProps = {
    icon: null,
  };

  render() {
    const {icon, onPress, rctshtTheme, ...rest} = this.props;

    let background = null;

    if (Platform.OS === 'android') {
      background = TouchableNativeFeedback.SelectableBackground();
    }

    return (
      <View style={styles.container}>
        <Touchable background={background} style={styles.container} onPress={onPress}>
          {/* $FlowFixMe */}
          {icon || <Icon size={24} color={rctshtTheme.colors.primary} {...rest} />}
        </Touchable>
      </View>
    );
  }
}

export default withTheme(CircleButton);
