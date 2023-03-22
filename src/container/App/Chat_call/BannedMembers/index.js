import React, {useState, useEffect} from 'react';
import {Switch, View, FlatList} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {BorderContainer, Text, ActionWrapper} from './style';
import {fonts} from '../../../../res/fonts';
import {GET_SENDBIRD} from '../../../../api_helper/ApiServices';
import {GROUP_MUTE_USER} from '../../../../api_helper/Api';
import {
  ConfirmationDialog,
  getrelamContactName,
} from '../../../../commonAction';
import {useDirectNavigation} from '../../../../navigations/useDirectNavigation';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Strings from '../../../../string_key/Strings';

export default BannedMember = props => {
  const {channel} = props.route.params;
  const {type} = props.route.params;

  const [bannedUserList, setBannedUserList] = useState([]);
  const [mutedUserList, setMutedUserList] = useState([]);
  const {navigation} = useDirectNavigation();

  useEffect(() => {
    channel.createBannedUserListQuery().next(data => {
      setBannedUserList(data == null ? [] : data);
    });
    GET_SENDBIRD(GROUP_MUTE_USER(channel.url), item => {
      setMutedUserList(item.muted_list);
    });
  }, [channel]);

  const ListItem = ({item}) => {
    return (
      <>
        <ActionWrapper>
          <Text style={{marginTop: wp(2), fontFamily: fonts.MEDIUM}}>
            {getrelamContactName(item.metaData?.phone)}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Switch
              trackColor={{
                false: colors.DARK_GRAY_91,
                true: colors.LIGHT_PRIMARY_COLOR,
              }}
              thumbColor={
                item.is_banned ? colors.DARK_THUMB : colors.PRIMARY_COLOR
              }
              onValueChange={() => {
                (item.is_banned = true),
                  ConfirmationDialog(
                    {
                      title: Strings.yes,
                      subtitle: Strings.msg_sure_to_un_ban,
                      yesText: Strings.yes,
                    },
                    () => {
                      channel.unbanUserWithUserId(item.userId, data => {
                        channel.inviteWithUserIds([item.userId], data => {
                          navigation.goBack();
                        });
                      });
                    },
                  );
              }}
              value={!item.is_banned}
            />
          </View>
        </ActionWrapper>
        <BorderContainer />
      </>
    );
  };

  const MuteListItem = ({item}) => {
    return (
      <>
        <ActionWrapper>
          <Text style={{marginTop: wp(2), fontFamily: fonts.MEDIUM}}>
            {getrelamContactName(item.metadata?.phone)}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Switch
              trackColor={{
                false: colors.DARK_GRAY_91,
                true: colors.LIGHT_PRIMARY_COLOR,
              }}
              thumbColor={
                item.is_banned ? colors.DARK_THUMB : colors.PRIMARY_COLOR
              }
              onValueChange={() => {
                item.is_mute = true;
                ConfirmationDialog(
                  {
                    title: Strings.yes,
                    subtitle: Strings.msg_sure_to_un_mute,
                    yesText: Strings.yes,
                  },
                  () => {
                    channel.unmuteUserWithUserId(item.user_id, data => {
                      navigation.goBack();
                    });
                  },
                );
              }}
              value={!item.is_mute}
            />
          </View>
        </ActionWrapper>
        <BorderContainer />
      </>
    );
  };

  return (
    <GlobalFlex>
      <BackHeader
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={type == 1 ? Strings.banned_members : Strings.muted_members}
      />
      <Spacer space={hp(1)} />
      <View style={{flex: 1}}>
        {type == 1 ? (
          bannedUserList.length > 0 ? (
            <FlatList
              data={bannedUserList}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => <ListItem item={item} />}
              keyExtractor={(item, index) => index}
            />
          ) : (
            <View style={{flex: 1, JustifyContent: 'center'}}>
              <Text>{Strings.warn_no_banned_users}</Text>
            </View>
          )
        ) : mutedUserList.length > 0 ? (
          <FlatList
            data={mutedUserList}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <MuteListItem item={item} />}
            keyExtractor={(item, index) => index}
          />
        ) : (
          <View style={{flex: 1, JustifyContent: 'center'}}>
            <Text>{Strings.warn_no_mute_users}</Text>
          </View>
        )}
      </View>
    </GlobalFlex>
  );
};
