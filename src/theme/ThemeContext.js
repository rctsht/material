// @flow strict-local
import * as React from 'react';

import {themeDefaults, type ThemeProps} from './defaults';

const ThemeContext: React$Context<ThemeProps> = React.createContext(themeDefaults);

export default ThemeContext;
