// @flow
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

class DialogOverlay extends React.PureComponent<any> {
  constructor(props: any) {
    super(props);

    this.state = {
      contents: [],
      extraProps: {},
    };
  }

  setExtraProps = (extraProps: Object = {}, callback: Function) => {
    this.setState({extraProps}, callback);
  };

  addOrUpdateContent = (Component: React.ComponentType<any>, props: Object = {}) => {
    this.setState(currentState => ({
      contents: [...currentState.contents.filter(content => content.props.id !== props.id), {Component, props}],
    }));
  };

  removeContent = (id: string) => {
    this.setState(currentState => ({
      contents: currentState.contents.filter(content => content.props.id !== id),
    }));
  };

  render() {
    const {contents, extraProps} = this.state;

    return contents.map(content => {
      const {Component, props} = content;
      return (
        <View style={styles.container} pointerEvents="box-none" key={props.id}>
          <Component {...extraProps} {...props} />
        </View>
      );
    });
  }
}

export default DialogOverlay;
