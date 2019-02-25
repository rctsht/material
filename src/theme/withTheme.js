// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import {ThemeContext} from '.';

function withTheme(Component: React.ComponentType<*>) {
  class ThemedComponent extends React.PureComponent<*> {
    render() {
      const {forwardedRef} = this.props;

      return (
        <ThemeContext.Consumer>
          {theme => <Component {...this.props} ref={forwardedRef} rctshtTheme={theme} />}
        </ThemeContext.Consumer>
      );
    }
  }

  type Props = {
    onRef?: () => ?ThemedComponent,
  };
  /* eslint-disable react/no-multi-comp */
  // $FlowFixMe: https://github.com/facebook/flow/issues/6103
  const ThemedComponentWithForwardRef = React.forwardRef((props: Props, ref) => (
    <ThemedComponent {...props} forwardedRef={props.onRef || ref} />
  ));
  /* eslint-enable react/no-multi-comp */

  hoistNonReactStatics(ThemedComponentWithForwardRef, Component);

  return ThemedComponentWithForwardRef;
}

export default withTheme;
