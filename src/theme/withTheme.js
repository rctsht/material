// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import {ThemeContext} from '.';

function withTheme(Component: React.ComponentType<any>) {
  class ThemedComponent extends React.PureComponent<any> {
    render() {
      const {forwardedRef} = this.props;

      return (
        <ThemeContext.Consumer>
          {theme => <Component {...this.props} ref={forwardedRef} rctshtTheme={theme} />}
        </ThemeContext.Consumer>
      );
    }
  }

  // $FlowFixMe: https://github.com/facebook/flow/issues/6103
  const ThemedComponentWithForwardRef = React.forwardRef((props, ref) => (
    <ThemedComponent {...props} forwardedRef={props.onRef || ref} />
  ));

  hoistNonReactStatics(ThemedComponentWithForwardRef, Component);

  return ThemedComponentWithForwardRef;
}

export default withTheme;
