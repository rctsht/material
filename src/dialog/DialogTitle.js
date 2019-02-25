// @flow strict-local
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {Divider} from '../divider';
import {Type} from '../type';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    marginTop: 18,
    marginBottom: 18,
    color: '#000000de',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
});

type Props = {
  title?: string,
  divider?: boolean,
};

const DialogTitle = (props: Props) => {
  const {title, divider} = props;

  if (!title) {
    return null;
  }

  return (
    <View>
      <View style={styles.container}>
        <Type style={styles.title}>{title}</Type>
      </View>
      {divider ? <Divider fullWidth /> : null}
    </View>
  );
};

DialogTitle.defaultProps = {
  title: '',
  divider: false,
};

export default DialogTitle;
