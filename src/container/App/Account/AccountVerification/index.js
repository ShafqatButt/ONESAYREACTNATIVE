// noinspection ES6CheckImport

import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, Alert} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  BText,
  Button,
  TitleText,
  LabelText,
  LabelIcon,
  VerifyIcon,
  TitleContainer,
  MainTitleContainer,
} from './style';
import {
  sendOtp,
  sendVerifyEmail,
  CONST_FLOW_TYPES,
} from '../../../Auth/VerifyOTPScreen';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import {GET_QR_CODE, PATCH_UPDATE_PROFILE} from '../../../../api_helper/Api';
import {PATCH, GET_DATA} from '../../../../api_helper/ApiServices';
import AsyncStorage from '@react-native-community/async-storage';
import {getLanguageValueFromKey} from '../../../../commonAction';
import {AuthContext} from '../../../../context/Auth.context';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {underDevelopment} from '../../../../uikit-app';
import Strings from '../../../../string_key/Strings';
import {Input} from '../../../../components/Input';
import DeviceInfo from 'react-native-device-info';
import {Spacer} from '../../../../res/spacer';
import {colors} from '../../../../res/colors';
import IconAssets from '../../../../assets';

export const StatusComponent = ({isVerified}) => {
  if (isVerified === null) {
    return null;
  } else if (isVerified) {
    return <VerifyIcon source={IconAssets.ic_verified_green} />;
  } else {
    return <VerifyIcon source={IconAssets.ic_not_verified_yellow} />;
  }
};

export const TitleComponent = props => {
  const {title, icon, isVerified, onPress, is2FA, isFrom2FA} = props;

  return (
    <MainTitleContainer>
      <TitleContainer>
        <LabelIcon
          style={{
            ...(isVerified === null && {
              tintColor: undefined,
              height: wp('13%'),
              width: wp('13%'),
            }),
          }}
          resizeMode={'contain'}
          source={icon}
        />
        <TitleText
          style={{
            ...(isVerified === null && {
              fontSize: wp('4'),
            }),
          }}>
          {title}
        </TitleText>
        {!isFrom2FA && <StatusComponent isVerified={isVerified} />}
      </TitleContainer>
      <Button onPress={() => onPress(!props?.isEditable)}>
        {isFrom2FA ? (
          <BText>
            {' '}
            {is2FA == true ? Strings.disable_now : Strings.enable_now}
          </BText>
        ) : (
          <BText>
            {props?.isEditable === null
              ? Strings.verify
              : isVerified === null
              ? Strings.enable_now
              : props?.isEditable
              ? Strings.save
              : isVerified
              ? Strings.change
              : Strings.verify}
          </BText>
        )}
      </Button>
    </MainTitleContainer>
  );
};

