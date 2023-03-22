import React, {useContext, useState, useEffect} from 'react';
import {View, Text, Keyboard, Alert, TextInput} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import globalStyles, {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {AuthContext} from '../../../../context/Auth.context';
import realm from '../../../../realmStore';
import {GET_DATA} from '../../../../api_helper/ApiServices';
import {GET_DELETE_REASON} from '../../../../api_helper/Api';
import deviceInfoModule from 'react-native-device-info';
import {colors} from '../../../../res/colors';
import {styles} from './style';
import {fonts} from '../../../../res/fonts';
import {Button} from '../../../../components/Button';
import {ChevronWrapper} from '../../../../components/Input/style';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {getBottomSpace, ifIphoneX} from 'react-native-iphone-x-helper';
import RNPickerSelect from 'react-native-picker-select';
import * as Icons from 'react-native-heroicons/solid';
import {CONST_FLOW_TYPES, sendOtp} from '../../../Auth/VerifyOTPScreen';
import Strings from '../../../../string_key/Strings';

let pushReasons = [];
export default ReasonModal = props => {
  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;
  const [isDisable, setIsDisable] = useState(true);
  const [reasonList, setReasonList] = useState([]);
  const [reasonType, setReasonType] = useState(null);
  const [reason, setReason] = useState('');

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getDeleteReasonData();
    return () => {
      pushReasons = [];
    };
  }, [userData]);

  const getDeleteReasonData = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    GET_DATA(GET_DELETE_REASON, true, userData?.token, uniqueID, data => {
      data.map(val => {
        pushReasons.push({label: val?.deleteReason, value: val?.id});
      });
      setReasonList(pushReasons);
    });
  };

  const onDeletePermanant = () => {
    Alert.alert(
      Strings.Delete_Account,
      Strings.are_you_sure_want_to_delete_account,
      [
        {
          text: Strings.Cancel,
          style: 'cancel',
        },
        {
          text: Strings.delete_all_caps,
          onPress: () => {
            props.navigation.pop();
            setTimeout(() => {
              setLoading(() => true);
              sendOtp().then(({success, response}) => {
                setLoading(() => false);
                if (success) {
                  props.navigation.navigate('VerifyOTPScreen', {
                    type: CONST_FLOW_TYPES.DELETE_ACCOUNT,
                    deleteAccountReasonId: reasonType,
                    deleteAccountReasonDescription: reason,
                    uniqueUUID: response.uniqueUUID,
                    expireTime: 10,
                    email: userData?.mobile,
                  });
                }
              });
            }, 100);
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    if (reasonType != null && reason != '') {
      setIsDisable(false);
    }
  }, [reason, reasonType]);

  return (
    <>
      <GlobalFlex>
        <BackHeader
          background={{
            backgroundColor: colors.PRIMARY_COLOR,
            paddingTop: wp(4),
            paddingBottom: wp(3.5),
          }}
          textColor={{color: colors.WHITE}}
          isLeftText={true}
          onBackPress={() => props.navigation.goBack()}
        />
        <Spacer space={hp(1.5)} />
        <View style={{alignSelf: 'center', width: wp(90)}}>
          <Text style={{fontSize: wp(4.5), fontFamily: fonts.BOLD}}>
            {Strings.what_is_your_reason_for_leaving}
          </Text>

          <View style={styles.pickerWrapper}>
            {reasonList.length > 0 && (
              <RNPickerSelect
                onValueChange={value => setReasonType(value)}
                items={reasonList}
                placeholder={{
                  label: Strings.select_reason,
                  value: 'Select Reason',
                  color: colors.TRIPLET_PLACEHOLDER,
                }}
                style={{
                  inputAndroid: {
                    fontSize: wp(4.5),
                    fontFamily: fonts.REGULAR,
                    paddingLeft: 0,
                    width: wp(90),
                    color: colors.BLACK,
                  },
                  ...globalStyles.hideIconsRNPicker,
                }}
                textInputProps={{
                  placeholderTextColor: colors.TRIPLET_PLACEHOLDER,
                  style: styles.pickerInput,
                }}
                doneText={Strings.done}
              />
            )}
            {Platform.OS == 'ios' && (
              <ChevronWrapper style={[{marginRight: 10}]}>
                <Icons.ChevronDownIcon
                  color={colors.HAWKES_BLUE}
                  size={wp(5)}
                />
              </ChevronWrapper>
            )}
          </View>

          <Spacer space={hp(0.5)} />
          <View>
            <Text style={styles.inputHeaderLabel}>
              {Strings.please_des_problem}
            </Text>
            <Spacer space={hp(0.8)} />
            <TextInput
              placeholder={Strings.write_reason}
              placeholderTextColor={colors.LIGHT_GRAY}
              multiline={true}
              numberOfLines={4}
              returnKeyType="done"
              value={reason}
              onChangeText={text => {
                setReason(text), text == '' && setIsDisable(true);
              }}
              style={styles.inputWrapper}
              blurOnSubmit={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          </View>
          <Spacer space={hp(1.5)} />
        </View>
      </GlobalFlex>
      <Button
        buttonText={Strings.Delete_Account}
        buttonPress={() => isDisable == false && onDeletePermanant()}
        txtstyle={{
          color: isDisable ? colors.TRIPLET_PLACEHOLDER : colors.WHITE,
        }}
        btnstyle={{
          backgroundColor: isDisable ? colors.GRAY2 : colors.PRIMARY_COLOR,
          ...ifIphoneX(
            {
              bottom: getBottomSpace(),
            },
            {
              bottom: 12,
            },
          ),
        }}
      />
    </>
  );
};
