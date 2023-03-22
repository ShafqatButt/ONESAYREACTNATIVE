// noinspection ES6CheckImport

import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
  Linking,
  useWindowDimensions,
} from 'react-native';
import {Spacer} from '../../../../res/spacer';
import {GlobalFlex} from '../../../../res/globalStyles';
import {colors} from '../../../../res/colors';
import {BorderContainer, styles, Text, ActionWrapper} from './style';
import {images} from '../../../../res/images';
import {fonts} from '../../../../res/fonts';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {
  GET_SENDBIRD,
  POST,
  POST_SENDBIRD,
  DELETE_SENDBIRD,
} from '../../../../api_helper/ApiServices';
import {Button} from '../../../../components/Button';
import {
  BLOCK_USERS,
  CHECK_SENDBIRD_USER,
  POST_BLOCK_USERS,
  UN_BLOCK_USERS,
  CHANNEL_MUTE_USER,
  GROUP_MUTE_USER,
} from '../../../../api_helper/Api';
import {Routes} from '../../../../libs/navigation';
import Loading from '../../../../components/Loading';
import {
  getLanguageValueFromKey,
  getrelamContactName,
} from '../../../../commonAction';
import {useDirectNavigation} from '../../../../navigations/useDirectNavigation';
import {DirectRoutes} from '../../../../navigations/routes';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {useSendbirdChat} from '@sendbird/uikit-react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';
import {TabView, SceneMap} from 'react-native-tab-view';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import {
  CONST_TYPES,
  removeSpecialCharacters,
  underDevelopment,
} from '../../../../uikit-app';
import Permissions from 'react-native-permissions';
import nativePermissionGranted from '@sendbird/uikit-react-native/src/utils/nativePermissionGranted';
import {CALL_PERMISSIONS} from '../../../../hooks/usePermissions';
import moment from 'moment/moment';
import Strings from '../../../../string_key/Strings';

