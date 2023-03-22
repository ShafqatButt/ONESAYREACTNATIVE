import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  useWindowDimensions,
  Animated,
  Text,
  TouchableOpacity,
  AppState,
  Pressable,
  Alert,
  FlatList,
  Linking,
} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {images} from '../../../../res/images';
import {styles} from './style';
import realm from '../../../../realmStore';
import {GET_DATA, POST} from '../../../../api_helper/ApiServices';
import Loading from '../../../../components/Loading';
import {
  CHECK_SENDBIRD_USER,
  GET_INVITE_LIST,
  GET_NETWORK_LIST,
} from '../../../../api_helper/Api';
// Third Party library
import AlphabetList from 'react-native-flatlist-alphabet';
import {TabView, SceneMap} from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-gesture-handler';
import {useStorePhoneContactsRealm} from '../../../../hooks/useStorePhoneContactsRealm';
import {CONST_TYPES, removeSpecialCharacters} from '../../../../uikit-app';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import deviceInfoModule from 'react-native-device-info';
import {AuthContext} from '../../../../context/Auth.context';
import {Palette} from '@sendbird/uikit-react-native-foundation';
import SBText from '../../../../components/SBText';
import {getrelamContactName} from '../../../../commonAction';
import SBIcon from '../../../../components/SBIcon';
import nativePermissionGranted from '@sendbird/uikit-react-native/src/utils/nativePermissionGranted';
import {CALL_PERMISSIONS} from '../../../../hooks/usePermissions';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import {AppLogger} from '../../../../utils/logger';
import {DirectRoutes} from '../../../../navigations/routes';
import {useDirectNavigation} from '../../../../navigations/useDirectNavigation';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import Strings from "../../../../string_key/Strings";

