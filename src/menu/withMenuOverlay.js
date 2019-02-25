// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, {PureComponent} from 'react';
import uuid from 'uuid';

import MenuContext from './MenuContext';

export default function withMenuOverlay(Component: React.ComponentType<any>) {
  class ComponentWithMenuOverlay extends PureComponent<any> {
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
