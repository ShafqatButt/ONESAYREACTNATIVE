// noinspection ES6CheckImport

import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Alert,
  Platform,
  ScrollView,
  AppState,
  StatusBar,
  Animated,
  StyleSheet,
} from 'react-native';
import {Spacer} from '../../../res/spacer';
import {AuthContext} from '../../../context/Auth.context';
import {UsernameText} from './style';
import ActionSheet from '../../../components/ActionSheet';
import {AppHeader} from '../../../components/AppHeader';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  useLocalization,
  usePlatformService,
  useSendbirdChat,
} from '@sendbird/uikit-react-native/src';
import MenuItemComponent from './Components/MenuItemComponent';
import BasicInfoComponent from './Components/BasicInfoComponent';
import IconsAssets from '../../../assets';
import TextButtonComponent from './Components/TextButtonComponent';
import ProfilePictureComponent from './Components/ProfilePictureComponent';
import {MainContainer, MenuContainer} from './style';
import {getTabIcon} from './Constants';
import {images} from '../../../res/images';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {compressImage} from '../../../uikit-app';
import {ActionMenu, useToast} from '@sendbird/uikit-react-native-foundation';
import {useStorePhoneContactsRealm} from '../../../hooks/useStorePhoneContactsRealm';
import {getData} from '../../../res/asyncStorageHelper';
import AsyncStorage from '@react-native-community/async-storage';
import {PATCH, POST_MULTIPART} from '../../../api_helper/ApiServices';
import {PATCH_UPDATE_PROFILE, POST_FILE_UPLOAD} from '../../../api_helper/Api';
import {useEventEmitter} from '../../../hooks/useEventEmitter';
import {Routes} from '../../../libs/navigation';
import {launchCamera} from 'react-native-image-picker';
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils';
import {ReelContext} from '../../../context/ReelContext';
import {AppHeaderContext} from '../../../components/AppHeaderContext';
import {
  ButtonText,
  HeaderText,
  InviteContainer,
  LoadingContainer,
  RegularText,
  RoundButton,
} from '../Hub/HubScreen/style';

import { useAppNavigation } from '../../../hooks/useAppNavigation';

import Strings from '../../../string_key/Strings';


const eventConfig = {
  title: '',
  attendees: [
    {name: 'Amjad', email: 'amjad@totalpresent.com'},
    {name: 'Amjad Khan', email: 'amjad@yopmail.com.com'},
  ],
  // and other options
};

