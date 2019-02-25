// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import uuid from 'uuid';

import MenuContext from './MenuContext';
import MenuOverlay from './MenuOverlay';

export default function withMenuOverlay(Component: React.ComponentType<*>) {
  class ComponentWithMenuOverlay extends React.PureComponent<*> {
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

    getOverlayRef: ?((MenuOverlay) => void) => void;

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
        <MenuContext.Consumer>
          {getOverlayRef => {
            this.getOverlayRef = getOverlayRef;
          }}
        </MenuContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ComponentWithMenuOverlay, Component);

  return ComponentWithMenuOverlay;
}
