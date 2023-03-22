// noinspection ES6CheckImport

import React, {useState, useContext} from 'react';
import {View, Platform, Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import {BackHeader} from '../../../components/BackHeader';
import {AuthContext} from '../../../context/Auth.context';
import {
  GET_MEMBERSHIPS,
  handleLink,
  PATCH_UPDATE_PROFILE,
} from '../../../api_helper/Api';
import {GlobalFlex} from '../../../res/globalStyles';
import {GET, PATCH} from '../../../api_helper/ApiServices';
import styles, {SkipButton, SkipText, TitleText} from './style';
import {saveData} from '../../../res/asyncStorageHelper';
import Loading from '../../../components/Loading';
import DeviceInfo from 'react-native-device-info';
import {Spacer} from '../../../res/spacer';
import {colors} from '../../../res/colors';
import DeepLinking from 'react-native-deep-linking';
import {underDevelopment} from '../../../uikit-app';

// Send the cookie information back to the mobile app
const CHECK_COOKIE: string = `
  ReactNativeWebView.postMessage("Cookie: " + document.cookie);
  true;
`;

const CONST_PAYMENT_FAIL = 0;
const CONST_PAYMENT_SUCCESS = 1;

export default StripePaymentScreen = props => {
  const {state: ContextState, updateUserData} = useContext(AuthContext);
  const webViewRef = React.useRef(null);
  const {siteLink} = props.route.params;
  const [paymentSuccess, setPaymentSuccess] = useState(-1);

  const handleSuccessResponse = async () => {
    const isMembershipFlow = props?.route?.params?.isMembershipFlow;
    if (typeof isMembershipFlow === 'boolean' && !isMembershipFlow) {
      underDevelopment('Payment Success!');
      const onPaymentSuccess = props?.route?.params?.onPaymentSuccess;
      props.navigation.goBack();
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      return;
    }

    setPaymentSuccess(() => CONST_PAYMENT_SUCCESS);

    const url = PATCH_UPDATE_PROFILE(ContextState?.userData?.userId);

    if (isMembershipFlow) {
      const {membership} = props?.route?.params;
      const user = {
        ...ContextState?.userData,
        membership: membership,
      };

      updateUserData(user);
    }
    setTimeout(() => {
      props.navigation.goBack();
      props.navigation.goBack();
    }, 1000);
    return;

    // setLoading(() => true);
    //
    // PATCH(
    //   url,
    //   userData.token,
    //   uniqueID,
    //   {
    //     membershipId: productId,
    //   },
    //   (res, e) => {
    //     setLoading(() => false);
    //     if (!e) {
    //       console.log('res ===> ', res);
    //       updateUserData(res);
    //       props.navigation.goBack();
    //       props.navigation.goBack();
    //     } else {
    //       console.log('PATCH_UPDATE_PROFILE (error) => ', res);
    //     }
    //   },
    // );
  };

  const handleNavigationStateChange = event => {
    console.log('handleNavigationStateChange : ', event.nativeEvent);

    if (event?.nativeEvent?.url?.includes('paymentSuccess=true')) {
      handleSuccessResponse();
    } else if (event?.nativeEvent?.url?.includes('paymentSuccess=false')) {
      setPaymentSuccess(() => CONST_PAYMENT_FAIL);
      props.navigation.goBack();
    }

    // Check cookies every time URL changes
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(CHECK_COOKIE);
    }
  };

  const onMessage = async event => {
    const {data} = event.nativeEvent;

    if (data.includes('Cookie:')) {
      // process the cookies
      const storedCookies = await CookieManager.get(siteLink, true);
      console.log('storedCookies ===> ', storedCookies);
    }
  };

  return (
    <GlobalFlex>
      <BackHeader
        is_center_text
        isLeftText={true}
        backTitle={'Cancel'}
        title={'Payment'}
        textColor={{color: colors.WHITE}}
        onBackPress={() => props.navigation.goBack()}
        background={{
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
          backgroundColor: colors.PRIMARY_COLOR,
        }}
      />
      <View style={{flex: 1, justifyContent: 'center'}}>
        {paymentSuccess === CONST_PAYMENT_SUCCESS ? (
          <TitleText style={{color: 'green'}}>Payment success</TitleText>
        ) : paymentSuccess === CONST_PAYMENT_FAIL ? (
          <TitleText style={{color: 'red'}}>Payment failed</TitleText>
        ) : (
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
            style={{height: hp('70%'), width: wp('100%')}}
            source={{uri: siteLink}}
            onLoadStart={handleNavigationStateChange}
          />
        )}
      </View>
    </GlobalFlex>
  );
};
