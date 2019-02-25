// @flow strict-local
import * as React from 'react';

import {DialogContext, DialogOverlay} from '../dialog';
import {GlobalContext, GlobalOverlay} from '../global';
import {MenuContext, MenuOverlay} from '../menu';
import {SheetContext, SheetOverlay} from '../sheet';
import {SnackbarContext, SnackbarOverlay} from '../snackbar';
import {createTheme, ThemeContext, type ThemeProps} from '../theme';

type Props = {
  children?: React.Node,
  theme?: ThemeProps,
};

class Context extends React.PureComponent<Props> {
  static defaultProps = {
    children: null,
    theme: createTheme(),
  };

  getDialogOverlayRefCallbacks = [];

  getDialogOverlayRef = (cb: DialogOverlay => void) => {
    if (this.dialogOverlayRef) {
      cb(this.dialogOverlayRef);
    } else {
      this.getDialogOverlayRefCallbacks.push(cb);
    }
  };

  setDialogOverlayRef = (node: ?DialogOverlay) => {
    this.dialogOverlayRef = node;

    if (this.dialogOverlayRef) {
      this.getDialogOverlayRefCallbacks.forEach(cb => {
        if (this.dialogOverlayRef) {
          cb(this.dialogOverlayRef);
        }
      });

      this.getDialogOverlayRefCallbacks = [];
    }
  };

  getMenuOverlayRefCallbacks = [];

  getMenuOverlayRef = (cb: MenuOverlay => void) => {
    if (this.menuOverlayRef) {
      cb(this.menuOverlayRef);
    } else {
      this.getMenuOverlayRefCallbacks.push(cb);
    }
  };

  setMenuOverlayRef = (node: ?MenuOverlay) => {
    this.menuOverlayRef = node;

    if (this.menuOverlayRef) {
      this.getMenuOverlayRefCallbacks.forEach(cb => {
        if (this.menuOverlayRef) {
          cb(this.menuOverlayRef);
        }
      });

      this.getMenuOverlayRefCallbacks = [];
    }
  };

  getSheetOverlayRefCallbacks = [];

  getSheetOverlayRef = (cb: SheetOverlay => void) => {
    if (this.sheetOverlayRef) {
      cb(this.sheetOverlayRef);
    } else {
      this.getSheetOverlayRefCallbacks.push(cb);
    }
  };

  setSheetOverlayRef = (node: ?SheetOverlay) => {
    this.sheetOverlayRef = node;

    if (this.sheetOverlayRef) {
      this.getSheetOverlayRefCallbacks.forEach(cb => {
        if (this.sheetOverlayRef) {
          cb(this.sheetOverlayRef);
        }
      });

      this.getSheetOverlayRefCallbacks = [];
    }
  };

  getSnackbarOverlayRefCallbacks = [];

  getSnackbarOverlayRef = (cb: SnackbarOverlay => void) => {
    if (this.snackbarOverlayRef) {
      cb(this.snackbarOverlayRef);
    } else {
      this.getSnackbarOverlayRefCallbacks.push(cb);
    }
  };

  setSnackbarOverlayRef = (node: ?SnackbarOverlay) => {
    this.snackbarOverlayRef = node;

    if (this.snackbarOverlayRef) {
      this.getSnackbarOverlayRefCallbacks.forEach(cb => {
        if (this.snackbarOverlayRef) {
          cb(this.snackbarOverlayRef);
        }
      });

      this.getSnackbarOverlayRefCallbacks = [];
    }
  };

  getGlobalOverlayRefCallbacks = [];

  getGlobalOverlayRef = (cb: GlobalOverlay => void) => {
    if (this.globalOverlayRef) {
      cb(this.globalOverlayRef);
    } else {
      this.getGlobalOverlayRefCallbacks.push(cb);
    }
  };

  setGlobalOverlayRef = (node: ?GlobalOverlay) => {
    this.globalOverlayRef = node;
    if (this.globalOverlayRef) {
      this.getGlobalOverlayRefCallbacks.forEach(cb => {
        if (this.globalOverlayRef) {
          cb(this.globalOverlayRef);
        }
      });

      this.getGlobalOverlayRefCallbacks = [];
    }
  };

  dialogOverlayRef: ?DialogOverlay;

  menuOverlayRef: ?MenuOverlay;

  sheetOverlayRef: ?SheetOverlay;

  snackbarOverlayRef: ?SnackbarOverlay;

  globalOverlayRef: ?GlobalOverlay;

  render() {
    const {children, theme} = this.props;

    return (
      // $FlowFixMe
      <ThemeContext.Provider value={theme}>
        <GlobalContext.Provider value={this.getGlobalOverlayRef}>
          <DialogContext.Provider value={this.getDialogOverlayRef}>
            <SheetContext.Provider value={this.getSheetOverlayRef}>
              <MenuContext.Provider value={this.getMenuOverlayRef}>
                <SnackbarContext.Provider value={this.getSnackbarOverlayRef}>
                  {children}
                  <SnackbarOverlay ref={this.setSnackbarOverlayRef} />
                  <MenuOverlay ref={this.setMenuOverlayRef} />
                  <SheetOverlay ref={this.setSheetOverlayRef} />
                  <DialogOverlay ref={this.setDialogOverlayRef} />
                  <GlobalOverlay ref={this.setGlobalOverlayRef} />
                </SnackbarContext.Provider>
              </MenuContext.Provider>
            </SheetContext.Provider>
          </DialogContext.Provider>
        </GlobalContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

export default Context;
