// @ts-ignore
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import styles, {
  ClearIcon,
  SearchIcon,
  ClearButton,
  SearchInput,
  SearchBarContainerMember,
} from './GroupChannelTabs/styles';
import {
  useSendbirdChat,
  createGroupChannelMembersFragment,
} from '@sendbird/uikit-react-native/src';
import {CONST_TYPES, getChannelWithCustomType, underDevelopment} from './index';
import {GET_SENDBIRD_OPERATOR_PERMISSION} from '../api_helper/Api';
import AsyncStorage from '@react-native-community/async-storage';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {useEventEmitter} from '../hooks/useEventEmitter';
import DeviceInfo from 'react-native-device-info';
import {GET} from '../api_helper/ApiServices';
import Strings from '../string_key/Strings';
import {Routes} from '../libs/navigation';
import {images} from '../res/images';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();

export const SearchComponentForMembers = props => {
  const {onQuery} = props;
  const [query, setQuery] = useState('');

  useEffect(() => onQuery(query), [query]);

  return (
    <SearchBarContainerMember>
      <SearchIcon style={styles.searchIconStyle} source={images.search_ic} />
      <SearchInput
        value={query}
        placeholder={'Search'}
        placeholderTextColor={'#7b7d83'}
        onChangeText={val => setQuery(() => val)}
      />
      <ClearButton
        disabled={query.length <= 0}
        isActive={query.length > 0}
        onPress={() => setQuery(() => '')}>
        <ClearIcon source={images.iconDecline_3x} />
      </ClearButton>
    </SearchBarContainerMember>
  );
};

const GroupChannelMembersScreen = () => {
  const {navigation, params} = useAppNavigation<Routes.GroupChannelInvite>();
  // @ts-ignore
  const {onRefresh} = params;
  // @ts-ignore
  const {sdk, currentUser} = useSendbirdChat();
  const [channel, setChannel] = useState(() =>
    sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
  );
  const [renderKey, setRenderKey] = useState(32113);
  const [permissions, setPermissions] = useState({
    ActionChangeGroupInfo: false,
    ActionAddMembers: false,
    ActionInviteUsersViaLink: false,
    ActionAddOperators: false,
    ActionDeleteMembers: false,
    ActionBanMembers: false,
    ActionMuteMembers: false,
    ActionReportMembers: false,
    ActionFreezeChannel: false,
  });

  const isOwner = channel.creator.userId === currentUser.userId;

  const identifier =
    getChannelWithCustomType(channel).customType === CONST_TYPES.ROOM_GROUP
      ? 'Admin'
      : 'Operator';

  const getStringForValue = val => {
    if (val.toLowerCase().includes('opera')) {
      return Strings.operator;
    } else if (val.toLowerCase().includes('admi')) {
      return Strings.admin;
    }

    return val;
  };

  const [searchQuery, setSearchQuery] = useState('');
  useEventEmitter('channel-update', data => {
    console.log('channel-update ==> ', JSON.stringify(data));
    if (data?.userLeftChannel?.userId === currentUser?.userId) {
      // navigation.navigate(Routes.GroupChannelList);
      channel.refresh(ch => {
        setChannel(() => ch);
        setRenderKey(prevState => ++prevState);
      });
    } else if (
      data?.userJoinnedChannel?.userId !== currentUser?.userId ||
      data?.operatorCountUpdated
    ) {
      channel.refresh(ch => {
        setChannel(() => ch);
        setRenderKey(prevState => ++prevState);
      });
    }
  });
  const getPermissions = async () => {
    const uniqueID = await DeviceInfo.getUniqueId();
    const user = await AsyncStorage.getItem('userDetails');

    const api = GET_SENDBIRD_OPERATOR_PERMISSION(
      currentUser.userId,
      channel.url,
    );

    GET(api, JSON.parse(user).token, uniqueID)
      .then(res => {
        setPermissions(() => res?.data?.permissions);
        setRenderKey(prevState => ++prevState);
      })
      .catch(e =>
        console.log('GET_SENDBIRD_OPERATOR_PERMISSION (error) => ', e.message),
      );
  };

  useEffect(() => {
    if (isOwner || channel.myRole === 'operator') {
      getPermissions().then();
    }
  }, []);

  const promoteAsOperator = user => {
    Alert.alert(
      user.role === 'operator'
        ? `${Strings.demote} ${getStringForValue(identifier)}`
        : `${Strings.promote} ${getStringForValue(identifier)}`,
      Strings.msg_are_you_sure_admin(
        user.role === 'operator' ? Strings.dismiss : Strings.promote,
        identifier.toLowerCase(),
      ),
      [
        {
          text:
            user.role === 'operator'
              ? `${Strings.demote} ${getStringForValue(identifier)}`
              : `${Strings.promote} ${getStringForValue(identifier)}`,
          onPress: () => {
            if (user.role === 'operator') {
              channel.removeOperators([user.userId], (_res, _err) => {
                if (onRefresh) {
                  onRefresh();
                }
                setRenderKey(prevState => ++prevState);
              });
              return;
            }

            if (
              getChannelWithCustomType(channel).customType ===
              CONST_TYPES.ROOM_GROUP
            ) {
              channel.addOperators([user.userId], (res, e) => {
                if (onRefresh) {
                  navigation.goBack();
                  onRefresh();
                } else {
                  setRenderKey(prevState => ++prevState);
                }
              });
            } else {
              // @ts-ignore
              navigation.navigate(Routes.GroupChannelOperatorPermissions, {
                ...params,
                userData: user,
                onRefresh: () => {
                  if (onRefresh) {
                    navigation.goBack();
                    onRefresh();
                  } else {
                    setRenderKey(prevState => ++prevState);
                  }
                  underDevelopment(
                    `${getStringForValue(identifier)} ${Strings.added_success}`,
                  );
                },
              });
            }
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

  const searchMemeber = () => {
    return (
      <SearchComponentForMembers
        onQuery={_text => {
          setSearchQuery(() => _text?.toLowerCase());
        }}
      />
    );
  };

  return (
    <GroupChannelMembersFragment
      key={renderKey}
      channel={channel}
      searchQuery={searchQuery}
      // @ts-ignore
      isOwner={isOwner}
      permissions={permissions}
      // @ts-ignore
      onPermoteToOperator={user => promoteAsOperator(user)}
      onPressHeaderLeft={() => navigation.goBack()}
      topListItem={searchMemeber()}
      onPressHeaderRight={() => {
        // navigation.navigate(Routes.GroupChannelInvite, params);
      }}
    />
  );
};

export default GroupChannelMembersScreen;
