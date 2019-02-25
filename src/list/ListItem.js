// @flow strict-local
import {isFunction, isString} from 'lodash-es';
import * as React from 'react';
import {LayoutAnimation, Platform, StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import color from 'tinycolor2';

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
    borderBottomColor: 'rgba(0,0,0,0.54)',
  },
});

type Props = {
  children: React.Node,
  divider: boolean,
  expanding?: boolean,
  initialExpanded?: boolean,
  label: string | React.Node,
  leadingIcon?: React.Node,
  leadingIconColor: string,
  onPress?: Function,
  rctshtTheme: ThemeProps,
  trailingIcon?: React.Node,
  trailingIconColor: string,
};

type State = {
  expanded: boolean,
};

class ListItem extends React.PureComponent<Props, State> {
  static defaultProps = {
    initialExpanded: false,
    expanding: false,
    onPress: null,
    selected: false,
  };

  constructor(props) {
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
      // $FlowFixMe
      onPress();
    }
  };

  render() {
    const {
      children,
      divider,
      label,
      leadingIcon,
      leadingIconColor,
      expanding,
      rctshtTheme,
      trailingIcon,
      trailingIconColor,
    } = this.props;
    const {expanded} = this.state;

    let background;

    if (Platform.Version >= 21) {
      const rippleColor = color(rctshtTheme.colors.primary);
      rippleColor.setAlpha(0.4);
      // eslint-disable-next-line babel/new-cap
      background = TouchableNativeFeedback.Ripple(rippleColor.toHex8String(), false);
    }

    let expandingTrailingIcon = null;

    if (expanding) {
      expandingTrailingIcon = expanded ? <Icon name="menu-up" /> : <Icon name="menu-down" />;
    }

    return (
      <View style={divider ? styles.divider : null}>
        <Touchable onPress={this.onPress} background={background} style={styles.container} pointerEvents="box-only">
          {leadingIcon}
          <View style={styles.label}>
            {isString(label) ? (
              <Type numberOfLines={1} preset={typePresets.body1}>
                {label}
              </Type>
            ) : (
              label
            )}
          </View>
          {trailingIcon || expandingTrailingIcon}
        </Touchable>
        {children ? (
          <View style={expanding && !expanded ? {height: 0, opacity: 0, overflow: 'hidden'} : null}>{children}</View>
        ) : null}
      </View>
    );
  }
}

export default withTheme(ListItem);
