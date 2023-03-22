import React from 'react';
// noinspection ES6CheckImport
import { ActivityIndicator } from 'react-native';
// style component
import { ButtonContainer, TextWrapper } from './style';
import { colors } from '../../res/colors';

export const Button = props => {
  const { isLoading, btnstyle, txtstyle, buttonText, disabled, buttonPress } =
    props;
  return (
    <ButtonContainer
      style={[btnstyle]}
      disabled={disabled}
      isLoading={isLoading}
      onPress={() =>
        disabled === true ? console.log('disabled') : buttonPress()
      }>
      {isLoading ? (
        <ActivityIndicator size={'large'} color={colors.PRIMARY_COLOR} />
      ) : (
          <TextWrapper style={[txtstyle]}>{buttonText} </TextWrapper>
        )}
    </ButtonContainer>
  );
};
