import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Linking,
} from 'react-native';
import Config from 'react-native-config';
// Styles and themes
import {Button} from '../../../components/Button';
import {Spacer} from '../../../res/spacer';
import {
  MainContainer,
  styles,
  ImgBackGroundgContainer,
  LogoWrapper,
  ForgotWrapper,
  BackWrapper,
} from './style';
import {colors} from '../../../res/colors';
import {AuthContext} from '../../../context/Auth.context';
import {images} from '../../../res/images';
import {Input} from '../../../components/Input';
import * as HOC from '../../HOC';
// Third party library
import AutoHeightImage from 'react-native-auto-height-image';
import {getLanguageValueFromKey} from '../../../commonAction';
import {SocialButton} from '../../../components/SocialButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CookieManager from '@react-native-cookies/cookies';
import {
  LoginManager,
  Profile,
  AccessToken,
  LoginButton,
} from 'react-native-fbsdk-next';
import {WebView} from 'react-native-webview';
import IconAssets from '../../../assets';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import jwtDecode from 'jwt-decode';
import SegmentedControlTab from "react-native-segmented-control-tab";
import Strings from '../../../string_key/Strings';


// Send the cookie information back to the mobile app
const CHECK_COOKIE: string = `
  ReactNativeWebView.postMessage("Cookie: " + document.cookie);
  true;
`;
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default Login = props => {
  const webViewRef = React.useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(true);

  const [showWebView, setShowWebView] = useState(false);
  const refWebUrl = React.useRef(null);
  const [selectedIndex,setSelectedIndex] = useState(0);

  const {
    state: ContextState,
    login,
    socialLogin,
    googleLogin,
    clear,
    loginExigo
  } = useContext(AuthContext);
  const {isLoginPending, loginError} = ContextState;
  const MessageShow = new HOC.MessageShow();
  
  const onLogin = () => {
    console.log('MessageShow', MessageShow);
    if(selectedIndex === 0){
      let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_email_or_user'),
      );
    } else if (email.includes('@') && !re.test(email)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_email'),
      );
    } 
    else if (password === '') {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_password'),
      );
    } 
    else {
      // MessageShow.dismissSnackBar();
      login(email, password, props);
      
    }

    }else if(selectedIndex === 1){
      loginExigo(email, password, props);

    }
    
    
  };

  const onClearRedirect = () => {
    clear();
    setTimeout(() => {
      props.navigation.navigate('ForgetPassword');
    }, 100);
  };

  useEffect(() => {
    if (loginError != null) {
      Keyboard.dismiss();
      console.log(loginError.includes('Inactive user'));
      if (loginError.includes('Inactive user')) {
        MessageShow.showToastAlertWithCall(loginError, onClearRedirect);
      } else {
        MessageShow.showToastAlertWithCall(loginError, clear);
      }
    }

    
  }, [loginError]);

  const signIn = async () => {
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
          props.navigation.navigate('SignUp', {
            userData: userInfo.user,
            loginType: 'Google',
            token: userInfo.idToken,
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

  const handleFbLogin = async () => {
    // TODO: For testing only...
    // LoginManager.logOut();
    // return;
    const getFbProfile = async token => {
      const currentProfile = await Profile.getCurrentProfile();
      if (currentProfile) {
        socialLogin(currentProfile.userID, 'Facebook', props, e => {
          console.log('Google login (error) ===> ', e);

          if (e.includes('A222')) {
            return;
          } else {
            props.navigation.navigate('SignUp', {
              userData: {
                ...currentProfile,
                givenName: currentProfile.firstName,
                familyName: currentProfile.lastName,
                id: currentProfile.userID,
              },
              loginType: 'Facebook',
              token: token?.accessToken,
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

  const handleNavigationStateChange = event => {
    console.log('handleNavigationStateChange : ', event.nativeEvent);

    // Check cookies every time URL changes
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(CHECK_COOKIE);
    }
  };
//MARK: Apple Login For IOS

const handleSignIn = async (data) => {
  /* Redux actions, persisting data with AsyncStorage, redirection...*/
}

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
      // On iOS, user ID and email are easily retrieved from request
      console.log('response==>>',response);
   
      appleId = response.user;
      appleToken = response.identityToken;
      appleEmail = response.email;

      console.log("Apple ID" ,appleId);
      console.log("\nApple Token",appleToken);
      console.log("\nApple Email ",appleEmail);

      socialLogin(response?.user, 'Apple', props, e => {
        console.log('Apple login (error) ===> ', e);

        if (e.includes('A222')) {
          return;
        } else {
          props.navigation.navigate('SignUp', {
            // firstName:response?.fullName?.familyName,
            // lastName:response?.fullName?.middleName,
            // email:response?.email,
            // username:response?.fullName?.givenName,
            // mobile:'',
            socialId:appleId,
            loginType: 'Apple',
            
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




const handleIndexChange = index => {
  setSelectedIndex(index);
};
  const onMessage = async event => {
    const {data} = event.nativeEvent;

    if (data.includes('Cookie:')) {
      // process the cookies
      const storedCookies = await CookieManager.get(refWebUrl.current, true);
      console.log('storedCookies ===> ', storedCookies);
    }
  };

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <MainContainer>
        {/* Header */}
        <>
          <ImgBackGroundgContainer
            source={images.menu_line}
            resizeMode={'stretch'}>
            <BackWrapper
              onPress={() => {
                props.navigation.goBack();
              }}>
              <Image
                source={images.back_white}
                style={styles.back_ic}
                resizeMode={'contain'}
              />
            </BackWrapper>
          </ImgBackGroundgContainer>
          <LogoWrapper style={styles.shadowStyle}>
            <AutoHeightImage
              source={images.app_logo}
              width={wp(10)}
              style={styles.logo_ic}
              resizeMode={'contain'}
            />
          </LogoWrapper>
        </>
        {/* Body */}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={'handled'}>
          <View style={{width: wp(95), alignSelf: 'center'}}>
            <Text style={styles.bold_font}>{Strings.login}</Text>
            <Spacer space={wp(4)} />
          <View>
          <SegmentedControlTab
          values={[Strings.login, "Exigo"]}
          selectedIndex={selectedIndex}
          onTabPress={handleIndexChange}
          tabStyle={{borderColor:colors.PRIMARY_COLOR,borderEndColor:colors.PRIMARY_COLOR}}
          tabTextStyle={{color:colors.PRIMARY_COLOR}}
          activeTabStyle={{backgroundColor:colors.PRIMARY_COLOR}}
          
          />
          </View>
            <Spacer space={wp(3)} />
            <Input
              value={email}
              onChange={value => {
                setEmail(value);
              }}
              placeholder={Strings.SA_STR_EMAIL_USERNAME}
              keyboardType={'email-address'}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
            />
            <Input
              is_password={true}
              value={password}
              onChange={value => setPassword(value)}
              placeholder={Strings.SA_STR_PASSWORD}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
              secureTextEntry={show}
              style={{flex: 1}}
              mainstyle={{flexDirection: 'row'}}
              onTouchPress={() => {
                setShow(!show);
              }}
            />
            <Spacer space={hp(0.5)} />
            <ForgotWrapper
              onPress={() => {
                props.navigation.navigate('ForgetPassword');
              }}>
              <Text style={styles.txtNormalStyle}>
                {Strings.SA_STR_Forgot_PASSWORD}
              </Text>
            </ForgotWrapper>
            <Spacer space={hp(2.5)} />
            <Button
              isLoading={isLoginPending}
              buttonText={Strings.login}
              buttonPress={() => onLogin()}
            />
            <Spacer space={hp(2)} />
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <SocialButton
                source={IconAssets.fbLogin}
                onPress={() => handleFbLogin()}
              />
              <Spacer row={wp(4)} />
              <SocialButton
                source={IconAssets.googleLogin}
                onPress={() => {
                  signIn();
                  // googleLogin(redirectUrl => {
                  //   console.log('redirectUrl ===> ', redirectUrl);
                  //   refWebUrl.current = redirectUrl;
                  //   setShowWebView(() => true);
                  // });

                  //_GoolgeSignin();
                }}
              />
              {Platform.OS === 'ios' &&   <Spacer row={wp(4)} />}
              {Platform.OS === 'ios' &&    
               
              <SocialButton
                source={IconAssets.appleLogin}
                onPress={() => {
                  doUserLogInApple()
                }}
              />}

            </View>
            <Spacer space={hp(2.5)} />
            {/* <TouchableOpacity style={{alignSelf: 'center'}}> */}

            <TouchableOpacity style={{alignSelf: 'center'}}
          onPress = {() => props.navigation.navigate('ContactUs')}
          >
              <Text
                style={{
                  ...styles.txtNormalStyle,
                  color: colors.DARK_GRAY,
                  fontSize: wp(4),
                }}>
                {Strings.ContactUs}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
        <Modal visible={showWebView} transparent={true} animationType={'fade'}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('100%'),
              height: hp('100%'),
            }}>
            <View style={{height: hp('80%'), width: wp('90%')}}>
              <TouchableOpacity
                style={{
                  padding: 12,
                  backgroundColor: 'red',
                  position: 'absolute',
                  top: 40,
                  right: 0,
                  zIndex: 99,
                }}
                onPress={() => setShowWebView(() => false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <WebView
                ref={webViewRef}
                useWebKit={true}
                javaScriptEnabled={true}
                userAgent={
                  Platform.OS === 'android'
                    ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
                    : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'
                }
                onMessage={onMessage}
                sharedCookiesEnabled={true}
                style={{height: hp('70%'), width: wp('70%')}}
                source={{uri: refWebUrl.current}}
                onLoadEnd={handleNavigationStateChange}
              />
            </View>
          </View>
        </Modal>
      </MainContainer>
    </>
  );
};
const INJECTEDJAVASCRIPT =
  "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";
