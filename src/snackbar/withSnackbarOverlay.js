// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import uuid from 'uuid';

import SnackbarContext from './SnackbarContext';
import SnackbarOverlay from './SnackbarOverlay';

export default function withSnackbarOverlay(Component: React.ComponentType<*>) {
  class ComponentWithSnackbarOverlay extends React.PureComponent<*> {
    getOverlayRef: ?((SnackbarOverlay) => void) => void;

    id: string;

    constructor(props: *) {
      super(props);

      this.id = uuid.v4();
    }

    componentDidMount() {
      this.renderContent();
    }

    componentDidUpdate() {
      this.renderContent();
    }

    componentWillUnmount() {
      if (this.getOverlayRef) {
        this.getOverlayRef(overlay => {
          overlay.removeContent(this.id);
        });
      }
    }

    renderContent() {
      if (this.getOverlayRef) {
        this.getOverlayRef(overlay => {
          overlay.addOrUpdateContent(Component, {...this.props, id: this.id, getOverlayRef: this.getOverlayRef});
        });
      }
    }

    render() {
      return (
        <SnackbarContext.Consumer>
          {getOverlayRef => {
            this.getOverlayRef = getOverlayRef;
          }}
        </SnackbarContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ComponentWithSnackbarOverlay, Component);

  return ComponentWithSnackbarOverlay;
}
