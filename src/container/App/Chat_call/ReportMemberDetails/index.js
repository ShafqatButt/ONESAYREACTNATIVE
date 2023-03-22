// noinspection ES6CheckImport

import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDirectNavigation} from '../../../../navigations/useDirectNavigation';
import {CHECK_SENDBIRD_USER, REPORT_USER} from '../../../../api_helper/Api';
import {GET_SENDBIRD, POST} from '../../../../api_helper/ApiServices';
import {GlobalFlex, SubContainer} from '../../../../res/globalStyles';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import AsyncStorage from '@react-native-community/async-storage';
import {BackHeader} from '../../../../components/BackHeader';
import {getrelamContactName} from '../../../../commonAction';
import {BorderContainer, styles, MText} from './style';
import {useNavigation} from '@react-navigation/native';
import Strings from '../../../../string_key/Strings';
import Loading from '../../../../components/Loading';
import {Routes} from '../../../../libs/navigation';
import DeviceInfo from 'react-native-device-info';
import {Spacer} from '../../../../res/spacer';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';

const ReportMemberDetailsContainer = props => {
  const {channel} = props.route.params;
  const {item} = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [reportList, setReportList] = useState([]);
  const {currentUser, sdk} = useSendbirdChat();
  const {navigate} = useNavigation();
  const {navigation} = useDirectNavigation();

  useEffect(() => {
    getReportList();
  }, [channel]);

  const getReportList = () => {
    GET_SENDBIRD(REPORT_USER(item.user_id), data => {
      if (data) {
        setReportList(data?.report_logs);
      }
    });
  };

  const ListItem = ({item}) => {
    return (
      <>
        <View>
          <View style={styles.flex_wrapper}>
            <Text style={styles.label}>{Strings.report_type}:</Text>
            <Text style={styles.sublabel}>{item?.report_category}</Text>
          </View>
          <BorderContainer />
          <View style={styles.flex_wrapper}>
            <Text style={styles.label}>{Strings.report_description}:</Text>
            <Text style={styles.sublabel}>{item?.report_description}</Text>
          </View>
          <BorderContainer />
          <View style={styles.flex_wrapper}>
            <Text style={styles.label}>{Strings.report_by}:</Text>
            <Text style={styles.sublabel}>
              {currentUser.userId == item.reporting_user.user_id
                ? Strings.you
                : getrelamContactName(item?.reporting_user.metadata.phone)}
            </Text>
          </View>
          <BorderContainer />
        </View>
        <BorderContainer style={[{height: hp(2)}]} />
      </>
    );
  };

  const onCheckSendBirdUser = async () => {
    let postData = {mobileNumbers: [item?.metadata.phone]};
    const userData = await AsyncStorage.getItem('userDetails');
    const uniqueID = await DeviceInfo.getUniqueId();
    setIsLoading(true);
    POST(
      CHECK_SENDBIRD_USER,
      true,
      JSON.parse(userData).token,
      uniqueID,
      postData,
      async mitem => {
        setIsLoading(false);
        if (mitem?.length > 0) {
          if (mitem[0]?.isSendBirdUser == true) {
            const params = new sdk.GroupChannelParams();
            params.isSuper = false;
            params.isPublic = false;
            params.isEphemeral = false;
            if (currentUser) {
              params.operatorUserIds = [currentUser.userId];
            }
            params.addUserIds([item.user_id]);
            params.name = '';
            params.isDistinct = true;
            const channel = await sdk.GroupChannel.createChannel(params);
            setTimeout(() => {
              navigation.goBack();
              navigation.push(Routes.GroupChannel, {
                serializedChannel: channel.serialize(),
              });
            }, 500);
          }
        }
      },
    );
  };

  const onRemoveFromChannel = () => {
    channel.banUserWithUserId(item.user_id, 1, 'banned', data => {
      navigation.goBack();
    });
  };
  const onMuteFromChannel = () => {
    channel.muteUserWithUserId(item.user_id, data => {
      navigation.goBack();
    });
  };

  const onViewUser = () => {
    navigation.goBack();
    navigate('ProfileView', {
      data: Object.assign(item, {
        metaData: {
          phone: item.metadata.phone,
          username: item.metadata.username,
        },
      }),
      channelUrl: channel?.url,
      is_super: channel?.isSuper,
    });
  };
  return (
    <GlobalFlex>
      <BackHeader
        title={null}
        isLeftText={true}
        isRightText={false}
        textColor={{color: colors.WHITE}}
        onBackPress={() => props.navigation.goBack()}
        background={{
          backgroundColor: colors.PRIMARY_COLOR,
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
        }}
      />

      <SubContainer style={[{width: wp(100)}]}>
        <Spacer space={hp(1)} />
        <Text
          style={{
            marginLeft: wp(4),
            fontSize: wp(4.5),
            fontFamily: fonts.MEDIUM,
          }}>
          {Strings.report_details}
        </Text>
        <Spacer space={hp(1)} />
        <FlatList
          bounces={false}
          data={reportList}
          ListFooterComponent={() => {
            return (
              <>
                <>
                  <Spacer space={hp(0.5)} />
                  <TouchableOpacity
                    onPress={onViewUser}
                    style={{paddingVertical: wp(2), paddingHorizontal: wp(4)}}>
                    <MText
                      style={[
                        {color: colors.PRIMARY_COLOR, textAlign: 'left'},
                      ]}>{`${
                      Strings.view +
                      ' ' +
                      getrelamContactName(item.metadata.phone)
                    }`}</MText>
                  </TouchableOpacity>
                </>
                <>
                  <Spacer space={hp(0.5)} />
                  <TouchableOpacity
                    onPress={onCheckSendBirdUser}
                    style={{paddingVertical: wp(2), paddingHorizontal: wp(4)}}>
                    <MText
                      style={[
                        {color: colors.PRIMARY_COLOR, textAlign: 'left'},
                      ]}>{`${
                      Strings.message +
                      ' ' +
                      getrelamContactName(item.metadata.phone)
                    }`}</MText>
                  </TouchableOpacity>
                </>
                <>
                  <Spacer space={hp(0.5)} />
                  <TouchableOpacity
                    onPress={onRemoveFromChannel}
                    style={{paddingVertical: wp(2), paddingHorizontal: wp(4)}}>
                    <MText
                      style={[
                        {color: colors.PRIMARY_COLOR, textAlign: 'left'},
                      ]}>{`${Strings.remove_from} ${
                      channel.isSuper ? Strings.channel : Strings.group
                    }`}</MText>
                  </TouchableOpacity>
                </>
                <>
                  <Spacer space={hp(0.5)} />
                  <TouchableOpacity
                    onPress={onMuteFromChannel}
                    style={{paddingVertical: wp(2), paddingHorizontal: wp(4)}}>
                    <MText
                      style={[
                        {color: colors.PRIMARY_COLOR, textAlign: 'left'},
                      ]}>{`${
                      Strings.mute +
                      ' ' +
                      getrelamContactName(item.metadata.phone)
                    }`}</MText>
                  </TouchableOpacity>
                </>
                <>
                  <Spacer space={hp(0.5)} />
                  <TouchableOpacity
                    onPress={onRemoveFromChannel}
                    style={{paddingVertical: wp(2), paddingHorizontal: wp(4)}}>
                    <MText
                      style={[
                        {color: colors.PRIMARY_COLOR, textAlign: 'left'},
                      ]}>{`${
                      Strings.ban +
                      ' ' +
                      getrelamContactName(item.metadata.phone)
                    }`}</MText>
                  </TouchableOpacity>
                </>
              </>
            );
          }}
          keyExtractor={(item, index) => index}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => <ListItem item={item} />}
        />

        <Spacer space={hp(2)} />
      </SubContainer>
      <Loading visible={isLoading} />
    </GlobalFlex>
  );
};

export default ReportMemberDetailsContainer;
