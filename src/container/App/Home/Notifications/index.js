import React, {useContext, useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {GET_DATA, PUT_SENDBIRD} from '../../../../api_helper/ApiServices';
import {
  GET_ACTIONS,
  GET_NOTIFCATIONS_AND_INVITATIONS,
} from '../../../../api_helper/Api';
import {styles, Text} from './style';
import {AuthContext} from '../../../../context/Auth.context';
import realm from '../../../../realmStore';
import {colors} from '../../../../res/colors';
import {Routes} from '../../../../libs/navigation';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {getrelamContactName} from '../../../../commonAction';
import {GET_NOTIFICATIONS} from '../../../../api_helper/Api';
import {useIsFocused} from '@react-navigation/native';
import deviceInfoModule from 'react-native-device-info';
import {BorderContainer} from './style';
import {PATCH} from '../../../../api_helper/ApiServices';
import {UPDATE_NOTIFICATIONS} from '../../../../api_helper/Api';
import Strings from "../../../../string_key/Strings";

const PAGE_LIMIT = 10;

export default Notifications = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionData, setActionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState({status: false, id: 0});
  const [page, setPage] = useState(1);
  const [notificationData, setNotificationData] = useState([]);

  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;
  const {sdk, currentUser} = useSendbirdChat();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   //onGetActionsData();
  //   // console.log(userData)
  // }, [userData]);

  useEffect(() => {
    if (isFocused) {
      // getNotificationList(page);
      onGetNotification_InvitationData(page);
    } else {
      // setPage(1)
    }
  }, [isFocused, userData, page]);

  const getNotificationList = async page_data => {
    setLoading(true);
    const uniqueID = await deviceInfoModule.getUniqueId();
    let queryParam = `?page=${page_data}&limit=${PAGE_LIMIT}`;
    GET_DATA(
      GET_NOTIFICATIONS + queryParam,
      true,
      userData.token,
      uniqueID,
      data => {
        console.log('data===>>>>>>', data);
        setLoading(false);
        if (data?.length > 0) {
          // const temp = data.map(item => ({...item, read: false}));
          if (page_data === 1) {
            setNotificationData(data);
          } else {
            setNotificationData([...notificationData, ...data]);
          }
        }
      },
    );
  };
  //console.log('notificationData=>>', notificationData);

  const loadMoreData = () => {
    console.log('loadMoreData', page);
    if (
      notificationData.length >= page * PAGE_LIMIT &&
      notificationData.length < (page + 1) * PAGE_LIMIT
    ) {
      console.log('my game before', page);
      setPage(page + 1);

      console.log('my game', page);
      onGetNotification_InvitationData(page + 1);
    }
  };

  // const onNotificationTap = (item) => {
  //     let temp = notificationData.map((val) => {
  //     if(val.id == item.id){

  //         console.log('Returning notification New->', item.description, {...val,"description":"tatalha is a good message"});
  //         return (
  //             {...val,"description":"talha is a good message"}
  //         )
  //     }
  //     return val;
  //     });
  //     console.log('temp==>>>',temp);

  // }

  const onNotificationTap = item => {
    if (!item.read) {
      setMarkingAsRead({status: true, id: item.id});
      const uniqueID = deviceInfoModule.getUniqueId();
      let url = UPDATE_NOTIFICATIONS(item.id);
      PATCH(
        url,
        userData.token,
        uniqueID,
        {
          markAsRead: true,
        },
        (res, e) => {
          setMarkingAsRead({status: false, id: 0});
          if (!e) {
            let temp = notificationData.map(val =>
              val.id === item.id ? {...val, read: true} : val,
            );
            setNotificationData(temp);
            console.log('response', res, e);
          } else {
            console.log('PATCH_UPDATE_PROFILE (error) => ', res);
          }
        },
      );
    }
  };

  const onGetActionsData = async () => {
    setIsLoading(true);
    const uniqueID = await DeviceInfo.getUniqueId();

    GET_DATA(
      GET_ACTIONS + `${userData?.mobile}`,
      true,
      userData?.token,
      uniqueID,
      data => {
        console.log('Action Data for SB User', data);
        // data.forEach(async element => {
        //   const {name} = await sdk.GroupChannel.getChannel(
        //     element?.invitationLink,
        //   );
        //   // console.log(name.toString())
        //   element.channelname = name.toString();
        // });
        setTimeout(() => {
          setIsLoading(false);
          console.log('==> SB UIKit Data');
          console.log(data);
          console.log('---');
          setActionData(data);
        }, 1000);
      },
    );
  };

  const onGetNotification_InvitationData = async page_data => {
    if (page_data === 1) {
      setIsLoading(true);
    } else {
      setRefreshing(true);
    }

    const uniqueID = await DeviceInfo.getUniqueId();
    let queryParam = `?page=${page_data}&limit=${PAGE_LIMIT}`;
    console.log('Query Game', queryParam);
    GET_DATA(
      GET_NOTIFCATIONS_AND_INVITATIONS + `${userData?.mobile}` + queryParam,
      true,
      userData?.token,
      uniqueID,
      data => {
        console.log(
          'Action Data for SB User On Get Notification and Invitations',
          data,
          page_data,
        );
        if (data.length > 0) {
          data.forEach(async element => {
            if (element.isChannelNotification) {
              const {name} = await sdk.GroupChannel.getChannel(
                element?.invitationLink,
              );
              // console.log(name.toString())
              element.channelname = name.toString();
            }
          });
          // setActionData(data);

          setTimeout(() => {
            setIsLoading(false);
            setRefreshing(false);
            if (page_data === 1) {
              setNotificationData(data);
            } else {
              setNotificationData([...notificationData, ...data]);
            }
          }, 1000);
        }
      },
    );
  };

  //

  const onJoinGroup = async item => {
    if (item?.channelType == 'group') {
      PUT_SENDBIRD(item?.invitationLink, userData?.userId, async channel => {
        const mainchannel = await sdk.GroupChannel.getChannel(
          item?.invitationLink,
        );
        Alert.alert(
          item?.channelname,
          'Thank you for joining',
          [
            {
              text: 'Okay',
              onPress: () => {
                setTimeout(() => {
                  props.navigation.navigate(Routes.GroupChannel, {
                    serializedChannel: mainchannel.serialize(),
                  });
                }, 500);
              },
            },
          ],
          {cancelable: false},
        );
      });
    } else {
      const params = new sdk.GroupChannelParams();
      params.isSuper = false;
      params.isPublic = false;
      if (currentUser) {
        params.operatorUserIds = [currentUser.userId];
      }
      params.addUserIds([item?.invitationLink]);
      params.name = '';
      params.isDistinct = true;
      const channel = await sdk.GroupChannel.createChannel(params);
      setTimeout(() => {
        props.navigation.navigate(Routes.GroupChannel, {
          serializedChannel: channel.serialize(),
        });
      }, 500);
    }
  };

  const renderListItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.listItemContainer} key={item?.id}>
        <Text style={{...styles.listItemLabel, width: wp(70)}}>talaha</Text>
        <TouchableOpacity
          onPress={() => {
            onJoinGroup(item);
          }}
          style={{
            padding: wp(3),
            borderRadius: wp(4),
            backgroundColor: colors.PRIMARY_COLOR,
            marginRight: wp(4),
          }}>
          <Text style={{...styles.listItemLabel, color: colors.WHITE}}>
            talga
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderNotificationsList = ({item}) => {
    if (!item.isChannelNotification) {
      return (
        <TouchableOpacity
          style={{backgroundColor: item.read ? '#FFFFFF' : '#C2C2C2'}}
          onPress={() => onNotificationTap(item)}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: wp(2),
              paddingHorizontal: wp(4),
              marginTop: wp(2),
              height: wp(15),
            }}>
            {markingAsRead.id === item.id && markingAsRead.status ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size={'small'} color={'#000000'} />
              </View>
            ) : (
              <View style={{alignItems: 'flex-start'}}>
                <Text style={{fontWeight: '500'}}>
                  {'Title : '}
                  <Text style={{fontWeight: '600'}}>{item.title}</Text>
                </Text>
                <Text style={{fontWeight: '500'}}>
                  {'Description : '}
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: wp(3.8),
                      fontWeight: '500',
                    }}>
                    {item.description}
                  </Text>
                </Text>
              </View>
            )}
          </View>
          <Spacer space={hp(0.6)} />
          <BorderContainer />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.listItemContainer} key={item?.id}>
          <Text
            style={{
              ...styles.listItemLabel,
              width: wp(70),
            }}>{`${getrelamContactName(item.sender)} has invited you to join ${
            item?.channelType == 'group'
              ? item?.channelname || ''
              : 'Individual Chat'
          }`}</Text>
          <TouchableOpacity
            onPress={() => {
              onJoinGroup(item);
            }}
            style={{
              padding: wp(3),
              borderRadius: wp(4),
              backgroundColor: colors.PRIMARY_COLOR,
              marginRight: wp(4),
            }}>
            <Text style={{...styles.listItemLabel, color: colors.WHITE}}>
              {'Join'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
  };

  const renderJoinListItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.listItemContainer} key={item?.id}>
        <Text
          style={{
            ...styles.listItemLabel,
            width: wp(70),
          }}>{`${getrelamContactName(item.sender)} has invited you to join ${
          item?.channelType == 'group'
            ? item?.channelname || ''
            : 'Individual Chat'
        }`}</Text>
        <TouchableOpacity
          onPress={() => {
            onJoinGroup(item);
          }}
          style={{
            padding: wp(3),
            borderRadius: wp(4),
            backgroundColor: colors.PRIMARY_COLOR,
            marginRight: wp(4),
          }}>
          <Text style={{...styles.listItemLabel, color: colors.WHITE}}>
            {'Join'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (refreshing) {
      return <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />;
    } else {
      return null;
    }
  };

  return (
    <GlobalFlex>
      <Spacer space={hp(1)} />
      <BackHeader
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={Strings.notifications}
      />
      <Spacer space={hp(1)} />
      <View style={{flex: 1}}>
        {isLoading == true ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={colors.PRIMARY_COLOR} />
          </View>
        ) : notificationData.length > 0 ? (
          <FlatList
            style={{flex: 1}}
            data={notificationData}
            renderItem={renderNotificationsList}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            refreshing={refreshing}
          />
        ) : (
          <View style={{justifyContent: 'center', flex: 1}}>
            <Text style={{...styles.listItemLabel, textAlign: 'center'}}>
              {'No notification found'}
            </Text>
          </View>
        )}
      </View>
    </GlobalFlex>
  );
};
