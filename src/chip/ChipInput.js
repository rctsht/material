// @flow strict-local
import isFunction from 'lodash.isfunction';
import uniq from 'lodash.uniq';
import * as React from 'react';
import {LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';

import {withTheme, type ThemeProps} from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: 12,
    paddingRight: 4,
    paddingTop: 0,
    paddingBottom: 1,
    backgroundColor: '#00000006',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#00000099',
  },
  containerWithChips: {
    paddingTop: 12,
  },
  containerFocused: {
    paddingBottom: 0,
    borderBottomWidth: 2,
  },
  chipWrapper: {
    flexShrink: 1,
    height: 40,
    paddingRight: 8,
    paddingBottom: 8,
  },
  textInputWrapper: {
    height: 56,
    paddingRight: 8,
    paddingBottom: 8,
    minWidth: 150,
    flex: 1,
    alignItems: 'stretch',
  },
  textInput: {
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
  suggestions: {
    flex: 1,
    flexBasis: '100%',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#00000006',
  },
  suggestionsContent: {
    padding: 8,
    paddingRight: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    top: 8,
    fontSize: 10,
  },
  labelNoColor: {
    color: '#00000099',
  },
});

type Props = {
  allowNewValues?: boolean,
  children?: React.Node,
  labelText?: string,
  onChangeText?: Function,
  onChangeSelection: Function,
  onPressRemove?: Function,
  onPressSuggestion?: Function,
  onSubmitEditing?: Function,
  suggestions: Array<string> | Function,
  rctshtTheme: ThemeProps,
  render?: Function,
  renderNewValueSuggestion?: Function,
  renderSuggestion: Function,
  value?: any,
  selectedValues?: Array<any>,
};

type State = {
  isFocused: boolean,
  suggestions: Array<string>,
  selectedValues: Array<string>,
  value: string,
};

class ChipInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    allowNewValues: false,
    children: null,
    labelText: null,
    onSubmitEditing: null,
    onChangeText: null,
    render: null,
    renderNewValueSuggestion: null,
  };

  state = {
    isFocused: false,
    suggestions: [],
    selectedValues: [],
    value: '',
  };

  textInput = null;

  getSuggestions = (input, selectedValues) => {
    const {suggestions} = this.props;

    if (isFunction(suggestions)) {
      // $FlowFixMe: Flow doesn't recognise lodash type checks as type refinements
      return suggestions(input, selectedValues);
    }

    return suggestions.filter(suggestion => new RegExp(`${input}`, 'i').test(suggestion));
  };

  onChangeText = value => {
    this.setState(oldState => ({
      value,
      suggestions: this.getSuggestions(value, oldState.selectedValues),
    }));
  };

  onSubmitEditing = () => {
    const {onSubmitEditing} = this.props;

    if (isFunction(onSubmitEditing)) {
      const {value} = this.state;
      // $FlowFixMe: Flow doesn't recognise lodash type checks as type refinements
      onSubmitEditing(value);
    }
    // @TODO implement to allow adding new values
    // const {value} = this.state;
    //
    // if (this.textInput) {
    //   this.textInput.clear();
    // }
  };

  setTextInputRef = (node: TextInput) => {
    this.textInput = node;
  };

  onPressRemove = (value: string) => {
    const {onPressRemove} = this.props;
    if (onPressRemove && isFunction(onPressRemove)) {
      onPressRemove(value);
      return;
    }

    this.setState(
      oldState => {
        const selectedValues = [...oldState.selectedValues].filter(selectedValue => selectedValue !== value);
        return {
          selectedValues,
          suggestions: this.getSuggestions(oldState.value, selectedValues),
        };
      },
      () => {
        const {onChangeSelection} = this.props;
        const {selectedValues} = this.state;
        onChangeSelection(selectedValues);
      },
    );
  };

  onPressSuggestion = (value: string) => {
    const {onPressSuggestion} = this.props;
    if (onPressSuggestion && isFunction(onPressSuggestion)) {
      onPressSuggestion(value);
      return;
    }

    if (this.textInput) {
      this.textInput.clear();
    }

    this.setState(
      oldState => {
        const selectedValues = uniq([...oldState.selectedValues, value]);
        return {
          selectedValues,
          suggestions: this.getSuggestions(oldState.value, selectedValues),
          value: '',
        };
      },
      () => {
        const {onChangeSelection} = this.props;
        const {selectedValues} = this.state;
        onChangeSelection(selectedValues);
      },
    );
  };

  onFocus = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity),
    );
    this.setState({
      isFocused: true,
    });
  };

  onBlur = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity),
    );
    this.setState({
      isFocused: false,
    });
  };

  render() {
    const {
      allowNewValues,
      children,
      labelText,
      rctshtTheme,
      render,
      renderNewValueSuggestion,
      renderSuggestion,

      ...rest
    } = this.props;
    const {isFocused, suggestions, selectedValues, value} = this.state;

    return (
      <View
        style={[
          styles.container,
          (suggestions && suggestions.length) || (selectedValues && selectedValues.length)
            ? styles.containerWithChips
            : null,
          isFocused ? styles.containerFocused : null,
          isFocused ? {borderBottomColor: rctshtTheme.colors.primary} : null,
        ]}
      >
        {render
          ? React.Children.map(render({selectedValues, onPressRemove: this.onPressRemove}), child => (
              <View style={styles.chipWrapper}>{child}</View>
            ))
          : React.Children.map(children, child => <View style={styles.chipWrapper}>{child}</View>)}
        {(suggestions && suggestions.length) || (allowNewValues && value && !selectedValues.includes(value)) ? (
          <ScrollView
            horizontal
            style={styles.suggestions}
            contentContainerStyle={styles.suggestionsContent}
            keyboardShouldPersistTaps="handled"
          >
            {renderNewValueSuggestion && allowNewValues && value && !selectedValues.includes(value) ? (
              <View key={value} style={styles.chipWrapper}>
                {renderNewValueSuggestion({
                  suggestion: value,
                  onPress: this.onPressSuggestion,
                })}
              </View>
            ) : null}
            {suggestions.map(suggestion => (
              // @TODO don't use stringify
              <View key={JSON.stringify(suggestion)} style={styles.chipWrapper}>
                {renderSuggestion({
                  suggestion,
                  onPress: this.onPressSuggestion,
                })}
              </View>
            ))}
          </ScrollView>
        ) : null}
        <View style={styles.textInputWrapper}>
          {/* @TODO Use <Type /> */}
          <Text
            style={[
              isFocused || value ? styles.labelShrink : styles.label,
              isFocused || value ? {color: rctshtTheme.colors.primary} : null,
              !isFocused && value ? styles.labelNoColor : null,
            ]}
          >
            {labelText}
            {/* @TODO Use <Type />, implement required? */}
            {/* {required ? <Text style={styles.asteriskText}>*</Text> : null} */}
          </Text>
          <TextInput
            {...rest}
            ref={this.setTextInputRef}
            style={styles.textInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitEditing}
            blurOnSubmit={false}
          />
        </View>
      </View>
    );
  }
}

export default withTheme(ChipInput);
