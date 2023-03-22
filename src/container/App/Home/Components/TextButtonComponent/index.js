import React from 'react';
import {DiamondIcon} from '../BasicInfoComponent/styles';
import {Container, TitleText, MainContainer} from './styles';

const TextButtonComponent = props => {
  const {title, icon, onPress} = props;
  return (
    <MainContainer>
      <Container onPress={onPress}>
        <TitleText>{title}</TitleText>
        {icon && <DiamondIcon resizeMode={'contain'} source={icon} />}
      </Container>
    </MainContainer>
  );
};

export default TextButtonComponent;
