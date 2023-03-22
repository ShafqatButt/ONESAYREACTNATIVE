import React, {useContext, useState, useEffect} from 'react';
import {View, Image, TouchableOpacity, Alert} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {images} from '../../../../res/images';
import {styles, BorderContainer, Text} from './style';
import {fonts} from '../../../../res/fonts';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import {AuthContext} from '../../../../context/Auth.context';
import {PATCH} from '../../../../api_helper/ApiServices';
import {DEACTIVATE_ACCOUNT} from '../../../../api_helper/Api';
import deviceInfoModule from 'react-native-device-info';
import {removeData} from '../../../../res/asyncStorageHelper';
import {unregisterToken} from '../../../../commonAction';
import {useConnection} from '@sendbird/uikit-react-native';
import AuthManager from '../../../../libs/AuthManager';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import Strings from '../../../../string_key/Strings';

const DeleteAccounts = props => {
  const [is_selected, setIsSelected] = useState(1);
  const {state: authContextState} = useContext(AuthContext);
  const {userData} = authContextState;
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const {disconnect} = useConnection();

  const deauthenticate = async () => {
    await Promise.all([
      AuthManager.deAuthenticate(),
      SendbirdCalls.deauthenticate(),
    ]);
  };

  const InActiveAccount = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    PATCH(
      DEACTIVATE_ACCOUNT,
      userData?.token,
      uniqueID,
      {
        userID: userData?.userId,
      },
      (res, e) => {
        console.log(res);
        setLoading(() => false);
        setUpdating(() => false);
        if (!e) {
          Alert.alert(
            'Buzzmi',
            res?.message,
            [
              {
                text: Strings.okay,
                onPress: async () => {
                  await unregisterToken();
                  await deauthenticate();
                  await disconnect();
                  removeData('userDetails');
                  removeData('company_id');
                  setTimeout(() => {
                    props.navigation.replace('Auth');
                  }, 150);
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          console.log('PATCH_UPDATE_PROFILE (error) => ', res);
        }
      },
    );
  };

  const onAlertConfirmation = () => {
    Alert.alert(
      Strings.inactive_account,
      Strings.msg_inactive_acc_confirm,
      [
        {
          text: Strings.Cancel,
          style: 'cancel',
        },
        {
          text: Strings.inactive,
          onPress: () => InActiveAccount(),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <GlobalFlex style={[{backgroundColor: colors.BORDER_SPACE_COLOR}]}>
      <BackHeader
        is_center_text
        title={Strings.delete_account}
        onBackPress={() => props.navigation.goBack()}
        background={{paddingBottom: wp(4)}}
      />
      <View style={styles.borderView} />
      <View style={[styles.viewWrapper, {opacity: is_selected == 2 ? 0.6 : 1}]}>
        <Spacer space={hp(1.2)} />
        <TouchableOpacity
          onPress={() => {
            setIsSelected(1);
          }}
          style={{flexDirection: 'row'}}>
          <Image
            source={is_selected == 1 ? images.radio_fill : images.radio_ring}
            style={{width: wp(5), height: wp(5), marginRight: wp(2)}}
          />
          <View style={{width: wp(80)}}>
            <Text
              style={{
                fontFamily: fonts.MEDIUM,
                fontSize: wp(3.5),
                lineHeight: wp(5),
              }}>
              {Strings.deleting_your_account_will}:
            </Text>
            <Spacer space={hp(0.5)} />
            <Text>{'\u2022' + ` ${Strings.delete_your_account_profile}`}</Text>
            <Text>{'\u2022' + ' ' + Strings.delete_from_buzzmi_groups}</Text>
            <Text>{'\u2022' + ' ' + Strings.delete_messages_and_backup}</Text>
          </View>
        </TouchableOpacity>
        <Spacer space={hp(1)} />
      </View>
      <BorderContainer />
      <View style={[styles.viewWrapper, {opacity: is_selected == 1 ? 0.6 : 1}]}>
        <Spacer space={hp(1)} />
        <TouchableOpacity
          onPress={() => {
            setIsSelected(2);
          }}
          style={{flexDirection: 'row'}}>
          <Image
            source={is_selected == 2 ? images.radio_fill : images.radio_ring}
            style={{width: wp(5), height: wp(5), marginRight: wp(2)}}
          />
          <View style={{width: wp(80)}}>
            <Text
              style={{
                fontFamily: fonts.MEDIUM,
                fontSize: wp(3.5),
                lineHeight: wp(5),
              }}>
              {Strings.temp_inactive_your_account}
            </Text>
            <Spacer space={hp(0.5)} />
            <Text>
              {'\u2022' + ' ' + Strings.your_buzzmi_acc_temp_inactive}
            </Text>
            <Text>{'\u2022' + ' ' + Strings.not_display_buzzmi_profile}</Text>
            <Text>{'\u2022' + ' ' + Strings.make_login_invalid}</Text>
            <Text>
              {'\u2022' + ' ' + Strings.allow_acc_active_with_forgot_pass}
            </Text>
          </View>
        </TouchableOpacity>
        <Spacer space={hp(1)} />
      </View>
      <Spacer space={hp(2)} />
      <View style={{...styles.viewWrapper, paddingVertical: wp(3)}}>
        <Text style={{color: '#aaa', fontSize: wp(2.8), lineHeight: wp(5)}}>
          {Strings.your_phone_number + ' '}
        </Text>
        <Text style={{fontSize: wp(4), lineHeight: wp(5)}}>
          {userData?.mobile}
        </Text>
        <Spacer space={hp(0.2)} />
        <View style={{backgroundColor: colors.DARK_GRAY_91, height: wp(0.2)}} />
      </View>

      <Spacer space={hp(2.5)} />
      {is_selected == 1 ? (
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
            props.navigation.navigate('ReasonModal');
          }}>
          <Text
            style={{
              fontFamily: fonts.REGULAR,
              fontSize: wp(4),
              color: colors.DARK_RED,
            }}>
            {Strings.del_my_acc}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
            onAlertConfirmation();
          }}>
          <Text
            style={{
              fontFamily: fonts.REGULAR,
              fontSize: wp(4),
              color: colors.PRIMARY_COLOR,
            }}>
            {Strings.inactive_my_acc}
          </Text>
        </TouchableOpacity>
      )}
    </GlobalFlex>
  );
};

export default DeleteAccounts;
