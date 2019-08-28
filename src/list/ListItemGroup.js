// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = {
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
};

type Props = {
  children: React.Node,
  divider?: boolean,
};

class ListItemGroup extends React.PureComponent<Props> {
  render() {
    const {children, divider, ...rest} = this.props;
    const propsToApply = divider !== undefined ? {divider, ...rest} : {...rest};

    return (
      <View style={divider ? styles.divider : null}>
        {React.Children.map(children, child => (child ? React.cloneElement(child, propsToApply) : null))}
      </View>
    );
  }
}

export default ListItemGroup;
