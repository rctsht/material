// @flow strict-local
import {isFunction} from 'lodash-es';
import * as React from 'react';
import {InteractionManager, PanResponder} from 'react-native';
import uuid from 'uuid';

const MIN_MOVEMENT_X = 10;
const MIN_MOVEMENT_Y = 10;
const returnTrue = () => true;
const returnFalse = () => false;
const maybeTriggerPanResponder = (event, gestureState) =>
  Math.abs(gestureState.dx) >= MIN_MOVEMENT_X || Math.abs(gestureState.dy) >= MIN_MOVEMENT_Y;
const maybeCallFunctionWithGestureState = fn => (event, gestureState) => {
  if (isFunction(fn)) {
    fn(gestureState);
  }
};

type Props = {};
type State = {
  panResponder: ?{
    getInteractionHandle: () => {},
  },
  panHandlers: ?{},
  active: boolean,
};

function withPanResponder(Component: React.ComponentType<*>) {
  class ComponentWithPanResponder extends React.PureComponent<Props, State> {
    state = {
      panResponder: null,
      panHandlers: null,
      active: false,
    };

    componentWillUnmount() {
      this.destroyPanResponder();
    }

    onDragStart: ?({}) => void;

    onDragMove: ?({}) => void;

    onDragEnd: ?({}) => void;

    initPanResponder = () => {
      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: returnFalse,
        onStartShouldSetPanResponderCapture: returnFalse,
        onMoveShouldSetPanResponder: maybeTriggerPanResponder,
        onMoveShouldSetPanResponderCapture: returnFalse,
        onPanResponderGrant: maybeCallFunctionWithGestureState(this.onDragStart),
        onPanResponderMove: maybeCallFunctionWithGestureState(this.onDragMove),
        onPanResponderRelease: maybeCallFunctionWithGestureState(this.onDragEnd),
        onPanResponderTerminationRequest: returnTrue,
        onPanResponderTerminate: maybeCallFunctionWithGestureState(this.onDragEnd),
        onShouldBlockNativeResponder: returnTrue,
      });

      const {panHandlers} = panResponder;

      this.setState({
        panResponder,
        panHandlers,
      });
    };

    capturePanResponder = (
      options: {
        onDragStart: ({}) => void,
        onDragMove: ({}) => void,
        onDragEnd: ({}) => void,
      } = {},
    ) => {
      const {onDragStart, onDragMove, onDragEnd} = options;
      this.onDragStart = onDragStart;
      this.onDragMove = onDragMove;
      this.onDragEnd = onDragEnd;
      this.captureId = uuid.v4();

      this.setState({
        active: true,
      });

      const {panResponder} = this.state;

      if (!panResponder) {
        this.initPanResponder();
      }

      return this.captureId;
    };

    releasePanResponder = (captureId: string) => {
      if (this.captureId === captureId) {
        this.onDragStart = null;
        this.onDragMove = null;
        this.onDragEnd = null;
        this.captureId = null;

        this.setState({
          active: false,
        });

        this.destroyPanResponder();
      }
    };

    destroyPanResponder = () => {
      const {panResponder} = this.state;

      if (panResponder && panResponder.getInteractionHandle()) {
        InteractionManager.clearInteractionHandle(panResponder.getInteractionHandle());
      }

      this.setState({
        panResponder: null,
        panHandlers: null,
        active: false,
      });
    };

    captureId: ?string;

    render() {
      const {panResponder, panHandlers, active} = this.state;

      return (
        <Component
          rctshtPanResponder={panResponder}
          rctshtPanHandlers={panHandlers}
          rctshtCapturePanResponder={this.capturePanResponder}
          rctshtReleasePanResponder={this.releasePanResponder}
          rctshtPanResponderActive={active}
          {...this.props}
        />
      );
    }
  }

  return ComponentWithPanResponder;
}

export default withPanResponder;
