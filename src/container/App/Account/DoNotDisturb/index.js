// noinspection ES6CheckImport

import React, {useState, useRef, useContext} from 'react';
import {View, Alert, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import RNLocalize from 'react-native-localize';
import DatePicker from 'react-native-date-picker';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {styles, BorderContainer, Text} from './style';
import {Button} from '../../../../components/Button';
import {colors} from '../../../../res/colors';
import {Spacer} from '../../../../res/spacer';
import Strings from '../../../../string_key/Strings';
import {AuthContext} from '../../../../context/Auth.context';

export default DoNotDisturb = props => {
  const {onDndEnabled} = props.route.params;
  const {sdk, currentUser} = useSendbirdChat();
  const {state: AuthState} = useContext(AuthContext);

  const [openTimePicker, setOpenTimePicker] = useState(false);

  const todayDate = new Date();

  const refMinDate = useRef(todayDate);
  const refMaxDate = useRef(todayDate);

  const refStartHour = useRef(-1);
  const refStartMin = useRef(-1);
  const refEndHour = useRef(-1);
  const refEndMin = useRef(-1);

  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  // const [endTime, setEndTime] = useState(moment(todayDate).format('hh:mm'));
  const [selection, setSelection] = useState(1);

  const update = () => {
    if (refStartHour.current === -1) {
      Alert.alert(Strings.please_select_start_time);
    } else if (refEndHour.current === -1) {
      Alert.alert(Strings.please_select_end_time);
    } else {
      const startHour = refStartHour.current;
      const startMin = refStartMin.current;
      const endHour = refEndHour.current;
      const endMin = refEndMin.current;

      if (startHour === endHour && startMin === endMin) {
        Alert.alert(Strings.start_time_end_time_not_same);
        return;
      }

      const timeZone = RNLocalize.getTimeZone();

      sdk
        .setDoNotDisturb(
          true,
          startHour,
          startMin,
          endHour,
          endMin,
          timeZone,
          (res, e) => {
            console.log('setDoNotDisturb => ', res);
            let meta = {
              DNDData: JSON.stringify({
                isEnable: true,
                startTime: refMinDate.current.getTime(),
                endTime: refMaxDate.current.getTime(),
                startHour: startHour,
                startMin: startMin,
                endHour: endHour,
                endMin: endMin,
                timezone: timeZone,
              }),
            };
            currentUser.updateMetaData(meta, true, (res, e) => {
              console.log('response (updateMetaData) ===> ', res);
            });
            setTimeout(() => {
              onDndEnabled(true, res);
              props.navigation.goBack();
            }, 800);
          },
        )
        .then();
    }
  };

  return (
    <>
      <GlobalFlex>
        <DatePicker
          modal
          mode={'time'}
          title={Strings.select_time}
          confirmText={Strings.confirm}
          cancelText={Strings.Cancel}
          locale={AuthState.selectedLang === 'en' ? 'en_GB' : 'es_GT'}
          date={new Date()}
          open={openTimePicker}
          is24hourSource={'locale'}
          onCancel={() => setOpenTimePicker(false)}
          // maximumDate={selection === 1 ? refMaxDate.current : undefined}
          // minimumDate={selection === 1 ? new Date() : refMinDate?.current}
          onConfirm={date => {
            const hours = parseInt(moment(date).format('HH'));
            const minutes = parseInt(moment(date).format('mm'));
            console.log('date (h) => ', hours);
            console.log('date (m) => ', minutes);

            if (selection === 1) {
              refMinDate.current = date;
              refStartHour.current = hours;
              refStartMin.current = minutes;
              setStartTime(moment(date).format('HH:mm'));

              if (
                date.getTime() >=
                refMaxDate?.current?.getTime() - 30 * 1000
              ) {
                const endDate = new Date(date.getTime() + 60 * 1000);
                const _hours = parseInt(moment(endDate).format('HH'));
                const _minutes = parseInt(moment(endDate).format('mm'));
                refMaxDate.current = endDate;
                refEndHour.current = _hours;
                refEndMin.current = _minutes;
                setEndTime(moment(endDate).format('HH:mm'));
              }
            } else {
              refMaxDate.current = date;
              refEndHour.current = hours;
              refEndMin.current = minutes;
              setEndTime(moment(date).format('HH:mm'));

              if (date.getTime() < refMinDate?.current?.getTime() + 30 * 1000) {
                const startDate = new Date(date.getTime() - 60 * 1000);
                const _hours = parseInt(moment(startDate).format('HH'));
                const _minutes = parseInt(moment(startDate).format('mm'));
                refMinDate.current = startDate;
                refStartHour.current = _hours;
                refStartMin.current = _minutes;
                setStartTime(moment(startDate).format('HH:mm'));
              }
            }
            setOpenTimePicker(false);
          }}
        />
        <BackHeader
          is_center_text
          title={Strings.Do_not_disturb}
          textColor={{color: colors.WHITE}}
          background={styles.backHeaderStyle}
          onBackPress={() => props.navigation.goBack()}
        />

        <Spacer space={hp(1.5)} />
        <View style={styles.rowContainerStyle}>
          <Text style={styles.titleTextStyle}>{Strings.start_time}</Text>
          <TouchableOpacity
            onPress={() => {
              setOpenTimePicker(!openTimePicker);
              setSelection(1);
            }}
            style={styles.chipContainerStyle}>
            <Text style={[{letterSpacing: wp(1)}]}>{startTime}</Text>
          </TouchableOpacity>
        </View>
        <BorderContainer />
        <View style={styles.rowContainerStyle}>
          <Text style={styles.titleTextStyle}>{Strings.end_time}</Text>
          <TouchableOpacity
            onPress={() => {
              setOpenTimePicker(!openTimePicker);
              setSelection(2);
            }}
            style={styles.chipContainerStyle}>
            <Text style={[{letterSpacing: wp(1)}]}>{endTime}</Text>
          </TouchableOpacity>
        </View>
        <BorderContainer />
        <Spacer space={hp(1.5)} />
        <Text style={styles.messageTextStyle}>
          {Strings.this_option_routinely}
        </Text>
      </GlobalFlex>
      <Button buttonText={Strings.save} buttonPress={() => update()} />
      <Spacer space={hp(3)} />
    </>
  );
};
