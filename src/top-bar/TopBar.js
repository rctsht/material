// @flow strict-local
import * as React from 'react';
import {Platform, StatusBar, StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import {CircleButton} from '../button';
import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight,
    minHeight: 56 + StatusBar.currentHeight,
  },
  leftAction: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  menu: {
    marginRight: 8,
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
    marginRight: -4,
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
  leadingIcon?: string | React.Node,
  trailingIcon?: string | React.Node,
  key: string,
  label: string,
  onPress: () => void,
  show?: 'always' | 'never',
};

type Props = {
  label: string | React.Node,
  leftIcon: string | React.Node,
  leftNode?: React.Node,
  onPressLeftIcon: ?() => void,
  rightActions: Array<RightActionItem>,
  rctshtTheme: ThemeProps,
  style: ViewStyleProp,
};

class TopBar extends React.Component<Props> {
  static defaultProps = {
    rightActions: [],
  };

  filterRightActionsByShow = (rightAction: RightActionItem) => {
    const {show} = rightAction;

    return show === 'always';
  };

  filterRightActionsByHide = (rightAction: RightActionItem) => {
    const {show} = rightAction;

    return show !== 'always';
  };

  renderEllipsisMenuAction = (ellipsisMenuAction: RightActionItem) => {
    const {disabled, leadingIcon, trailingIcon, key, label, onPress} = ellipsisMenuAction;
    const {rctshtTheme} = this.props;

    let leadingMenuOptionIcon = null;
    let trailingMenuOptionIcon = null;

    if (leadingIcon != null) {
      leadingMenuOptionIcon = (
        <View style={styles.iconWrapper}>
          {typeof leadingIcon === 'string' ? (
            <Icon name={leadingIcon} size={24} color={rctshtTheme.colors.onPrimary} />
          ) : (
            leadingIcon
          )}
        </View>
      );
    }

    if (trailingIcon != null) {
      trailingMenuOptionIcon = (
        <View style={styles.iconWrapper}>
          {typeof trailingIcon === 'string' ? (
            <Icon name={trailingIcon} size={24} color={rctshtTheme.colors.onPrimary} />
          ) : (
            trailingIcon
          )}
        </View>
      );
    }

    return (
      <MenuOption key={key} customStyles={menuOptionStyles} onSelect={onPress} disabled={disabled}>
        {leadingMenuOptionIcon}
        <Type.Body1 style={[styles.menuOptionText, disabled ? styles.menuOptionTextDisabled : null]}>
          {label}
        </Type.Body1>
        {trailingMenuOptionIcon}
      </MenuOption>
    );
  };

  renderRightAction = (rightAction: RightActionItem) => {
    const {leadingIcon, key, onPress} = rightAction;

    return (
      <View style={styles.rightAction} key={key}>
        <CircleButton allowOverflow icon={leadingIcon} onPress={onPress} />
      </View>
    );
  };

  render() {
    const {label, leftNode, leftIcon, onPressLeftIcon, rctshtTheme, rightActions, style} = this.props;

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
      <Menu style={styles.menu}>
        <MenuTrigger customStyles={menuTriggerStyles}>
          <Icon name="dots-vertical" size={24} color={rctshtTheme.colors.onPrimary} />
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={styles.menuOptions}>
          {ellipsisMenuActions.map(this.renderEllipsisMenuAction)}
        </MenuOptions>
      </Menu>
    ) : (
      <View style={{width: 8}} />
    );

    return (
      <View
        style={[
          styles.container,
          {backgroundColor: rctshtTheme.colors.primary},
          ...(Array.isArray(style) ? style : [style]),
        ]}
      >
        {leftNode != null ? leftNode : leftAction}
        <View style={[styles.label, leftAction ? null : styles.labelNoLeftAction]}>
          {typeof label === 'string' ? <Type.H6 style={{color: rctshtTheme.colors.onPrimary}}>{label}</Type.H6> : label}
        </View>
        {rightActions.filter(this.filterRightActionsByShow).map(this.renderRightAction)}
        {ellipsisMenu}
        {/*
          <View
            style={{position: 'absolute', top: StatusBar.currentHeight, height: 4, width: 72, backgroundColor: 'black'}}
          />
          <View
            style={{
              position: 'absolute',
              top: StatusBar.currentHeight + 4,
              height: 4,
              width: 32,
              backgroundColor: 'white',
            }}
          />
          <View style={{position: 'absolute', top: 0, right: 0, height: 56, width: 8, backgroundColor: 'white'}} />
          <View style={{position: 'absolute', top: 0, right: 8, height: 56, width: 8, backgroundColor: 'black'}} />
          <View style={{position: 'absolute', top: 40, right: 28, height: 24, width: 24, backgroundColor: 'white'}} />
          <View style={{position: 'absolute', top: 40, right: 76, height: 24, width: 24, backgroundColor: 'black'}} />
          <View style={{position: 'absolute', top: 40, right: 124, height: 24, width: 24, backgroundColor: 'white'}} />
          <View
            style={{
              position: 'absolute',
              top: 0,
              height: StatusBar.currentHeight,
              left: 0,
              right: 0,
              backgroundColor: 'black',
            }}
          />
        */}
      </View>
    );
  }
}

export type {RightActionItem};
export default withTheme(TopBar);
