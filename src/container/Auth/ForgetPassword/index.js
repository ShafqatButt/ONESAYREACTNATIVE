import React, {useContext, useState, useEffect} from 'react';
import {ActivityIndicator, Alert, Keyboard, View} from 'react-native';
import {Spacer} from '../../../res/spacer';
import {AuthContext} from '../../../context/Auth.context';
import {
  GlobalFlex,
  MainTitle,
  SubContainer,
  SubTitle,
} from '../../../res/globalStyles';
import {BackHeader} from '../../../components/BackHeader';
import {colors} from '../../../res/colors';
import {Button} from '../../../components/Button';
import {Input} from '../../../components/Input';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as HOC from '../../HOC';
import {CONST_FLOW_TYPES} from '../VerifyOTPScreen';
import {underDevelopment} from '../../../uikit-app';
import Strings from '../../../string_key/Strings';

export default ForgetPassword = props => {
  const [email, setEmail] = useState('');

  const {
    state: ContextState,
    onforgetPassword,
    clear,
  } = useContext(AuthContext);
  const {emailError, emailload} = ContextState;
  const MessageShow = new HOC.MessageShow();
  const FullScreenspinner = HOC.FullScreenspinner(View);

  const onSubmit = () => {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email === '') {
      MessageShow.showToastAlert('Please enter email');
    } else if (email.includes('@') && !re.test(email)) {
      MessageShow.showToastAlert('Please enter valid email');
    } else {
      onforgetPassword(email, (flowId, message) => {
        // Alert.alert(
        //   "We've sent you an email to\n" + 'reset your password.',
        //   "If you don't receive an email within few\n" +
        //     'minutes (check your spam too), please\n' +
        //     'contact support@onesay.app',
        // );

        Alert.alert(
          Strings.SA_STR_RESET_PASSWORD_SUCCESS_MSG,
          Strings.SA_STR_RESET_PASSWORD_SUCCESS_SUB_MSG,
        );
        props.navigation.goBack();
        props.navigation.navigate('UpdatePasswordScreen');
      });
    }
  };

  useEffect(() => {
    if (emailError != null) {
      Keyboard.dismiss();
      MessageShow.showToastAlertWithCall(emailError, clear);
    }
  }, [emailError]);

  return (
    <GlobalFlex>
      <BackHeader
        onBackPress={() => {
          props.navigation.goBack();
          clear();
        }}
      />
      <Spacer space={hp(1)} />
      <View
        style={{height: 2, backgroundColor: '#d9dbdf', width: wp('100%')}}
      />
      <Spacer space={hp(1)} />
      <SubContainer>
        <MainTitle>{Strings.ResetPasswordTitle}</MainTitle>
        <Spacer space={hp(2)} />
        <SubTitle>
          {
          Strings.ResetPasswordHeading
          }
        </SubTitle>
        <Spacer space={hp(2.5)} />
        <Input
          value={email}
          onChange={value => setEmail(value)}
          keyboardType={'email-address'}
          returnKeyType={'default'}
          placeholder={Strings.SA_STR_RESET_PASSWORD_EMAIL}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
        <Spacer space={hp(4)} />
        {emailload === true ? (
          <FullScreenspinner spinner={emailload} />
        ) : (
          <Button buttonText={Strings.SA_STR_RESET_PASSWORD_SUBMIT} buttonPress={() => onSubmit()} />
        )}
      </SubContainer>
    </GlobalFlex>
  );
};
