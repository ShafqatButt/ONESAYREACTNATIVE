import React, {useEffect, useState} from 'react';
// noinspection ES6CheckImport
import {
  Text,
  StatusBar,
  TouchableOpacity,
  View,
  Platform,
  NativeEventEmitter,
  Linking,
  AppState,
} from 'react-native';
// Styles and themes
import {Button} from '../../../components/Button';
import {Spacer} from '../../../res/spacer';
import {
  MainContainer,
  styles,
  ImgBackGroundgContainer,
  LogoWrapper,
} from './style';
import {colors} from '../../../res/colors';
import {images} from '../../../res/images';
import {MainTitle} from '../../../res/globalStyles';
// Third party library
import AutoHeightImage from 'react-native-auto-height-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../res/fonts';
import {getLanguageValueFromKey} from '../../../commonAction';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {getSearchParamsFromURL} from '../../../uikit-app';
import {useRef} from 'react';
import {useNavigation} from '@react-navigation/core';
import {useEventEmitter} from '../../../hooks/useEventEmitter';
import Strings from '../../../string_key/Strings';


export default Welcome = props => {
  console.log('props.route.params=welcome=?>', props.route.params);
  const [wasLoggedIN, setWasLoggedIN] = useState(
    props.route.params?.wasLoggedIN ? props.route.params.wasLoggedIN : false,
  );
  const appState = useRef(AppState.currentState);
  const refEventListener = React.useRef(null);
  const {navigate} = useNavigation();

  const handleUrl = ({url}) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        handleChannelInvite(url).then();
      }
    });
  };

  useEventEmitter('register-success', () => {
    navigate('alert_modal', {
      message:
        'Congratulations Your Buzzmi\naccount is successfully created. Click \nhere to login.',
      tickIcon: true,
      btnText: 'Login',
      onBtnPress: () => {
        navigate('Login');
      },
    });
  });

  const handleChannelInvite = async url => {
    if (typeof url !== 'string') {
      return;
    }

    const resolvedLink = await dynamicLinks()
      .resolveLink(url)
      .then(resolved => resolved);

    if (
      typeof resolvedLink?.url !== 'string' &&
      !resolvedLink?.url.includes('http')
    ) {
      return;
    }

    let _params = getSearchParamsFromURL(resolvedLink?.url);

    props.navigation.navigate('SignUp', {
      referCode: _params?.code || '',
    });
  };
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        Linking.addEventListener('url', handleUrl);
      }

      appState.current = nextAppState;
      setWasLoggedIN(false);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    console.log('wasLoggedIN in useeff', wasLoggedIN);

    if (!wasLoggedIN) {
      console.log('wasLoggedIN in useeff', wasLoggedIN);
      Linking.addEventListener('url', handleUrl);
      Linking.getInitialURL().then(
        url => {
          console.log('Hello deep link in welcome  (getInitialURL) => ', url);
          if (url) {
            handleChannelInvite(url).then();
          }
        },
        error => {
          console.log('eze', error);
        },
      );
      if (Platform.OS === 'android') {
        const eventEmitter = new NativeEventEmitter(null);
        refEventListener.current = eventEmitter.addListener(
          'onDeeplinkClicked',
          event => {
            console.log('🚀 Event ===> ', event);
            if (event?.code !== null) {
              console.log('refer code ===> ', event?.code);
              props.navigation.navigate('SignUp', {
                referCode: event?.code,
              });
            } else {
              dynamicLinks()
                .resolveLink(event?.link)
                .then(resolvedLink => {
                  let _params = getSearchParamsFromURL(resolvedLink?.url);

                  props.navigation.navigate('SignUp', {
                    referCode: _params?.code || '',
                  });
                });
            }
          },
        );
      }

      return () => {
        if (Platform.OS === 'android') {
          if (refEventListener?.current !== null) {
            refEventListener?.current?.remove();
            refEventListener.current = null;
          }
        }
      };
    }
  }, []);

  const onLogin = () => {
    props.navigation.navigate('Login');
  };

  const onSignup = () => {
    props.navigation.navigate('SignUp');
  };

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <MainContainer>
        {/* Header */}
        <ImgBackGroundgContainer
          source={images.welcome_menu}
          resizeMode={'stretch'}>
          <MainTitle style={[{color: colors.WHITE, fontSize: wp(7)}]}>
            {getLanguageValueFromKey('welcome_chat_connect')}
          </MainTitle>
        </ImgBackGroundgContainer>
        <LogoWrapper style={styles.shadowStyle}>
          <AutoHeightImage
            source={images.app_logo}
            width={wp(10)}
            style={styles.logo_ic}
            resizeMode={'contain'}
          />
        </LogoWrapper>
        {/* Body */}
        <>
          <Button
            buttonText={Strings.login}
            buttonPress={() => {
              onLogin();
            }}
          />
          <Spacer space={hp(0.6)} />
          <Button
            buttonText={Strings.SA_STR_WELCOME_SIGN_UP}
            buttonPress={() => {
              onSignup();
            }}
          />
          <Spacer space={hp(3)} />
         
          <TouchableOpacity style={{alignSelf: 'center'}}
          onPress = {() => navigate('ContactUs')}
          >
            <Text style={{...styles.txtNormalStyle}}>
              {Strings.ContactUs}
            </Text>
          </TouchableOpacity>
        </>
      </MainContainer>
      <View style={styles.BottomWrapper}>
        <Text style={{...styles.txtNormalStyle, fontFamily: fonts.REGULAR}}>
          {/* {Strings.SA_STR_WELCOME_VERSION} */}
        </Text>
      </View>
    </>
  );
};
