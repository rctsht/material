// @flow
import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {type ImageStyleProp, type ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

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

type Props = {
  children?: React.Node,
  imageRef?: Function,
  imageStyle?: ImageStyleProp,
  style?: ViewStyleProp,
  scrim?: boolean,
  opacity: Object,
};

class ImageBackground extends React.Component<Props> {
  static defaultProps = {
    children: null,
    imageRef: null,
    imageStyle: null,
    scrim: false,
    style: null,
  };

  render() {
    const {children, style, scrim, opacity, imageStyle, imageRef, ...props} = this.props;

    return (
      <View accessibilityIgnoresInvertColors style={style}>
        <Animated.Image
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
              width: (style && style.width) || 0,
              height: (style && style.height) || 0,
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
