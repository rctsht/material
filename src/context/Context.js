// @flow
import * as React from 'react';

import {DialogContext, DialogOverlay} from '../dialog';
// import {MenuContext, MenuOverlay} from '../menu';
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

  getDialogOverlayRef = (cb: Function) => {
    if (this.dialogOverlayRef) {
      cb(this.dialogOverlayRef);
    } else {
      this.getDialogOverlayRefCallbacks.push(cb);
    }
  };

  setDialogOverlayRef = (node: React.Node) => {
    this.dialogOverlayRef = node;

    this.getDialogOverlayRefCallbacks.forEach(cb => {
      cb(this.dialogOverlayRef);
    });

    this.getDialogOverlayRefCallbacks = [];
  };

  // getMenuOverlayRefCallbacks = [];
  //
  // getMenuOverlayRef = (cb: Function) => {
  //   if (this.menuOverlayRef) {
  //     cb(this.menuOverlayRef);
  //   } else {
  //     this.getMenuOverlayRefCallbacks.push(cb);
  //   }
  // };
  //
  // setMenuOverlayRef = (node: React.Node) => {
  //   this.menuOverlayRef = node;
  //
  //   this.getMenuOverlayRefCallbacks.forEach(cb => {
  //     cb(this.menuOverlayRef);
  //   });
  //
  //   this.getMenuOverlayRefCallbacks = [];
  // };

  getSheetOverlayRefCallbacks = [];

  getSheetOverlayRef = (cb: Function) => {
    if (this.sheetOverlayRef) {
      cb(this.sheetOverlayRef);
    } else {
      this.getSheetOverlayRefCallbacks.push(cb);
    }
  };

  setSheetOverlayRef = (node: React.Node) => {
    this.sheetOverlayRef = node;

    this.getSheetOverlayRefCallbacks.forEach(cb => {
      cb(this.sheetOverlayRef);
    });

    this.getSheetOverlayRefCallbacks = [];
  };

  getSnackbarOverlayRefCallbacks = [];

  getSnackbarOverlayRef = (cb: Function) => {
    if (this.snackbarOverlayRef) {
      cb(this.snackbarOverlayRef);
    } else {
      this.getSnackbarOverlayRefCallbacks.push(cb);
    }
  };

  setSnackbarOverlayRef = (node: React.Node) => {
    this.snackbarOverlayRef = node;

    this.getSnackbarOverlayRefCallbacks.forEach(cb => {
      cb(this.snackbarOverlayRef);
    });

    this.getSnackbarOverlayRefCallbacks = [];
  };

  render() {
    const {children, theme} = this.props;

    return (
      // $FlowFixMe
      <ThemeContext.Provider value={theme}>
        <DialogContext.Provider value={this.getDialogOverlayRef}>
          <SheetContext.Provider value={this.getSheetOverlayRef}>
            {/* <MenuContext.Provider value={this.getMenuOverlayRef}> */}
            <SnackbarContext.Provider value={this.getSnackbarOverlayRef}>
              {children}
              <SnackbarOverlay ref={this.setSnackbarOverlayRef} />
              {/* <MenuOverlay ref={this.setMenuOverlayRef} /> */}
              <SheetOverlay ref={this.setSheetOverlayRef} />
              <DialogOverlay ref={this.setDialogOverlayRef} />
            </SnackbarContext.Provider>
            {/* </MenuContext.Provider> */}
          </SheetContext.Provider>
        </DialogContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

export default Context;