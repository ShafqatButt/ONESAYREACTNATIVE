import React from 'react';
import {ActivityDot, MenuTitle} from '../../../../../res/globalStyles';
import {TitleContainer, MenuIcon, MenuButton} from './styles';

const MenuItemComponent = props => {
  const {title, icon, isActive, onPress} = props;
  return (
    <MenuButton onPress={onPress}>
      <MenuIcon resizeMode={'contain'} source={icon} />
      <TitleContainer>
        {isActive && <ActivityDot />}
        <MenuTitle>{title}</MenuTitle>
      </TitleContainer>
    </MenuButton>
  );
};

export default MenuItemComponent;