export default Home = props => {
  const MENU_ITEMS: string[] = [
    Strings.my_missions,
    Strings.my_wallet,
    // 'Events',
    // 'My Orders',
    // 'Hub',
    // 'Campaigns',
    // 'Leaderboard',
    Strings.buy_coins,
    Strings.add_friends,
    // 'My Livestreams',
    Strings.market_place,
    Strings.contributors,
    // 'Categories',
    // 'Share Profile',
  ];

  const actionRef = useRef(null);
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  const {userData} = ContextState;
  const [addContact, syncContacts, getContacts, syncContactsIfRequired] =
    useStorePhoneContactsRealm();
  const {sdk, currentUser} = useSendbirdChat();
  // const {data, isLoading} = serviceList();
  const refSelectedDateTime = useRef('');
  const [visible, setVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(
    userData?.avatar || images.avatar,
  );

  const {state: HeaderContextState, getNotificationCount_WalletTotal} =
    useContext(AppHeaderContext);
  const {notificationCount} = ContextState;
  const {navigation} = useAppNavigation();
  const {actionGetUserReels, actionGetReelList} = useContext(ReelContext);
  const appState = React.useRef(AppState.currentState);
  const toast = useToast();
  const {STRINGS} = useLocalization();
  const {fileService} = usePlatformService();
  // const FullScreenspinner = HOC.FullScreenspinner(View);
  // const {connect} = useConnection();
  //
  // useEffect(() => {
  //   console.log('userData.id', ContextState?.userData?.id);
  //   if (ContextState?.userData != null) {
  //     connect(ContextState?.userData?.id)
  //       .then(user => {})
  //       .catch(err => {});
  //   }
  // }, []);

  useEventEmitter('dl_channel_invite', data => {
    sdk.GroupChannel.getChannel(data?.url, (_channel, e) => {
      AsyncStorage.getItem('userDetails')
        .then(userData => JSON.parse(userData))
        .then(userData => {
          const isAlreadyMember =
            _channel.members.filter(
              m =>
                m.userId === currentUser?.userId ||
                m.userId === userData?.userId,
            )?.length > 0;

          let title = 'Join Channel';
          let message = `Are you sure you want to join ${_channel.name}`;

          if (isAlreadyMember) {
            title = 'Already member';
            message = `You are already member of ${_channel.name}`;
          }

          const buttons = [];
          const okButton = {
            text: 'OK',
            onPress: () => console.log('OK pressed!'),
          };
          const joinButton = {
            text: 'Join',
            onPress: async () => {
              try {
                const response = await _channel.join();
                console.log('Joining the channel... (response) => ', response);
                props.navigation.navigate('chat', {
                  screen: Routes.GroupChannel,
                  params: {
                    serializedChannel: _channel.serialize(),
                  },
                });
              } catch (error) {
                console.log('Error while joining the channel', error.message);
              }
            },
          };
          buttons.push(isAlreadyMember ? okButton : joinButton);
          const cancelButton = {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => console.log('Cancel pressed!'),
          };
          if (!isAlreadyMember) {
            buttons.push(cancelButton);
          }

          Alert.alert(title, message, buttons);
        });
    });
  });

  useEffect(() => {
    if (typeof userData !== 'undefined' && userData !== null) {
      getNotificationCount_WalletTotal();

      if (userData?.membership === null) {
        getData('isMembershipSkipped', isMembershipSkipped => {
          if (
            typeof isMembershipSkipped !== 'boolean' ||
            !isMembershipSkipped
          ) {
            props.navigation.navigate('Membership');
          }
        });
      }
    }
  }, [ContextState]);

  useEffect(() => {
    // RNCalendarEvents.findCalendars().then(res => {
    //   console.log('RNCalendarEvents => ', JSON.stringify(res));
    // });
    // RNCalendarEvents.fetchAllEvents(
    //   '1990-10-01T14:48:00.000Z',
    //   '2023-10-01T14:48:00.000Z',
    // ).then(res => {
    //   console.log('RNCalendarEvents => ', JSON.stringify(res));
    // });
    actionGetUserReels(), actionGetReelList();
  }, [userData]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log('App has come to the foreground!');
        syncContacts();
      }

      appState.current = nextAppState;
      // console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // function _renderServicesLayout() {
  //   return (
  //     <View>
  //       <FlatList
  //         data={data}
  //         numColumns={2}
  //         style={styles.wrapper}
  //         keyExtractor={item => `${item.id}`}
  //         renderItem={({item}) => (
  //           <TouchableOpacity
  //             style={styles.post}
  //             onPress={() => {
  //               props.navigation.navigate('SterioCard');
  //             }}>
  //             <AutoHeightImage
  //               source={{uri: item?.icon}}
  //               width={wp(10)}
  //               style={{alignSelf: 'center'}}
  //             />
  //             <View style={styles.item}>
  //               <Text style={styles.postTitle}>{item.name}</Text>
  //             </View>
  //           </TouchableOpacity>
  //         )}
  //       />
  //     </View>
  //   );
  // }

  //Add the Wallet and Notification update API to the Home -> Index page
  async function uploadImageAndUpdateUserData(compressed) {
    const fd = new FormData();
    fd.append('file', compressed);
    POST_MULTIPART(POST_FILE_UPLOAD, userData.token, fd, (res, e) => {
      if (!e) {
        console.log('res ===> ', res);
        // setProfileImage(() => res.link);

        const url = PATCH_UPDATE_PROFILE(userData.userId);

        const avatarLink = res.link;

        PATCH(
          url,
          userData.token,
          '',
          {
            avatar: res.link,
          },
          (res, e) => {
            if (!e) {
              const _user = {
                ...ContextState.userData,
                avatar: avatarLink,
              };
              updateUserData(_user);
            } else {
              console.log('PATCH_UPDATE_PROFILE (error) => ', res);
            }
          },
        );
      } else {
        console.log('res (error) ===> ', res);
      }
    });
  }

  const onRefresh = (data) => {
console.log("Calling onRefresh",data);

if (data === true){

  setTimeout(() => {
   // alert("Refreshing")
    navigation.navigate("Invitations")
  }, 500);
 
}


  }

  return (
    <>
      {Platform.OS === 'android' && <StatusBar barStyle={'light-content'} />}
      <MainContainer>
        <ActionSheet
          navigation={props.navigation}
          refRBSheet={actionRef}
          onClose={() => actionRef?.current.close()}
          onRefresh={(data) => onRefresh(data)}
        />
        <AppHeader
          pendingNotifications={true}
          onNotification={() =>
            props.navigation.navigate('ProfileNav', {screen: 'Notifications'})
          }
          action_open={() => actionRef?.current.open()}
          userData={userData}
        />
        <View style={{flex: 1}}>
          {/*{isLoading ? (
            // <FullScreenspinner spinner={isLoading} />
            <Loading visible={isLoading} />
          ) : (
            data &&
            data.length > 0 && (
              <>
                <LabelText>Services</LabelText>
                <Spacer space={hp(0.5)} />
                {_renderServicesLayout()}
              </>
            )
          )}*/}

          <ScrollView>
            <Spacer space={wp('1%')} />
            <ProfilePictureComponent
              resizeMode={'cover'}
              source={userData?.avatar || profileImage}
              onPressed={() => {
                setVisible(!visible);
              }}
            />
            <Spacer space={hp(0.5)} />
            <UsernameText>{userData?.displayName}</UsernameText>
            <Spacer space={hp(0.5)} />
            <TextButtonComponent
              title={Strings.view_profile}
              icon={IconsAssets.ShevronRight}
              onPress={() => {
                console.log('userData ==> ', JSON.stringify(userData));

                props.navigation.navigate('chat', {
                  screen: 'ProfileView',
                  params: {
                    is_own: true,
                    data: {
                      nickname: userData?.username,
                      metaData: {
                        phone: userData?.mobile,
                      },
                      image: userData?.avatar,
                    },
                  },
                });

                return;

                // setIsDatePickerVisible(() => true);
                // AddCalendarEvent.presentEventEditingDialog({
                //   eventId:
                //     // 'E0009164-7DCB-4F9C-B51C-A76F29527A0D:4F3188D4-E9B9-4F6A-BF71-9887E5A1F2F7',
                //     'E0009164-7DCB-4F9C-B51C-A76F29527A0D:ED9164DF-B1BB-491A-885C-3BDBD7F270FF',
                // })
                //   .then(
                //     (eventInfo: {
                //       calendarItemIdentifier: string,
                //       eventIdentifier: string,
                //     }) => {
                //       // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
                //       // These are two different identifiers on iOS.
                //       // On Android, where they are both equal and represent the event id, also strings.
                //       // when { action: 'CANCELED' } is returned, the dialog was dismissed
                //       console.warn(JSON.stringify(eventInfo));
                //     },
                //   )
                //   .catch((error: string) => {
                //     // handle error such as when user rejected permissions
                //     console.warn(error);
                //   });
                AddCalendarEvent.presentEventCreatingDialog(eventConfig)
                  .then(
                    (eventInfo: {
                      calendarItemIdentifier: string,
                      eventIdentifier: string,
                    }) => {
                      // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
                      // These are two different identifiers on iOS.
                      // On Android, where they are both equal and represent the event id, also strings.
                      // when { action: 'CANCELED' } is returned, the dialog was dismissed
                      console.warn(
                        'AddCalendarEvent (eventInfo) => ',
                        JSON.stringify(eventInfo),
                      );

                      // RNCalendarEvents.findEventById(
                      //   eventInfo.calendarItemIdentifier,
                      // ).then(res => {
                      //   console.log(
                      //     'RNCalendarEvents => ',
                      //     JSON.stringify(res),
                      //   );
                      // });
                    },
                  )
                  .catch(e => {
                    // handle error such as when user rejected permissions
                    console.log('AddCalendarEvent (error) => ', e);
                  });
              }}
            />
            <Spacer top={wp('3%')} />
            <BasicInfoComponent
              onManagePress={() => props.navigation.navigate('Membership')}
            />
            <Spacer top={wp('3%')} />
            <LoadingContainer>
              <HeaderText>{Strings.rank_ladder}</HeaderText>
              <View
                style={{
                  height: 20,
                  flexDirection: 'row',
                  width: '90%',
                  backgroundColor: 'white',
                  borderColor: '#000',
                  alignSelf: 'center',
                  borderRadius: 10,
                }}>
                <Animated.View
                  style={[
                    [StyleSheet.absoluteFill],
                    {
                      backgroundColor: 'rgb(90,187,198)',
                      width: '50%',
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                    },
                  ]}
                />
              </View>
              <HeaderText>564 / 10k</HeaderText>
            </LoadingContainer>
            <MenuContainer>
              {MENU_ITEMS.map((title, index) => (
                <MenuItemComponent
                  onPress={() => {
                    console.log(title, index);
                    /*if (index === 2) {
                      props.navigation.navigate('ProfileNav', {
                        screen: 'BookedEvents',
                        params: {topTabIndex: 1, NobottomTab: false},
                      });
                    } else */ if (index === 3) {
                      props.navigation.navigate('Invitations');
                    } else if (index === 1) {
                      props.navigation.navigate('ProfileNav', {
                        screen: 'Wallet',
                      });
                    } else if (index === 7) {
                      props.navigation.navigate(Routes.MyOrders);
                      // props.navigation.navigate('ProfileNav', {
                      //   screen: 'AddFriend',
                      // });
                    } else if (index === 4) {
                      props.navigation.navigate('MarketPlaceNav', {
                        screen: 'ProductCategories',
                        params: {
                          is_parent: false,
                        },
                      });
                    } else if (index === 5) {
                      props.navigation.navigate('ProfileNav', {
                        screen: 'Contributors',
                      });
                    }
                    //  else if (index === 4) {
                    //   props.navigation.navigate('ProfileNav', {
                    //     screen: 'HubScreen',
                    //   });

                    // else if (index === 9) {
                    //   props.navigation.navigate('Hub');

                    // }
                    else {
                      props.navigation.navigate('ProfileNav', {
                        screen: 'UnderDevelopmentScreen',
                        params: {
                          title: title,
                        },
                      });
                    }
                  }}
                  title={title}
                  icon={getTabIcon(index == 9 ? 9 : index % 5)}
                  isActive={index === 0 || index === 2}
                />
              ))}
            </MenuContainer>
            <InviteContainer>
              <RegularText>
                {Strings.invite_3_friends +
                  '\n' +
                  Strings.and_earn_5 +
                  '\n' +
                  Strings.cap_buzzmi}
              </RegularText>
              <RoundButton
                onPress={() => props.navigation.navigate('Invitations')}>
                <ButtonText>{Strings.invite}</ButtonText>
              </RoundButton>
            </InviteContainer>
            {/*<CalendarPicker
                    // allowRangeSelection={true}
                    onDateChange={date => {
                      console.log('date => ', date);
                    }}
                    selectedDayTextStyle={{
                      color: 'white',
                    }}
                    selectedDayStyle={{
                      backgroundColor: colors.PRIMARY_COLOR,
                    }}
                  />*/}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={date => {
                // const _date = date.toISOString().split('T')[0];
                // console.log('DatePickerModal (ISO date) => ', _date);
                console.log('DatePickerModal => ', date);
                // setIsDatePickerVisible(() => false);
                // refSelectedDateTime.current = date;
                // setTimeout(
                //   () => setIsTimePickerVisible(() => true),
                //   1000,
                // );
              }}
              onCancel={() => {
                console.log('DatePickerModal Cancel!');
                setIsDatePickerVisible(() => false);
              }}
            />
            {/*<DateTimePickerModal
                    date={refSelectedDateTime.current}
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={date => {
                      // const _time = date.toISOString().split('T')[1];
                      // console.log('TimePickerModal date (date) => ', date);
                      // console.log('TimePickerModal date => ', _time);
                      // refSelectedDateTime.current =
                      //   refSelectedDateTime.current + 'T' + _time;

                      refSelectedDateTime.current = date;

                      console.log(
                        'TimePickerModal date => ',
                        refSelectedDateTime.current,
                      );

                      // const selectedData = new Date(
                      //   refSelectedDateTime.current,
                      // );

                      // console.log('Selected date => ', selectedData);
                      setIsTimePickerVisible(() => false);
                    }}
                    onCancel={() => {
                      console.log('TimePickerModal Cancel!');
                      setIsTimePickerVisible(() => false);
                    }}
                  />*/}
          </ScrollView>
        </View>
      </MainContainer>
      <ActionMenu
        onHide={() => {
          setVisible(false);
        }}
        onDismiss={() => {
          setVisible(false);
        }}
        visible={visible}
        title={Strings.choose_photo}
        menuItems={[
          {
            title: Strings.take_photo,
            onPress: async () => {
              let file;
              const result = await launchCamera({
                mediaType: 'photo',
                maxHeight: 1080,
                maxWidth: 1080,
                quality: 1,
              });

              if (result.errorCode === 'permission') {
                alert({
                  title: Strings.allow_permission,
                  message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                    'camera',
                    'UIKitSample',
                  ),
                  buttons: [
                    {
                      text: Strings.cap_settings,
                      onPress: () => SBUUtils.openSettings(),
                    },
                  ],
                });
              } else if (
                result.errorCode === 'camera_unavailable' ||
                result.errorCode === 'others'
              ) {
                toast.show(Strings.error_open_camera, 'error');
              } else if (result.didCancel) {
                // Cancel
              } else {
                const {fileName, uri, width, height, fileSize, type} =
                  result.assets[0];

                file = {
                  name: fileName,
                  size: fileSize,
                  type: type,
                  uri: uri,
                };
              }

              console.log('photo ==> ', file);

              // const file = await fileService.openCamera({
              //   mediaType: 'photo',
              //   onOpenFailureWithToastMessage: () =>
              //     toast.show(STRINGS.TOAST.OPEN_CAMERA_ERROR, 'error'),
              // });

              if (!file) {
                return;
              }

              let compressed = null;

              try {
                compressed = await compressImage(file);
              } catch (e) {
                console.log('my error ==> ', e.message, file);
                Alert.alert('Error', Strings.error_upload_image);
              }

              if (!compressed) {
                return;
              }

              await uploadImageAndUpdateUserData(compressed);
            },
          },
          {
            title: Strings.choose_photo,
            onPress: async () => {
              const files = await fileService.openMediaLibrary({
                selectionLimit: 1,
                mediaType: 'photo',
                onOpenFailureWithToastMessage: () =>
                  toast.show(Strings.error_open_photo_lib, 'error'),
              });
              if (!files || !files[0]) {
                return;
              }

              let compressed = null;

              try {
                compressed = await compressImage(files[0]);
              } catch (e) {
                console.log('my error ==> ', e.message, files);
                Alert.alert('Error', Strings.error_upload_image);
              }

              if (!compressed) {
                return;
              }

              await uploadImageAndUpdateUserData(compressed);
            },
          },
        ]}
      />
    </>
  );
};
