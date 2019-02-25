// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = {
  container: {
    marginVertical: 4,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.54)',
  },
};

type Props = {
  key?: mixed,
  children: React.Node,
  divider?: boolean,
};

class ListItemGroup extends React.PureComponent<Props> {
  static defaultProps = {
    divider: false,
    key: null,
  };

  render() {
    const {children, key, divider, ...rest} = this.props;
    const propsToApply = {divider, ...rest};

    return (
      <View style={[styles.container, divider ? styles.divider : null]}>
        {React.Children.map(children, child => (child ? React.cloneElement(child, propsToApply) : null))}
      </View>
    );
  }
}

export default ListItemGroup;
