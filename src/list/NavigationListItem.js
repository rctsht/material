// @flow strict-local
import isString from 'lodash.isstring';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {Icon} from '../icon';
import {withTheme, type ThemeProps} from '../theme';
import {Touchable} from '../touchable';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  active: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 4,
    bottom: 4,
    borderRadius: 4,
  },
  indent: {
    width: 56,
  },
  icon: {
    flex: 0,
    width: 24,
    marginLeft: 16,
    marginRight: 16,
  },
  label: {
    flex: 1,
    marginLeft: 16,
  },
});

type Props = {
  active: boolean,
  icon: string | React.Node,
  indent: boolean,
  label: string | React.Node,
  onPress: Function,
  rctshtTheme: ThemeProps,
};

class NavigationListItem extends React.PureComponent<Props> {
  render() {
    const {active, icon, indent, label, onPress, rctshtTheme} = this.props;

    let iconNode = null;

    if (icon) {
      iconNode = (
        <View style={styles.icon}>
          {isString(icon) ? (
            // $FlowFixMe
            <Icon name={icon} size={24} color={active ? rctshtTheme.colors.secondary : '#757575'} />
          ) : (
            icon
          )}
        </View>
      );
    } else if (indent) {
      iconNode = <View style={styles.indent} />;
    }

    return (
      <Touchable style={styles.container} onPress={onPress} disabled={active}>
        {active ? <View style={[styles.active, {backgroundColor: `${rctshtTheme.colors.secondary}33`}]} /> : null}
        {iconNode}
        {/* $FlowFixMe */}
        {isString(label) ? <Type style={styles.label}>{label}</Type> : label}
      </Touchable>
    );
  }
}

export default withTheme(NavigationListItem);
