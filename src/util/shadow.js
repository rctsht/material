// @flow strict-local
import {Platform} from 'react-native';

const overflow = Platform.OS === 'ios' ? {overflow: 'visible'} : null;

// All shadow* values generated using:
// https://ethercreative.github.io/react-native-shadow-generator/
const elevationMap = [
  {
    elevation: 0,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    zIndex: 0,
  },
  {
    elevation: 1,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    zIndex: 1,
  },
  {
    elevation: 2,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    zIndex: 2,
  },
  {
    elevation: 3,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
  },
  {
    elevation: 4,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    zIndex: 4,
  },
  {
    elevation: 5,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 5,
  },
  {
    elevation: 6,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 6,
  },
  {
    elevation: 7,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    zIndex: 7,
  },
  {
    elevation: 8,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 8,
  },
  {
    elevation: 9,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    zIndex: 9,
  },
  {
    elevation: 10,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    zIndex: 10,
  },
  {
    elevation: 11,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    zIndex: 11,
  },
  {
    elevation: 12,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    zIndex: 12,
  },
  {
    elevation: 13,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    zIndex: 13,
  },
  {
    elevation: 14,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    zIndex: 14,
  },
  {
    elevation: 15,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    zIndex: 15,
  },
  {
    elevation: 16,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    zIndex: 16,
  },
  {
    elevation: 17,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    zIndex: 17,
  },
  {
    elevation: 18,
    ...overflow,
    zIndex: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
  },
  {
    elevation: 19,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    zIndex: 19,
  },
  {
    elevation: 20,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    zIndex: 20,
  },
  {
    elevation: 21,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    zIndex: 21,
  },
  {
    elevation: 22,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    zIndex: 22,
  },
  {
    elevation: 23,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    zIndex: 23,
  },
  {
    elevation: 24,
    ...overflow,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    zIndex: 24,
  },
];

const MIN_ELEVATION = 0;
const MAX_ELEVATION = 24;

function getStylesForElevation(elevation: number) {
  const elevationIndex = Math.max(MIN_ELEVATION, Math.min(elevation, MAX_ELEVATION));
  return elevationMap[elevationIndex];
}

export default {getStylesForElevation};
