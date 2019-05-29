// @flow strict-local
import * as React from 'react';
import {LayoutAnimation, StyleSheet, View} from 'react-native';

import {Button, type ButtonProps} from '../button';
import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Type, typePresets} from '../type';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  containerHidden: {
    height: 0,
    borderBottomWidth: 0,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
  },
  iconWrapper: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButtonWrapper: {
    marginLeft: 8,
  },
});

type Props = {
  actions: Array<{key?: string} & ButtonProps>,
  icon: string,
  message: string,
  rctshtTheme: ThemeProps,
  visible: boolean,
};

class Banner extends React.PureComponent<Props> {
  componentWillReceiveProps(nextProps: Props) {
    const {visible} = this.props;
    const {visible: nextVisible} = nextProps;

    if (visible !== nextVisible) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(250, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.scaleY),
      );
    }
  }

  render() {
    const {actions, icon, message, rctshtTheme, visible} = this.props;

    return (
      <View style={[styles.container, visible ? null : styles.containerHidden]}>
        <View style={styles.content}>
          <View style={[styles.iconWrapper, {backgroundColor: rctshtTheme.colors.primary}]}>
            <Icon name={icon} size={24} color="#ffffff" />
          </View>
          <Type.Default preset={typePresets.body2} style={styles.text} numberOfLines={2}>
            {message}
          </Type.Default>
        </View>
        <View style={styles.actions}>
          <View style={{flex: 1}} />
          {actions.map((action, index) => {
            const {key = index, ...rest} = action;
            return (
              <View style={styles.actionButtonWrapper} key={key}>
                <Button {...rest} />
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default withTheme(Banner);
