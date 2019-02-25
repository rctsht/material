// @flow strict-local
import * as React from 'react';

import SnackbarOverlay from './SnackbarOverlay';

const SnackbarContext = React.createContext<?((SnackbarOverlay) => void) => void>();

export default SnackbarContext;
