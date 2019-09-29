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

type State = {
  extraProps: {},
  // $FlowFixMe
  menus: Array<{Component: React.ComponentType<any>, props: {}}>,
  // $FlowFixMe
  tooltips: Array<{Component: React.ComponentType<any>, props: {}}>,
};

// $FlowFixMe
class GlobalOverlay extends React.PureComponent<any, State> {
  static getContext = () => context;

  // $FlowFixMe
  constructor(props: any) {
    super(props);

    this.state = {
      extraProps: {},
      menus: [],
      tooltips: [],
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

  setExtraProps = (extraProps: {} = {}, callback: () => void) => {
    this.setState({extraProps}, callback);
  };

  // $FlowFixMe
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

  // $FlowFixMe
  addOrUpdateMenu = (Component: React.ComponentType<any>, props: {} = {}) => {
    this.setState(currentState => ({
      menus: [...currentState.menus.filter(menu => menu.props.id !== props.id), {Component, props}],
    }));
  };

  removeMenu = (id: string) => {
    this.setState(currentState => ({
      menus: currentState.menus.filter(menu => menu.props.id !== id),
    }));
  };

  // $FlowFixMe
  addOrUpdate = (type: 'menu' | 'tooltip', Component: React.ComponentType<any>, props: {} = {}) => {
    switch (type) {
      case 'tooltip':
        this.addOrUpdateTooltip(Component, props);
        break;
      case 'menu':
        this.addOrUpdateMenu(Component, props);
        break;
      default:
        break;
    }
  };

  remove = (type: 'menu' | 'tooltip', id: string) => {
    switch (type) {
      case 'tooltip':
        this.removeTooltip(id);
        break;
      case 'menu':
        this.removeMenu(id);
        break;
      default:
        break;
    }
  };

  render() {
    const {menus, tooltips, extraProps} = this.state;

    return (
      <>
        {tooltips.map<React.Node>(tooltip => {
          const {Component, props} = tooltip;
          return (
            <View style={styles.container} pointerEvents="box-none" key={props.id}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...extraProps} {...props} />
            </View>
          );
        })}
        {menus.map<React.Node>(tooltip => {
          const {Component, props} = tooltip;
          return (
            <View style={styles.container} pointerEvents="box-none" key={props.id}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...extraProps} {...props} />
            </View>
          );
        })}
      </>
    );
  }
}

export default GlobalOverlay;
