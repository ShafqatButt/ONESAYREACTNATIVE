import React, {useState, useEffect} from 'react';
import {Image, View, FlatList} from 'react-native';
import {Spacer} from '../../../../res/spacer';
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {BorderContainer, Text, ActionWrapper} from './style';
import {fonts} from '../../../../res/fonts';
import {GET_SENDBIRD} from '../../../../api_helper/ApiServices';
import {REPORT_CHANNEL} from '../../../../api_helper/Api';
import {getrelamContactName} from '../../../../commonAction';
import {useDirectNavigation} from '../../../../navigations/useDirectNavigation';
import {CONST_REPORT_TYPE} from '../../../../uikit-app';
import Loading from '../../../../components/Loading';
import {images} from '../../../../res/images';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Strings from "../../../../string_key/Strings";

export default ReportedMemberList = props => {
  const {channel} = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [reportedMemberList, setReportedMemberList] = useState([]);
  const {navigation} = useDirectNavigation();

  useEffect(() => {
    getReportedMemberList();
  }, [channel]);

  const getReportedMemberList = () => {
    GET_SENDBIRD(REPORT_CHANNEL('group_channels', channel.url), data => {
      if (data) {
        var reportArray = [];
        var arr = [];
        var v_data = new Promise((resolve, reject) => {
          reportArray = data?.report_logs.filter(function (el) {
            return el.report_type == CONST_REPORT_TYPE.USER;
          });
          resolve();
        });
        v_data.then(() => {
          var assign_data = new Promise((resolve, reject) => {
            reportArray.forEach(function (arrayItem) {
              if (!userExists(arr, arrayItem.offending_user.user_id)) {
                arr.push(arrayItem.offending_user);
              }
            });
            resolve();
          });
          assign_data.then(() => {
            setReportedMemberList(arr);
          });
        });
      }
    });
  };

  const userExists = (report_Array, user_id) => {
    return report_Array.some(function (el) {
      return el.user_id === user_id;
    });
  };

  const ListItem = ({item}) => {
    return (
      <>
        <ActionWrapper
          onPress={() => {
            navigation.navigate('ReportMemberDetails', {
              item: item,
              channel: channel,
            });
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Image
              source={
                item.profile_url != '' ? {uri: item.profile_url} : images.avatar
              }
              style={{
                width: wp(12),
                height: wp(12),
                borderRadius: wp(8),
                marginRight: wp(2),
              }}
            />
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: fonts.MEDIUM,
              }}>
              {getrelamContactName(item.metadata?.phone)}
            </Text>
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
        title={Strings.reported_members}
      />
      <Spacer space={hp(1)} />
      <View style={{flex: 1}}>
        {reportedMemberList.length > 0 ? (
          <FlatList
            data={reportedMemberList}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => <ListItem item={item} />}
            keyExtractor={(item, index) => index}
          />
        ) : (
          <View style={{flex: 1, JustifyContent: 'center'}}>
            <Text>{Strings.warn_no_reported_users}</Text>
          </View>
        )}
      </View>
      <Loading visible={isLoading} />
    </GlobalFlex>
  );
};
