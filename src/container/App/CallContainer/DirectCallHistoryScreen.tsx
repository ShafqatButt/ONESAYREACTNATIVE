import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  DirectCallProperties,
  SendbirdCalls,
} from '@sendbird/calls-react-native';

import CallHistoryCell from '../../../components/CallHistoryCell';
import Loading from '../../../components/Loading';
import SBIcon from '../../../components/SBIcon';
import SBText from '../../../components/SBText';
import {useRemoteHistory} from '../../../hooks/useCallHistory';
import {DirectRoutes} from '../../../navigations/routes';
import {useDirectNavigation} from '../../../navigations/useDirectNavigation';
import Palette from '../../../styles/palette';
import {AppLogger} from '../../../utils/logger';
import {colors} from '../../../res/colors';
import {Spacer} from '../../../res/spacer';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {images} from '../../../res/images';
import {fonts} from '../../../res/fonts';
import {
  Icon,
  useHeaderStyle,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {CALL_PERMISSIONS} from '../../../hooks/usePermissions';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import nativePermissionGranted from '@sendbird/uikit-react-native/src/utils/nativePermissionGranted';
import moment from 'moment/moment';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import Strings from '../../../string_key/Strings';

const DirectCallHistoryScreen = () => {
  const {navigation} = useDirectNavigation<DirectRoutes.HISTORY>();
  const {
    onRefresh,
    history_missed,
    refreshing,
    history,
    loading,
    onEndReached,
    onSearchFilter,
  } = useRemoteHistory();
  const [search, setSerach] = useState('');
  const [selectedTab, setSelectedTab] = useState(1);
  const {HeaderComponent} = useHeaderStyle();
  const {sdk} = useSendbirdChat();

  const onNavigate = async (callProps: DirectCallProperties) => {
    if (callProps.isVideoCall) {
      navigation.navigate(DirectRoutes.VIDEO_CALLING, {
        callId: callProps.callId,
      });
    } else {
      navigation.navigate(DirectRoutes.VOICE_CALLING, {
        callId: callProps.callId,
      });
    }
  };

  const getSendbirdUserById = async userId => {
    try {
      const query = sdk.createUserListQuery([userId]);
      const users = await query.next();
      return users[0];
    } catch (e) {
      console.log('error (getSendbirdUserById) => ', e.message);
      return null;
    }
  };

  const onDial = useCallback(async (userId: string, isVideoCall: boolean) => {
    console.log('users => ', userId);
    const user = await getSendbirdUserById(userId);
    console.log('users => ', JSON.stringify(user));
    let metadate = user?.metaData;

    if (metadate !== null && metadate !== undefined) {
      let snoozeData, dndData;
      const currentDate = new Date();
      if (metadate?.DNDData?.length > 0) {
        dndData = JSON.parse(metadate?.DNDData);

        const getHours = timestamp => parseInt(moment(timestamp).format('HH'));
        const getMinutes = timestamp =>
          parseInt(moment(timestamp).format('mm'));

        const currentHours = getHours(currentDate.getTime());
        const currentMinutes = getMinutes(currentDate.getTime());
        const currentValue = currentHours + currentMinutes;

        const startHours = getHours(dndData?.startTime);
        const startMinutes = getMinutes(dndData?.startTime);
        const startValue = startHours + startMinutes;

        const endHours = getHours(dndData?.endTime);
        const endMinutes = getMinutes(dndData?.endTime);
        const endValue = endHours + endMinutes;

        const dndEnabled =
          currentValue >= startValue && currentValue <= endValue;

        if (dndEnabled) {
          Alert.alert(
            'Failed',
            'This user is currently on do not disturb mode.',
          );
          return;
        }
      } else if (metadate?.snoozData?.length > 0) {
        snoozeData = JSON.parse(metadate?.snoozData);

        const snoozeEnabled =
          currentDate.getTime() > snoozeData?.startTimestamp &&
          currentDate.getTime() < snoozeData?.endTimestamp;

        if (snoozeEnabled) {
          Alert.alert('Failed', 'This user is currently on snooze mode.');
          return;
        }
      }
    }

    // return;
    try {
      const requestResult = await Permissions.requestMultiple(CALL_PERMISSIONS);
      const isGranted = nativePermissionGranted(requestResult);

      if (isGranted) {
        const callProps = await SendbirdCalls.dial(userId, isVideoCall);
        AppLogger.info('DIAL CALLED', callProps.callId);
        onNavigate(callProps);
      } else {
        Alert.alert(
          'Insufficient permissions!',
          "To call, allow one'ssay access to your camera and microphone",
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: async () => {},
            },
            {
              text: 'Okay',
              onPress: async () => {
                Linking.openSettings();
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (e) {
      // @ts-ignore
      Alert.alert('Failed', e.message);
    }
  }, []);

  // useEffect(() => {
  //   Platform.OS == 'android' && verifyPermissions()
  // }, [])

  // const verifyPermissions = async () => {
  //   let perm: any;
  //   perm = [PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  //   PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
  //   PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  //   PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
  //   PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
  //   let permissionStatuses = await requestMultiple(perm);
  //   const result = permissionStatuses[perm[0]];
  //   if (result !== 'granted') {
  //     Alert.alert('Insufficient permissions!', 'You need to grant storage access permissions.', [
  //       { text: 'Okay' }
  //     ]);
  //     return false;
  //   }
  //   return true;
  // };

  return (
    <React.Fragment>
      <HeaderComponent
        title={Strings.call_history}
        left={
          // <Text style={{ fontSize: wp(8), fontFamily: fonts.BOLD, color: colors.REGULAR_TEXT_COLOR }}>
          //   {"One'sSay"}
          // </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={images.back_black}
              style={{width: wp(6), height: wp(6)}}
            />
          </Pressable>
        }
        // right={

        // }
      />

      <View style={{flex: 1, backgroundColor: colors.WHITE}}>
        <Spacer space={hp(1)} />

        <View style={styles.tabWrapper}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab(1);
            }}
            style={{
              ...styles.tabStyle,
              backgroundColor:
                selectedTab == 1 ? colors.PRIMARY_COLOR : colors.WHITE,
              borderTopLeftRadius: wp(5),
              borderBottomLeftRadius: wp(5),
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.MEDIUM,
                fontSize: wp(4),
                color: selectedTab == 1 ? colors.WHITE : colors.DARK_GRAY_93,
              }}>
              {Strings.all}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab(2);
            }}
            style={{
              ...styles.tabStyle,
              backgroundColor:
                selectedTab == 2 ? colors.PRIMARY_COLOR : colors.WHITE,
              borderTopRightRadius: wp(5),
              borderBottomRightRadius: wp(5),
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.MEDIUM,
                fontSize: wp(4),
                color: selectedTab == 2 ? colors.WHITE : colors.DARK_GRAY_93,
              }}>
              {Strings.missed}
            </Text>
          </TouchableOpacity>
        </View>

        <>
          <Spacer space={hp(1)} />
          <View style={styles.search_wrapper}>
            <Image source={images.search_ic} style={styles.search_ic} />
            <TextInput
              placeholder={Strings.search}
              placeholderTextColor={colors.OSLO_GRAY}
              value={search}
              onChangeText={val => {
                setSerach(val), onSearchFilter(val);
              }}
              style={styles.Input}
              clearButtonMode={'always'}
            />
          </View>
          <Spacer space={hp(0.6)} />
        </>
        <FlatList
          style={{backgroundColor: colors.WHITE}}
          showsVerticalScrollIndicator={false}
          data={history}
          keyExtractor={item => item.callId}
          renderItem={({item}) =>
            selectedTab == 1 ? (
              <CallHistoryCell onDial={onDial} history={item} />
            ) : item.isOutgoing == false && item.endResult != 'COMPLETED' ? (
              <CallHistoryCell onDial={onDial} history={item} />
            ) : null
          }
          contentContainerStyle={{flexGrow: 1, backgroundColor: colors.WHITE}}
          refreshing={refreshing}
          onRefresh={() => {
            onRefresh(), setSerach('');
          }}
          ListFooterComponent={<Spacer space={hp(6)} />}
          //onEndReached={onEndReached}
          onEndReached={() => onEndReached(search)}
        />
        <Loading visible={loading} />
      </View>
    </React.Fragment>
  );
};

const EmptyList = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <SBIcon
        icon={'CallHistory'}
        size={60}
        color={Palette.onBackgroundLight03}
        containerStyle={{marginBottom: 20}}
      />
      <SBText
        body3
        color={Palette.onBackgroundLight03}
        style={{textAlign: 'center'}}>
        {'The list of calls you make will show here.\n' +
          'Tap the phone button to start making a call.'}
      </SBText>
    </View>
  );
};

export default DirectCallHistoryScreen;

export const styles = StyleSheet.create({
  search_ic: {
    marginHorizontal: wp(2),
    width: wp(4),
    height: wp(4),
    alignSelf: 'center',
    tintColor: colors.OSLO_GRAY,
  },
  search_wrapper: {
    backgroundColor: colors.SERACH_BACK_COLOR,
    width: wp(92),
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: wp(6),
  },
  Input: {
    backgroundColor: colors.SERACH_BACK_COLOR,
    borderRadius: wp(6),
    paddingVertical: wp(2.6),
    fontFamily: fonts.REGULAR,
    fontSize: wp(4.5),
    color: colors.OSLO_GRAY,
    flex: 1,
  },
  tabWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(92),
    alignSelf: 'center',
  },
  tabStyle: {
    padding: wp(2.5),
    borderColor: colors.LIGHT_GRAY,
    borderWidth: 0.5,
    flex: 1,
    alignSelf: 'center',
  },
});
