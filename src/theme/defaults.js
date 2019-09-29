// @flow strict-local
import {merge} from 'lodash-es';
import {Easing} from 'react-native';

type ThemeAnimations = {
  accelerateEasing: number => number,
  decelerateEasing: number => number,
  standardEasing: number => number,
  medium: {
    in: number,
    out: number,
  },
  large: {
    in: number,
    out: number,
  },
  dialog: {
    in: number,
    out: number,
  },
  control: {
    selection: number,
  },
  icon: {
    simple: number,
    detailed: number,
  },
};

type ThemeColors = {
  primary: string,
  primaryVariant: string,
  secondary: string,
  secondaryVariant: string,
  background: string,
  surface: string,
  error: string,
  onPrimary: string,
  onSecondary: string,
  onBackground: string,
  onSurface: string,
  onError: string,
};

type ThemeComponents = {
  button: {
    contained: {
      borderRadius: number,
      height: number,
    },
    outlined: {
      borderRadius: number,
      height: number,
    },
  },
  textField: {
    filled: {
      backgroundColor: string,
    },
  },
};

type ThemeProps = {
  animations: ThemeAnimations,
  colors: ThemeColors,
  components: ThemeComponents,
};

const themeDefaults: ThemeProps = {
  animations: {
    // For objects entering the screen
    accelerateEasing: Easing.bezier(0.4, 0.0, 1, 1),
    // For objects leaving the screen
    decelerateEasing: Easing.bezier(0.0, 0.0, 0.2, 1),
    // For objects moving within the screen
    standardEasing: Easing.bezier(0.4, 0.0, 0.2, 1),
    // Sheet, chip
    medium: {
      in: 250,
      out: 200,
    },
    // Card, full screen sheet
    large: {
      in: 300,
      out: 250,
    },
    // Dialogs
    dialog: {
      in: 150,
      out: 75,
    },
    // Switches, checkboxes
    control: {
      selection: 100,
    },
    // Icons
    icon: {
      simple: 200,
      detailed: 500,
    },
  },
  colors: {
    primary: '#FFD600',
    primaryVariant: '#F9A825',
    secondary: '#FF5A3C',
    secondaryVariant: '#EF100D',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#ECB6B6',
    onPrimary: '#212121',
    onSecondary: '#FFFFFF',
    onBackground: '#212121',
    onSurface: '#212121',
    onError: '#FFFFFF',
  },
  components: {
    button: {
      contained: {
        borderRadius: 3,
        height: 36,
      },
      outlined: {
        borderRadius: 3,
        height: 36,
      },
    },
    textField: {
      filled: {
        backgroundColor: '#00000006',
      },
    },
  },
};

function createTheme(values: $Shape<ThemeProps> = {}): ThemeProps {
  return merge({}, themeDefaults, values);
}

export {createTheme, themeDefaults};
export type {ThemeProps};
