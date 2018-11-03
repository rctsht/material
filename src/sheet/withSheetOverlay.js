// @flow
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import uuid from 'uuid';

import {getNavigation} from '../navigation';
import {withTheme} from '../theme';

import SheetContext from './SheetContext';

type Props = {
  navigation: Object,
};

function withSheetOverlay(Component: React.ComponentType<any>, type: string, global: boolean = false) {
  class ComponentWithSheetOverlay extends React.PureComponent<Props> {
    id = null;
    getOverlayRef;

    constructor(props: Props) {
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
          overlay.removeSheet(this.id);
        });
      }
    }

    renderContent() {
      const navigation = getNavigation();
      const {nav: state} = navigation || {};
      const {key: navigationKey = this.id} = state || {};

      if (this.getOverlayRef) {
        this.getOverlayRef(overlay => {
          overlay.addOrUpdateSheet({
            type,
            Component,
            props: {
              ...this.props,
              navigation: getNavigation(),
              rctshtOverlayId: this.id,
              rctshtNavigationKey: global ? 'GLOBAL' : navigationKey,
              rctshtGetOverlayRef: this.getOverlayRef,
            },
            overlayId: this.id,
            navigationKey,
          });
        });
      }
    }

    render() {
      return (
        <SheetContext.Consumer>
          {getOverlayRef => {
            this.getOverlayRef = getOverlayRef;
          }}
        </SheetContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ComponentWithSheetOverlay, Component);

  return withTheme(ComponentWithSheetOverlay); // TODO do we need theme here?
}

export default withSheetOverlay;
