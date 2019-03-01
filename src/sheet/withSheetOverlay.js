// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import uuid from 'uuid';

import {getNavigation} from '../navigation';
import {withTheme} from '../theme';

import type Sheet from './Sheet';
import SheetContext from './SheetContext';
import SheetOverlay from './SheetOverlay';

type Props = {
  navigation: {},
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

    open = () => {
      if (this.sheetRef) {
        this.sheetRef.open();
      }
    };

    close = () => {
      if (this.sheetRef) {
        this.sheetRef.close();
      }
    };

    setSheetRef = (node: ?Sheet) => {
      this.sheetRef = node;
    };

    sheetRef: ?Sheet;

    getOverlayRef: ((SheetOverlay) => void) => void;

    id: string;

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
              ref: this.setSheetRef,
            },
            overlayId: this.id,
            navigationKey: global ? 'GLOBAL' : navigationKey,
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

  return ComponentWithSheetOverlay;
}

export default withSheetOverlay;
