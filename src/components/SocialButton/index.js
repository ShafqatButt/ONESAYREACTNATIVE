import React from 'react';
// noinspection ES6CheckImport
import {Image} from 'react-native';
// style component
import {styles, ButtonContainer} from './style';

export const SocialButton = props => {
  const {onPress, customStyle, disabled, source} = props;
  return (
    <ButtonContainer
      onPress={onPress}
      disabled={disabled}
      style={[styles.shadowStyle, customStyle]}>
      <Image source={source} style={styles.iconStyle} />
    </ButtonContainer>
  );
};
