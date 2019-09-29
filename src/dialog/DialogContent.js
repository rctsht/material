// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  containerHorizontalPadding: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  containerVerticalPadding: {
    paddingTop: 24,
    paddingBottom: 24,
  },
});

const paddingTypes = {
  BOTH: 'BOTH',
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
  NONE: 'NONE',
};

type Props = {
  children?: React.Node,
  padContent?: $Values<typeof paddingTypes>,
};

const DialogContent = (props: Props) => {
  const {children, padContent} = props;

  if (children == null) {
    return null;
  }

  const viewStyles = [styles.container];

  if ([paddingTypes.BOTH, paddingTypes.HORIZONTAL].includes(padContent)) {
    viewStyles.push(styles.containerHorizontalPadding);
  }

  if ([paddingTypes.BOTH, paddingTypes.VERTICAL].includes(padContent)) {
    viewStyles.push(styles.containerVerticalPadding);
  }

  return (
    // $FlowFixMe
    <View
      style={viewStyles}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </View>
  );
};

DialogContent.paddingTypes = paddingTypes;

DialogContent.defaultProps = {
  children: null,
  padContent: paddingTypes.BOTH,
};

export default DialogContent;
