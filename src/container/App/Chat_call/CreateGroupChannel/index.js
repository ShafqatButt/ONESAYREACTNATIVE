import React, {useContext, useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity, Alert} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {images} from '../../../../res/images';
import {styles} from './style';
import {POST} from '../../../../api_helper/ApiServices';
import {CHECK_SENDBIRD_USER} from '../../../../api_helper/Api';
import realm from '../../../../realmStore';
// Third Party library
import AlphabetList from 'react-native-flatlist-alphabet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import * as Icons from 'react-native-heroicons/solid';
import DeviceInfo from 'react-native-device-info';
import {AuthContext} from '../../../../context/Auth.context';
import AsyncStorage from '@react-native-community/async-storage';
import {removeSpecialCharacters} from '../../../../uikit-app';
import Strings from '../../../../string_key/Strings';

let selectedPhones = [];
export default CreateGroupChannel = props => {
  const {is_channel} = props.route.params;
  const [search, setSerach] = useState('');
  const [mathRandom, setMathRandom] = useState(Math.random());
  const [contactData, setContactData] = useState([]);
  const [selectedContact, setSelectedContacts] = useState([]);
  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;

  useEffect(() => {
    let arr = [];
    const _contact = JSON.parse(
      JSON.stringify(realm.objects('Contact').sorted('givenName')),
    );

    _contact.map(item => {
      arr.push({
        key: item.key,
        value: item.value,
        is_checked: false,
        recordID: item.recordID,
        givenName: item.givenName,
        familyName: item.familyName,
        phoneNumber: item.phoneNumber,
        hasThumbnail: item.hasThumbnail,
        thumbnailPath: item.thumbnailPath,
      });
    });
    setContactData(arr);
    return () => {
      selectedPhones = [];
    };
  }, []);

  const renderListItem = item => {
    return (
      <TouchableOpacity
        key={mathRandom}
        style={styles.listItemContainer}
        onPress={() => {
          item.is_checked = !item.is_checked;
          // setMathRandom(Math.random());
          // if (item.is_checked == false) {
          if (selectedPhones.includes(item.phoneNumber)) {
            // selectedContact.splice(
            //   selectedContact.findIndex(a => a.recordID === item.recordID),
            //   1,
            // );
            selectedPhones.splice(
              selectedPhones.findIndex(a => a == item.phoneNumber),
              1,
            );
            setSelectedContacts(prevState => {
              return prevState.filter(a => a.recordID !== item.recordID);
            });
          } else {
            // selectedContact.push(item);
            setSelectedContacts(prevState => {
              return [...prevState, item];
            });
            selectedPhones.push(item.phoneNumber);
          }
          setMathRandom(Math.random());
        }}>
        <View style={{alignSelf: 'center'}}>
          <CheckBox
            boxType={'circle'}
            disabled={false}
            // value={item.is_checked}
            value={selectedPhones.includes(item.phoneNumber)}
            onFillColor={colors.DARK_GREEN}
            onTintColor={colors.DARK_GREEN}
            onCheckColor={colors.WHITE}
            tintColor={colors.LIGHT_GRAY}
            animationDuration={0.2}
            lineWidth={1}
            tintColors={{true: colors.DARK_GREEN, false: colors.LIGHT_GRAY}}
            onValueChange={newValue => (item.is_checked = newValue)}
            style={styles.checkbox}
          />
        </View>
        <Image
          source={item.hasThumbnail ? {uri: item.thumbnailPath} : images.avatar}
          style={{width: wp(14), height: wp(14), borderRadius: wp(10)}}
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

  const onNext = async () => {
    if (selectedPhones.length > 0) {
      let realmFilter; // relam filter for name retrive
      let nonSendBirdUserPhone = []; // for push nonsendbird user phone
      let nonSendBirdUserName = []; // for push nonsendbird user name
      let sendBirdUser = [];
      let sendBirdUserPhone = [];
      let sendBirdFilterContacts = [];
      let nonsendBirdFilterContacts = [];
      let postData = {
        mobileNumbers: selectedPhones,
      };
      const userDetails = await AsyncStorage.getItem('userDetails').then(
        _data => JSON.parse(_data),
      );
      const uniqueID = await DeviceInfo.getUniqueId();

      POST(
        CHECK_SENDBIRD_USER,
        true,
        userDetails.token,
        uniqueID,
        postData,
        data => {
          console.log(data);
          if (data instanceof Array) {
            data.map(Item => {
              if (Item?.isSendBirdUser == true) {
                sendBirdUser.push(Item);
                sendBirdUserPhone.push(Item.mobile);
              } else {
                nonSendBirdUserPhone.push(Item.mobile);
              }
            });
            setTimeout(() => {
              realmFilter =
                nonSendBirdUserPhone.length > 0
                  ? [
                      Array(nonSendBirdUserPhone.length)
                        .fill()
                        .map((x, i) => `phoneNumber == $${i}`)
                        .join(' OR '),
                    ].concat(nonSendBirdUserPhone)
                  : [];
              let data = new Promise((resolve, reject) => {
                if (realmFilter.length > 0) {
                  const _contacts = JSON.parse(
                    JSON.stringify(
                      realm.objects('Contact').filtered(...realmFilter),
                    ),
                  );
                  _contacts.forEach((value, index, array) => {
                    nonsendBirdFilterContacts.push(value);
                    nonSendBirdUserName.push(value.value);
                    resolve();
                  });
                }
              });

              let realm_Filter =
                sendBirdUserPhone.length > 0
                  ? [
                      Array(sendBirdUserPhone.length)
                        .fill()
                        .map((x, i) => `phoneNumber == $${i}`)
                        .join(' OR '),
                    ].concat(sendBirdUserPhone)
                  : [];
              if (realm_Filter.length > 0) {
                const _contacts = JSON.parse(
                  JSON.stringify(
                    realm.objects('Contact').filtered(...realm_Filter),
                  ),
                );
                _contacts.forEach((value, index, array) => {
                  sendBirdFilterContacts.push(value);
                });
              }

              if (realmFilter.length > 0) {
                data.then(() => {
                  Alert.alert(
                    Strings.invite_user,
                    nonSendBirdUserName.toString() +
                      Strings.are_not_memeber_of_onesay,
                    [
                      {
                        text: Strings.yes,
                        onPress: () =>
                          props.navigation.navigate('CreateNext', {
                            invite_send: true,
                            sendBirdFilterContacts: sendBirdFilterContacts,
                            sendBirdUser: sendBirdUser,
                            nonSendBirdUserPhone: nonSendBirdUserPhone,
                            nonsendBirdFilterContacts:
                              nonsendBirdFilterContacts,
                            is_channel: is_channel,
                          }),
                      },
                      {
                        text: Strings.no,
                        onPress: () =>
                          props.navigation.navigate('CreateNext', {
                            invite_send: false,
                            sendBirdFilterContacts: sendBirdFilterContacts,
                            sendBirdUser: sendBirdUser,
                            is_channel: is_channel,
                          }),
                      },
                    ],
                  );
                });
              } else {
                props.navigation.navigate('CreateNext', {
                  invite_send: false,
                  sendBirdFilterContacts: sendBirdFilterContacts,
                  sendBirdUser: sendBirdUser,
                  is_channel: is_channel,
                });
              }
            }, 1000);
          } else {
            alert(data);
          }
        },
      );
    } else {
      alert(Strings.please_select_users);
    }
  };

  return (
    <GlobalFlex>
      <BackHeader
        rightText={Strings.next}
        isRightText={true}
        isLeftText={true}
        background={{
          backgroundColor: colors.PRIMARY_COLOR,
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
        }}
        textColor={{color: colors.WHITE}}
        onNextPress={() => onNext().then()}
        onBackPress={() => props.navigation.goBack()}
        is_center_text
        title={is_channel ? Strings.new_channel : Strings.new_group}
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
              setSerach(val);
              let arr = [];
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
              _contacts.map(item => {
                arr.push({
                  key: item.key,
                  value: item.value,
                  is_checked: false,
                  recordID: item.recordID,
                  givenName: item.givenName,
                  familyName: item.familyName,
                  phoneNumber: item.phoneNumber,
                  hasThumbnail: item.hasThumbnail,
                  thumbnailPath: item.thumbnailPath,
                });
              });
              setContactData(() => arr);
            }}
            style={styles.Input}
            clearButtonMode={'always'}
          />
        </View>
        <Spacer space={hp(0.6)} />
      </View>
      {selectedContact.length > 0 && (
        <View>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            {selectedContact.map(item => {
              return (
                <View style={{width: wp(22)}}>
                  <View style={{margin: wp(2), justifyContent: 'center'}}>
                    <Image
                      source={
                        item.hasThumbnail
                          ? {uri: item.thumbnailPath}
                          : images.avatar
                      }
                      style={{
                        width: wp(14),
                        height: wp(14),
                        borderRadius: wp(10),
                        alignSelf: 'center',
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.listItemLabel,
                        fontSize: wp(2.8),
                        marginLeft: 0,
                      }}>
                      {item.value}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      // setMathRandom(Math.random());
                      // selectedContact.splice(
                      //   selectedContact.findIndex(
                      //     a => a.recordID === item.recordID,
                      //   ),
                      //   1,
                      // );
                      setSelectedContacts(prevState =>
                        prevState.filter(a => a.recordID !== item.recordID),
                      );
                      selectedPhones.splice(
                        selectedPhones.findIndex(a => a == item.phoneNumber),
                        1,
                      );
                      setMathRandom(Math.random());
                      // contactData.map(val => {
                      //   if (val.recordID == item.recordID) {
                      //     console.log('call');
                      //     val.is_checked = false;
                      //   }
                      // });
                    }}
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      right: wp(2),
                      top: wp(2),
                    }}>
                    <Icons.XCircleIcon
                      color={colors.DARK_GRAY_91}
                      size={wp(5)}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={{flex: 1, backgroundColor: colors.WHITE}}>
        {contactData && contactData.length > 0 && mathRandom && (
          <>
            <AlphabetList
              style={{flex: 1}}
              data={contactData}
              renderItem={renderListItem}
              renderSectionHeader={renderSectionHeader}
              letterItemStyle={{height: 20}}
              indexLetterColor={colors.PRIMARY_COLOR}
            />
            <Spacer space={hp(1)} />
          </>
        )}
      </View>
    </GlobalFlex>
  );
};
