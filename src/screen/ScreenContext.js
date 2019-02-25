// @flow strict-local
import EventEmitter from 'events';

import * as React from 'react';

const ScreenContext: React$Context<?((EventEmitter) => void) => void> = React.createContext();

export default ScreenContext;
