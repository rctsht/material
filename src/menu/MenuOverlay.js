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

type Props = {};

type State = {
  contents: Array<{
    Component: React.ComponentType<*>,
    props: {
      id: string,
    },
  }>,
  extraProps: {},
};

class MenuOverlay extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      contents: [],
      extraProps: {},
    };
  }

  setExtraProps = (extraProps: {} = {}, callback: () => void) => {
    this.setState({extraProps}, callback);
  };

  addOrUpdateContent = (Component: React.ComponentType<*>, theProps: {id: string} = {}) => {
    this.setState(currentState => ({
      contents: [
        ...currentState.contents.filter(content => content.props.id !== theProps.id),
        {Component, props: theProps},
      ],
    }));
  };

  removeContent = (id: string) => {
    this.setState(currentState => ({
      contents: currentState.contents.filter(content => content.props.id !== id),
    }));
  };

  render() {
    const {contents, extraProps} = this.state;

    return (
      <View style={styles.container} pointerEvents="box-none">
        {contents.map(content => {
          const {Component, props} = content;
          return (
            <Component
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...extraProps}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              key={props.id}
            />
          );
        })}
      </View>
    );
  }
}

export default MenuOverlay;
