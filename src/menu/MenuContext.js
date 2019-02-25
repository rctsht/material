// @flow strict-local
import * as React from 'react';

import MenuOverlay from './MenuOverlay';

const MenuContext = React.createContext<?((MenuOverlay) => void) => void>();

export default MenuContext;
