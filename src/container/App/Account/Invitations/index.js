import React, {useContext, useState, useEffect, useRef} from 'react';

import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Pressable,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {images} from '../../../../res/images';
import {styles} from './style';
import {AuthContext} from '../../../../context/Auth.context';
import realm from '../../../../realmStore';
import {GET} from '../../../../api_helper/ApiServices';
import {fonts} from '../../../../res/fonts';
import {INVITE_LINK} from '../../../../api_helper/Api';
// Third Party library
import AlphabetList from 'react-native-flatlist-alphabet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CheckBox from '@react-native-community/checkbox';
import SendSMS from 'react-native-sms';

import {StyleSheet, SafeAreaView, FlatList} from 'react-native';
import Share from 'react-native-share';
import {Modalize} from 'react-native-modalize';
import QRCode from 'react-native-qrcode-svg';
import QR from 'qrcode-base64';
import Clipboard from '@react-native-community/clipboard';
import {useToast} from '@sendbird/uikit-react-native-foundation';

import Strings from '../../../../string_key/Strings';

const {share_link, whatsapp, sms, email, qr_code, copy_link} = images;

let selectedPhones = [];
export default Invitations = props => {
  const refContactsData = React.useRef([
    ...realm.objects('Contact').sorted('givenName'),
  ]);
  const [mathRandom, setMathRandom] = useState(Math.random());
  const [selectedContact, setSelectedContacts] = useState([]);

  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;

  const [search, setSearchQuery] = useState('');
  const [contactData, setContactData] = useState(refContactsData?.current);
  const [userLink, setUserLink] = useState([]);
  console.log('userLink==>>', userLink);
  const [qrCode, setQrCode] = useState();
  const [QRCodeBase64, setQRCodeBase64] = useState();

  const sheetRef = useRef();
  let qrCodeRef = useRef();
  const toast = useToast();

  const openSheet = () => {
    sheetRef?.current?.open();
  };

  const closeSheet = () => {
    sheetRef?.current?.close();
  };

  const shareHandler = () => {
    var imgData = QR.drawImg(qrCode, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: 500,
    });

    Share.open({
      type: 'image/jpg',
      title: '',
      url: imgData,
    })
      .then(res => {})
      .catch(err => {});
  };

  const invitationsOBJNames = [
    {
      icon: share_link,
      label: Strings.share_link,
    },
    {
      icon: email,
      label: Strings.email,
    },
    {
      icon: sms,
      label: 'SMS',
    },
    {
      icon: whatsapp,
      label: 'WhatsApp',
    },
    {
      icon: qr_code,
      label: Strings.qr_code,
    },
    {
      icon: copy_link,
      label: Strings.copy_link,
    },
  ];

  const Separator = () => {
    return (
      <View
        style={{
          height: 10,
          width: 1,
          backgroundColor: 'white',
        }}
      />
    );
  };
  // const ItemRender = ({source,label}) => {
  //   // <View style={styleSheet.item}>
  //   //   <Text style={styleSheet.itemText}>{name}</Text>
  //   // </View>

  //   // <Image     style={{width: 65, height: 65, borderRadius: 65/ 2}}
  //   // source={images.plus_round} resizeMode={'contain'}
  //   // />

  //   return(
  //      <View style={{flexDirection:'row'}}>
  //     <View>
  //     <Image source={source} style={{ width: 100, height: 100}} resizeMode={'contain'} />
  //       <Text>{label}</Text>
  //       </View>
  //     </View>
  //   )

  // };

  const copyToClipboard = () => {
    Clipboard.setString(qrCode);
    toast.show(Strings.copied);
  };

  const hasAndroidPermissions = async () => {
    const perfmission = Permissionsandroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const haspermission = await PermissionsAndroid.check(permission);
    if (haspermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const shareSingleImage = async () => {
    const shareOptions = {
      title: Strings.share_file,
      failOnCancel: false,
      message: qrCode,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      setResult('error: '.concat(getErrorString(error)));
    }
  };

  const getInvitationLinkFromServer = async () => {
    const api = INVITE_LINK(userData?.userId);
    GET(api, userData?.token, '')
      .then(res => {
        let link = res.data?.link;
        setUserLink(link);
        setQrCode(link);
      })
      .catch(e => console.log('INVITATION (error) => ', e.message));
  };
  const onSendInvitation = async () => {
    const api = INVITE_LINK(userData?.userId);
    GET(api, userData?.token, '')
      .then(res => {
        SendSMS.send(
          {
            body: res.data?.link,
            recipients: selectedContact.map(a => a.phoneNumber),
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true,
          },
          (completed, cancelled, error) => {
            if (completed) {
              props.navigation.goBack();
            }
          },
        );
      })
      .catch(e => console.log('INVITATION (error) => ', e.message));
  };

  const getUserContactList = () => {
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
  };

  useEffect(() => {
    getUserContactList();
    getInvitationLinkFromServer();
  }, []);

  const renderListItem = item => {
    return (
      <TouchableOpacity
        key={mathRandom}
        style={styles.listItemContainer}
        onPress={() => {
          item.is_checked = !item.is_checked;
          if (selectedPhones.includes(item.phoneNumber)) {
            selectedPhones.splice(
              selectedPhones.findIndex(a => a == item.phoneNumber),
              1,
            );
            setSelectedContacts(prevState => {
              return prevState.filter(a => a.recordID !== item.recordID);
            });
          } else {
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
          style={{width: wp(8), height: wp(8), borderRadius: wp(8)}}
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

  return (
    <>
      <GlobalFlex>
        <BackHeader
          is_center_text
          title={Strings.no_caps_invite}
          onBackPress={() => props.navigation.goBack()}
          isRightText
          rightText={Strings.clear}
          onNextPress={() => {
            setSelectedContacts([]);
            selectedPhones.splice(0, selectedPhones.length);
            setMathRandom(Math.random());
          }}
        />

        <Spacer space={hp(1)} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={invitationsOBJNames}
          renderItem={({item, index}) => {
            return (
              <>
                <TouchableOpacity
                  style={styles.invitation_Icon_Container}
                  onPress={() => {
                    if (index == 0) {
                      shareSingleImage();
                    } else if (index == 1) {
                      // Linking.openURL(`mailto:subject=Buzzmi Invitation&body=${qrCode}`)
                      Linking.openURL(
                        `mailto:?subject=Buzzmi Invitation&body=${qrCode}`,
                      );
                    } else if (index == 2) {
                      onSendInvitation();
                    } else if (index == 3) {
                      Linking.openURL(`whatsapp://send?text=${qrCode}`);
                    } else if (index == 4) {
                      openSheet();
                    } else if (index == 5) {
                      copyToClipboard();
                    }
                  }}>
                  <View style={styles.invitation_sub_Container}>
                    <Image
                      source={item?.icon}
                      style={styles.invitation_Image_Container}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.invitation_Text_Container}>
                      {item?.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            );
          }}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={Separator}
          horizontal={true}
        />
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

        <Spacer space={hp(1)} />
        <View style={{flex: 1, backgroundColor: colors.WHITE}}>
          {contactData && contactData.length > 0 && mathRandom && (
            <>
              <AlphabetList
                style={{flex: 1}}
                data={contactData}
                renderItem={renderListItem}
                renderSectionHeader={renderSectionHeader}
                letterItemStyle={{height: 0}}
                indexLetterColor={colors.PRIMARY_COLOR}
              />
              <Spacer space={hp(1)} />
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.float_wrapper}
          disabled={selectedContact.length > 0 ? false : true}
          onPress={() => onSendInvitation()}>
          <View
            style={{
              backgroundColor:
                selectedContact.length > 0
                  ? colors.PRIMARY_COLOR
                  : colors.LIGHT_PRIMARY_COLOR,
              paddingHorizontal: wp(5),
              paddingVertical: wp(3),
              borderRadius: wp(12),
            }}>
            <Text style={{color: colors.WHITE, fontFamily: fonts.BOLD}}>
              {Strings.no_caps_invite}
            </Text>
          </View>
        </TouchableOpacity>
      </GlobalFlex>
      <Modalize ref={sheetRef} modalHeight={wp(175)} handlePosition={'inside'}>
        {/* <View>
      <BackHeader
        is_center_text
        title={'QR Code'}
        onBackPress={() => props.navigation.goBack()}
      />
      </View> */}
        <Text
          style={{
            marginTop: wp(5),
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            fontSize: wp(3.8),
            fontFamily: fonts.REGULAR,
          }}>
          {' '}
          QR Code{' '}
        </Text>

        <View
          style={{
            marginTop: wp(40),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              borderWidth: wp(3),
              width: '60%',
              borderColor: colors.HAWKES_BLUE,
              alignItems: 'center',
              borderRadius: wp(5),
              paddingVertical: wp(2),
            }}>
            <QRCode
              //  getBase64={base64 => {
              //   console.log("The base64 added", base64)
              //   setQRCodeBase64(base64);
              // }}
              size={wp(50)}
              value={qrCode}
              getRef={c => (qrCodeRef = c)}
              ref={qrCodeRef}
              logo={{}}
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: wp(25),
          }}>
          <TouchableOpacity
            onPress={shareHandler}
            style={{
              width: wp(15),
              height: wp(15),
              borderRadius: wp(50),
              alignItems: 'center',
              backgroundColor: colors.HUSKY,
              justifyContent: 'center',
            }}>
            <Image
              source={images.ic_share_qrCode}
              style={{width: wp(10), height: wp(10)}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: wp(5),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{alignSelf: 'center'}}>
            Let your friends scan this QR code to{' '}
          </Text>
          <Text>download Buzzmi.</Text>
        </View>
      </Modalize>
    </>
  );
};

// Let your friends scan QR code to download Buzzmi

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 12,
  },

  item: {
    padding: 8,
    backgroundColor: '#00C853',
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },

  image: {
    width: 150,
    height: 150,
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 75,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  button: {},

  centered: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc2c2',
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
});