export default ContactsContainer = props => {
  const {navigation} = useDirectNavigation();

  const appState = React.useRef(AppState.currentState);
  const refContactsData = React.useRef([
    ...realm.objects('Contact').sorted('givenName'),
  ]);
  const [addContact, syncContacts, getContacts, syncContactsIfRequired] =
    useStorePhoneContactsRealm();
  const layout = useWindowDimensions();
  const {sdk, currentUser} = useSendbirdChat();
  const [loading, setLoading] = useState('');
  const [search, setSerach] = useState('');
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'all', title: Strings.all},
    {key: 'onessay', title: 'Buzzmi'},
    {key: 'network', title: Strings.network},
  ]);

  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;

  const [contactData, setContactData] = useState(refContactsData?.current);
  const [networkData, setNetworkData] = useState([]);
  const [inviteData, setInviteData] = useState([]);

  const result = []

  useEffect(() => {
    syncContactsIfRequired(response => {
      if (response.syncRequired) {
        if (response.isLoading) {
          refContactsData.current = null;
          setContactData(() => []);
        } else {
          refContactsData.current = response.contacts;
          setContactData(() => refContactsData.current);
        }
      }
    }, refContactsData?.current?.length);
  }, []);

  useEffect(() => {
    getNetworkList();
    getInviteList();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        //console.log('App has come to the foreground!');
        refContactsData.current = null;
        setContactData(() => []);
        syncContacts(contacts => {
          refContactsData.current = contacts;
          setContactData(() => refContactsData.current);
        });
      }

      appState.current = nextAppState;
      //  console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const renderListItem = item => {
    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => {
          onCheckSendBirdUser(item);
        }}>
        <Image
          source={item.hasThumbnail ? {uri: item.thumbnailPath} : images.avatar}
          style={{width: wp(6), height: wp(6), borderRadius: wp(6)}}
        />
        <Text style={styles.listItemLabel}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = section => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
      </View>
    );
  };

  const onCheckSendBirdUser = async item => {
    let postData = {
      mobileNumbers: [item?.phoneNumber],
    };
    const userData = await AsyncStorage.getItem('userDetails');
    const uniqueID = await DeviceInfo.getUniqueId();
    setLoading(true);
    POST(
      CHECK_SENDBIRD_USER,
      true,
      JSON.parse(userData).token,
      uniqueID,
      postData,
      async data => {
        console.log('data ===> ', data);
        setLoading(false);
        if (data?.length > 0) {
          if (data[0]?.isSendBirdUser) {
            props.navigation.pop();

            const params = new sdk.GroupChannelParams();
            params.isSuper = false;
            params.isPublic = false;
            if (currentUser) {
              params.operatorUserIds = [currentUser.userId];
            }
            params.addUserIds([data[0]?.sendBirdId]);
            params.name = '';
            params.isDistinct = true;
            params.customType = CONST_TYPES.ROOM_DIRECT;
            const channel = await sdk.GroupChannel.createChannel(params);

            const _data = channel.members.filter(
              user => user.userId === data[0]?.sendBirdId,
            )[0];
            console.log('_data (1) _data ===> ', _data);
            props.navigation.navigate('chat', {
              screen: 'ProfileView',
              params: {
                data: _data,
                channelUrl: channel?.url,
                is_super: false,
              },
            });

            // props.navigation.navigate('ContactCard', {
            //   card: item,
            //   isSendBirdUser: true,
            //   sendBirdID: data[0]?.sendBirdId,
            // });
          } else {
            props.navigation.pop();
            props.navigation.navigate('chat', {
              screen: 'ContactCard',
              params: {
                card: item,
                isSendBirdUser: false,
              },
            });
          }
        }
      },
    );
  };

  const FirstRoute = () => (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      {contactData && contactData.length > 0 && (
        <AlphabetList
          style={{flex: 1}}
          data={contactData}
          renderItem={renderListItem}
          renderSectionHeader={renderSectionHeader}
          letterItemStyle={{height: 20}}
          indexLetterColor={colors.PRIMARY_COLOR}
        />
      )}
    </View>
  );

  const onNavigate = async (callProps: DirectCallProperties) => {
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

  const onDial = useCallback(async (userId, isVideoCall) => {
    console.log(userId);
    try {
      const requestResult = await Permissions.requestMultiple(CALL_PERMISSIONS);
      const isGranted = nativePermissionGranted(requestResult);
      if (isGranted) {
        const callProps = await SendbirdCalls.dial(userId, isVideoCall);
        AppLogger.info('DIAL CALLED', callProps.callId);
        onNavigate(callProps);
      } else {
        Alert.alert(
          'Insufficient permissions!',
          "To call, allow one'ssay access to your camera and microphone",
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
      // @ts-ignore
      Alert.alert('Failed', e.message);
    }
  }, []);

  const SecondRoute = () => (
    <>
      {inviteData?.length > 0 ? (
        <FlatList
          style={{flex: 1}}
          bounces={false}
          data={inviteData}
          renderItem={({item, index}) => (
            <TouchableOpacity style={styles.cellContainer}>
              <View style={{...styles.cellInfo}}>
                <View style={{flex: 1, marginTop : 10}}>
                  <SBText
                    subtitle1
                    color={Palette.onBackgroundLight01}
                    numberOfLines={2}>
                    {getrelamContactName(item?.user.mobile) || '—'}
                  </SBText>
                </View>
                <View style={{alignItems: 'flex-end', alignSelf: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      style={{marginRight: 8}}
                      onPress={() =>
                        onCheckSendBirdUser(
                          Object.assign(item?.user, {
                            phoneNumber: item?.user?.mobile,
                          }),
                        )
                      }>
                      {({pressed}) => {
                        return (
                          <SBIcon
                            size={35}
                            icon={(() => {
                              if (pressed) {
                                return 'chatFillOn';
                              }
                              return 'chatOn';
                            })()}
                          />
                        );
                      }}
                    </Pressable>

                    <Pressable
                      style={{marginRight: 8}}
                      onPress={() => {
                        props.navigation.goBack();
                        setTimeout(() => {
                          onDial(item?.user?.sendbirdUserId ?? 'unknown', true);
                        }, 120);
                      }}>
                      {({pressed}) => {
                        return (
                          <SBIcon
                            size={35}
                            icon={(() => {
                              if (pressed) {
                                return 'btnCallVideoFillTertiaryPressed';
                              }
                              return 'btnCallVideoTertiaryPressed';
                            })()}
                          />
                        );
                      }}
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        props.navigation.goBack();
                        setTimeout(() => {
                          onDial(
                            item?.user?.sendbirdUserId ?? 'unknown',
                            false,
                          );
                        }, 120);
                      }}>
                      {({pressed}) => {
                        return (
                          <SBIcon
                            size={35}
                            icon={(() => {
                              if (pressed) {
                                return 'btnCallVoiceTertiaryfillPressed';
                              }
                              return 'btnCallVoiceTertiaryPressed';
                            })()}
                          />
                        );
                      }}
                    </Pressable>
                  </View>
                </View>
              </View>
              {/* <Loading visible={isLoading} /> */}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[{textAlign: 'center'}]}>{Strings.warn_no_record_found}</Text>
        </View>
      )}
    </>
  );
  const ThirdRoute = () => (
    <>
      {networkData?.length > 0 ? (
        <FlatList
          style={{flex: 1}}
          bounces={false}
          data={networkData}
          renderItem={({item, index}) => (
            <TouchableOpacity style={!(item.isParent) ? (styles.cellContainer) : (styles.cellContainerForNetworkParent)}>
              <View style={{...styles.cellInfo}}>
                <View style={{flex: 1, marginTop : 10}}>
                  <SBText
                    subtitle1
                    color={Palette.onBackgroundLight01}
                    numberOfLines={2}>
                    {getrelamContactName(item?.mobile) || '—'}
                  </SBText>
                </View>
                <View style={{alignItems: 'flex-end', alignSelf: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      style={{marginRight: 8}}
                      onPress={() =>
                        onCheckSendBirdUser(
                          Object.assign(item, {
                            phoneNumber: item?.mobile,
                          }),
                        )
                      }>
                      {({pressed}) => {
                        return (
                          <SBIcon
                            size={35}
                            icon={(() => {
                              if (pressed) {
                                return 'chatFillOn';
                              }
                              return 'chatOn';
                            })()}
                          />
                        );
                      }}
                    </Pressable>

                    <Pressable
                      style={{marginRight: 8}}
                      onPress={() => {
                        props.navigation.goBack();
                        setTimeout(() => {
                          onDial(item?.sendbirdUserId ?? 'unknown', true);
                        }, 120);
                      }}>
                      {({pressed}) => {
                        return (
                          <SBIcon
                            size={35}
                            icon={(() => {
                              if (pressed) {
                                return 'btnCallVideoFillTertiaryPressed';
                              }
                              return 'btnCallVideoTertiaryPressed';
                            })()}
                          />
                        );
                      }}
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        props.navigation.goBack();
                        setTimeout(() => {
                          onDial(item?.sendbirdUserId ?? 'unknown', false);
                        }, 120);
                      }}>
                      {({pressed}) => {
                        return (
                          <SBIcon
                            size={35}
                            icon={(() => {
                              if (pressed) {
                                return 'btnCallVoiceTertiaryfillPressed';
                              }
                              return 'btnCallVoiceTertiaryPressed';
                            })()}
                          />
                        );
                      }}
                    </Pressable>
                  </View>
                </View>
              </View>
              {/* <Loading visible={isLoading} /> */}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[{textAlign: 'center'}]}>{Strings.warn_no_record_found}</Text>
        </View>
      )}
    </>
  );
  const renderScene = SceneMap({
    all: FirstRoute,
    onessay: SecondRoute,
    network: ThirdRoute,
  });

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
            <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
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
            <Text style={[styles.label, styles.active]}>{route.title}</Text>
          </Animated.View>
        </View>
      );
    };

  const renderTabBar = props => (
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
  );

  const getNetworkList = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    GET_DATA(
      GET_NETWORK_LIST(userData?.userId),
      true,
      userData?.token,
      uniqueID,
      data => {
        //console.log('Networkdata==>', data.network);
    
      let networkData = data.network;   
       let flatArray = networkData.reduce((acc, curVal) => {
        let newVal = curVal.network.flat(Infinity)
        acc.push(curVal);
        return acc.concat(newVal)
    }, []);
    
    let networkArray = flatArray.flat(Infinity);
    console.log(networkArray);
        setNetworkData(networkArray);
      },
    );
  };

  const getInviteList = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    GET_DATA(
      GET_INVITE_LIST(userData?.userId),
      true,
      userData?.token,
      uniqueID,
      data => {
        //console.log('Invitedata==>', data);
        setInviteData(data);
      },
    );
  };

  return (
    <GlobalFlex>
      <BackHeader
        background={{paddingTop: wp(4), paddingBottom: wp(3.5)}}
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={Strings.contacts}
      />
      <Spacer space={hp(0.6)} />
      <View style={styles.search_wrapper}>
        <Image source={images.search_ic} style={styles.search_ic} />
        <TextInput
          placeholder={Strings.search}
          placeholderTextColor={colors.OSLO_GRAY}
          value={search}
          onChangeText={val => {
            setSerach(val);

            const _contacts = JSON.parse(
              JSON.stringify(
                realm
                  .objects('Contact')
                  .sorted('givenName')
                  .filtered(
                    'givenName CONTAINS $0 OR familyName CONTAINS $0 ',
                    val,
                  ),
              ),
            );

            setContactData(() => _contacts);
          }}
          style={styles.Input}
          clearButtonMode={'always'}
        />
      </View>
      <Spacer space={hp(0.3)} />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{width: layout.width}}
      />
      <Loading visible={loading} />
    </GlobalFlex>
  );
};
