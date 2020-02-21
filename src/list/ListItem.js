// @flow strict-local
import {isFunction, isString} from 'lodash-es';
import * as React from 'react';
import {LayoutAnimation, StyleSheet, View} from 'react-native';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';
import {Touchable} from '../touchable';
import {Type, typePresets} from '../type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 56,
    padding: 16,
  },
  label: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  disabled: {
    opacity: 0.25,
  },
});

type DefaultProps = {|
  children: React.Node,
  divider: boolean,
  expanding: boolean,
  initialExpanded: boolean,
  leadingIcon: React.Node,
  onPress: ?() => void,
  trailingIcon: React.Node,
  disabled: boolean,
|};

type Props = {
  ...DefaultProps,
  label: string | React.Node,
  rctshtTheme: ThemeProps,
};

type State = {
  expanded: boolean,
};

class ListItem extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    children: null,
    divider: false,
    initialExpanded: false,
    expanding: false,
    onPress: null,
    leadingIcon: null,
    trailingIcon: null,
    disabled: false,
  };

  constructor(props: Props) {
    super(props);

    const {initialExpanded} = props;

    this.state = {
      expanded: initialExpanded,
    };
  }

  onPress = () => {
    const {expanding, onPress, rctshtTheme} = this.props;
    const {expanded} = this.state;

    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        expanded ? rctshtTheme.animations.medium.out : rctshtTheme.animations.medium.in,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );

    if (expanding) {
      this.setState(oldState => ({
        expanded: !oldState.expanded,
      }));
    }

    if (isFunction(onPress)) {
      onPress();
    }
  };

  render() {
    const {children, divider, label, leadingIcon, expanding, trailingIcon, disabled} = this.props;
    const {expanded} = this.state;

    let expandingTrailingIcon = null;

    if (expanding) {
      expandingTrailingIcon = expanded ? <Icon name="menu-up" /> : <Icon name="menu-down" />;
    }

    return (
      <View
        style={[divider ? styles.divider : null, disabled ? styles.disabled : null]}
        needsOffscreenAlphaCompositing={disabled}
      >
        <Touchable onPress={this.onPress} disabled={disabled} style={styles.container} pointerEvents="box-only">
          {leadingIcon}
          <View style={styles.label}>
            {isString(label) ? (
              <Type.Default numberOfLines={1} preset={typePresets.body1}>
                {label}
              </Type.Default>
            ) : (
              label
            )}
          </View>
          {trailingIcon != null ? trailingIcon : expandingTrailingIcon}
        </Touchable>
        {children != null ? (
          <View style={expanding && !expanded ? {height: 0, opacity: 0, overflow: 'hidden'} : null}>{children}</View>
        ) : null}
      </View>
    );
  }
}

export default withTheme<React.Config<Props, DefaultProps>, ListItem>(ListItem);
