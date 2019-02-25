// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 100,
  },
});

let context = null;

class GlobalOverlay extends React.PureComponent<any> {
  static getContext = () => context;

  constructor(props: any) {
    super(props);

    this.state = {
      tooltips: [],
      extraProps: {},
    };
  }

  componentDidMount() {
    if (context) {
      throw new Error('Multiple global contexts are forbidden');
    }

    context = this;
  }

  componentWillUnmount() {
    context = null;
  }

  setExtraProps = (extraProps: {} = {}, callback: Function) => {
    this.setState({extraProps}, callback);
  };

  addOrUpdateTooltip = (Component: React.ComponentType<any>, props: {} = {}) => {
    this.setState(currentState => ({
      tooltips: [...currentState.tooltips.filter(tooltip => tooltip.props.id !== props.id), {Component, props}],
    }));
  };

  removeTooltip = (id: string) => {
    this.setState(currentState => ({
      tooltips: currentState.tooltips.filter(tooltip => tooltip.props.id !== id),
    }));
  };

  render() {
    const {tooltips, extraProps} = this.state;

    return tooltips.map(tooltip => {
      const {Component, props} = tooltip;
      return (
        <View style={styles.container} pointerEvents="box-none" key={props.id}>
          <Component {...extraProps} {...props} />
        </View>
      );
    });
  }
}

export default GlobalOverlay;
