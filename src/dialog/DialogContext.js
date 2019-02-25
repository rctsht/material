// @flow strict-local
import * as React from 'react';

import DialogOverlay from './DialogOverlay';

const DialogContext = React.createContext<?((DialogOverlay) => void) => void>();

export default DialogContext;