const phoneValidator = require('phone').phone;
const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const AccountVerification = props => {
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  const refPhoneField = useRef(null);
  const refEmailField = useRef(null);
  const [isPhoneEditable, setPhoneEditable] = useState(false);
  const [isEmailEditable, setEmailEditable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [phone, setPhone] = useState(ContextState?.userData?.mobile);
  const [email, setEmail] = useState(ContextState?.userData?.email);
  const [userDatas, setUserData] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userDetails').then(val => {
      setUserData(JSON.parse(val));
    });
  }, []);

  React.useEffect(() => {
    refPhoneField?.current?.setFocus(false);
    setEmailEditable(() => false);
    refEmailField?.current?.setFocus(false);
    setPhoneEditable(() => false);
  }, [ContextState?.userData]);

  const onSubmitCode = async () => {
    const uniqueID = await DeviceInfo.getUniqueId();
    GET_DATA(
      GET_QR_CODE(ContextState?.userData?.userId),
      true,
      ContextState?.userData?.token,
      uniqueID,
      data => {
        props.navigation.navigate(
          'FAVerification',
          Object.assign(data, {
            twoFactorAuthEnabled: userDatas.twoFactorAuthEnabled,
          }),
        );
      },
    );
  };

  const updateUserProfile = async (updatePhone, callback) => {
    const url = PATCH_UPDATE_PROFILE(ContextState?.userData?.userId);

    let params;

    if (updatePhone) {
      if (phone.trim() === ContextState?.userData?.mobile) {
        callback();
        setPhone(() => ContextState?.userData?.mobile);
        return;
      } else if (phone === '') {
        Alert.alert(Strings.please_enter_mobile_number);
        setPhone(() => ContextState?.userData?.mobile);
        return;
      } else if (!phone?.includes('+')) {
        Alert.alert(Strings.please_enter_valid_phone);
        setPhone(() => ContextState?.userData?.mobile);
        return;
      } else if (!phoneValidator(phone).isValid) {
        Alert.alert(Strings.please_enter_valid_phone);
        setPhone(() => ContextState?.userData?.mobile);
        return;
      }
      params = {
        mobile: phone,
      };
    } else {
      if (email.trim() === ContextState?.userData?.email) {
        callback();
        setEmail(() => ContextState?.userData?.email);
        return;
      } else if (email === '') {
        Alert.alert(Strings.please_enter_email);
        setEmail(() => ContextState?.userData?.email);
        return;
      } else if (!emailReg.test(email)) {
        Alert.alert(Strings.please_enter_valid_email);
        setEmail(() => ContextState?.userData?.email);
        return;
      }
      params = {
        email: email,
      };
    }
    setLoading(() => true);
    PATCH(url, ContextState?.userData?.token, '', params, (response, e) => {
      setLoading(() => false);
      if (!e) {
        // const _user = {
        //   ...ContextState?.userData,
        //   email: email,
        //   mobile: phone,
        // };
        //
        // updateUserData(_user);
        callback(response);
      } else {
        const errorMessage = response.includes(':')
          ? response.split(':')[1].trim()
          : response;
        underDevelopment(errorMessage);
        // setPhone(() => ContextState?.userData?.mobile);
        setEmail(() => ContextState?.userData?.email);
      }
    });
  };

  const onDisableSubmitCode = async () => {
    const userData = await AsyncStorage.getItem('userDetails');
    const uniqueID = await DeviceInfo.getUniqueId();
    GET_DATA(
      GET_QR_CODE(JSON.parse(userData).userId),
      true,
      JSON.parse(userData).token,
      uniqueID,
      data => {
        props.navigation.navigate('Disable2FA');
      },
    );
  };

  return (
    <GlobalFlex>
      <BackHeader
        is_center_text
        title={Strings.verify_account}
        onBackPress={() => props.navigation.goBack()}
      />
      <Spacer space={hp(1)} />
      <View
        style={{height: 2, backgroundColor: '#d9dbdf', width: wp('100%')}}
      />
      <Spacer space={hp(1)} />
      <TitleComponent
        title={Strings.mobile_number}
        onPress={flag => {
          if (!flag || ContextState?.userData?.isMobileVerified) {
            updateUserProfile(true, response => {
              if (ContextState?.userData?.mobile !== phone) {
                refPhoneField?.current?.setFocus(false);
                props.navigation.navigate('VerifyOTPScreen', {
                  type: CONST_FLOW_TYPES.VERIFY_PHONE,
                  uniqueUUID: response.uniqueUUID,
                  flowId: '', // Not required for this flow...
                  expireTime: 10,
                  email: phone,
                  onVerified: () => {
                    if (ContextState?.userData?.isMobileVerified) {
                      refPhoneField?.current?.setFocus(true);
                      setEmailEditable(() => false);
                      setPhoneEditable(() => flag);
                    }
                  },
                });
                return;
              }
              setLoading(() => true);
              sendOtp().then(({success, response}) => {
                setLoading(() => false);
                if (success) {
                  refPhoneField?.current?.setFocus(false);
                  props.navigation.navigate('VerifyOTPScreen', {
                    type: CONST_FLOW_TYPES.VERIFY_PHONE,
                    uniqueUUID: response.uniqueUUID,
                    flowId: '', // Not required for this flow...
                    expireTime: 10,
                    email: phone,
                    onVerified: () => {
                      if (ContextState?.userData?.isMobileVerified) {
                        refPhoneField?.current?.setFocus(true);
                        setEmailEditable(() => false);
                        setPhoneEditable(() => flag);
                      }
                    },
                  });
                }
              });
            }).then();
            return;
          }
          if (flag) {
            refPhoneField?.current?.setFocus(true);
          }
          setEmailEditable(() => false);
          setPhoneEditable(() => flag);
        }}
        isEditable={isPhoneEditable}
        icon={IconAssets.ic_call_outline}
        isVerified={ContextState?.userData?.isMobileVerified}
      />
      <LabelText>{Strings.mobile_number}</LabelText>
      <Input
        value={phone}
        onChange={setPhone}
        ref={refPhoneField}
        returnKeyType={'done'}
        keyboardType={'phone-pad'}
        editable={isPhoneEditable}
        placeholder={'Mobile Number'}
        style={{paddingBottom: wp(2)}}
        placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        onFocus={() => refPhoneField?.current?.setFocus(true)}
        onBlur={() => refPhoneField?.current?.setFocus(false)}
      />

      <Spacer space={hp(1)} />
      <TitleComponent
        icon={IconAssets.ic_email_new}
        isVerified={ContextState?.userData?.isEmailVerified}
        isEditable={isEmailEditable}
        title={Strings.email}
        onPress={flag => {
          if (!flag || ContextState?.userData?.isEmailVerified) {
            updateUserProfile(false, response => {
              if (ContextState?.userData?.email !== email) {
                refEmailField?.current?.setFocus(false);
                props.navigation.navigate('VerifyOTPScreen', {
                  type: CONST_FLOW_TYPES.VERIFY_EMAIL,
                  flowId: '', // Not required for this flow...
                  expireTime: 10,
                  uniqueUUID: '',
                  email: email,
                  onVerified: () => {
                    if (ContextState?.userData?.isEmailVerified) {
                      refEmailField?.current?.setFocus(true);
                      setPhoneEditable(() => false);
                      setEmailEditable(() => flag);
                    }
                  },
                });
                return;
              }
              setLoading(() => true);
              sendVerifyEmail().then(({success, response}) => {
                setLoading(() => false);
                if (success) {
                  refEmailField?.current?.setFocus(false);
                  props.navigation.navigate('VerifyOTPScreen', {
                    type: CONST_FLOW_TYPES.VERIFY_EMAIL,
                    flowId: '', // Not required for this flow...
                    expireTime: 10,
                    uniqueUUID: '',
                    email: email,
                    onVerified: () => {
                      if (ContextState?.userData?.isEmailVerified) {
                        refEmailField?.current?.setFocus(true);
                        setPhoneEditable(() => false);
                        setEmailEditable(() => flag);
                      }
                    },
                  });
                }
              });
            }).then();
            return;
          }

          if (flag) {
            refEmailField?.current?.setFocus(true);
          }
          setPhoneEditable(() => false);
          setEmailEditable(() => flag);
        }}
      />
      <LabelText>{Strings.email}</LabelText>
      <Input
        value={email}
        ref={refEmailField}
        onChange={setEmail}
        placeholder={Strings.email}
        editable={isEmailEditable}
        keyboardType={'email-address'}
        style={{paddingBottom: wp(2)}}
        placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        onFocus={() => refEmailField?.current?.setFocus(true)}
        onBlur={() => refEmailField?.current?.setFocus(false)}
      />

      <Spacer space={hp(1)} />
      <TitleComponent
        icon={IconAssets.ic_two_factor}
        is2FA={userDatas?.twoFactorAuthEnabled}
        title={Strings.two_factor_authentication}
        onPress={() =>
          userDatas?.twoFactorAuthEnabled
            ? onDisableSubmitCode()
            : onSubmitCode()
        }
        isFrom2FA={true}
      />
      {/* props.navigation.navigate("FAVerification") */}
      <LabelText style={{marginStart: wp('13%'), maxWidth: wp(50)}}>
        {Strings.add_extra_layer}
      </LabelText>
      {/*<Loading visible={isLoading} />*/}
      {isLoading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: hp(90),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </GlobalFlex>
  );
};

export default AccountVerification;
