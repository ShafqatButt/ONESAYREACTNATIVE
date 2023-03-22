// noinspection ES6CheckImport

import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import styles, {MessageText, LoginText, TitleText} from './styles';
import {images} from '../../../res/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Strings from '../../../string_key/Strings';
const AlertModalComponent = props => {
  const {message, onBtnPress, tickIcon, isCancel, btnText, title} =
    props.route.params;

  return (
    <TouchableOpacity
      onPress={() => props.navigation.goBack()}
      style={[styles.mainContainerStyle]}>
      <View style={styles.innerContainerStyle}>
        {tickIcon && (
          <View style={styles.tickContainerStyle}>
            <Image source={images.ic_done} style={styles.tickIconStyle} />
          </View>
        )}
        {title && (
          <TitleText style={isCancel ? styles.leftAlign : {}}>
            {title}
          </TitleText>
        )}
        <MessageText style={isCancel ? styles.leftAlign : {}}>
          {message}
        </MessageText>

        <View style={styles.btnWrapper}>
          {isCancel && (
            <TouchableOpacity
              style={[styles.btnStyle, {backgroundColor: 'white'}]}
              onPress={() => props.navigation.goBack()}>
              <LoginText>{Strings.Cancel}</LoginText>
            </TouchableOpacity>
          )}
          {onBtnPress && (
            <TouchableOpacity
              onPress={onBtnPress}
              style={[
                styles.btnStyle,
                !isCancel ? {backgroundColor: 'white'} : {},
              ]}>
              <LoginText
                style={isCancel ? {color: 'white'} : {fontSize: wp(6)}}>
                {btnText}
              </LoginText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AlertModalComponent;
