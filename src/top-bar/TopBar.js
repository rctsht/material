// @flow strict-local
import * as React from 'react';
import {Platform, StatusBar, StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';

import {CircleButton} from '../button';
import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'red',
    paddingTop: StatusBar.currentHeight,
    minHeight: 56 + StatusBar.currentHeight,
  },
  leftAction: {
    marginLeft: 10,
  },
  leftActionNoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  label: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 26,
  },
  labelNoLeftAction: {
    marginLeft: 32,
  },
  rightAction: {
    marginLeft: 12,
    marginRight: 0,
  },
  menuOptionText: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    marginLeft: 7,
  },
  menuOptionTextDisabled: {
    color: '#cccccc',
  },
  menuOptions: {
    marginTop: 40,
    padding: 0,
  },
  iconWrapper: {
    paddingHorizontal: 8,
  },
});

const menuTriggerStyles = {
  triggerWrapper: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    marginRight: 4,
  },
  triggerTouchable: {},
};

const menuOptionStyles = {
  optionWrapper: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
};

type RightActionItem = {
  disabled?: boolean,
  icon?: string | React.Node,
  key: string,
  label: string,
  onPress: () => void,
  show?: 'always' | 'never',
};

type Props = {
  label: string | React.Node,
  leftIcon: string | React.Node,
  onPressLeftIcon: ?() => void,
  rightActions: Array<RightActionItem>,
  rctshtTheme: ThemeProps,
};

class TopBar extends React.Component<Props> {
  filterRightActionsByShow = (rightAction: RightActionItem) => {
    const {show} = rightAction;

    return show === 'always';
  };

  filterRightActionsByHide = (rightAction: RightActionItem) => {
    const {show} = rightAction;

    return show !== 'always';
  };

  renderEllipsisMenuAction = (ellipsisMenuAction: RightActionItem) => {
    const {disabled, icon, key, label, onPress} = ellipsisMenuAction;
    const {rctshtTheme} = this.props;

    let menuOptionIcon = null;

    if (icon != null) {
      menuOptionIcon = (
        <View style={styles.iconWrapper}>
          {typeof icon === 'string' ? <Icon name={icon} size={24} color={rctshtTheme.colors.onPrimary} /> : icon}
        </View>
      );
    }

    return (
      <MenuOption key={key} customStyles={menuOptionStyles} onSelect={onPress} disabled={disabled}>
        {menuOptionIcon}
        <Type.Body1 style={[styles.menuOptionText, disabled ? styles.menuOptionTextDisabled : null]}>
          {label}
        </Type.Body1>
      </MenuOption>
    );
  };

  renderRightAction = (rightAction: RightActionItem) => {
    const {icon, key, onPress} = rightAction;

    return (
      <View style={styles.rightAction} key={key}>
        <CircleButton icon={icon} onPress={onPress} />
      </View>
    );
  };

  render() {
    const {label, leftIcon, onPressLeftIcon, rctshtTheme, rightActions} = this.props;

    let leftAction =
      typeof leftIcon === 'string' ? <Icon name={leftIcon} size={24} color={rctshtTheme.colors.onPrimary} /> : leftIcon;

    if (leftAction != null && onPressLeftIcon) {
      leftAction = (
        <View style={styles.leftAction}>
          <CircleButton icon={leftAction} onPress={onPressLeftIcon} />
        </View>
      );
    } else if (leftAction != null) {
      leftAction = <View style={[styles.leftAction, styles.leftActionNoButton]}>{leftAction}</View>;
    } else {
      leftAction = null;
    }

    const ellipsisMenuActions = rightActions.filter(this.filterRightActionsByHide);

    const background = Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackgroundBorderless() : null;

    menuTriggerStyles.triggerTouchable = {
      background,
    };

    const ellipsisMenu = ellipsisMenuActions.length ? (
      <Menu>
        <MenuTrigger customStyles={menuTriggerStyles}>
          <Icon name="dots-vertical" size={24} color={rctshtTheme.colors.onPrimary} />
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={styles.menuOptions}>
          {ellipsisMenuActions.map(this.renderEllipsisMenuAction)}
        </MenuOptions>
      </Menu>
    ) : null;

    return (
      <View style={[styles.container, {backgroundColor: rctshtTheme.colors.primary}]}>
        {leftAction}
        <View style={[styles.label, leftAction ? null : styles.labelNoLeftAction]}>
          {typeof label === 'string' ? <Type.H6 style={{color: rctshtTheme.colors.onPrimary}}>{label}</Type.H6> : label}
        </View>
        {rightActions.filter(this.filterRightActionsByShow).map(this.renderRightAction)}
        {ellipsisMenu}
        {/*
          <View style={{position: 'absolute', top: 0, height: 4, width: 72, backgroundColor: 'black'}} />
          <View style={{position: 'absolute', top: 4, height: 4, width: 32, backgroundColor: 'white'}} />
          <View style={{position: 'absolute', top: 0, right: 0, height: 56, width: 8, backgroundColor: 'white'}} />
          <View style={{position: 'absolute', top: 0, right: 8, height: 56, width: 8, backgroundColor: 'black'}} />
          <View style={{position: 'absolute', top: 40, right: 28, height: 24, width: 24, backgroundColor: 'white'}} />
          <View style={{position: 'absolute', top: 40, right: 76, height: 24, width: 24, backgroundColor: 'black'}} />
          <View style={{position: 'absolute', top: 40, right: 124, height: 24, width: 24, backgroundColor: 'white'}} />
        */}
      </View>
    );
  }
}

export default withTheme(TopBar);
