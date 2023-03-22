// noinspection ES6CheckImport

import React, {useContext, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  AppState,
  Image,
  Platform,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {POST_QR_CODE} from '../../../../api_helper/Api';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {POST_DATA} from '../../../../api_helper/ApiServices';
import {ScrollView} from 'react-native-gesture-handler';
import {Spacer} from '../../../../res/spacer';
import {colors} from '../../../../res/colors';
import {MainTitle, SubContainer} from './style';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {fonts} from '../../../../res/fonts';
import {Input} from '../../../../components/Input';
import {Button} from '../../../../components/Button';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import {saveData} from '../../../../res/asyncStorageHelper';
import {AuthContext} from '../../../../context/Auth.context';
import Clipboard from '@react-native-community/clipboard';
import * as HOC from '../../../HOC';
import Strings from '../../../../string_key/Strings';

export default FAVerification = props => {
  const appState = React.useRef(AppState.currentState);
  const {navigation, params} = useAppNavigation();
  const {sdk, currentUser} = useSendbirdChat();
  const [code, setCode] = useState('');
  const [userData, setUserData] = useState('');
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);

  const MessageShow = new HOC.MessageShow();

  const onVerifyOtp = async () => {
    const userData = await AsyncStorage.getItem('userDetails');
    let postData = {
      userId: JSON.parse(userData).userId,
      totp: code,
      isTFAEnabled: true,
    };
    POST_DATA(
      POST_QR_CODE,
      JSON.parse(userData).token,
      postData,
      (data, flag) => {
        if (flag == false && data?.otpValid) {
          saveData(
            'userDetails',
            Object.assign(JSON.parse(userData), {
              twoFactorAuthEnabled: data?.isTFAEnabled,
            }),
          );
          Alert.alert(
            'Buzzmi',
            '2FA ' + Strings.enable_successfully,
            [
              {
                text: Strings.okay,
                onPress: () => {
                  props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      },
    );
  };

  const copyToClipboard = () => {
    Clipboard.setString(params?.secret);
    setTimeout(() => {
      MessageShow.showToast(Strings.secret_key_copied);
    }, 200);
  };

  return (
    <GlobalFlex>
      <BackHeader
        isLeftText={true}
        background={{
          backgroundColor: colors.PRIMARY_COLOR,
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
        }}
        textColor={{color: colors.WHITE}}
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={''}
      />

      <SubContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Spacer space={hp(1)}></Spacer>
          <View style={{width: wp(90), alignSelf: 'center'}}>
            <MainTitle>{Strings.enable_twofactor_auth}</MainTitle>
            <Spacer space={hp(1)}></Spacer>
            <Text
              style={{
                fontSize: wp(3.5),
                fontFamily: fonts.REGULAR,
                color: colors.DARK_GRAY_91,
              }}>
              {Strings.an_authenticator_app_lets_you}
            </Text>
            <Spacer space={hp(1.5)}></Spacer>
            <Text
              style={{
                fontSize: wp(3.5),
                fontFamily: fonts.REGULAR,
                color: colors.DARK_GRAY_91,
              }}>
              {Strings.to_configure_your}
            </Text>
            <Spacer space={hp(1.5)}></Spacer>
            <Text
              style={{
                fontSize: wp(3.5),
                fontFamily: fonts.REGULAR,
                color: colors.DARK_GRAY_91,
              }}>
              {Strings.add_a_new_timebased}
            </Text>
            <Spacer space={hp(1.5)}></Spacer>

            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                copyToClipboard();
              }}>
              <Image
                source={{uri: params?.qrcode}}
                style={{width: wp(50), height: wp(50)}}
              />
            </TouchableOpacity>
            <Spacer space={hp(1.5)}></Spacer>
            <MainTitle>{Strings.enter_the_code_generated}</MainTitle>
            <Spacer space={hp(0.5)}></Spacer>
            <Input
              value={code}
              onChange={setCode}
              placeholder={Strings.code}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
              style={{flex: 1, paddingBottom: wp(2)}}
              mainstyle={{flexDirection: 'row'}}
            />
            <Spacer space={hp(1.5)} />
            <Button
              buttonText={Strings.validate}
              buttonPress={() => onVerifyOtp()}
            />
          </View>
        </ScrollView>
        {Platform.OS === 'ios' && (
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={120}
          />
        )}
      </SubContainer>
    </GlobalFlex>
  );
};
