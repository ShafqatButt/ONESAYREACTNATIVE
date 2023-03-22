// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {View, Alert, Platform} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {SubTitle, GlobalFlex, SubContainer} from '../../../res/globalStyles';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BackHeader} from '../../../components/BackHeader';
import {AuthContext} from '../../../context/Auth.context';
import {GET, POST, DELETE_USER_ACCOUNT} from '../../../api_helper/ApiServices';
import {Button} from '../../../components/Button';
import Loading from '../../../components/Loading';
import {Input} from '../../../components/Input';
import {Spacer} from '../../../res/spacer';
import {colors} from '../../../res/colors';
import {MainTitle} from './style';
import {IS_IPHONE_X} from '../../../constants';
import {fonts} from '../../../res/fonts';
import {
  DELETE_ACCOUNT,
  GET_CONFIRM_EMAIL_VERIFICATION,
  GET_SEND_OTP,
  GET_SEND_VERIFY_EMAIL,
  POST_RESET_PASSWORD,
  POST_VERIFY_OTP,
} from '../../../api_helper/Api';
import {underDevelopment} from '../../../uikit-app';
import AsyncStorage from '@react-native-community/async-storage';
import {getUniqueId} from 'react-native-device-info';
import {toHHMMSS} from '../../App/Chat_call/CameraScreen';
import {getLanguageValueFromKey, unregisterToken} from '../../../commonAction';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import {removeData} from '../../../res/asyncStorageHelper';
import {useConnection} from '@sendbird/uikit-react-native';
import Strings from '../../../string_key/Strings';

export const CONST_FLOW_TYPES = {
  VERIFY_EMAIL: 'verify-email',
  VERIFY_PHONE: 'verify-phone',
  RECOVER_EMAIL: 'recover-email',
  DELETE_ACCOUNT: 'delete-account',
};

