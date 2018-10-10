// @flow
import isFunction from 'lodash.isfunction';
import React, {PureComponent} from 'react';
import type {Node} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  containerScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerWrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chipWrapper: {
    height: 40,
    paddingRight: 8,
    paddingBottom: 8,
  },
});

type Props = {
  children: Node,
  initialSelectedValues?: Array<any>,
  maxSelection?: number,
  onChangeSelection?: Function,
  scroll?: boolean,
};

type State = {
  selectedValues: Array<any>,
};

class ChipGroup extends PureComponent<Props, State> {
  static defaultProps = {
    initialSelectedValues: null,
    maxSelection: null,
    onChangeSelection: null,
    scroll: true,
  };

  constructor(props: Props) {
    super(props);

    const {initialSelectedValues} = props;

    this.state = {
      selectedValues: initialSelectedValues || [],
    };
  }

  onPressChild = (value: any) => {
    const {maxSelection} = this.props;
    this.setState(
      oldState => {
        const index = oldState.selectedValues.indexOf(value);
        const selectedValues = [...oldState.selectedValues];

        if (index === -1) {
          selectedValues.push(value);
        } else {
          selectedValues.splice(index, 1);
        }

        return {
          selectedValues: maxSelection != null ? selectedValues.slice(-maxSelection) : selectedValues,
        };
      },
      () => {
        const {onChangeSelection} = this.props;
        const {selectedValues} = this.state;

        if (onChangeSelection && isFunction(onChangeSelection)) {
          onChangeSelection(selectedValues);
        }
      },
    );
  };

  render() {
    const {children, scroll} = this.props;
    const {selectedValues} = this.state;

    const WrapperComponent = scroll ? ScrollView : View;
    const wrapperProps = scroll
      ? {
          horizontal: true,
          contentContainerStyle: styles.containerScroll,
        }
      : {style: styles.containerWrap};

    return (
      <WrapperComponent {...wrapperProps}>
        {React.Children.map(children, child => (
          <View style={styles.chipWrapper}>
            {React.cloneElement(child, {
              selected: selectedValues.includes(child.props.value),
              onPress: this.onPressChild,
            })}
          </View>
        ))}
      </WrapperComponent>
    );
  }
}

export default ChipGroup;
