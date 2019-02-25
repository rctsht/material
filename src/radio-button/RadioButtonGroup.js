// @flow strict-local
import {isFunction} from 'lodash-es';
import * as React from 'react';
import {View} from 'react-native';

type Props = {
  children: React.Node,
  initialSelectedValue: mixed,
  onChangeSelection: ?(mixed) => void,
};

type State = {
  selectedValue: mixed,
};

class RadioButtonGroup extends React.PureComponent<Props, State> {
  static defaultProps = {
    initialSelectedValue: null,
    onChangeSelection: null,
  };

  constructor(props: Props) {
    super(props);

    const {initialSelectedValue} = props;

    this.state = {
      selectedValue: initialSelectedValue,
    };
  }

  onPressChild = (selectedValue: mixed) => {
    let changed = false;
    this.setState(
      oldState => {
        if (selectedValue !== oldState.selectedValue) {
          changed = true;
          return {
            selectedValue,
          };
        }

        return null;
      },
      () => {
        const {onChangeSelection} = this.props;

        if (changed && isFunction(onChangeSelection)) {
          onChangeSelection(selectedValue);
        }
      },
    );
  };

  render() {
    const {children} = this.props;
    const {selectedValue} = this.state;

    return (
      <View {...this.props}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            selected: selectedValue === child.props.value,
            onPress: this.onPressChild,
          }),
        )}
      </View>
    );
  }
}

export default RadioButtonGroup;
