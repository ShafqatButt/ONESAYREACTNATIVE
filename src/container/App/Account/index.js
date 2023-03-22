// noinspection ES6CheckImport

import React, {useContext, useRef, useState, useEffect} from 'react';
import {
  ScrollView,
  Pressable,
  View,
  Image,
  Switch,
  Alert,
  StyleSheet,
  Button,
  SafeAreaView,
} from 'react-native';
import {Spacer} from '../../../res/spacer';
import {AuthContext} from '../../../context/Auth.context';
import {
  Text,
  styles,
  RegularText,
  ItemDivider,
  SubtitleText,
  ActionWrapper,
  MainContainer,
  BorderContainer,
} from './style';
import ActionSheet from '../../../components/ActionSheet';
import {AppHeader} from '../../../components/AppHeader';
import {images} from '../../../res/images';
import {fonts} from '../../../res/fonts';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';
import moment from 'moment';
import {colors} from '../../../res/colors';
import {Logout, unregisterToken} from '../../../commonAction';
import RNLocalize from 'react-native-localize';
import TokenManager from '../../../libs/TokenManager';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import AuthManager from '../../../libs/AuthManager';
import Strings from '../../../string_key/Strings';
import {useAuthContext} from '../../../context/AuthContext';
import {useConnection} from '@sendbird/uikit-react-native';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {LoginManager} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import {useCallback} from 'react';
import {Modalize} from 'react-native-modalize';
import WebViewModalProvider, {WebViewModal} from 'react-native-webview-modal';

