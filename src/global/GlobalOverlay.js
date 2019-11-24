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
  snackbars: Array<{Component: React.ComponentType<any>, props: {}}>,
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
      snackbars: [],
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
  addOrUpdateSnackbar = (Component: React.ComponentType<any>, props: {} = {}) => {
    this.setState(currentState => ({
      snackbars: [...currentState.snackbars.filter(snackbar => snackbar.props.id !== props.id), {Component, props}],
    }));
  };

  removeSnackbar = (id: string) => {
    this.setState(currentState => ({
      snackbars: currentState.snackbars.filter(snackbar => snackbar.props.id !== id),
    }));
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
  addOrUpdate = (type: 'menu' | 'snackbar' | 'tooltip', Component: React.ComponentType<any>, props: {} = {}) => {
    switch (type) {
      case 'menu':
        this.addOrUpdateMenu(Component, props);
        break;
      case 'snackbar':
        this.addOrUpdateSnackbar(Component, props);
        break;
      case 'tooltip':
        this.addOrUpdateTooltip(Component, props);
        break;
      default:
        break;
    }
  };

  remove = (type: 'menu' | 'snackbar' | 'tooltip', id: string) => {
    switch (type) {
      case 'menu':
        this.removeMenu(id);
        break;
      case 'snackbar':
        this.removeSnackbar(id);
        break;
      case 'tooltip':
        this.removeTooltip(id);
        break;
      default:
        break;
    }
  };

  render() {
    const {menus, snackbars, tooltips, extraProps} = this.state;

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
        {menus.map<React.Node>(menu => {
          const {Component, props} = menu;
          return (
            <View style={styles.container} pointerEvents="box-none" key={props.id}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...extraProps} {...props} />
            </View>
          );
        })}
        {snackbars.map<React.Node>(snackbar => {
          const {Component, props} = snackbar;
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
