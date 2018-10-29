// @flow
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
  onChangeSelection: Function,
  onPressRemove?: Function,
  onPressSuggestion?: Function,
  onSubmitEditing?: Function,
  suggestions: Array<string> | Function,
  rctshtTheme: ThemeProps,
  render?: Function,
  renderNewValueSuggestion?: Function,
  renderSuggestion: Function,
};

type State = {
  isFocused: boolean,
  suggestions: Array<string>,
  selectedValues: Array<string>,
  text: string,
};

class ChipInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    allowNewValues: false,
    children: null,
    labelText: null,
    onSubmitEditing: null,
    render: null,
    renderNewValueSuggestion: null,
  };

  state = {
    isFocused: false,
    suggestions: [],
    selectedValues: [],
    text: '',
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

  onChangeText = text => {
    this.setState(oldState => ({
      text,
      suggestions: this.getSuggestions(text, oldState.selectedValues),
    }));
  };

  onSubmitEditing = () => {
    const {onSubmitEditing} = this.props;

    if (isFunction(onSubmitEditing)) {
      const {text} = this.state;
      // $FlowFixMe: Flow doesn't recognise lodash type checks as type refinements
      onSubmitEditing(text);
    }
    // @TODO implement to allow adding new values
    // const {text} = this.state;
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
          suggestions: this.getSuggestions(oldState.text, selectedValues),
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
          suggestions: this.getSuggestions(oldState.text, selectedValues),
          text: '',
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
    } = this.props;
    const {isFocused, suggestions, selectedValues, text} = this.state;

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
        {(suggestions && suggestions.length) || (allowNewValues && text && !selectedValues.includes(text)) ? (
          <ScrollView
            horizontal
            style={styles.suggestions}
            contentContainerStyle={styles.suggestionsContent}
            keyboardShouldPersistTaps="handled"
          >
            {renderNewValueSuggestion && allowNewValues && text && !selectedValues.includes(text) ? (
              <View key={text} style={styles.chipWrapper}>
                {renderNewValueSuggestion({
                  suggestion: text,
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
              isFocused || text ? styles.labelShrink : styles.label,
              isFocused || text ? {color: rctshtTheme.colors.primary} : null,
              !isFocused && text ? styles.labelNoColor : null,
            ]}
          >
            {labelText}
            {/* @TODO Use <Type />, implement required? */}
            {/* {required ? <Text style={styles.asteriskText}>*</Text> : null} */}
          </Text>
          <TextInput
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
