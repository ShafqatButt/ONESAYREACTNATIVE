// noinspection ES6CheckImport

import React from 'react';
import {View} from 'react-native';
import {Container, MenuIcon, MenuTitle} from './styles';

const TabMenuComponent = props => {
  const {focused, tabText, tabImage, onPressed, index} = props;

  return (
    <Container onPress={onPressed}>
      <MenuIcon
        resizeMode={'contain'}
        source={tabImage}
        focused={index != 2 && focused}
        index={index}
      />
      <View pointerEvents={'none'}>
        <MenuTitle pointerEvents={'none'} focused={focused}>
          {tabText}
        </MenuTitle>
      </View>
    </Container>
  );
};

export default TabMenuComponent;
