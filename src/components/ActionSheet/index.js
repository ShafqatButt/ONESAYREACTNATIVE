// noinspection ES6CheckImport

import React, { useContext , useRef,useState} from 'react';
import { Image,View, SafeAreaView } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {styles, BorderContainer, ActionWrapper, Text} from './style';
import {useConnection} from '@sendbird/uikit-react-native/src';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import {useAuthContext} from '../../context/AuthContext';
import {AuthContext} from '../../context/Auth.context';
import * as Animatable from 'react-native-animatable';
import RBSheet from 'react-native-raw-bottom-sheet';
import TokenManager from '../../libs/TokenManager';
import AuthManager from '../../libs/AuthManager';

import { Logout } from '../../commonAction';
import { colors } from '../../res/colors';
import { images } from '../../res/images';
import { fonts } from '../../res/fonts';
import { ReelContext } from '../../context/ReelContext';
import { useCallback } from 'react';
import { Modalize } from 'react-native-modalize';
import WebViewModalProvider, { WebViewModal } from
'react-native-webview-modal';
import { useAppNavigation } from '../../hooks/useAppNavigation';

import Strings from '../../string_key/Strings';


const ActionSheet = props => {
  const {showAccount = true} = props;
  //#region ref
  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;
  const {disconnect} = useConnection();
  const {currentUser, setCurrentUser} = useAuthContext();
  const {actionClearData} = useContext(ReelContext);

  const {navigation} = useAppNavigation();
  const [pageLink, setpageLink] = useState('');
  const modalizeRef = useRef(null)
  const handleOpen = useCallback(() => {
    if (modalizeRef.current) {
      modalizeRef.current.open()
    }
  }, [])



  //#endregion

  const unregisterToken = async () => {
    const token = await TokenManager.get();
    if (token) {
      switch (token.type) {
        case 'apns':
        case 'fcm': {
          await SendbirdCalls.unregisterPushToken(token.value);
          break;
        }
        case 'voip': {
          await SendbirdCalls.ios_unregisterVoIPPushToken(token.value);
          break;
        }
      }
      await TokenManager.set(null);
    }
  };

  const deauthenticate = async () => {
    await Promise.all([
      AuthManager.deAuthenticate(),
      SendbirdCalls.deauthenticate(),
    ]);
    setCurrentUser(undefined);
  };

  //#region Sheet content
  const renderContent = () => (
    <>

<Modalize
                        ref={modalizeRef}
                        snapPoint={wp(175)}
                    handlePosition="inside"
                    >
                        <View style={{
                            flex: 1, height: 500,
                            flexDirection: 'row', justifyContent: 'center'
                        }}>
                            <WebViewModalProvider>
                                <View style={{ margin: 30, height: 500 }}>
                                    <SafeAreaView />
                                    <WebViewModal
                                        visible={true}
                                        source={{ uri: pageLink}}
                                        style={{ margin: 10 }}
                                    />
                                </View>
                            </WebViewModalProvider>
                        </View>
                    </Modalize>

      <Animatable.View delay={150} animation={'fadeInUp'}>
        {showAccount && (
          <>
            <ActionWrapper
              onPress={() => {
                props.onClose();
                setTimeout(() => {

                  navigation.navigate('ProfileNav', { screen: 'Account' });


                }, 500);
              }}>
              <Image style={styles.icon_ic} source={images.account_ic} />
              <Text
                style={[
                  {
                    alignSelf: 'center',
                    marginLeft: wp(5),
                    fontFamily: fonts.REGULAR,
                  },
                ]}>
                {Strings.account}
              </Text>
            </ActionWrapper>
            <BorderContainer />
          </>
        )}
        <ActionWrapper
          onPress={() => {
            props.onClose();
            setTimeout(() => {
              props.navigation.navigate('ProfileNav', {screen: 'Language'});
            }, 500);
          }}>
          <Image style={styles.icon_ic} source={images.language_ic} />
          <Text
            style={[
              {
                alignSelf: 'center',
                marginLeft: wp(5),
                fontFamily: fonts.REGULAR,
              },
            ]}>
            {Strings.Language}
          </Text>
        </ActionWrapper>
        <BorderContainer />

        <ActionWrapper    onPress={() => {
                setpageLink("https://social.onesay.app/terms-of-use/");
                // handleOpen();
                props.onClose();
              //  props.onRefresh(true);

              }
              }>

          <Image style={styles.icon_ic} source={images.terms_ic} />
          <Text
            style={[
              {
                alignSelf: 'center',
                marginLeft: wp(5),
                fontFamily: fonts.REGULAR,
              },
            ]}>
            {Strings.Terms_Of_Use}
          </Text>
        </ActionWrapper>
        <BorderContainer />
        <ActionWrapper
          onPress={async () => {
            props.onClose();
            setTimeout(() => {
              Logout(props, logout, actionClearData);
            }, 500);
            await disconnect();
            await unregisterToken();
            await deauthenticate();
          }}>
          <Image style={styles.icon_ic} source={images.logout_ic} />
          <Text
            style={[
              {
                alignSelf: 'center',
                marginLeft: wp(5),
                fontFamily: fonts.REGULAR,
              },
            ]}>
            {Strings.Logout}
          </Text>
        </ActionWrapper>
        <BorderContainer />
      </Animatable.View>
    </>
  );
  //#endregion
  return (
    <RBSheet
      animationType="none"
      ref={props.refRBSheet}
      openDuration={250}
      height={showAccount ? wp('75%') : wp('60%')}
      closeOnDragDown={false}
      closeOnPressMask={true}
      customStyles={{
        draggableIcon: {backgroundColor: colors.WHITE},
        container: {
          borderTopLeftRadius: wp(5),
          borderTopRightRadius: wp(5),
        },
      }}>
      {renderContent()}
    </RBSheet>
  );
};
export default ActionSheet;
