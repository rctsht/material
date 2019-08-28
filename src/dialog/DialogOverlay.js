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
  },
});

type Props = {};

type State = {
  contents: Array<{
    // $FlowFixMe
    Component: React.ComponentType<any>,
    props: {id: string},
  }>,
  extraProps: {},
};

class DialogOverlay extends React.PureComponent<Props, State> {
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

  // $FlowFixMe
  addOrUpdateContent = (Component: React.ComponentType<any>, theProps: {id: string}) => {
    this.setState(currentState => {
      if (currentState.contents.some(content => content.props.id === theProps.id)) {
        return {
          contents: currentState.contents.map(content => {
            if (content.props.id === theProps.id) {
              return {Component, props: theProps};
            }

            return content;
          }),
        };
      }
      return {
        contents: [...currentState.contents, {Component, props: theProps}],
      };
    });
  };

  removeContent = (id: string) => {
    this.setState(currentState => ({
      contents: currentState.contents.filter(content => content.props.id !== id),
    }));
  };

  render() {
    const {contents, extraProps} = this.state;

    return contents.map<React.Node>(content => {
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
