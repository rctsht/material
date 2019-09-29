// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

export default function withForwardRef<Config: {}, Instance>(
  Component: React.AbstractComponent<Config, Instance>,
): React.AbstractComponent<Config, Instance> {
  const ComponentWithForwardRef = React.forwardRef<Config, Instance>((props, ref) => (
    <Component
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      forwardedRef={ref}
    />
  ));

  hoistNonReactStatics(ComponentWithForwardRef, Component);

  return ComponentWithForwardRef;
}
