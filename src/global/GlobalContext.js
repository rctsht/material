// @flow strict-local
import * as React from 'react';

import GlobalOverlay from './GlobalOverlay';

const GlobalContext = React.createContext<?((GlobalOverlay) => void) => void>();

export default GlobalContext;
