// @flow strict-local
import {isString} from 'lodash-es';
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

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
    minHeight: 56,
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
  rctshtTheme: ThemeProps,
  trailingIcon?: string | React.Node,
  trailingIconColor?: string,
  children: React.Node,
};

class Picker extends React.PureComponent<Props> {
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
    children: null,
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
      children,
    } = this.props;

    const errorIcon = errorText != null ? <Icon name="alert-circle" size={24} color="#b00020" /> : null;

    const theTrailingIcon =
      errorIcon ||
      // $FlowFixMe
      (isString(trailingIcon) ? <Icon name={trailingIcon} size={24} color={trailingIconColor} /> : trailingIcon);

    let text = required && helperText == null ? '* Required' : helperText || '';
    if (errorText != null) {
      text = errorText;
    }

    // {/* TODO Use <Type.Default /> */}
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputWrapper,
            // isFocused ? styles.inputWrapperFocused : null,
            // isFocused ? {borderBottomColor: rctshtTheme.colors.primary} : null,
            errorText != null ? styles.inputWrapperError : null,
            // multiline && height > 0 ? {height: height + 8} : null,
            {backgroundColor: rctshtTheme.components.textField.filled.backgroundColor},
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
                styles.labelShrink,
                {color: rctshtTheme.colors.primary},
                styles.labelNoColor,
                errorText != null ? styles.errorText : null,
              ]}
            >
              {labelText}
              {required ? <Text style={styles.asteriskText}>*</Text> : null}
            </Text>
            {children}
          </View>
          {theTrailingIcon != null ? <View style={styles.trailingIcon}>{theTrailingIcon}</View> : null}
        </View>
        <Text style={[styles.helperText, errorText != null ? styles.errorText : null]}>{text}</Text>
      </View>
    );
  }
}

export default withTheme(Picker);
