// @flow
import EventEmitter from 'events';

import * as React from 'react';

import ScreenContext from './ScreenContext';

type Props = {
  children: React.Node,
};

class Screen extends React.Component<Props> {
  screenEvents = new EventEmitter();

  render() {
    const {children} = this.props;
    return <ScreenContext.Provider value={this.screenEvents}>{children}</ScreenContext.Provider>;
  }
}

export default Screen;
