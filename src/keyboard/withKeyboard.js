// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import KeyboardContext from './KeyboardContext';

type Props<Instance> = {
  forwardedRef: {current: null | Instance} | ((null | Instance) => mixed),
};

function withKeyboard<Config, Instance>(Component: React.AbstractComponent<Config, Instance>) {
  class KeyboardedComponent extends React.PureComponent<Config & Props<Instance>> {
    render() {
      const {forwardedRef, ...rest} = this.props;

      return (
        <KeyboardContext.Consumer>
          {keyboardIsOpen => (
            <Component
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
              ref={forwardedRef}
              rctshtKeyboardIsOpen={keyboardIsOpen}
            />
          )}
        </KeyboardContext.Consumer>
      );
    }
  }

  /* eslint-disable react/no-multi-comp */
  const KeyboardedComponentWithForwardRef = React.forwardRef<Config, Instance>((props, ref) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <KeyboardedComponent {...props} forwardedRef={ref} />
  ));
  /* eslint-enable react/no-multi-comp */

  hoistNonReactStatics(KeyboardedComponentWithForwardRef, Component);

  return KeyboardedComponentWithForwardRef;
}

export default withKeyboard;
