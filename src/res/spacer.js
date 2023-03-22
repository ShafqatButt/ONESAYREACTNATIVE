import React from 'react';
import {View} from 'react-native';

const Spacer = ({space, row, top}) => {
  return (
    <View
      style={{
        marginTop: top && top,
        marginVertical: space && space,
        marginHorizontal: row && row,
      }}
    />
  );
};

export {Spacer};
