// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import { Image, SafeAreaView } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ActionWrapper, RegularText} from "../style";
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import styles, {HeaderShadowLine} from './style';
import {images} from '../../../../res/images';
import {Spacer} from '../../../../res/spacer';

export default UnderDevelopmentScreen = props => {
  return (
    <GlobalFlex>
      <BackHeader
        is_center_text
        title={props?.route?.params?.title || 'Hub'}
        onBackPress={() => props.navigation.goBack()}
      />
      <Spacer space={wp(1.5)} />
      <HeaderShadowLine />
      <Spacer space={hp(20)} />
      <RegularText>Under Development</RegularText>
    </GlobalFlex>
  );
};
