import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput, Alert, Platform} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import globalStyles, {
  GlobalFlex,
  SubContainer,
} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {styles} from './style';
import {ChevronWrapper} from '../../../../components/Input/style';
import {Button} from '../../../../components/Button';
import {getLanguageValueFromKey} from '../../../../commonAction';
import {REPORT_CHANNEL, REPORT_USER} from '../../../../api_helper/Api';
import {POST_SENDBIRD} from '../../../../api_helper/ApiServices';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import * as Icons from 'react-native-heroicons/solid';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import Loading from '../../../../components/Loading';
import {fonts} from '../../../../res/fonts';
import Strings from '../../../../string_key/Strings';

export default ReportUserContainer = props => {
  const [reasonType, setReasonType] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {currentUser} = useSendbirdChat();
  const {channelUrl, isSuper, offending_user_id, onDismiss} =
    props.route.params;

  const commonAction = (title, sub_title) => {
    Alert.alert(
      title,
      sub_title,
      [
        {
          text: Strings.got_it,
          onPress: () => {
            if (onDismiss) {
              onDismiss();
            }
            props.navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const onPostReportUser = () => {
    if (reasonType != '' && reasonType != 'Select Reason') {
      if (offending_user_id) {
        let body_json = {
          channel_type: 'group_channels',
          channel_url: channelUrl,
          report_category: reasonType,
          reporting_user_id: currentUser.userId,
          report_description: reason,
        };

        setIsLoading(true);
        POST_SENDBIRD(REPORT_USER(offending_user_id), body_json, data => {
          setIsLoading(false);
          if (data) {
            commonAction(Strings.user_reported, Strings.warn_report_noted);
          }
        });
      } else {
        let body_json = {
          report_category: reasonType,
          reporting_user_id: currentUser.userId,
          report_description: reason,
        };

        setIsLoading(true);
        POST_SENDBIRD(
          REPORT_CHANNEL('group_channels', channelUrl),
          body_json,
          data => {
            setIsLoading(false);
            if (data) {
              commonAction(
                isSuper ? Strings.channel_reported : Strings.group_reported,
                Strings.warn_report_noted,
              );
            }
          },
        );
      }
    } else {
      alert(Strings.warn_select_reason);
    }
  };

  return (
    <GlobalFlex>
      <BackHeader
        onBackPress={() => {
          props.navigation.goBack();
        }}
        isRightText={false}
        isLeftText={false}
        background={{
          backgroundColor: colors.PRIMARY_COLOR,
          paddingTop: wp(4),
          paddingBottom: wp(3.5),
        }}
        textColor={{color: colors.WHITE}}
        is_center_text
        title={Strings.report}
      />

      <SubContainer>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={value => setReasonType(value)}
            items={[
              {label: Strings.suspicious, value: 'suspicious'},
              {label: Strings.harassing, value: 'harassing'},
              {label: Strings.inappropriate, value: 'inappropriate'},
              {label: Strings.spam, value: 'spam'},
            ]}
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
          {Platform.OS == 'ios' && (
            <ChevronWrapper style={[{marginRight: 10}]}>
              <Icons.ChevronDownIcon color={colors.HAWKES_BLUE} size={wp(5)} />
            </ChevronWrapper>
          )}
        </View>

        <Spacer space={hp(0.5)} />
        <View>
          <Text style={styles.inputHeaderLabel}>{Strings.message}</Text>
          <Spacer space={hp(0.8)} />
          <TextInput
            placeholder={Strings.warn_write_your_reason}
            placeholderTextColor={colors.LIGHT_GRAY}
            multiline={true}
            numberOfLines={4}
            value={reason}
            onChangeText={text => setReason(text)}
            style={styles.inputWrapper}
          />
        </View>
        <Spacer space={hp(1.5)} />
        <Button
          buttonText={Strings.submit}
          buttonPress={() => {
            onPostReportUser();
          }}
        />
      </SubContainer>
      <Loading visible={isLoading} />
    </GlobalFlex>
  );
};
