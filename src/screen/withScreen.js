// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import ScreenContext from './ScreenContext';

export default function withScreen(Component: React.ComponentType<*>) {
  class ComponentWithScreen extends React.PureComponent<*> {
    render() {
      return (
        <ScreenContext.Consumer>
          {screenEvents => (
            <Component
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...this.props}
              rctshtScreenEvents={screenEvents}
            />
          )}
        </ScreenContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ComponentWithScreen, Component);

  return ComponentWithScreen;
}