export const sendVerifyEmail = async () => {
  const userData = await AsyncStorage.getItem('userDetails').then(s =>
    JSON.parse(s),
  );
  try {
    const response = await GET(GET_SEND_VERIFY_EMAIL, userData.token, '');
    const _response = response.data;
    return {
      success: true,
      response: _response,
    };
  } catch (e) {
    underDevelopment(e.message);
    console.log('response (error) => ', e);
    return {
      success: false,
      response: e.message,
    };
  }
};
export const sendOtp = async () => {
  const userData = await AsyncStorage.getItem('userDetails').then(s =>
    JSON.parse(s),
  );
  try {
    const response = await GET(GET_SEND_OTP, userData.token, '');
    const _response = response.data;
    return {
      success: true,
      response: _response,
    };
  } catch (e) {
    underDevelopment(
      e.response.data.message ? e.response.data.message : e.message,
    );

    console.log('response (error) => ', e.response);
    return {
      success: false,
      response: e.message,
    };
  }
};
const passwordReg =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
export default VerifyOTPScreen = props => {
  /**
   * email field will be used as phone for VERIFY_PHONE flow...
   */
  const {
    message,
    flowId,
    onVerified,
    email,
    expireTime,
    type,
    uniqueUUID,
    deleteAccountReasonId,
    deleteAccountReasonDescription,
  } = props.route.params;
  const refCurrentTimerSeconds = React.useRef(expireTime * 60);

  const refUniqueUUID = React.useRef(uniqueUUID);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show_1, setShow1] = useState(true);
  const [show_2, setShow2] = useState(true);
  const refExpiryTimer = React.useRef(null);
  const [timerText, setTimerText] = useState(
    toHHMMSS(refCurrentTimerSeconds?.current),
  );
  const [loading, setLoading] = useState(false);
  const [isResendEnabled, setResendEnabled] = useState(false);
  const {disconnect} = useConnection();

  const {
    state: ContextState,
    onforgetPassword,
    clear,
    updateUserData,
  } = useContext(AuthContext);

  useEffect(() => {
    if (!isResendEnabled) {
      refCurrentTimerSeconds.current = expireTime * 60;
    }
    if (refExpiryTimer?.current !== null) {
      BackgroundTimer.clearInterval(refExpiryTimer?.current);
    }

    refExpiryTimer.current = BackgroundTimer.setInterval(() => {
      refCurrentTimerSeconds.current = refCurrentTimerSeconds?.current - 1;
      if (refCurrentTimerSeconds.current < 0) {
        if (refExpiryTimer?.current !== null) {
          BackgroundTimer.clearInterval(refExpiryTimer?.current);
          setResendEnabled(() => true);
        }
        return;
      }
      setTimerText(() => toHHMMSS(refCurrentTimerSeconds?.current));
    }, 1000);
    return () => {
      if (refExpiryTimer?.current !== null) {
        BackgroundTimer.clearInterval(refExpiryTimer?.current);
        refExpiryTimer.current = null;
      }
    };
  }, [isResendEnabled]);

  const onResendCode = () => {
    setLoading(() => true);
    switch (type) {
      case CONST_FLOW_TYPES.VERIFY_EMAIL:
        sendVerifyEmail().then(({success, response}) => {
          setLoading(() => false);
          if (success) {
            setResendEnabled(() => false);
            underDevelopment(response?.message);
          }
        });
        break;
      case CONST_FLOW_TYPES.VERIFY_PHONE:
        console.log('CONST_FLOW_TYPES.VERIFY_PHONE');
        sendOtp().then(({success, response}) => {
          setLoading(() => false);
          if (success) {
            setResendEnabled(() => false);
            refUniqueUUID.current = response?.uniqueUUID;
            underDevelopment(response?.message);
          }
        });
        break;
      case CONST_FLOW_TYPES.DELETE_ACCOUNT:
        console.log('CONST_FLOW_TYPES.DELETE_ACCOUNT');
        sendOtp().then(({success, response}) => {
          setLoading(() => false);
          if (success) {
            setResendEnabled(() => false);
            refUniqueUUID.current = response?.uniqueUUID;
            underDevelopment(response?.message);
          }
        });
        break;
      default:
        onforgetPassword(email, (flowId, message) => {
          setLoading(() => false);
          setResendEnabled(() => false);
          Alert.alert('Success', message);
        });
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const response = await GET(
        GET_CONFIRM_EMAIL_VERIFICATION(otp),
        ContextState?.userData?.token,
        '',
      );
      const _response = response.data;
      return {
        success: true,
        response: _response,
      };
    } catch (e) {
      let x = e.response.data.message;
      // underDevelopment(e.message);
      // console.log('response email(error) => ', e.message);
      return {
        success: false,
        response: x ? x : e.message,
      };
    }
  };
  const confirmPhoneVerification = async callback => {
    const uniqueID = await getUniqueId();
    POST(
      POST_VERIFY_OTP,
      true,
      ContextState?.userData?.token,
      '',
      {
        otp: otp,
        uniqueUUID: refUniqueUUID?.current,
      },
      callback,
    );
  };

  const confirmDeleteAccount = async callback => {
    DELETE_USER_ACCOUNT(
      DELETE_ACCOUNT,
      {
        otp: otp,
        uniqueUUID: refUniqueUUID?.current,
        deleteAccountReasonId: deleteAccountReasonId,
        deleteAccountReasonDescription: deleteAccountReasonDescription,
      },
      ContextState?.userData?.token,
      callback,
    );
  };

  const onSubmit = () => {
    if (
      type === CONST_FLOW_TYPES.VERIFY_PHONE ||
      type === CONST_FLOW_TYPES.DELETE_ACCOUNT
        ? otp.length < 4
        : otp.length < 6
    ) {
      underDevelopment(Strings.please_enter_received_code);
      return;
    }

    if (type === CONST_FLOW_TYPES.RECOVER_EMAIL) {
      if (newPassword === '') {
        underDevelopment(Strings.please_enter_password);
        return;
      } else if (!passwordReg.test(newPassword)) {
        Alert.alert(
          Strings.invalid_password,
          Strings.password_length_to_be +
            Strings.at_least_one_special_char +
            Strings.at_least_one_capital_letter +
            Strings.at_least_one_number +
            Strings.no_more_than_two_consecutive,
        );
      } else if (confirmPassword === '') {
        underDevelopment(Strings.please_enter_confirm_password);
        return;
      } else if (confirmPassword !== newPassword) {
        underDevelopment(Strings.passwords_do_not_match);
        return;
      }
    }

    setLoading(() => true);
    switch (type) {
      case CONST_FLOW_TYPES.VERIFY_EMAIL:
        confirmEmailVerification().then(({success, response}) => {
          setLoading(() => false);
          if (success) {
            underDevelopment(response?.message);
            const updateUser = {
              ...ContextState?.userData,
              email: email,
              isEmailVerified: true,
            };
            updateUserData(updateUser);
            onVerified();
            props.navigation.goBack();
          } else {
            underDevelopment(response);
            setOtp('');
          }
        });
        break;
      case CONST_FLOW_TYPES.VERIFY_PHONE:
        console.log('CONST_FLOW_TYPES.VERIFY_PHONE');
        confirmPhoneVerification((res, e) => {
          setLoading(() => false);
          if (!e) {
            underDevelopment(res?.message);
            const updateUser = {
              ...ContextState?.userData,
              mobile: email, // email for this case is actually the phone number passed from AccountVerification screen.
              isMobileVerified: true,
            };
            updateUserData(updateUser);
            onVerified();
            props.navigation.goBack();
          } else {
            console.log('Error => ', res);
            underDevelopment(res);
            setOtp('');
          }
        });
        break;
      case CONST_FLOW_TYPES.DELETE_ACCOUNT:
        confirmDeleteAccount((res, e) => {
          setLoading(() => false);
          if (!e) {
            removeData('userDetails');
            removeData('company_id');
            setTimeout(() => {
              props.navigation.replace('Auth');
            }, 150);
          } else {
            console.log('Error => ', res);
            underDevelopment(res);
            setOtp('');
          }
        });
        break;
      default:
        POST(
          POST_RESET_PASSWORD,
          false,
          '',
          '',
          {
            password: newPassword,
            token: otp,
          },
          (res, e) => {
            setLoading(() => false);
            if (!e) {
              console.log('Success => ', JSON.stringify(res));
              underDevelopment(res?.message);
              props.navigation.goBack();
              props.navigation.goBack();
            } else {
              console.log('Error => ', res);
            }
          },
        );
    }
  };

  return (
    <GlobalFlex>
      <BackHeader
        onBackPress={() => {
          props.navigation.goBack();
          if (type === CONST_FLOW_TYPES.RECOVER_EMAIL) {
            clear();
          }
        }}
      />
      <Spacer space={hp(1)} />
      <View
        style={{height: 2, backgroundColor: '#d9dbdf', width: wp('100%')}}
      />
      <Spacer space={wp(3)} />
      <SubContainer>
        <MainTitle>{Strings.enter_your_verification_code}</MainTitle>
        <Spacer space={hp(2)} />
        <SubTitle>{`${Strings.we_sent_the_code} ${
          type === CONST_FLOW_TYPES.VERIFY_PHONE
            ? Strings.phone_small
            : Strings.email_small
        } \n${email}`}</SubTitle>
        <Spacer space={hp(2.5)} />

        <OTPInputView
          pinCount={
            type === CONST_FLOW_TYPES.VERIFY_PHONE ||
            type === CONST_FLOW_TYPES.DELETE_ACCOUNT
              ? 4
              : 6
          }
          code={otp}
          autoFocusOnLoad={false}
          keyboardType={'default'}
          codeInputFieldStyle={{
            borderWidth: 1,
            borderColor: '#c3cddc',
            borderRadius: 10,
            backgroundColor: '#ffffff',
            fontSize: Platform.OS == 'ios' ? 25 : 20,
            fontFamily: fonts.MEDIUM,
            textAlign: 'center',
            height: hp('6%'),
            width: wp('10%'),
          }}
          onCodeFilled={code => {
            console.log('code ===> ', code);
            // onSubmit();
          }}
          placeholderTextColor={'black'}
          onCodeChanged={setOtp}
          style={{
            marginTop: -20,
            alignSelf: 'center',
            width:
              type === CONST_FLOW_TYPES.VERIFY_PHONE ||
              type === CONST_FLOW_TYPES.DELETE_ACCOUNT
                ? wp('49%')
                : wp('69%'),
            height: hp('10%'),
          }}
          codeInputHighlightStyle={{borderColor: colors.PRIMARY_COLOR}}
        />

        <SubTitle>
          {Strings.this_code_will_expire} {timerText}.
        </SubTitle>
        {/*{otp?.length === 6 && type === CONST_FLOW_TYPES.RECOVER_EMAIL && (*/}
        {type === CONST_FLOW_TYPES.RECOVER_EMAIL && (
          <>
            <Input
              is_password={true}
              value={newPassword}
              secureTextEntry={show_1}
              onChange={setNewPassword}
              placeholder={Strings.new_password}
              mainstyle={{flexDirection: 'row'}}
              onTouchPress={() => setShow1(!show_1)}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
              style={{flex: 1, paddingBottom: wp(2)}}
            />
            <Input
              is_password={true}
              value={confirmPassword}
              secureTextEntry={show_2}
              onChange={setConfirmPassword}
              placeholder={Strings.confirm_password}
              mainstyle={{flexDirection: 'row'}}
              onTouchPress={() => setShow2(!show_2)}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
              style={{flex: 1, paddingBottom: wp(2)}}
            />
          </>
        )}
        <Spacer space={wp(2.2)} />
        <Button
          disabled={isResendEnabled}
          buttonText={Strings.submit}
          buttonPress={() => onSubmit()}
          txtstyle={{
            color: isResendEnabled ? colors.BLACK : colors.WHITE,
          }}
          btnstyle={{
            backgroundColor: isResendEnabled ? '#dee8f2' : colors.PRIMARY_COLOR,
          }}
        />
        <Spacer space={hp(1)} />
        <Button
          disabled={!isResendEnabled}
          buttonText={Strings.resend_code}
          buttonPress={() => onResendCode()}
          txtstyle={{color: !isResendEnabled ? colors.BLACK : colors.WHITE}}
          btnstyle={{
            backgroundColor: !isResendEnabled
              ? '#dee8f2'
              : colors.PRIMARY_COLOR,
          }}
        />
      </SubContainer>
      {/*<Loading visible={loading} />*/}
      {loading && (
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
