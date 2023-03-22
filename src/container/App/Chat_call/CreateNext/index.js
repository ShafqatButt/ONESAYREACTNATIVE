import React, {useContext, useState, useEffect, useCallback} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {images} from '../../../../res/images';
import {styles} from './style';
import {POST} from '../../../../api_helper/ApiServices';
import {INVITE_SEND_BIRD_USER} from '../../../../api_helper/Api';
import {AuthContext} from '../../../../context/Auth.context';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {
  useLocalization,
  usePlatformService,
  useSendbirdChat,
} from '@sendbird/uikit-react-native/src';
import {Logger} from '@sendbird/uikit-utils';
import {fonts} from '../../../../res/fonts';
import {ActionMenu, useToast} from '@sendbird/uikit-react-native-foundation';
import {Routes} from '../../../../libs/navigation';
import DeviceInfo from 'react-native-device-info';
import {compressImage, CONST_TYPES} from '../../../../uikit-app';
import Strings from '../../../../string_key/Strings';

export default CreateNextContainer = props => {
  const {invite_send} = props.route.params;
  const {sendBirdUser} = props.route.params;
  const {nonsendBirdFilterContacts} = props.route.params;
  const {sendBirdFilterContacts} = props.route.params;
  const {nonSendBirdUserPhone} = props.route.params;
  const {is_channel} = props.route.params;

  const [txtChannel, setTextChannel] = useState('');
  const [filename, setFileName] = useState(null);
  const [visible, setVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;
  const {sdk, currentUser} = useSendbirdChat();
  const {STRINGS} = useLocalization();
  const {fileService} = usePlatformService();

  const toast = useToast();

  const renderListItem = ({item}) => (
    <TouchableOpacity style={styles.listItemContainer}>
      <Image
        source={item.hasThumbnail ? {uri: item.thumbnailPath} : images.avatar}
        style={{width: wp(14), height: wp(14), borderRadius: wp(10)}}
      />
      <Text style={styles.listItemLabel}>{item.value}</Text>
    </TouchableOpacity>
  );

  const defaultUserIdsGenerator = users => {
    const userIds = users
      .map(user => {
        return user.sendBirdId;
      })
      .filter(u => Boolean(u));
    if (userIds.length === 0) {
      Logger.warn(
        'GroupChannelCreateFragment: Couldn\'t find user ids! if you provide "queryCreator", please provide "userIdsGenerator" as well',
      );
    }
    return userIds;
  };

  function navigateToGroupChannelScreen(channel) {
    props.navigation.pop();
    props.navigation.pop();
    props.navigation.pop();
    // setTimeout(() => {
    // props.navigation.replace(Routes.GroupChannelTabs);

    setTimeout(() => {
      props.navigation.navigate('chat', {
        screen: Routes.GroupChannel,
        params: {
          serializedChannel: channel.serialize(),
        },
      });
    }, 500);
    // }, 250);
  }

  const onCreateChannel = async sendBirdUser => {
    if (txtChannel == '') {
      alert(
        is_channel
          ? Strings.please_enter_channel_name
          : Strings.please_enter_group_name,
      );
    } else {
      setIsLoading(true);
      const params = new sdk.GroupChannelParams();
      params.isSuper = is_channel ? true : false;
      params.isPublic = true;
      params.isEphemeral = false;
      if (currentUser) {
        params.operatorUserIds = [currentUser.userId];
      }

      params.addUserIds(defaultUserIdsGenerator(sendBirdUser));
      params.name = txtChannel;
      params.coverImage = filename;
      // params.isDistinct = is_channel
      //   ? false
      //   : sendBirdUser.length >= 1
      //   ? false
      //   : true;
      params.isDistinct = false;
      // params.customType =
      //   sendBirdUser.length > 1
      //     ? is_channel
      //       ? CONST_TYPES.ROOM_CHANNEL
      //       : CONST_TYPES.ROOM_GROUP
      //     : CONST_TYPES.ROOM_DIRECT;
      params.customType = is_channel
        ? CONST_TYPES.ROOM_CHANNEL
        : CONST_TYPES.ROOM_GROUP;

      const channel = await sdk.GroupChannel.createChannel(params);
      let postData = {
        mobileNumbers: nonSendBirdUserPhone,
        channelType: channel?.channelType,
        invitationLink: channel?.url,
      };
      const userData = await AsyncStorage.getItem('userDetails');
      const uniqueID = await DeviceInfo.getUniqueId();
      console.log(
        'JSON.parse(userData).token ===> ',
        JSON.parse(userData).token,
      );
      if (invite_send) {
        POST(
          INVITE_SEND_BIRD_USER,
          true,
          JSON.parse(userData).token,
          uniqueID,
          postData,
          data => {
            setIsLoading(false);
            if (data?.message == 'SUCCESS') {
              navigateToGroupChannelScreen(channel);
            }
          },
        );
      } else {
        setIsLoading(false);
        navigateToGroupChannelScreen(channel);
      }
    }
  };

  return (
    <GlobalFlex>
      <BackHeader
        isLoading={isLoading}
        rightText={Strings.create}
        isRightText={true}
        isLeftText={true}
        background={{
          backgroundColor: colors.PRIMARY_COLOR,
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
        }}
        textColor={{color: colors.WHITE}}
        onNextPress={() => {
          onCreateChannel(sendBirdUser);
        }}
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={is_channel ? Strings.create_channel : Strings.create_group}
      />
      <View
        style={{
          flexDirection: 'row',
          width: wp(92),
          alignSelf: 'center',
          paddingVertical: wp(2),
        }}>
        <TouchableOpacity
          onPress={() => {
            setVisible(!visible);
          }}>
          <Image
            source={filename != null ? {uri: filename?.uri} : images.avatar}
            style={{width: wp(14), height: wp(14), borderRadius: wp(10)}}
          />
        </TouchableOpacity>
        <TextInput
          autoCapitalize="none"
          value={txtChannel}
          onChangeText={value => setTextChannel(value)}
          style={{
            fontSize: wp(4.8),
            fontFamily: fonts.BOLD,
            padding: wp(5),
            flex: 1,
            color: colors.REGULAR_TEXT_COLOR,
          }}
          placeholder={
            is_channel ? Strings.create_channel : Strings.create_group
          }
          placeholderTextColor={colors.DARK_BORDER_GRAY}
        />
      </View>

      <ActionMenu
        onHide={() => {
          setVisible(false);
        }}
        onDismiss={() => {
          setVisible(false);
        }}
        visible={visible}
        title={Strings.change_channel_image}
        menuItems={[
          {
            title: Strings.take_photo,
            onPress: async () => {
              const file = await fileService.openCamera({
                mediaType: 'photo',
                onOpenFailureWithToastMessage: () =>
                  toast.show(Strings.error_open_camera, 'error'),
              });
              if (!file) {
                return;
              }

              const compressed = await compressImage(file);
              setFileName(compressed);
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

              const compressed = await compressImage(files[0]);

              setFileName(compressed);
            },
          },
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, backgroundColor: colors.LIGHT_GRAY_BG}}>
          {sendBirdFilterContacts && sendBirdFilterContacts.length > 0 && (
            <>
              <Text
                style={{
                  ...styles.listItemLabel,
                  fontSize: wp(2.8),
                  marginLeft: wp(3),
                  alignSelf: 'flex-start',
                  paddingVertical: wp(2),
                }}>
                {Strings.members}
              </Text>
              <FlatList
                style={{flex: 1}}
                data={sendBirdFilterContacts}
                renderItem={renderListItem}
                keyExtractor={item => item?.recordID}
              />
              {invite_send == false && <Spacer space={hp(1)} />}
            </>
          )}

          {invite_send &&
            nonsendBirdFilterContacts &&
            nonsendBirdFilterContacts.length > 0 && (
              <>
                <Text
                  style={{
                    ...styles.listItemLabel,
                    fontSize: wp(2.8),
                    marginLeft: wp(3),
                    alignSelf: 'flex-start',
                    paddingVertical: wp(2),
                  }}>
                  {Strings.invite_members}
                </Text>
                <FlatList
                  style={{flex: 1}}
                  data={nonsendBirdFilterContacts}
                  renderItem={renderListItem}
                  keyExtractor={item => item?.recordID}
                />
              </>
            )}
        </View>
        <Spacer space={hp(1)} />
      </ScrollView>
    </GlobalFlex>
  );
};