export default Account = props => {
  const {sdk, currentUser: sbUser} = useSendbirdChat();
  const actionRef = useRef(null);
  const {
    state: ContextState,
    logout,
    updateDND,
    updateSnooze,
  } = useContext(AuthContext);
  const refSnoozeChecked = useRef(false);
  // const [isSnooze, setIsSnooze] = useState(ContextState?.isSnooze?.state);
  // const [isDisturb, setIsDisturb] = useState(ContextState?.isDisturb?.state);
  // const [dndTimeText, setDndTimeText] = useState(
  //   ContextState?.isDisturb?.dndText,
  // );
  // const [snoozeText, setSnoozeText] = useState(
  //   ContextState?.isSnooze?.snoozeText,
  // );
  const [isLoading, setLoading] = useState(true);
  const [isSnooze, setIsSnooze] = useState(false);
  const [isDisturb, setIsDisturb] = useState(false);
  const [dndTimeText, setDndTimeText] = useState('');
  const [snoozeText, setSnoozeText] = useState('');
  const {currentUser, setCurrentUser} = useAuthContext();
  const {disconnect} = useConnection();

  const [pageTitle, setpageTitle] = useState('');
  const [pageLink, setpageLink] = useState('');

  const zeroPad = num => (num < 10 ? '0' + num : num);

  const modalizeRef = useRef(null);

  const handleOpen = useCallback(() => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  }, []);

  const sheetRef = useRef();

  const openSheet = () => {
    sheetRef?.current?.open();
  };

  const closeSheet = () => {
    sheetRef?.current?.close();
  };

  /*const checkMetadataForDND = () => {
    const metadate = sbUser.metaData;
    let dndData;

    const currentDate = new Date();
    if (metadate?.DNDData?.length > 0) {
      dndData = JSON.parse(metadate?.DNDData);

      const getHours = timestamp => parseInt(moment(timestamp).format('HH'));
      const getMinutes = timestamp => parseInt(moment(timestamp).format('mm'));

      const currentHours = getHours(currentDate.getTime());
      const currentMinutes = getMinutes(currentDate.getTime());
      const currentValue = currentHours + currentMinutes;

      const startHours = getHours(dndData?.startTime);
      const startMinutes = getMinutes(dndData?.startTime);
      const startValue = startHours + startMinutes;

      const endHours = getHours(dndData?.endTime);
      const endMinutes = getMinutes(dndData?.endTime);
      const endValue = endHours + endMinutes;

      return currentValue >= startValue && currentValue <= endValue;
    }

    return false;
  };

  const checkMetadataForSnooze = () => {
    const metadate = sbUser.metaData;
    let snoozeData;

    const currentDate = new Date();
    if (metadate?.snoozData?.length > 0) {
      snoozeData = JSON.parse(metadate?.snoozData);

      return (
        currentDate.getTime() > snoozeData?.startTimestamp &&
        currentDate.getTime() < snoozeData?.endTimestamp
      );
    }

    return false;
  };*/

  function turnOffDND() {
    sdk.setDoNotDisturb(
      false,
      0,
      0,
      0,
      0,
      RNLocalize.getTimeZone(),
      (res, e) => {
        setIsDisturb(() => false);
        updateDND({
          state: false,
          dndText: '',
        });
        setDndTimeText(() => '');
        let meta = sbUser.metaData;
        console.log('meta ==> ', meta);
        sbUser.updateMetaData(
          {
            DNDData: '',
          },
          true,
        );
        console.log('setDoNotDisturb => ', res);
      },
    );
  }

  function turnOffSnooze() {
    const date = new Date().getTime();
    sdk.setSnoozePeriod(false, date, date, (res, e) => {
      setIsSnooze(() => false);
      updateSnooze({
        state: false,
        snoozeText: '',
      });
      setSnoozeText(() => '');
      sbUser.updateMetaData(
        {
          snoozData: '',
        },
        true,
      );
      console.log('setSnoozePeriod => ', res);
    });
  }

  useEffect(() => {
    setTimeout(() => setLoading(() => false), 2000);
    sdk.getDoNotDisturb((res, e) => {
      console.log('setDoNotDisturb in sdk useeff=> ', res);

      if (res?.doNotDisturbOn) {
        setIsDisturb(() => true);
        const ET = `${zeroPad(res?.endHour)}:${zeroPad(res?.endMin)}`;
        const dndText = `${zeroPad(res?.startHour)}:${zeroPad(
          res?.startMin,
        )} to ${ET}`;

        const endTimeText = moment(ET, 'HH:mm').format('DD-MMM-YYYY HH:mm');
        const currTimeText = moment(new Date()).format('DD-MMM-YYYY HH:mm');
        if (
          moment(currTimeText, 'DD-MMM-YYYY HH:mm').isAfter(
            moment(endTimeText, 'DD-MMM-YYYY HH:mm'),
          )
        ) {
          console.log('Time passed => ', endTimeText, currTimeText);
          turnOffDND();
          return;
        }

        updateDND({
          state: true,
          dndText: dndText,
        });
        setDndTimeText(() => dndText);
      } else {
        setDndTimeText(() => '');
      }
    });
  }, [isDisturb]);

  useEffect(() => {
    if (!refSnoozeChecked?.current) {
      refSnoozeChecked.current = true;
      let currDate = new Date();
      currDate = moment(currDate).format('DD-MMM-YYYY HH:mm');
      sdk.getSnoozePeriod((res, e) => {
        console.log('getSnoozePeriod => ', res);

        if (res?.startTs === res?.endTs) {
          turnOffSnooze();
          return;
        }

        if (res?.startTs) {
          const startTimeText = moment(res?.startTs).format(
            'DD-MMM-YYYY HH:mm',
          );
          const endTimeText = moment(res?.endTs).format('DD-MMM-YYYY HH:mm');

          if (
            moment(currDate, 'DD-MMM-YYYY HH:mm').isAfter(
              moment(endTimeText, 'DD-MMM-YYYY HH:mm'),
            )
          ) {
            if (res?.isSnoozeOn) {
              turnOffSnooze();
            }
          } else {
            setIsSnooze(() => true);
            const _snoozeText = `${startTimeText} to ${endTimeText}`;
            updateSnooze({
              state: true,
              snoozeText: _snoozeText,
            });
            setSnoozeText(() => _snoozeText);
          }
        }
      });
    }
  }, [isSnooze]);

  // useEffect(() => {
  //   if (!refSnoozeChecked?.current) {
  //     refSnoozeChecked.current = true;
  //
  //     if (!checkMetadataForSnooze()) {
  //       turnOffSnooze();
  //     } else {
  //       sdk.getSnoozePeriod((res, e) => {
  //         console.log('getSnoozePeriod => ', res);
  //
  //         if (res?.isSnoozeOn) {
  //           setIsSnooze(() => true);
  //           const startTimeText = moment(res?.startTs).format(
  //             'DD-MMM-YYYY HH:mm',
  //           );
  //           const endTimeText = moment(res?.endTs).format('DD-MMM-YYYY HH:mm');
  //           setSnoozeText(() => `${startTimeText} to ${endTimeText}`);
  //         } else {
  //           setSnoozeText(() => '');
  //         }
  //       });
  //     }
  //   }
  // }, [isSnooze]);

  const deauthenticate = async () => {
    await Promise.all([
      AuthManager.deAuthenticate(),
      SendbirdCalls.deauthenticate(),
    ]);
    setCurrentUser(undefined);
  };

  return (
    <>
      <Modalize ref={modalizeRef} snapPoint={wp(175)} handlePosition="inside">
        <View
          style={{
            flex: 1,
            height: 500,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <WebViewModalProvider>
            <View style={{margin: 30, height: 500}}>
              <SafeAreaView />
              <WebViewModal
                visible={true}
                source={{uri: pageLink}}
                style={{margin: 10}}
              />
            </View>
          </WebViewModalProvider>
        </View>
      </Modalize>

      <MainContainer>
        <ActionSheet
          showAccount={false}
          refRBSheet={actionRef}
          navigation={props.navigation}
          onClose={() => actionRef?.current.close()}
        />
        <AppHeader
          onBackPress={() => props.navigation.goBack()}
          onNotification={() =>
            props.navigation.navigate('ProfileNav', {screen: 'Notifications'})
          }
          action_open={() => actionRef?.current.open()}
          userData={ContextState.userData}
        />
        <Spacer space={hp(0.5)} />
        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View
              style={{
                width: wp(95),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Pressable
                onPress={() => props.navigation.navigate('Invitations')}>
                <AutoHeightImage source={images.bg_elevation} width={wp(32)}>
                  <Image
                    style={styles.elevation_ic}
                    source={images.settings_acc}
                  />
                  <Text style={{fontSize: wp(3), marginTop: wp(3)}}>
                    {Strings.Invite}
                  </Text>
                </AutoHeightImage>
              </Pressable>
              <Pressable
                onPress={() =>
                  props.navigation.navigate('AccountVerification')
                }>
                <AutoHeightImage source={images.bg_elevation} width={wp(32)}>
                  <Image
                    style={styles.elevation_ic}
                    source={images.report_acc}
                  />
                  <Text style={{fontSize: wp(3), marginTop: wp(3)}}>
                    {Strings.Account_Verification}
                  </Text>
                </AutoHeightImage>
              </Pressable>
              <Pressable
                onPress={() => props.navigation.navigate('EditProfile')}>
                <AutoHeightImage source={images.bg_elevation} width={wp(32)}>
                  <Image
                    style={styles.elevation_ic}
                    source={images.preferences_acc}
                  />
                  <Text style={{fontSize: wp(3), marginTop: wp(3)}}>
                    {Strings.Edit_Profile}
                  </Text>
                </AutoHeightImage>
              </Pressable>
            </View>
            <Spacer space={hp(0.2)} />
            <ActionWrapper
              disabled={isDisturb}
              onPress={() => {
                props.navigation.navigate('DoNotDisturb', {
                  onDndEnabled: (isEnabled, res) => {
                    if (isEnabled) {
                      setIsDisturb(() => isEnabled);
                      const dndText = `${zeroPad(res?.startHour)}:${zeroPad(
                        res?.startMin,
                      )} to ${zeroPad(res?.endHour)}:${zeroPad(res?.endMin)}`;
                      updateDND({
                        state: isEnabled,
                        dndText: dndText,
                      });
                      setDndTimeText(() => dndText);
                    }
                  },
                });
              }}
              activeOpacity={1}>
              <View style={{alignItems: 'flex-start'}}>
                <RegularText>{Strings.Do_not_disturb}</RegularText>
                {dndTimeText.length > 0 && (
                  <SubtitleText>{dndTimeText}</SubtitleText>
                )}
              </View>
              <View style={{flexDirection: 'row'}}>
                <Switch
                  disabled={!isDisturb}
                  trackColor={{
                    false: colors.DARK_GRAY_91,
                    true: colors.LIGHT_PRIMARY_COLOR,
                  }}
                  thumbColor={
                    isDisturb ? colors.PRIMARY_COLOR : colors.DARK_THUMB
                  }
                  onValueChange={val => {
                    if (!val) {
                      turnOffDND();
                    }
                  }}
                  value={isDisturb}
                />
                <Image
                  style={{...styles.icon_ic, marginLeft: wp(1.5)}}
                  source={images.right_ic}
                />
              </View>
            </ActionWrapper>
            <BorderContainer />
            <ActionWrapper
              disabled={isSnooze}
              activeOpacity={1}
              onPress={() => {
                props.navigation.navigate('Snooze', {
                  onSnoozeEnabled: (isEnabled, res) => {
                    if (isEnabled) {
                      setIsSnooze(() => isEnabled);
                      const startTimeText = moment(res?.startTs).format(
                        'DD-MMM-YYYY HH:mm',
                      );
                      const endTimeText = moment(res?.endTs).format(
                        'DD-MMM-YYYY HH:mm',
                      );
                      const _snoozeText = `${startTimeText} to ${endTimeText}`;
                      updateSnooze({
                        state: isEnabled,
                        snoozeText: _snoozeText,
                      });
                      setSnoozeText(() => _snoozeText);
                    }
                  },
                });
              }}>
              <View style={{alignItems: 'flex-start'}}>
                <RegularText>{Strings.Snooze}</RegularText>
                {snoozeText.length > 0 && (
                  <SubtitleText>{snoozeText}</SubtitleText>
                )}
              </View>
              <View style={{flexDirection: 'row'}}>
                <Switch
                  disabled={!isSnooze}
                  trackColor={{
                    false: colors.DARK_GRAY_91,
                    true: colors.LIGHT_PRIMARY_COLOR,
                  }}
                  thumbColor={
                    isSnooze ? colors.PRIMARY_COLOR : colors.DARK_THUMB
                  }
                  onValueChange={val => {
                    if (!val) {
                      turnOffSnooze();
                    }
                  }}
                  value={isSnooze}
                />
                <Image
                  style={{...styles.icon_ic, marginLeft: wp(1.5)}}
                  source={images.right_ic}
                />
              </View>
            </ActionWrapper>
            <BorderContainer />
            <ActionWrapper
              onPress={() => props.navigation.navigate('Language')}>
              <RegularText>{Strings.Language}</RegularText>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#c4c4c4'}}>
                  {ContextState.selectedLang === 'en'
                    ? Strings.english
                    : Strings.spanish}
                </Text>
                <Image style={styles.icon_ic} source={images.right_ic} />
              </View>
            </ActionWrapper>
            <BorderContainer />
            <ActionWrapper
              onPress={() =>
                props.navigation.navigate('Auth', {screen: 'ContactUs'})
              }>
              <RegularText>{Strings.ContactUs}</RegularText>
              <Image style={styles.icon_ic} source={images.right_ic} />
            </ActionWrapper>
            <BorderContainer />

            {/* <ActionWrapper>
              <RegularText>Terms Of Use</RegularText>

            <ActionWrapper>
              <RegularText>{Strings.Terms_Of_Use}</RegularText>

              <Image style={styles.icon_ic} source={images.right_ic} />
            </ActionWrapper> */}

            <ActionWrapper
              onPress={() => {
                setpageLink('https://social.onesay.app/terms-of-use/');
                handleOpen();
              }}>
              <RegularText>Terms of Use</RegularText>
              <Image style={styles.icon_ic} source={images.right_ic} />
            </ActionWrapper>
            <BorderContainer />

            <ActionWrapper
              onPress={() => {
                setpageLink('https://social.onesay.app/privacy-policy/');
                handleOpen();
              }}>
              <RegularText>{Strings.Privacy_Policy}</RegularText>

              <Image style={styles.icon_ic} source={images.right_ic} />
            </ActionWrapper>
            {/* <BorderContainer /> */}
            {/*TODO: Added this screen for testing only...*/}
            {/*<ActionWrapper*/}
            {/*  onPress={() => props.navigation.navigate('EventSettings')}>*/}
            {/*  <RegularText>Event Settings</RegularText>*/}
            {/*  <Image style={styles.icon_ic} source={images.right_ic} />*/}
            {/*</ActionWrapper>*/}
            <BorderContainer />
            <ActionWrapper onPress={() => props.navigation.navigate('Setting')}>
              <RegularText>{Strings.Settings}</RegularText>
              <Image style={styles.icon_ic} source={images.right_ic} />
            </ActionWrapper>
            <BorderContainer />
            <ActionWrapper
              onPress={() => props.navigation.navigate('DeleteAccount')}>
              <RegularText>{Strings.Delete_Account}</RegularText>
              <Image style={styles.icon_ic} source={images.right_ic} />
            </ActionWrapper>
            <BorderContainer />
            <ItemDivider />
            <BorderContainer />
            <ActionWrapper
              onPress={async () => {
                setTimeout(() => {
                  Logout(props, logout);
                }, 500);
                await unregisterToken();
                await deauthenticate();
                await disconnect();
              }}>
              <RegularText>{Strings.Logout}</RegularText>
              <Image style={styles.icon_ic} source={images.logout_ic} />
            </ActionWrapper>
            <BorderContainer />
          </ScrollView>
        </View>
        {isLoading && (
          <View
            style={{
              // position: 'absolute',
              justifyContent: 'center',

              width: wp(100),
              height: hp(60),
              backgroundColor: 'white',
            }}>
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
          </View>
        )}
      </MainContainer>
    </>
  );
};
