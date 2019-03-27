// @flow strict-local
import hoistNonReactStatics from 'hoist-non-react-statics';
import {isString} from 'lodash-es';
import * as React from 'react';
import {LayoutAnimation, StyleSheet, Text, TextInput, View} from 'react-native';

import {Icon} from '../icon';
import {type ThemeProps, withTheme} from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  inputWrapper: {
    backgroundColor: '#00000006',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    height: 56,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00000099',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputWrapperError: {
    borderBottomColor: '#b00020',
  },
  inputWrapper2: {
    flex: 1,
    paddingTop: 8,
    alignSelf: 'stretch',
  },
  inputWrapperFocused: {
    borderBottomWidth: 2,
  },
  label: {
    color: '#00000099',
    fontSize: 16,
    position: 'absolute',
    height: 24,
    top: 16,
    left: 0,
  },
  labelShrink: {
    fontSize: 10,
  },
  labelNoColor: {
    color: '#00000099',
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: '#000000de',
    padding: 0,
    margin: 0,
    paddingTop: 16,
    borderWidth: 0,
    fontSize: 16,
    height: 56,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  asteriskText: {
    color: '#545454',
  },
  helperText: {
    marginHorizontal: 12,
    marginTop: 2,
    color: '#545454',
    fontSize: 12,
  },
  errorText: {
    color: '#b00020',
  },
  leadingIcon: {
    flex: 0,
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailingIcon: {
    flex: 0,
    width: 24,
    height: 24,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Props = {
  helperText: string,
  labelText: string,
  errorText: ?string,
  leadingIcon?: string | React.Node,
  leadingIconColor?: string,
  required?: boolean,
  selectionColor?: string,
  rctshtTheme: ThemeProps,
  trailingIcon?: string | React.Node,
  trailingIconColor?: string,
  value: string,
  forwardedRef: (?TextInput) => void,
  onFocus?: ?() => void,
  onBlur?: ?() => void,
};

type State = {
  isFocused: boolean,
};

class TextField extends React.PureComponent<Props, State> {
  static defaultProps = {
    helperText: '',
    labelText: '',
    errorText: null,
    leadingIcon: null,
    leadingIconColor: '#00000060',
    required: false,
    selectionColor: undefined,
    trailingIcon: null,
    trailingIconColor: '#00000060',
  };

  static Types = {
    FILLED: 'FILLED',
    OUTLINED: 'OUTLINED',
  };

  state = {
    isFocused: false,
  };

  onFocus = () => {
    const {onFocus} = this.props;

    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity),
    );
    this.setState({
      isFocused: true,
    });

    if (onFocus) {
      onFocus();
    }
  };

  onBlur = () => {
    const {onBlur} = this.props;

    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity),
    );
    this.setState({
      isFocused: false,
    });

    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const {
      helperText,
      labelText,
      errorText,
      leadingIcon,
      leadingIconColor = '#00000060',
      required,
      rctshtTheme,
      trailingIcon,
      trailingIconColor = '#00000060',
      value,
      selectionColor,
      forwardedRef,
    } = this.props;
    const {isFocused} = this.state;

    const errorIcon = errorText != null ? <Icon name="alert-circle" size={24} color="#b00020" /> : null;

    const theTrailingIcon =
      errorIcon ||
      // $FlowFixMe
      (isString(trailingIcon) ? <Icon name={trailingIcon} size={24} color={trailingIconColor} /> : trailingIcon);

    const theSelectionColor = errorText != null ? '#b00020' : selectionColor;

    // {/* TODO Use <Type /> */}
    return (
      <View style={styles.container}>
        <View
          id="1"
          style={[
            styles.inputWrapper,
            isFocused ? styles.inputWrapperFocused : null,
            isFocused ? {borderBottomColor: rctshtTheme.colors.primary} : null,
            errorText != null ? styles.inputWrapperError : null,
          ]}
        >
          {leadingIcon != null ? (
            <View style={styles.leadingIcon}>
              {/* $FlowFixMe */}
              {isString(leadingIcon) ? <Icon name={leadingIcon} size={24} color={leadingIconColor} /> : leadingIcon}
            </View>
          ) : null}
          <View style={styles.inputWrapper2}>
            <Text
              style={[
                isFocused || value ? styles.labelShrink : styles.label,
                isFocused || value ? {color: rctshtTheme.colors.primary} : null,
                !isFocused && value ? styles.labelNoColor : null,
                errorText != null ? styles.errorText : null,
              ]}
            >
              {labelText}
              {required ? <Text style={styles.asteriskText}>*</Text> : null}
            </Text>
            <TextInput
              {...this.props}
              ref={forwardedRef}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              style={styles.input}
              selectionColor={theSelectionColor}
            />
          </View>
          {theTrailingIcon != null ? <View style={styles.trailingIcon}>{theTrailingIcon}</View> : null}
        </View>
        <Text style={[styles.helperText, errorText != null ? styles.errorText : null]}>
          {errorText != null || (required && helperText == null ? '* Required' : helperText || '')}
        </Text>
      </View>
    );
  }
}

function withForwardRef(Component: React.ComponentType<*>) {
  function forwardRef(props, ref) {
    return <Component {...props} forwardedRef={ref} />;
  }

  hoistNonReactStatics(forwardRef, Component);

  return React.forwardRef(forwardRef);
}

export default withTheme(withForwardRef(TextField));
