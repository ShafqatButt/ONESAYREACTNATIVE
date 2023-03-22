// noinspection ES6CheckImport

import React, {useEffect, useState} from 'react';
import {
  AppState,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {CHECK_SENDBIRD_USER} from '../../../../api_helper/Api';
import {BackHeader} from '../../../../components/BackHeader';
import AlphabetList from 'react-native-flatlist-alphabet';
import {GlobalFlex} from '../../../../res/globalStyles';
import {POST} from '../../../../api_helper/ApiServices';
import {TextInput} from 'react-native-gesture-handler';
import Loading from '../../../../components/Loading';
import DeviceInfo from 'react-native-device-info';
import {Spacer} from '../../../../res/spacer';
import {colors} from '../../../../res/colors';
import {images} from '../../../../res/images';
import Contacts from 'react-native-contacts';
import {fonts} from '../../../../res/fonts';
import realm from '../../../../realmStore';
import {styles} from './style';
import {CONST_TYPES} from '../../../../uikit-app';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {useStorePhoneContactsRealm} from '../../../../hooks/useStorePhoneContactsRealm';
import {ActivityIndicator} from 'react-native';
import Strings from "../../../../string_key/Strings";

export default NewChatContainer = props => {
  const appState = React.useRef(AppState.currentState);
  const refContactsData = React.useRef([
    ...realm.objects('Contact').sorted('givenName'),
  ]);
  const [search, setSearchQuery] = useState('');
  const [addContact, syncContacts, getContacts, syncContactsIfRequired] =
    useStorePhoneContactsRealm();
  const [loading, setLoading] = useState(false);
  const {sdk, currentUser} = useSendbirdChat();
  const [contactData, setContactData] = useState(refContactsData?.current);
  const [showAlphabets, setShowAlphabets] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowAlphabets(() => true);
    }, 1500);
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
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log('App has come to the foreground!');
        refContactsData.current = null;
        setContactData(() => []);
        syncContacts(contacts => {
          refContactsData.current = contacts;
          setContactData(() => refContactsData.current);
        });
      }

      appState.current = nextAppState;
      //console.log('AppState', appState.current);
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
    console.log('postData ===> ', JSON.stringify(postData));
    POST(
      CHECK_SENDBIRD_USER,
      true,
      JSON.parse(userData).token,
      uniqueID,
      postData,
      async data => {
        setLoading(false);
        console.log('data ==> ', data);
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

            console.log('_data (2) _data ===> ', _data, channel.members);

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

  return (
    <GlobalFlex>
      <BackHeader
        isLeftText={true}
        background={{
          backgroundColor: colors.PRIMARY_COLOR,
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
        }}
        textColor={{color: colors.WHITE}}
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={Strings.new_chat}
      />
      <View style={{backgroundColor: colors.PRIMARY_COLOR}}>
        <Spacer space={hp(0.4)} />
        <View style={styles.search_wrapper}>
          <Image source={images.search_ic} style={styles.search_ic} />
          <TextInput
            placeholder={Strings.search}
            placeholderTextColor={colors.OSLO_GRAY}
            value={search}
            onChangeText={val => {
              setSearchQuery(val);
              refContactsData.current = null;
              refContactsData.current = JSON.parse(
                JSON.stringify(
                  realm
                    .objects('Contact')
                    .sorted('givenName')
                    .filtered(
                      'givenName CONTAINS[c] $0 OR familyName CONTAINS[c] $0 ',
                      val,
                    ),
                ),
              );
              setContactData(() => refContactsData.current);
            }}
            style={styles.Input}
            clearButtonMode={'always'}
          />
        </View>
        <Spacer space={hp(0.6)} />
      </View>
      <View style={{flex: 1, backgroundColor: colors.WHITE}}>
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => {
            props.navigation.navigate('CreateGroupChannel', {
              is_channel: false,
            });
          }}>
          <Image
            resizeMode={'contain'}
            source={images.new_group}
            style={{width: wp(5), height: wp(5)}}
          />
          <Text
            style={{
              ...styles.listItemLabel,
              color: colors.PRIMARY_COLOR,
              fontFamily: fonts.MEDIUM,
            }}>
            {Strings.new_group}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => {
            setSearchQuery('');
            Contacts.openContactForm({}).then(contact => {
              if (Platform.OS === 'android') {
                return;
              }
              if (contact === undefined) {
                console.log('Contact form cancelled!');
                return;
              }
              console.log('Contact saved => ', contact);

              addContact(contact, () => {
                refContactsData.current = [
                  ...realm.objects('Contact').sorted('givenName'),
                ];
                setContactData(() => refContactsData.current);
              });
            });
          }}>
          <Image
            resizeMode={'contain'}
            source={images.new_contact}
            style={{width: wp(5), height: wp(5)}}
          />
          <Text
            style={{
              ...styles.listItemLabel,
              color: colors.PRIMARY_COLOR,
              fontFamily: fonts.MEDIUM,
            }}>
            {Strings.new_contact}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => {
            props.navigation.navigate('CreateGroupChannel', {is_channel: true});
          }}>
          <Image
            resizeMode={'contain'}
            source={images.new_channel}
            style={{width: wp(5), height: wp(5)}}
          />
          <Text
            style={{
              ...styles.listItemLabel,
              color: colors.PRIMARY_COLOR,
              fontFamily: fonts.MEDIUM,
            }}>
            {Strings.new_channel}
          </Text>
        </TouchableOpacity>
        {contactData && contactData.length > 0 && (
          <>
            <AlphabetList
              style={{flex: 1}}
              data={contactData}
              renderItem={renderListItem}
              renderSectionHeader={renderSectionHeader}
              letterItemStyle={{height: 15}}
              indexLetterSize={13}
              indexLetterColor={
                showAlphabets ? colors.PRIMARY_COLOR : 'transparent'
              }
            />
            <Spacer space={hp(1)} />
          </>
        )}
      </View>
      <Loading visible={loading} />
    </GlobalFlex>
  );
};
