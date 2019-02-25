// @flow strict-local
import React from 'react';

import {themeDefaults, type ThemeProps} from '.';

const ThemeContext: React$Context<ThemeProps> = React.createContext(themeDefaults);

export default ThemeContext;