export default ProfileView = props => {
  const layout = useWindowDimensions();
  const {data} = props.route.params;
  const {channelUrl} = props.route.params;
  const {isSuper} = props.route.params;
  const {is_own} = props.route.params;
  console.log('data in profile screen====>', data, is_own);
  const [callOptions] = useState([
    {icon: images.call_btn, is_video_call: false},
    {icon: images.chat_btn, is_chat: true},
    {icon: images.video_btn, is_video_call: true},
  ]);
  const {navigation} = useDirectNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {sdk, currentUser} = useSendbirdChat();

  const [statistics, setStatistics] = useState([
    {title: Strings.following, digit: '0'},
    {title: Strings.followers, digit: '0'},
    {title: Strings.views + '/mo', digit: '0'},
    {title: Strings.streamer_hours + '/mo', digit: '0h 0m'},
  ]);

  const [routes] = useState([
    {key: 'first', icon: images.menu_ic},
    {key: 'second', icon: images.lock_ic},
    {key: 'third', icon: images.bookmark_ic},
    {key: 'fourth', icon: images.heart_ic},
  ]);
  const [index, setIndex] = useState(0);
  const [userPosts, setUserPosts] = useState([
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
  ]);
  const [userLocked] = useState([
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
    {image: images.demo_img},
  ]);
  const [is_block, setIsBlock] = useState(false);
  const [is_mute, setIsMute] = useState(false);
  const [is_notification, setIsNotification] = useState(false);

  useEffect(() => {
    checkListMuteUser();
    checkBlockUser();
  }, [data]);

  //#region block user
  const checkBlockUser = () => {
    GET_SENDBIRD(BLOCK_USERS(currentUser.userId, data?.userId), data => {
      if (data?.users.length > 0) {
        setIsBlock(true);
      } else {
        setIsBlock(false);
      }
    });
  };

  const onPostBlockUser = () => {
    let body_json = {target_id: data?.userId};
    POST_SENDBIRD(POST_BLOCK_USERS(currentUser.userId), body_json, data => {
      if (data) {
        checkBlockUser();
      }
    });
  };

  const onUnBlockUser = () => {
    DELETE_SENDBIRD(
      `${UN_BLOCK_USERS(currentUser.userId) + '/' + data?.userId}`,
      data => {
        if (data) {
          checkBlockUser();
        }
      },
    );
  };
  //#region

  //#region mute user
  const checkListMuteUser = () => {
    GET_SENDBIRD(
      isSuper
        ? CHANNEL_MUTE_USER(channelUrl) + '/' + data?.userId
        : GROUP_MUTE_USER(channelUrl) + '/' + data?.userId,
      item => {
        if (item) {
          setIsMute(item.is_muted ? true : false);
        }
      },
    );
  };

  const onPostMuteUser = () => {
    let body_json = {user_id: data?.userId};
    POST_SENDBIRD(
      isSuper ? CHANNEL_MUTE_USER(channelUrl) : GROUP_MUTE_USER(channelUrl),
      body_json,
      item => {
        checkListMuteUser();
      },
    );
  };

  const onUnMuteUser = () => {
    DELETE_SENDBIRD(
      isSuper
        ? CHANNEL_MUTE_USER(channelUrl) + '/' + data?.userId
        : GROUP_MUTE_USER(channelUrl) + '/' + data?.userId,
      data => {
        checkListMuteUser();
      },
    );
  };
  //#endregion

  const onNavigate = callProps => {
    if (callProps.isVideoCall) {
      navigation.navigate(DirectRoutes.VIDEO_CALLING, {
        callId: callProps.callId,
      });
    } else {
      navigation.navigate(DirectRoutes.VOICE_CALLING, {
        callId: callProps.callId,
      });
    }
  };

  const getSendbirdUserById = async userId => {
    try {
      const query = sdk.createUserListQuery([userId]);
      const users = await query.next();
      return users[0];
    } catch (e) {
      console.log('error (getSendbirdUserById) => ', e.message);
      return null;
    }
  };

  const onDial = async (userId, isVideoCall) => {
    // const users = channel?.members?.filter(m => m?.userId === userId);
    const user = await getSendbirdUserById(userId);
    let metadate = user?.metaData;
    // if (users?.length > 0) {
    //   metadate = users[0]?.metaData;
    // }

    if (metadate !== null && metadate !== undefined) {
      let snoozeData, dndData;
      const currentDate = new Date();
      if (metadate?.DNDData?.length > 0) {
        dndData = JSON.parse(metadate?.DNDData);

        const getHours = timestamp =>
          parseInt(moment(timestamp).format('HH'), 10);
        const getMinutes = timestamp =>
          parseInt(moment(timestamp).format('mm'), 10);

        const currentHours = getHours(currentDate.getTime());
        const currentMinutes = getMinutes(currentDate.getTime());
        const currentValue = currentHours + currentMinutes;

        const startHours = getHours(dndData?.startTime);
        const startMinutes = getMinutes(dndData?.startTime);
        const startValue = startHours + startMinutes;

        const endHours = getHours(dndData?.endTime);
        const endMinutes = getMinutes(dndData?.endTime);
        const endValue = endHours + endMinutes;

        const dndEnabled =
          currentValue >= startValue && currentValue <= endValue;

        console.log('dndEnabled ==> ', dndEnabled);

        if (dndEnabled) {
          Alert.alert(
            'Failed',
            'This user is currently on do not disturb mode.',
          );
          return;
        }
      } else if (metadate?.snoozData?.length > 0) {
        snoozeData = JSON.parse(metadate?.snoozData);

        const snoozeEnabled =
          currentDate.getTime() > snoozeData?.startTimestamp &&
          currentDate.getTime() < snoozeData?.endTimestamp;

        console.log(snoozeEnabled);

        if (snoozeEnabled) {
          Alert.alert('Failed', 'This user is currently on snooze mode.');
          return;
        }
      }
    }
    try {
      const requestResult = await Permissions.requestMultiple(CALL_PERMISSIONS);
      const isGranted = nativePermissionGranted(requestResult);
      if (isGranted) {
        const callProps = await SendbirdCalls.dial(userId, isVideoCall);
        onNavigate(callProps);
      } else {
        Alert.alert(
          'Insufficient permissions!',
          'To call, allow Buzzmi access to your camera and microphone',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: async () => {},
            },
            {
              text: 'Okay',
              onPress: async () => {
                Linking.openSettings();
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (e) {
      Alert.alert('Failed', e.message);
    }
  };

  const onCheckSendBirdUser = async navRoute => {
    console.log('data ==> ', data);
    let postData = {
      mobileNumbers: [data?.metaData.phone],
    };
    const userData = await AsyncStorage.getItem('userDetails');
    const uniqueID = await DeviceInfo.getUniqueId();
    setIsLoading(true);
    POST(
      CHECK_SENDBIRD_USER,
      true,
      JSON.parse(userData).token,
      uniqueID,
      postData,
      async item => {
        setIsLoading(false);
        if (item?.length > 0) {
          if (item[0]?.isSendBirdUser) {
            const params = new sdk.GroupChannelParams();
            params.isSuper = false;
            params.isPublic = false;
            params.isEphemeral = false;
            params.customType = CONST_TYPES.ROOM_DIRECT;
            if (currentUser) {
              params.operatorUserIds = [currentUser.userId];
            }
            params.addUserIds([data.userId]);
            params.name = '';
            params.isDistinct = true;
            const channel = await sdk.GroupChannel.createChannel(params);

            setTimeout(() => {
              navigation.replace(navRoute, {
                serializedChannel: channel.serialize(),
              });
              // navigation.push(Routes.GroupChannel, {
              //   serializedChannel: channel.serialize(),
              // });
            }, 500);
          }
        }
      },
    );
  };

  const renderItem =
    ({navigationState, position}) =>
    ({route, index}) => {
      const inputRange = navigationState.routes.map((_, i) => i);
      const activeOpacity = position.interpolate({
        inputRange,
        outputRange: inputRange.map(i => (i === index ? 1 : 0)),
      });
      const inactiveOpacity = position.interpolate({
        inputRange,
        outputRange: inputRange.map(i => (i === index ? 0 : 1)),
      });
      return (
        <View style={styles.tab}>
          <Animated.View style={[styles.item, {opacity: inactiveOpacity}]}>
            <Image
              source={route.icon}
              style={{
                ...styles.icon_ic,
                ...styles.tabBarIcon,
                tintColor: colors.GRAY2,
              }}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.item,
              styles.activeItem,
              {
                opacity: activeOpacity,
                borderBottomColor: colors.PRIMARY_COLOR,
                borderBottomWidth: wp(0.6),
              },
            ]}>
            <Image
              source={route.icon}
              style={{
                ...styles.icon_ic,
                ...styles.tabBarIcon,
                tintColor: colors.PRIMARY_COLOR,
              }}
            />
          </Animated.View>
        </View>
      );
    };
  const FirstRoute = () => (
    <FlatList
      style={{flex: 1}}
      data={userPosts}
      bounces={false}
      renderItem={({item}) => (
        <AutoHeightImage
          width={wp(33.33)}
          maxHeight={wp(40)}
          source={item.image}
          style={{marginRight: 2, marginBottom: 2}}
        />
      )}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const SecondRoute = () => (
    <FlatList
      style={{flex: 1}}
      bounces={false}
      data={userLocked}
      renderItem={({item}) => (
        <AutoHeightImage
          width={wp(33.33)}
          maxHeight={wp(40)}
          source={item.image}
          style={{marginRight: 2, marginBottom: 2}}
        />
      )}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const thirdRoute = () => (
    <View style={{flex: 1, backgroundColor: '#673ab7'}} />
  );
  const fourthRoute = () => (
    <View style={{flex: 1, backgroundColor: '#673ab7'}} />
  );

  const handleBookEvent = () => {
    // props.navigation.navigate('ProfileNav', {
    //   screen: 'ProfileEventTypes',
    //   params: {
    //     filterId: data?.userId,
    //   },
    // });
    props.navigation.navigate('ProfileEventTypes', {
      filterId: data?.userId,
    });
    return;

    const eventConfig = {
      title: '',
      attendees: [
        {name: 'Amjad', email: 'amjad@totalpresent.com'},
        {name: 'Amjad Khan', email: 'amjad@yopmail.com.com'},
      ],
      // and other options
    };

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
  };

  return (
    <GlobalFlex>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <AutoHeightImage
          width={wp(100)}
          maxHeight={wp(105)}
          source={
            data?.plainProfileUrl?.length > 0
              ? {uri: data?.plainProfileUrl}
              : data?.image?.length > 0
              ? {uri: data?.image}
              : images.demo_img
          }>
          <View
            style={{
              width: wp(90),
              alignSelf: 'center',
              position: 'absolute',
              bottom: -wp(6),
            }}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  ...styles.txtMobile,
                  color: colors.WHITE,
                  fontSize: wp(5.5),
                }}
                numberOfLines={1}>
                {getrelamContactName(data?.metaData.phone)}
              </Text>
              <Spacer space={wp(0.8)} />
              <Text style={styles.txtMobile} numberOfLines={1}>
                {'@' + data?.nickname.replace(/ /g, '').replace(/-/g, '')}
              </Text>
              <Spacer space={wp(0.5)} />
              <Text style={styles.txtMobile} numberOfLines={1}>
                {data?.metaData.phone}
              </Text>
            </View>
            <Spacer space={wp(1.5)} />
            {!is_own ? (
              <View style={styles.callOptionContainer}>
                {callOptions.map(item => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        item.is_chat
                          ? navigation.getState().index === 2
                            ? navigation.goBack()
                            : onCheckSendBirdUser(Routes.GroupChannel)
                          : onDial(data?.userId, item.is_video_call);
                      }}>
                      <Image source={item.icon} style={styles.callOptionImg} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={{height: hp(8)}} />
            )}
          </View>
        </AutoHeightImage>
        <Spacer space={wp(5)} />
        <View style={{...styles.callOptionContainer, width: wp(92)}}>
          {statistics.map((item, i) => {
            return (
              <>
                <View style={{alignItems: 'center', maxWidth: wp(40)}}>
                  <Text
                    style={{
                      ...styles.txtMobile,
                      color: colors.BLACK2,
                      fontSize: wp(4.2),
                      fontFamily: fonts.MEDIUM,
                      maxWidth: wp(20),
                    }}
                    numberOfLines={1}>
                    {item.digit}
                  </Text>
                  <Spacer space={wp(0.5)} />
                  <Text
                    style={{
                      ...styles.txtMobile,
                      fontSize: wp(2.7),
                      color: colors.GRAY2,
                    }}
                    numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                {i !== statistics.length - 1 && (
                  <Image
                    source={images.dotted_line}
                    style={{
                      ...styles.callOptionImg,
                      height: wp(10),
                      width: wp(2),
                    }}
                  />
                )}
              </>
            );
          })}
        </View>
        <Spacer space={wp(3)} />

        {!is_own && (
          <>
            <View style={styles.btnWrapper}>
              {/*<Button
                btnstyle={{width: wp(45)}}
                buttonText={getLanguageValueFromKey('book_event')}
                buttonPress={() => handleBookEvent()}
              />*/}
              <Button
                btnstyle={{width: wp(45)}}
                buttonText={Strings.follow}
                buttonPress={() => {}}
              />
            </View>
            <Spacer space={wp(3)} />
          </>
        )}

        <TabView
          navigationState={{index, routes}}
          renderScene={SceneMap({
            first: FirstRoute,
            second: SecondRoute,
            third: thirdRoute,
            fourth: fourthRoute,
          })}
          onIndexChange={setIndex}
          renderTabBar={props => (
            <View style={styles.tabbar}>
              {props.navigationState.routes.map((route, index) => {
                return (
                  <TouchableWithoutFeedback
                    key={route.key}
                    onPress={() => props.jumpTo(route.key)}>
                    {renderItem(props)({route, index})}
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          )}
          initialLayout={{width: layout.width}}
          style={{height: wp(95)}}
        />
        <BorderContainer />
        <Spacer space={hp(1.5)} />

        {!is_own && (
          <>
            <>
              <ActionWrapper activeOpacity={1} style={[{width: wp(90)}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={images.bell}
                    style={{
                      ...styles.callOptionImg,
                      tintColor: colors.PRIMARY_COLOR,
                      height: wp(7),
                      width: wp(7),
                    }}
                  />
                  <Spacer row={wp(1)} />
                  <Text
                    style={[
                      {
                        alignSelf: 'center',
                        fontFamily: fonts.REGULAR,
                        fontSize: wp(4.5),
                      },
                    ]}>
                    {Strings.mute}
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Switch
                    trackColor={{
                      false: colors.DARK_GRAY_91,
                      true: colors.LIGHT_PRIMARY_COLOR,
                    }}
                    thumbColor={
                      is_mute ? colors.PRIMARY_COLOR : colors.DARK_THUMB
                    }
                    onValueChange={() => {
                      //setIsNotification(!is_mute)
                      is_mute ? onUnMuteUser() : onPostMuteUser();
                    }}
                    value={is_mute}
                  />
                </View>
              </ActionWrapper>
              <BorderContainer />
            </>
            <>
              <ActionWrapper
                activeOpacity={0.4}
                style={[{width: wp(90)}]}
                onPress={() => onCheckSendBirdUser('SearchMessageScreen')}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={images.search_ic}
                    style={{
                      ...styles.callOptionImg,
                      tintColor: colors.PRIMARY_COLOR,
                      height: wp(6),
                      width: wp(6),
                    }}
                  />
                  <Spacer row={wp(1)} />
                  <Text
                    style={[
                      {
                        alignSelf: 'center',
                        fontFamily: fonts.REGULAR,
                        fontSize: wp(4.5),
                      },
                    ]}>
                    {Strings.search_message}
                  </Text>
                </View>
              </ActionWrapper>
              <BorderContainer />
            </>
            <>
              <ActionWrapper
                activeOpacity={0.4}
                style={[{width: wp(90)}]}
                onPress={() => {
                  is_block ? onUnBlockUser() : onPostBlockUser();
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={images.lock_ic}
                    style={{
                      ...styles.callOptionImg,
                      tintColor: colors.PRIMARY_COLOR,
                      height: wp(7),
                      width: wp(7),
                    }}
                  />
                  <Spacer row={wp(1)} />
                  <Text
                    style={[
                      {
                        alignSelf: 'center',
                        fontFamily: fonts.REGULAR,
                        fontSize: wp(4.5),
                      },
                    ]}>
                    {is_block ? Strings.unblock_contact : Strings.block_contact}
                  </Text>
                </View>
              </ActionWrapper>
              <BorderContainer />
            </>

            <>
              <ActionWrapper
                activeOpacity={0.4}
                style={[{width: wp(90)}]}
                onPress={() => {
                  navigation.navigate('ReportUser', {
                    channelUrl: channelUrl,
                    isSuper: isSuper,
                    offending_user_id: data?.userId,
                  });
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={images.subtract_ic}
                    style={{
                      ...styles.callOptionImg,
                      tintColor: colors.PRIMARY_COLOR,
                      height: wp(7),
                      width: wp(7),
                    }}
                  />
                  <Spacer row={wp(1)} />
                  <Text
                    style={[
                      {
                        alignSelf: 'center',
                        fontFamily: fonts.REGULAR,
                        fontSize: wp(4.5),
                      },
                    ]}>
                    {Strings.report}
                  </Text>
                </View>
              </ActionWrapper>
              <BorderContainer />
            </>
          </>
        )}
        <Spacer space={wp(5)} />
      </ScrollView>
      <TouchableOpacity
        style={styles.backBtnContainer}
        onPress={() => props.navigation.goBack()}>
        <Image
          source={images.back_black}
          style={{
            ...styles.icon_ic,
            ...styles.tabBarIcon,
            tintColor: colors.WHITE,
          }}
        />
      </TouchableOpacity>
      <Loading visible={isLoading} />
    </GlobalFlex>
  );
};
