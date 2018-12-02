// @flow
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import ScreenContext from './ScreenContext';

export default function withScreen(Component: React.ComponentType<any>) {
  class ComponentWithScreen extends React.PureComponent<any> {
    render() {
      return (
        <ScreenContext.Consumer>
          {screenEvents => <Component {...this.props} rctshtScreenEvents={screenEvents} />}
        </ScreenContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ComponentWithScreen, Component);

  return ComponentWithScreen;
}
