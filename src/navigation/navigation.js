// @flow strict-local
import type {NavigationContainer, NavigationState} from 'react-navigation';

import Log from '../log';

let navigation;
// const awaitCallbacks = [];

// function awaitNavigation(cb) {
//   if (navigation) {
//     cb(navigation);
//   } else {
//     awaitCallbacks.push(cb);
//   }
// }

function getCurrentRoute() {
  if (!navigation) {
    Log.warn('Navigation.getCurrentRoute: No navigation');
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  const {state} = navigation._navigation;
  const findCurrentRoute = navState => {
    if (navState.index !== undefined) {
      return findCurrentRoute(navState.routes[navState.index]);
    }
    return navState.routeName;
  };
  return findCurrentRoute(state);
}

function getCurrentNavigationKey() {
  if (!navigation) {
    Log.warn('Navigation.getCurrentNavigationKey: No navigation');
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  const {state = {}} = navigation._navigation;
  const findCurrentRoute = navState => {
    if (navState.index !== undefined) {
      return findCurrentRoute(navState.routes[navState.index]);
    }
    return navState.key;
  };
  return findCurrentRoute(state);
}

function getNavigation() {
  if (!navigation) {
    Log.warn('Navigation.getNavigation: No navigation');
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  return navigation._navigation;
}

function setNavigation(navigationRef: ?NavigationContainer<NavigationState, {}, {}>) {
  navigation = navigationRef;

  // if (navigation && awaitCallbacks.length) {
  //   awaitCallbacks.forEach(cb => {
  //     cb(navigation);
  //   });
  // }
}

export {getCurrentNavigationKey, getCurrentRoute, getNavigation, setNavigation}; // awaitNavigation,
