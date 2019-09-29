// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import uuid from 'uuid';

import GlobalContext from './GlobalContext';
import GlobalOverlay from './GlobalOverlay';

export default function withGlobalOverlay(Component: React.ComponentType<*>, type: 'tooltip' | 'menu') {
  class ComponentWithGlobalOverlay extends React.PureComponent<*> {
    getOverlayRef: ?((GlobalOverlay) => void) => void;

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
          overlay.remove(type, this.id);
        });
      }
    }

    renderContent() {
      if (this.getOverlayRef) {
        this.getOverlayRef(overlay => {
          overlay.addOrUpdate(type, Component, {...this.props, id: this.id, getOverlayRef: this.getOverlayRef});
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
