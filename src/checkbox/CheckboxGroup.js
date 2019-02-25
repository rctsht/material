// @flow strict-local
import {isFunction} from 'lodash-es';
import * as React from 'react';
import {View} from 'react-native';

type Props = {
  children: React.Node,
  initialSelectedValues: Array<mixed>,
  onChangeSelection?: (Array<mixed>) => void,
};

type State = {
  selectedValues: Array<mixed>,
};

class CheckboxGroup extends React.PureComponent<Props, State> {
  static defaultProps = {
    initialSelectedValues: [],
    onChangeSelection: null,
  };

  constructor(props: Props) {
    super(props);

    const {initialSelectedValues} = props;

    this.state = {
      selectedValues: initialSelectedValues,
    };
  }

  onPressChild = (value: mixed) => {
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
          selectedValues,
        };
      },
      () => {
        const {onChangeSelection} = this.props;
        const {selectedValues} = this.state;

        if (isFunction(onChangeSelection)) {
          onChangeSelection(selectedValues);
        }
      },
    );
  };

  render() {
    const {children} = this.props;
    const {selectedValues} = this.state;

    return (
      <View {...this.props}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            selected: selectedValues.includes(child.props.value),
            onPress: this.onPressChild,
          }),
        )}
      </View>
    );
  }
}

export default CheckboxGroup;
