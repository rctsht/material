import {Dimensions} from 'react-native';

function getCurrentOrientation() {
  const {width, height} = Dimensions.get('screen');

  return width > height ? 'landscape' : 'portrait';
}

// Calculate if a device is a tablet based on figures from:
// https://developer.android.com/training/multiscreen/screensizes#TaskUseSWQuali
function isPhone() {
  const {width} = Dimensions.get('screen');

  if (getCurrentOrientation() === 'portrait') {
    return width < 600;
  }

  return width < 960;
}

// Calculate if a device is a tablet based on figures from:
// https://developer.android.com/training/multiscreen/screensizes#TaskUseSWQuali
function isTablet() {
  return !isPhone();
}

export {getCurrentOrientation, isPhone, isTablet};
