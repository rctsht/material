// @flow
import * as React from 'react';
import uuid from 'uuid';

import DialogContext from './DialogContext';

export default function withDialogOverlay(Component: React.ComponentType<any>) {
  return class ComponentWithDialogOverlay extends React.PureComponent<any> {
    constructor(props: any) {
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
  };
}
