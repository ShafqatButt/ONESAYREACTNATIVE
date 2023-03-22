import React, {useContext, useState, useEffect, useRef} from 'react';
// noinspection ES6CheckImport
import {
  Text,
  View,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {AuthContext} from '../../../context/Auth.context';
// style themes and components
import {PhoneTextInput} from '../../../components/PhoneTextInput';
import {ChevronWrapper} from '../../../components/Input/style';
import {BackHeader} from '../../../components/BackHeader';
import {Button} from '../../../components/Button';
import {Input} from '../../../components/Input';
import {Spacer} from '../../../res/spacer';
import {colors} from '../../../res/colors';
import {fonts} from '../../../res/fonts';
import globalStyles, {
  SubContainer,
  GlobalFlex,
  MainTitle,
  SubTitle,
} from '../../../res/globalStyles';
import {styles} from './style';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {getLanguageValueFromKey} from '../../../commonAction';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';
import * as Icons from 'react-native-heroicons/solid';
import {handleLink} from '../../../api_helper/Api';
import DatePicker from 'react-native-date-picker';
import * as HOC from '../../HOC';
import moment from 'moment';
import IconAssets from '../../../assets';
import {
  LoginManager,
  Profile,
  AccessToken,
  LoginButton,
} from 'react-native-fbsdk-next';
import {SocialButton} from '../../../components/SocialButton';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import Strings from '../../../string_key/Strings';
import jwtDecode from 'jwt-decode';

const phoneValidator = require('phone').phone;
const countries = require('country-data').countries;

export default SignUp = props => {
  let inputRef = useRef();
  let refCallingCode = useRef('+1');
  let refDob = useRef('');
  let refLastDob = useRef(new Date());

  const {
    state: ContextState,
    register,
    socialRegister,
    socialLogin,
    clear,
    registerExigo
  } = useContext(AuthContext);
  const {isRegistrationPending, registrationError} = ContextState;

  const MessageShow = new HOC.MessageShow();

  let _email = '';
  let _lastName = '';
  let _firstName = '';
  let _referCode = '';

  if (props?.route?.params?.referCode?.length > 0) {
    _referCode = props?.route?.params?.referCode;
  }
  if (props?.route?.params?.loginType?.length > 0) {
    const {userData} = props?.route?.params;
    _email = userData?.email;
    _firstName = userData?.givenName;
    _lastName = userData?.familyName;
  }


  
  const isSocialLogin =
    typeof props?.route?.params?.loginType === 'string' &&
    props?.route?.params?.loginType?.length > 0;

    console.log("IS Social Login -->",isSocialLogin);

  const [show, setShow] = useState(true);
  const [cca2, setcca2] = useState('US');
  const [email, setEmail] = useState(_email);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('O');
  const [show_2, setShow2] = useState(true);
  const [show_1, setShow1] = useState(true);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [lastName, setLastName] = useState(_lastName);
  const [firstName, setFirstName] = useState(_firstName);
  const [birthDate, setBirthDate] = useState('');
  const [newuserName, setNewUserName] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [referalCode, setReferalCode] = useState(_referCode);
  const [countryName, setCountryName] = useState(countries[1]?.name);
  const [toggleCheckBox, setToggleCheckBox] = useState({1:false,2:false});
  const [openBirthPicker, setOpenBirthPicker] = useState(false);
  const [newconfirmpassword, setNewConfirmPassword] = useState('');

  useEffect(() => {
    if (registrationError != null) {
      Keyboard.dismiss();
      MessageShow.showToastAlertWithCall(registrationError, clear);
    }
  }, [registrationError]);

  useEffect(() => {
    if (toggleCheckBox) {
      clear();
    }
  }, [toggleCheckBox]);
  const hasEmojis = text => {
    return (
      text.match(
        /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g,
      ) !== null
    );
  };

  const doUserLogInApple = async () => {
    try {
      let response = {};
      let appleId = '';
      let appleToken = '';
      let appleEmail = '';
      if (Platform.OS === 'ios') {
        // Performs login request requesting user email
        response = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL],
        });
        console.log('response in signup===>>',response);

        // On iOS, user ID and email are easily retrieved from request
        appleId = response.user;
        appleToken = response.identityToken;
        appleEmail = response.email;
  
        console.log("Apple ID" ,appleId);
        console.log("\nApple Token",appleToken);
        console.log("\nApple Email ",appleEmail);

        socialLogin(appleId, 'Apple', props, e => {
          console.log('Apple login (errors mine) ===> ', e);
  
          if (e.includes('A222')) {
            return;
          } else {
            // props.navigation.push('SignUp', {
            //  firstName:response?.fullName?.familyName,
            //  lastName:response?.fullName?.middleName,
            //  email:response?.email,
            //  username:response?.fullName?.givenName,
            //  mobile:'',
            //  userData: userInfo.user,
            //  loginType: 'Apple',
            //  token: userInfo.idToken,
            //  referCode: referalCode,
            //  dob:'',
            //  gender:'',
            // });

            console.log("All okay fir pus")
            props.navigation.push('SignUp', {

              userData: {
                id: appleId,
              },
              // userData: appleId,
              loginType: 'Apple',
              token: appleId,
              referCode: referalCode,
            });
        
          }
        });
  
      } else if (Platform.OS === 'android') {
        // Configure the request
        appleAuthAndroid.configure({
          // The Service ID you registered with Apple
          clientId: 'YOUR_SERVICE_IO',
          // Return URL added to your Apple dev console
          redirectUri: 'YOUR_SERVICE_URL',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
        });
        response = await appleAuthAndroid.signIn();
        // Decode user ID and email from token returned from Apple,
        // this is a common workaround for Apple sign-in via web API
        const decodedIdToken = jwtDecode(response.id_token);
        appleId = decodedIdToken.sub;
        appleToken = response.id_token;
        appleEmail = decodedIdToken.email;
      }
      // Format authData to provide correctly for Apple linkWith on Parse
      const authData = {
        id: appleId,
        token: appleToken,
      };
      // Log in or sign up on Parse using this Apple credentials
  
      console.log(appleId,appleEmail,appleToken)
     
    } catch (error) {
      // Error can be caused by wrong parameters or lack of Internet connection
      // Alert.alert('Error!', error);
      console.log('Error!', error);
      return false;
    }
  };
  
  
  
  const onSubmit = () => {
    const phoneWithPlus = refCallingCode.current + phone;
    const userNameReg = /\s/;
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const nameReg = /^[A-Za-z]$/;
    const noNumberReg = /^[^0-9]*$/;
    const passwordReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;

    const validateName = name =>
      name.length < 3 ||
      name.length > 20 ||
      nameReg.test(name) ||
      hasEmojis(name) ||
      !noNumberReg.test(name);

    const validateUsername = name =>
      name.length < 3 ||
      name.length > 20 ||
      nameReg.test(name) ||
      hasEmojis(name) ||
      userNameReg.test(name);
    // ||noNumberReg.test(name);

    const validateDOB = dob =>
      dob.split('-')[0] < 1900 ||
      dob.split('-')[0] > new Date().getFullYear() - 18;

    if (firstName === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_first_name'),
      );
    } else if (validateName(firstName)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_first_name'),
      );
    } else if (lastName === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_last_name'),
      );
    } else if (validateName(lastName)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_last_name'),
      );
    } else if (refDob?.current === '') {
      MessageShow.showToastAlert(getLanguageValueFromKey('please_enter_dob'));
    } else if (validateDOB(refDob?.current)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_dob'),
      );
    } else if (gender === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_select_gender'),
      );
    } else if (email === '') {
      MessageShow.showToastAlert(getLanguageValueFromKey('please_enter_email'));
    } else if (!emailReg.test(email)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_email'),
      );
    } else if (newuserName === '') {
      MessageShow.showToastAlert(getLanguageValueFromKey('enter_username'));
    } else if (validateUsername(newuserName)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('enter_valid_username'),
      );
    }
     else if (!isSocialLogin && newpassword === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_password'),
      );
    } else if (!isSocialLogin && !passwordReg.test(newpassword)) {
      Alert.alert(
        'Invalid Password',
        '- Password Length to be 8 minimum and 15 maximum\n' +
          '- At least one Special Char\n' +
          '- At least one Capital Letter\n' +
          '- At least one Number\n' +
          '- No more than two consecutive characters',
      );
    } 
    else if (!isSocialLogin && newconfirmpassword === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_confirm_password'),
      );
    } else if (!isSocialLogin && newconfirmpassword !== newpassword) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('passwords_do_not_match'),
      );
    } else if (!phoneValidator(phoneWithPlus).isValid) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_phone'),
      );
    } else if (!toggleCheckBox[2]) {
      MessageShow.showToastAlertWithCall(
        'Please accept Terms & Conditions!',
        clear,
      );
    } else {

      console.log('Please accept Term')
      let params = {
        email: email,
        dob: refDob?.current,
        gender: gender,
        referralCode: referalCode,
        lastName: lastName,
        firstName: firstName,
        password: newpassword,
        username: newuserName,
        mobile: phoneWithPlus,
      };

     // console.log("Check the avalibliography of social login", isSocialLogin );
      try {
        console.log("Check the avalibliography of social login in the body",isSocialLogin)
        const {loginType} = props?.route?.params;

        if (isSocialLogin) {
          const {userData, token} = props?.route?.params;
          console.log("mine");
          console.log(userData)
          console.log(token);
          params = {
            ...params,
            loginType: loginType,
            socialId: userData.id,
            token: token,
          };

          console.log('params for social register ===> ', params);

          socialRegister(params, props);
          return;
        }
      } catch (e) {
        console.log('loginType (error) => ', e.message);
      }
      console.log('params (Register API Mine) => ', JSON.stringify(params), isSocialLogin);
      register(params, props);
    }
  };

  const onSubmitExigo = () => {

    const existingNameReg = /\s/;
    const passwordReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
      const nameReg = /^[A-Za-z]$/;

    const validateUsername = name =>
      name.length < 3 ||
      name.length > 20 ||
      nameReg.test(name) ||
      hasEmojis(name) ||
      existingNameReg.test(name);
    // ||noNumberReg.test(name);

  
    if (userName === '') {
      MessageShow.showToastAlert(getLanguageValueFromKey('enter_username'));
    } else if (validateUsername(userName)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('enter_valid_username'),
      );
    } else if (password === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_password'),
      );
    } 
     else if (!toggleCheckBox[1]) {
      MessageShow.showToastAlertWithCall(
        'Please accept Terms & Conditions!',
        clear,
      );
    } else {

      console.log('Please accept Term')
      let params = {
        username: userName,
        password: password
      };
      registerExigo(params, props);
      // let params = {
      //   email: email,
      //   dob: refDob?.current,
      //   gender: gender,
      //   referralCode: referalCode,
      //   lastName: lastName,
      //   firstName: firstName,
      //   password: newpassword,
      //   username: newuserName,
      //   mobile: phoneWithPlus,
      // };

     // console.log("Check the avalibliography of social login", isSocialLogin );
      // try {
      //   console.log("Check the avalibliography of social login in the body",isSocialLogin)
      //   const {loginType} = props?.route?.params;

      //   if (isSocialLogin) {
      //     const {userData, token} = props?.route?.params;
      //     console.log("mine");
      //     console.log(userData)
      //     console.log(token);
      //     params = {
      //       ...params,
      //       loginType: loginType,
      //       socialId: userData.id,
      //       token: token,
      //     };

      //     console.log('params for social register ===> ', params);

      //     socialRegister(params, props);
      //     return;
      //   }
      // } catch (e) {
      //   console.log('loginType (error) => ', e.message);
      // }
      // console.log('params (Register API Mine) => ', JSON.stringify(params), isSocialLogin);
      // register(params, props);
    }
  };
  const handleFbLogin = async () => {
    // TODO: For testing only...
    // LoginManager.logOut();
    // return;
    const getFbProfile = async token => {
      const currentProfile = await Profile.getCurrentProfile();
      if (currentProfile) {
        socialLogin(currentProfile.userID, 'Facebook', props, e => {
          console.log('Facebook login (error) ===> ', e);

          if (e.includes('A222')) {
            console.log('in fb logi incud ==>', e);
            return;
          } else {
            props.navigation.push('SignUp', {
              userData: {
                ...currentProfile,
                givenName: currentProfile.firstName,
                familyName: currentProfile.lastName,
                id: currentProfile.userID,
              },
              loginType: 'Facebook',
              token: token?.accessToken,
              referCode: referalCode,
            });
          }
        });
      } else {
        MessageShow.showToastAlert('Facebook: Profile not available.');
      }
    };

    try {
      const token = await AccessToken.getCurrentAccessToken();

      if (token !== null) {
        getFbProfile(token).then();
        return;
      }

      LoginManager.logInWithPermissions([
        'public_profile',
        'email',
        'user_friends',
      ]).then(
        function (result) {
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            console.log('Login success with facebook');

            AccessToken.getCurrentAccessToken().then(_token =>
              getFbProfile(_token).then(),
            );
          }
        },
        function (error) {
          console.log('Login fail with error: ' + error);
        },
      );
    } catch (e) {
      console.log('error (Google) => ', e.message);
    }
  };

  const googleSignIn = async () => {
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo (Google) => ', JSON.stringify(userInfo.idToken));
      // setEmail(() => userInfo.user.email);

      socialLogin(userInfo.user.id, 'Google', props, e => {
        console.log('Google login (error) ===> ', e);

        if (e.includes('A222')) {
          return;
        } else {
          props.navigation.push('SignUp', {
            userData: userInfo.user,
            loginType: 'Google',
            token: userInfo.idToken,
            referCode: referalCode,
          });
        }
      });
    } catch (error) {
      console.log('error (Google) => ', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  return (
    <GlobalFlex>
      <BackHeader onBackPress={() => props.navigation.goBack()} />
      <SubContainer>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <Spacer space={hp(2.5)} />
          <MainTitle style={[{fontSize: wp(6), fontFamily: fonts.MEDIUM}]}>
            {Strings.SA_STR_REGISTRTION_EXIGO_HEADING}
          </MainTitle>
          <Spacer space={hp(0.5)} />
          <Input
            value={userName}
            onChange={text => {
              setUserName(text);
            }}
            placeholder={Strings.SA_STR_REGISTRTION_EXIGO_USERNAME}
            style={{paddingBottom: wp(2)}}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />
          <Input
            is_password={true}
            value={password}
            onChange={text => {
              setPassword(text);
            }}
            placeholder={Strings.SA_STR_REGISTRTION_EXIGO_PASSWORD}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
            secureTextEntry={show}
            style={{flex: 1, paddingBottom: wp(2)}}
            mainstyle={{flexDirection: 'row'}}
            onTouchPress={() => {
              setShow(!show);
            }}
          />
          <Spacer space={hp(2)} />
          <View style={styles.check_wrapper}>
            <CheckBox
              boxType={'square'}
              disabled={false}
              value={toggleCheckBox[1]}
              onFillColor={colors.PRIMARY_COLOR}
              onTintColor={colors.PRIMARY_COLOR}
              onCheckColor={colors.WHITE}
              tintColor={colors.BLACK}
              animationDuration={0.2}
              lineWidth={1}
              tintColors={{true: colors.PRIMARY_COLOR, false: colors.BLACK}}
              onValueChange={() => setToggleCheckBox(prev => ({...prev,1:!prev[1]}))}
              style={styles.checkbox}
            />
            <SubTitle style={[{fontSize: wp(4)}]}>
              {Strings.SA_STR_REGISTRTION_EXIGO_ACCEPT}{' '}
              <Text
                onPress={() => handleLink()}
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.BOLD,
                }}>
                {Strings.SA_STR_REGISTRTION_EXIGO_TERMS}
              </Text>
              ,{' '}
              <Text
                onPress={() => handleLink()}
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.BOLD,
                }}>
                   {Strings.SA_STR_REGISTRTION_EXIGO_PRIVACY}
              </Text>{' '}
              {Strings.SA_STR_REGISTRTION_EXIGO_AND}{' '}
              <Text
                onPress={() => handleLink()}
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.BOLD,
                }}>
                   {Strings.SA_STR_REGISTRTION_EXIGO_EULA}
              </Text>
            </SubTitle>
          </View>
          <Spacer space={hp(2)} />
          <Button
            isLoading={isRegistrationPending}
            buttonText={Strings.SA_STR_REGISTRTION_EXIGO_REGISTER}
            buttonPress={() => onSubmitExigo()}
          />
          <Spacer space={hp(2)} />
          <MainTitle style={[{fontSize: wp(6), fontFamily: fonts.REGULAR}]}>
            {Strings.SA_STR_REGISTRTION_EXIGO_OR}
          </MainTitle>

          <Spacer space={hp(1)} />
          <MainTitle>{Strings.SA_STR_REGISTRTION_NEW_ACCOUNT}</MainTitle>
          {/*<Spacer space={hp(1.5)} />*/}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Input
              value={firstName}
              onChange={setFirstName}
              placeholder={Strings.SA_STR_REGISTRTION_FIRST_NAME}
              mainstyle={{width: wp(42)}}
              style={{paddingBottom: wp(2)}}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
            />
            <Input
              value={lastName}
              onChange={setLastName}
              placeholder={Strings.SA_STR_REGISTRTION_LAST_NAME}
              mainstyle={{width: wp(42)}}
              style={{paddingBottom: wp(2)}}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable onPress={() => setOpenBirthPicker(true)}>
              <Input
                value={birthDate}
                is_clickable={true}
                placeholder={Strings.SA_STR_REGISTRTION_DOB}
                style={{flex: 1, paddingBottom: wp(2)}}
                mainstyle={{flexDirection: 'row', width: wp(42)}}
                placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
              />
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  backgroundColor: 'rgba(255,255,255,0)',
                }}
              />
            </Pressable>
            <View style={styles.pickerWrapper}>
              <View>
                <Text
                  style={{
                    top: -3,
                    position: 'absolute',
                    fontFamily: fonts.REGULAR,
                    fontSize: wp(3),
                    color: colors.TRIPLET_PLACEHOLDER,
                  }}>
                  {Strings.SA_STR_REGISTRTION_GENDER}
                </Text>
                <RNPickerSelect
                  value={gender}
                  onValueChange={value => setGender(value)}
                  items={[
                    {label: 'Male', value: 'M'},
                    {label: 'Female', value: 'F'},
                    {label: 'Other', value: 'O'},
                  ]}
                  placeholder={
                    {
                      // label: 'Gender',
                      // value: 'Gender',
                      // color: colors.TRIPLET_PLACEHOLDER,
                    }
                  }
                  style={{
                    inputAndroid: {
                      fontSize: wp(4.5),
                      fontFamily: fonts.REGULAR,
                      // padding: wp(5),
                      paddingLeft: 0,
                      width: wp(36),
                      color: colors.BLACK,
                    },
                    placeholder: {
                      color: colors.TRIPLET_PLACEHOLDER,
                    },
                    ...globalStyles.hideIconsRNPicker,
                  }}
                  textInputProps={{
                    placeholderTextColor: colors.TRIPLET_PLACEHOLDER,
                    style: styles.pickerInput,
                  }}
                  Icon={() => null}
                />
              </View>
              <ChevronWrapper>
                <Icons.ChevronDownIcon
                  color={colors.HAWKES_BLUE}
                  size={wp(4)}
                />
              </ChevronWrapper>
            </View>
          </View>
          <Input
            value={email}
            // editable={typeof props?.route?.params?.loginType !== 'string'}
            onChange={setEmail}
            placeholder={Strings.SA_STR_REGISTRTION_EMAIL}
            style={{
              paddingBottom: wp(2),
              // backgroundColor:
              //   props?.route?.params?.loginType?.length > 0
              //     ? '#ece9e9'
              //     : undefined,
            }}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />

          <Input
            value={newuserName}
            onChange={setNewUserName}
            placeholder={Strings.SA_STR_REGISTRTION_USERNAME}
            style={{paddingBottom: wp(2)}}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />
          {!isSocialLogin && (
            <>
              <Input
                is_password={true}
                value={newpassword}
                onChange={setNewPassword}
                placeholder={Strings.SA_STR_PASSWORD}
                placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                secureTextEntry={show_1}
                style={{flex: 1, paddingBottom: wp(2)}}
                mainstyle={{flexDirection: 'row'}}
                onTouchPress={() => {
                  setShow1(!show_1);
                }}
              />
              <Input
                is_password={true}
                value={newconfirmpassword}
                onChange={setNewConfirmPassword}
                placeholder={Strings.SA_STR_REGISTRTION_CONFIRM_PASSWORD}
                placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                secureTextEntry={show_2}
                style={{flex: 1, paddingBottom: wp(2)}}
                mainstyle={{flexDirection: 'row'}}
                onTouchPress={() => {
                  setShow2(!show_2);
                }}
              />
            </>
          )}

          <Spacer space={hp(0.5)} />
          <PhoneTextInput
            cca2={cca2}
            value={phone}
            withFlag={false}
            onRef={ref => {
              inputRef = ref;
            }}
            returnKeyType={'done'}
            keyboardType={'phone-pad'}
            placeholder={Strings.SA_STR_REGISTRTION_PHONENUMBER}
            onChange={value => setPhone(value)}
            selectCountry={async value => {
              console.log('country => ', value);
              refCallingCode.current = '+' + value.callingCode[0];
              setcca2(value.cca2);
              setCountryName(value.name);
            }}
          />

          <Input
            value={referalCode}
            onChange={setReferalCode}
            placeholder={Strings.SA_STR_REGISTRTION_REFERRAL}
            style={{paddingBottom: wp(2)}}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />

          <Spacer space={hp(1.5)} />
          <View style={styles.check_wrapper}>
            <CheckBox
              boxType={'square'}
              disabled={false}
              value={toggleCheckBox[2]}
              onFillColor={colors.PRIMARY_COLOR}
              onTintColor={colors.PRIMARY_COLOR}
              onCheckColor={colors.WHITE}
              tintColor={colors.BLACK}
              animationDuration={0.2}
              lineWidth={1}
              tintColors={{true: colors.PRIMARY_COLOR, false: colors.BLACK}}
              onValueChange={() => setToggleCheckBox(prev => ({...prev,2:!prev[2]}))}
              style={styles.checkbox}
            />
            <SubTitle style={[{fontSize: wp(4)}]}>
            {Strings.SA_STR_REGISTRTION_EXIGO_ACCEPT}{' '}
              <Text
                onPress={() => handleLink()}
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.BOLD,
                }}>
               {Strings.SA_STR_REGISTRTION_EXIGO_TERMS}{' '}
              </Text>
              ,{' '}
              <Text
                onPress={() => handleLink()}
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.BOLD,
                }}>
                 {Strings.SA_STR_REGISTRTION_EXIGO_PRIVACY}{' '}
              </Text>{' '}
            {Strings.SA_STR_REGISTRTION_EXIGO_AND}{' '}
              <Text
                onPress={() => handleLink()}
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.BOLD,
                }}>
                {Strings.SA_STR_REGISTRTION_EXIGO_EULA}{' '}
              </Text>
            </SubTitle>
          </View>
          <Spacer space={hp(1.5)} />
          <Button
            isLoading={isRegistrationPending}
            buttonText= {Strings.SA_STR_REGISTRTION_EXIGO_REGISTER}
            buttonPress={() => onSubmit()}
          />

          <Spacer space={hp(1)} />
          {!isSocialLogin ? (
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <SocialButton
                source={IconAssets.fbLogin}
                onPress={() => handleFbLogin()}
              />
              <Spacer row={wp(4)} />
              <SocialButton
                source={IconAssets.googleLogin}
                onPress={() => {
                  googleSignIn();
                }}
              />
              <Spacer row={wp(4)} />
              <SocialButton
                source={IconAssets.appleLogin}
                onPress={() => {
                  doUserLogInApple()
                }}
              />
            </View>
          ) : null}
          <Spacer space={hp(1.5)} />
        </ScrollView>
        {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
      </SubContainer>
      <DatePicker
        modal
        open={openBirthPicker}
        date={refLastDob.current}
        mode={'date'}
        onConfirm={date => {
          setOpenBirthPicker(false);
          setBirthDate(moment(date).format('MM/DD/YYYY'));
          refDob.current = moment(date).toISOString();
          refLastDob.current = date;
        }}
        onCancel={() => {
          setOpenBirthPicker(false);
        }}
      />
    </GlobalFlex>
  );
};
