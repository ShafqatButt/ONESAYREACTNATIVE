// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {Image, View, Animated, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BasicInfoComponent from '../../Home/Components/BasicInfoComponent';
import styles, {
  ButtonText,
  RoundButton,
  RegularText,
  InviteContainer,
  HeaderShadowLine,
  LoadingContainer,
  HeaderText,
} from './style';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {underDevelopment} from '../../../../uikit-app';
import {images} from '../../../../res/images';
import {Spacer} from '../../../../res/spacer';

export default HubScreen = props => {
  return (
    <GlobalFlex>
      {/* <BackHeader
        title={'Hub'}
        is_center_text
        onBackPress={() => props.navigation.goBack()}
      /> */}
      <Spacer space={wp(1.5)} />
      {/* <HeaderShadowLine />

      <Spacer top={wp('6%')} /> */}
      <LoadingContainer>
        <HeaderText>Rank ladder</HeaderText>
        <View
          style={{
            height: 20,
            flexDirection: 'row',
            width: '90%',
            backgroundColor: 'white',
            borderColor: '#000',
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          <Animated.View
            style={[
              [StyleSheet.absoluteFill],
              {
                backgroundColor: 'rgb(90,187,198)',
                width: '50%',
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              },
            ]}
          />
        </View>
        <HeaderText>564 / 10k</HeaderText>
      </LoadingContainer>
      <Spacer top={wp('6%')} />

      <BasicInfoComponent
        onWalletPress={() =>
          props.navigation.navigate('ProfileNav', {
            screen: 'Wallet',
          })
        }
        onBenefitsPress={() => underDevelopment()}
      />
      <Spacer top={wp('6%')} />
      <InviteContainer>
        <RegularText>
          Invite 3 friends{'\n'}and earn 5{'\n'}BUZZMI
        </RegularText>
        <RoundButton onPress={() => props.navigation.navigate('Invitations')}>
          <ButtonText>INVITE</ButtonText>
        </RoundButton>
      </InviteContainer>
    </GlobalFlex>
  );
};
