// @flow strict-local
import * as React from 'react';

import SheetOverlay from './SheetOverlay';

const SheetContext = React.createContext<?((SheetOverlay) => void) => void>();

export default SheetContext;
