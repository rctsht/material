// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import {type ThemeProps} from './defaults';
import ThemeContext from './ThemeContext';

type Props<Instance> = {
  forwardedRef: {current: null | Instance} | ((null | Instance) => mixed),
};

function withTheme<Config: {}, Instance>(
  Component: React.AbstractComponent<Config, Instance>,
): React.AbstractComponent<$Diff<Config, {rctshtTheme: ThemeProps | void}>, Instance> {
  class ThemedComponent extends React.PureComponent<$Diff<Config, {rctshtTheme: ThemeProps | void}> & Props<Instance>> {
    render() {
      const {forwardedRef, ...rest} = this.props;

      return (
        <ThemeContext.Consumer>
          {theme => <Component {...rest} ref={forwardedRef} rctshtTheme={theme} />}
        </ThemeContext.Consumer>
      );
    }
  }

  /* eslint-disable react/no-multi-comp */
  const ThemedComponentWithForwardRef = React.forwardRef<$Diff<Config, {rctshtTheme: ThemeProps | void}>, Instance>(
    (props, ref) => <ThemedComponent {...props} forwardedRef={ref} />,
  );
  /* eslint-enable react/no-multi-comp */

  hoistNonReactStatics(ThemedComponentWithForwardRef, Component);

  return ThemedComponentWithForwardRef;
}

export default withTheme;
