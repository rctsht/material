// @flow
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
  key: any,
  children: React.Node,
  divider?: boolean,
};

class ListItemGroup extends React.PureComponent<Props> {
  static defaultProps = {
    divider: false,
  };

  render() {
    const {children, divider} = this.props;
    const propsToApply = {...this.props};
    delete propsToApply.children;
    delete propsToApply.key;

    return (
      <View style={[styles.container, divider ? styles.divider : null]}>
        {React.Children.map(children, child => React.cloneElement(child, propsToApply))}
      </View>
    );
  }
}

export default ListItemGroup;
