// @flow
import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

type Props = {};

class ImageBackground extends React.Component<Props> {
  render() {
    const {children, style, scrim, opacity, imageStyle, imageRef, ...props} = this.props;

    return (
      <View accessibilityIgnoresInvertColors style={style}>
        <Animated.Image
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
              width: style.width,
              height: style.height,
            },
            imageStyle,
            {
              opacity,
            },
          ]}
          ref={imageRef}
        />
        {scrim ? (
          <Animated.View
            style={[
              styles.scrim,
              {
                opacity,
              },
            ]}
          />
        ) : null}
        {children}
      </View>
    );
  }
}

export default ImageBackground;
