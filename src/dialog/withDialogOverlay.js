// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import uuid from 'uuid';

import DialogContext from './DialogContext';
import DialogOverlay from './DialogOverlay';

export default function withDialogOverlay(Component: React.ComponentType<*>) {
  class ComponentWithDialogOverlay extends React.PureComponent<*> {
    getOverlayRef: ?((DialogOverlay) => void) => void;

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
        <DialogContext.Consumer>
          {getOverlayRef => {
            this.getOverlayRef = getOverlayRef;
          }}
        </DialogContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ComponentWithDialogOverlay, Component);

  return ComponentWithDialogOverlay;
}
