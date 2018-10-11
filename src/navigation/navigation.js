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

  const {state} = navigation;
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

  const {state = {}} = navigation;
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

  return navigation;
}

function setNavigation(navigationRef) {
  navigation = navigationRef;

  // if (navigation && awaitCallbacks.length) {
  //   awaitCallbacks.forEach(cb => {
  //     cb(navigation);
  //   });
  // }
}

export {getCurrentNavigationKey, getCurrentRoute, getNavigation, setNavigation}; // awaitNavigation,
