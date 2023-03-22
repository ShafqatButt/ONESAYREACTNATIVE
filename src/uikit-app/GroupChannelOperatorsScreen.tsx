// @ts-ignore
import React, {useState} from 'react';
import {Alert} from 'react-native';
import {
  UserActionBar,
  useSendbirdChat,
  createGroupChannelMembersFragment,
} from '@sendbird/uikit-react-native/src';
import {useBottomSheet} from '@sendbird/uikit-react-native-foundation';
import AddOperatorsButton from './components/AddOperatorsButton';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {Routes} from '../libs/navigation';
import {CONST_TYPES, getChannelWithCustomType, underDevelopment} from './index';
import Strings from '../string_key/Strings';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();

const GroupChannelOperatorsScreen = () => {
  const {navigation, params} = useAppNavigation<Routes.GroupChannelInvite>();

  // @ts-ignore
  const {sdk} = useSendbirdChat();
  const [channel] = useState(() =>
    sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
  );
  const [renderKey, setRenderKey] = useState(21113);

  const {openSheet} = useBottomSheet();

  const identifier =
    getChannelWithCustomType(channel).customType === CONST_TYPES.ROOM_GROUP
      ? 'Admin'
      : 'Operator';

  // ActionAddMembers: false, // TODO: Need to handle on Members screen and Admins/Operators screen
  // ActionInviteUsersViaLink: false,
  // ActionAddOperators: false, // TODO: Need to handle on Members screen and Admins/Operators screen
  // ActionDeleteMembers: false, // TODO: Need to handle on Members screen and Admins/Operators screen
  // ActionBanMembers: false, // TODO: Need to handle on Members screen and Admins/Operators screen
  // ActionMuteMembers: false, // TODO: Need to handle on Members screen and Admins/Operators screen
  // ActionReportMembers: false, // TODO: Need to handle on Members screen and Admins/Operators screen
  // ActionFreezeChannel: false, // TODO: Need to handle on Members screen and Admins/Operators screen

  const demoteOperator = user => {
    Alert.alert(
      `${Strings.demote} ${identifier}`,
      `${Strings.are_you_sure_dismiss_memeber} ${identifier.toLowerCase()}?`,
      [
        {
          text: `${Strings.demote} ${identifier}`,
          onPress: () => {
            channel.removeOperators([user.userId], (_res, _err) =>
              setRenderKey(prevState => ++prevState),
            );
          },
        },
        {
          text: Strings.Cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  const getStringForValue = val => {
    if (val.toLowerCase().includes('opera')) {
      return Strings.operator;
    } else if (val.toLowerCase().includes('admi')) {
      return Strings.admin;
    }

    return val;
  };

  return (
    <GroupChannelMembersFragment
      key={renderKey}
      // @ts-ignore
      showSave={false}
      channel={channel}
      headerTitle={`${getStringForValue(identifier)}s`}
      onPressHeaderLeft={() => navigation.goBack()}
      onPressHeaderRight={() => {
        // navigation.navigate(Routes.GroupChannelInvite, params);
      }}

      // flatListProps={{
      //   ListFooterComponent: () => (
      //     <Text
      //       style={{
      //         textAlign: 'center',
      //         fontFamily: fonts.MEDIUM,
      //         color: colors.PRIMARY_COLOR,
      //         fontSize: wp('3.8%'),
      //       }}>
      //       Messages and calls are end-to-end encrypted.{'\n'}No one outside
      //       this chat, not even Buzzmi,{'\n'}can read or listen to them.
      //     </Text>
      //   ),
      // }}


      renderUser={user => (
        <UserActionBar
          disabled={false}
          name={
            user?.nickname?.length > 0 ? user?.nickname : `(${Strings.no_name})`
          }
          label={
            channel.creator.userId === user.userId
              ? Strings.owner
              : getStringForValue(identifier)
          }
          uri={user.profileUrl}
          muted={user.isMuted}
          onPressActionMenu={() => {
            if (channel.creator.userId !== user.userId) {
              openSheet({
                sheetItems: [
                  {
                    titleColor: 'red',
                    title: `${Strings.dismiss_from} ${identifier}`,
                    onPress: () => demoteOperator(user),
                  },
                  {
                    title: Strings.Cancel,
                    titleColor: '#0577f6',
                    onPress: () => console.log('Cancel'),
                  },
                ],
              });
            }
          }}
        />
      )}

      flatListProps={{
        ListFooterComponent: () => (
          <Text>{Strings.sa_str_end_to_end_encrypted}</Text>
        ),
      }}

      topListItem={
        <AddOperatorsButton
          identifier={identifier}
          onPress={() => {
            navigation.navigate(Routes.GroupChannelMembers, {
              ...params,
              // @ts-ignore
              onRefresh: () => setRenderKey(prevState => ++prevState),
            });
          }}
        />
      }
    />
  );
};

export default GroupChannelOperatorsScreen;
