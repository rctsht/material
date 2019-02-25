// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import uuid from 'uuid';

import GlobalContext from './GlobalContext';

export default function withGlobalOverlay(Component: React.ComponentType<any>) {
  class ComponentWithGlobalOverlay extends React.PureComponent<any> {
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

    getOverlayRef: ?Function;

    id: string;

    renderContent() {
      if (this.getOverlayRef) {
        this.getOverlayRef(overlay => {
          overlay.addOrUpdateContent(Component, {...this.props, id: this.id, getOverlayRef: this.getOverlayRef});
        });
      }
    }

    render() {
      return (
        <GlobalContext.Consumer>
          {getOverlayRef => {
            this.getOverlayRef = getOverlayRef;
          }}
        </GlobalContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ComponentWithGlobalOverlay, Component);

  return ComponentWithGlobalOverlay;
}
