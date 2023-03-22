// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {GlobalFlex, SubContainer, SubTitle} from '../../../res/globalStyles';
import {StatusComponent} from '../../App/Account/AccountVerification';
import {POST_RESET_PASSWORD} from '../../../api_helper/Api';
import {BackHeader} from '../../../components/BackHeader';
import {AuthContext} from '../../../context/Auth.context';
import {POST} from '../../../api_helper/ApiServices';
import {underDevelopment} from '../../../uikit-app';
import {Button} from '../../../components/Button';
import Loading from '../../../components/Loading';
import {Input} from '../../../components/Input';
import {Spacer} from '../../../res/spacer';
import {colors} from '../../../res/colors';
import styles, {MainTitle} from './style';
import Strings from '../../../string_key/Strings';

const passSpecialChar = /[#?!@$%^&*-]/;
const passCapitalLetter = /[A-Z]/;
const passOneNumber = /[0-9]/;
// const passConsecutiveTwoChar = /(.).*\1/;
const passwordReg =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
export default UpdatePasswordScreen = props => {
  const {clear} = useContext(AuthContext);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [show_1, setShow1] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newPassword.length > 0) {
      let errorString;
      if (!passwordReg.test(newPassword)) {
        if (newPassword.length < 8 || newPassword.length > 14) {
          errorString = Strings.SA_STR_CHANGE_PASSWORD_MUST_CONTAINS_AT_LEAST_8;
        } else if (!passSpecialChar.test(newPassword)) {
          errorString = Strings.SA_STR_CHANGE_PASSWORD_MUST_CONTAINS_AT_LEAST_1_SPECIALCHARACTER;
        } else if (!passCapitalLetter.test(newPassword)) {
          errorString = Strings.SA_STR_CHANGE_PASSWORD_MUST_CONTAINS_AT_LEAST_1_UPPER_CASE;
        } else if (!passOneNumber.test(newPassword)) {
          errorString = 'At least one Number\n';
        } else {
          errorString = 'No more than two consecutive characters';
        }
        setPasswordError(() => errorString);
      } else {
        setPasswordError(() => '');
      }
    } else {
      setPasswordError(() => '');
    }
  }, [newPassword]);

  const onSubmit = () => {
    setLoading(() => true);

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
        } else {
          underDevelopment(res.includes(':') ? res.split(':')[1].trim() : res);
          console.log('Error => ', res);
        }
      },
    );
  };

  return (
    <GlobalFlex>
      <BackHeader
        onBackPress={() => {
          props.navigation.goBack();
          clear();
        }}
      />
      <Spacer space={wp(3.5)} />
      <SubContainer>
        <MainTitle>{Strings.SA_STR_CHANGE_PASSWORD_SUCCESS_ALERT_TITLE}</MainTitle>
        <Spacer space={hp(3)} />
        <Input
          value={otp}
          placeholder={Strings.SA_STR_CHANGE_PASSWORD_TOKEN}
          keyboardType={'default'}
          returnKeyType={'default'}
          onChange={value => setOtp(() => value)}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
        <View style={{justifyContent: 'center'}}>
          <Input
            is_password={false}
            value={newPassword}
            secureTextEntry={show_1}
            placeholder={Strings.SA_STR_PASSWORD}
            mainstyle={{flexDirection: 'row'}}
            onTouchPress={() => setShow1(!show_1)}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
            style={{flex: 1, paddingBottom: wp(2)}}
            onChange={value => setNewPassword(() => value)}
          />
          {newPassword.length > 0 && passwordError?.length < 1 && (
            <View style={{position: 'absolute', right: 0}}>
              <StatusComponent isVerified={true} />
            </View>
          )}
        </View>
        {passwordError?.length > 0 && (
          <SubTitle style={styles.errorTextStyle}>{passwordError}</SubTitle>
        )}
        <Spacer space={wp(4)} />
        <Button
          disabled={passwordError.length > 0 || otp.length < 6}
          buttonText={Strings.SA_STR_CHANGE_PASSWORD_RESET_BUTTON}
          buttonPress={() => onSubmit()}
          txtstyle={{
            color: colors.WHITE,
          }}
          btnstyle={{
            opacity: passwordError.length > 0 || otp.length < 6 ? 0.4 : 1,
            backgroundColor: colors.PRIMARY_COLOR,
          }}
        />
      </SubContainer>
      <Loading visible={loading} />
    </GlobalFlex>
  );
};
