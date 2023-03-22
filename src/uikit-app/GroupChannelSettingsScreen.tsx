// @ts-ignore
import React, {useState, useEffect} from 'react';
import {createGroupChannelSettingsFragment} from '@sendbird/uikit-react-native/src';
import {GET_SENDBIRD_OPERATOR_PERMISSION} from '../api_helper/Api';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import ReportChannelModal from './components/ReportChannelModal';
import AsyncStorage from '@react-native-community/async-storage';
import {CONST_TYPES, getChannelWithCustomType} from './index';
import {useAppNavigation} from '../hooks/useAppNavigation';
import DeviceInfo from 'react-native-device-info';
import {GET} from '../api_helper/ApiServices';
import {Routes} from '../libs/navigation';

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment();

const GroupChannelSettingsScreen = () => {
  // @ts-ignore
  const {sdk, currentUser} = useSendbirdChat();
  const [showReportModal, setShowReportModal] = useState(false);
  const {navigation, params} = useAppNavigation<Routes.GroupChannelSettings>();
  const [channel, setChannel] = useState(() =>
    sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
  );

  const identifier =
    getChannelWithCustomType(channel).customType === CONST_TYPES.ROOM_GROUP
      ? 'Group'
      : 'Channel';

  const [permissions, setPermissions] = useState({
    ActionChangeGroupInfo: identifier === 'Group',
    ActionAddMembers: identifier === 'Group',
    ActionInviteUsersViaLink: identifier === 'Group',
    ActionAddOperators: identifier === 'Group',
    ActionDeleteMembers: identifier === 'Group',
    ActionBanMembers: identifier === 'Group',
    ActionMuteMembers: identifier === 'Group',
    ActionReportMembers: identifier === 'Group',
    ActionFreezeChannel: identifier === 'Group',
  });

  const isOwner = channel?.creator?.userId === currentUser?.userId;

  const getPermissions = async () => {
    const uniqueID = await DeviceInfo.getUniqueId();
    const user = await AsyncStorage.getItem('userDetails');

    const api = GET_SENDBIRD_OPERATOR_PERMISSION(
      currentUser.userId,
      channel.url,
    );

    GET(api, JSON.parse(user).token, uniqueID)
      .then(res => {
        console.log('res?.data?.permissions ===> ', res?.data?.permissions);
        setPermissions(res?.data?.permissions);
        console.log(
          'GET_SENDBIRD_OPERATOR_PERMISSION (response) =>',
          JSON.stringify(res.data),
        );
      })
      .catch(e =>
        console.log('GET_SENDBIRD_OPERATOR_PERMISSION (error) => ', e.message),
      );
  };

  useEffect(() => {
    if (!isOwner && identifier !== 'Group') {
      if (channel?.creator === null) {
        channel.refresh(ch => {
          setChannel(ch);
        });
        return;
      }

      getPermissions().then();
    }
  }, []);

  return (
    <>
      <GroupChannelSettingsFragment
        channel={channel}
        isOwner={isOwner}
        permissions={permissions}
        onReportChannel={() => setShowReportModal(() => true)}
        onPressHeaderLeft={() => navigation.goBack()}
        // @ts-ignore
        onPressMenuMembers={showOperators => {
          let _params = params;

          channel.refresh(ch => {
            _params = {..._params, serializedChannel: ch.serialize()};
            if (showOperators) {
              // @ts-ignore
              navigation.navigate(Routes.GroupChannelOperators, _params);
            } else {
              navigation.navigate(Routes.GroupChannelMembers, _params);
            }
          });
        }}
        onPressMenuLeaveChannel={() => {
          // Navigate to group channel list
          navigation.navigate(Routes.GroupChannelList);
        }}
      />
      <ReportChannelModal
        transparent={true}
        animationType={'fade'}
        identifier={identifier}
        visible={showReportModal}
        onHideModal={() => setShowReportModal(() => false)}
        onReport={shouldExit => {
          setShowReportModal(() => false);
          setTimeout(() => {
            // @ts-ignore
            navigation.navigate('ReportUser', {
              channelUrl: channel?.url,
              isSuper: channel?.isSuper,
              onDismiss: () => {
                if (shouldExit) {
                  channel
                    .leave((c, e) => {
                      console.log('leave (channel) => ', c);
                      console.log('leave (error) => ', e);
                    })
                    .then();
                }
              },
            });
          }, 500);
        }}
      />
    </>
  );
};

export default GroupChannelSettingsScreen;
