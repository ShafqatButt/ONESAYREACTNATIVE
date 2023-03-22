// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {Image, View, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ActionWrapper, RegularText} from '../../Account/style';

import {GlobalFlex} from '../../../../res/globalStyles';
import styles, {HeaderShadowLine} from './style';
import {images} from '../../../../res/images';
import {Spacer} from '../../../../res/spacer';
import {AuthContext} from '../../../../context/Auth.context';

export default EventSettings = props => {
  const {state: ContextState, updateUserData} = useContext(AuthContext);
  const {userData} = ContextState;
  return (
    <GlobalFlex>
      <View style={styles.flexInnerWrapper}>
        <Image
          source={
            userData?.avatar?.length > 0
              ? {uri: userData?.avatar}
              : images.avatar
          }
          style={styles.profile_ic}
        />
        <View style={styles.userDetsBox}>
          <Text style={styles.userNameText1}>{userData?.displayName}</Text>
          <Text style={styles.userNameText2}>{`@${userData?.username}`} </Text>
        </View>
      </View>
      <HeaderShadowLine light />
      <ActionWrapper onPress={() => props.navigation.navigate('Account')}>
        <RegularText>Account</RegularText>
        <Image style={styles.icon_ic} source={images.right_ic} />
      </ActionWrapper>
      <HeaderShadowLine light />
      <ActionWrapper
        onPress={() => props.navigation.navigate('EventAvailability')}>
        <RegularText>Availability</RegularText>
        <Image style={styles.icon_ic} source={images.right_ic} />
      </ActionWrapper>
      <HeaderShadowLine light />
      <ActionWrapper onPress={() => props.navigation.navigate('Notifications')}>
        <RegularText>Notifications</RegularText>
        <Image style={styles.icon_ic} source={images.right_ic} />
      </ActionWrapper>
    </GlobalFlex>
  );
};