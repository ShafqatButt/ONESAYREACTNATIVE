// noinspection ES6CheckImport

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import styles, {BorderContainer, Text} from './styles';
import {Button} from '../../../../components/Button';
import {colors} from '../../../../res/colors';
import {Spacer} from '../../../../res/spacer';
import {underDevelopment} from '../../../../uikit-app';
import Strings from "../../../../string_key/Strings";
let dt = new Date();
const dateAdjust = dateStr => {
  if (typeof dateStr === 'string') {
    if (!dateStr.includes('Z')) {
      let nowst = new Date(dateStr);

      nowst.setMinutes(nowst.getMinutes() - dt.getTimezoneOffset());
      return nowst;
    }
  }
  return new Date(dateStr);
};
export default TimeSlotPicker = props => {
  const tFormat = 'hh:mm a';
  const {edit, item, index, day, dayStatus, CONST_WEEK_DAYS, setDayStatus} =
    props.route.params;
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(dateAdjust(item?.startTime));
  const [endTime, setEndTime] = useState(dateAdjust(item?.endTime));
  const [selection, setSelection] = useState(1);

  const onPressSave = () => {
    console.log('pick start and end time', startTime, dateAdjust(startTime));
    console.log('pick start and end time', endTime, dateAdjust(endTime));

    let currTimeStartTime = moment(startTime).format(tFormat);
    let currTimeEndTime = moment(endTime).format(tFormat);
    if (!startTime || !endTime) {
      underDevelopment('pick start and end time');
      console.log('pick start and end time');
      return;
    } else if (
      moment(currTimeStartTime, tFormat).isSame(
        moment(currTimeEndTime, tFormat),
      )
    ) {
      console.log('start Time endTime cannot be equal');
      underDevelopment("Select an end time that's later then your start time");
      return;
    } else if (
      moment(currTimeStartTime, tFormat).isAfter(
        moment(currTimeEndTime, tFormat),
      )
    ) {
      console.log('start Time shold be before endTime');
      underDevelopment("Select an end time that's later then your start time");
      return;
    } else {
      let times = [...dayStatus[CONST_WEEK_DAYS[day]]];
      edit ? times.splice(index, 1) : null;
      console.log('times', times);

      if (times.length) {
        for (let i = 0; i < times.length; i++) {
          let beforeTime = moment(dateAdjust(times[i]?.startTime)).format(
            tFormat,
          );
          let afterTime = moment(dateAdjust(times[i]?.endTime)).format(tFormat);
          console.log(
            'passed',
            i,
            currTimeStartTime,
            currTimeEndTime,
            beforeTime,
            afterTime,
          );

          if (
            moment(currTimeStartTime, tFormat).isBetween(
              moment(beforeTime, tFormat),
              moment(afterTime, tFormat),
            ) ||
            moment(currTimeStartTime, tFormat).isSame(
              moment(beforeTime, tFormat),
            )
          ) {
            console.log('new start time cannot overlap');
            underDevelopment(
              'Please Edit your time frame. this one overlaps another on same day',
            );
            return;
          } else if (
            moment(currTimeEndTime, tFormat).isBetween(
              moment(beforeTime, tFormat),
              moment(afterTime, tFormat),
            ) ||
            moment(currTimeEndTime, tFormat).isSame(moment(afterTime, tFormat))
          ) {
            console.log('new end time cannot overlap');
            underDevelopment(
              'Please Edit your time frame. this one overlaps another on same day',
            );
            return;
          } else if (
            moment(beforeTime, tFormat).isBetween(
              moment(currTimeStartTime, tFormat),
              moment(currTimeEndTime, tFormat),
            ) ||
            moment(endTime, tFormat).isBetween(
              moment(currTimeStartTime, tFormat),
              moment(currTimeEndTime, tFormat),
            )
          ) {
            console.log('new end time cannot overlap');
            underDevelopment(
              'Please Edit your time frame. this one overlaps another on same day',
            );
            return;
          }
        }
      }
      console.log('tim', times, startTime, endTime);
      setDayStatus(prev => {
        let keyToUpdate = {};
        if (edit) {
          prev[CONST_WEEK_DAYS[day]][index] = {
            startTime: startTime,
            endTime: endTime,
          };
        } else {
          prev[CONST_WEEK_DAYS[day]].push({
            startTime: startTime,
            endTime: endTime,
          });
        }

        keyToUpdate[CONST_WEEK_DAYS[day]] = prev[CONST_WEEK_DAYS[day]];
        return {
          ...prev,
          ...keyToUpdate,
        };
      });
      props.navigation.goBack();
    }
  };

  return (
    <>
      <GlobalFlex>
        {item?.startTime && item?.endTime && (
          <DatePicker
            modal
            title={Strings.select_date}
            confirmText={Strings.confirm}
            cancelText={Strings.Cancel}
            mode={'time'}
            date={selection == 1 ? startTime : endTime}
            open={openTimePicker}
            is24hourSource={'locale'}
            minuteInterval={30}
            onCancel={() => setOpenTimePicker(false)}
            onConfirm={date => {
              if (selection === 1) {
                setStartTime(date);
              } else {
                setEndTime(date);
              }
              setOpenTimePicker(false);
            }}
          />
        )}
        <BackHeader
          is_center_text
          title={day}
          textColor={{color: colors.WHITE}}
          background={styles.backHeaderStyle}
          onBackPress={() => props.navigation.goBack()}
        />

        <Spacer space={hp(1.5)} />
        <View style={styles.rowContainerStyle}>
          <Text style={styles.titleTextStyle}>{'Start Time'}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelection(1);
              setOpenTimePicker(!openTimePicker);
            }}
            style={styles.chipContainerStyle}>
            <Text style={[{letterSpacing: wp(1)}]}>
              {moment.utc(startTime).local().format('hh:mm a')}
            </Text>
          </TouchableOpacity>
        </View>
        <BorderContainer />
        <View style={styles.rowContainerStyle}>
          <Text style={styles.titleTextStyle}>{'End Time'}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelection(2);
              setOpenTimePicker(!openTimePicker);
            }}
            style={styles.chipContainerStyle}>
            <Text style={[{letterSpacing: wp(1)}]}>
              {moment.utc(endTime).local().format('hh:mm a')}
            </Text>
          </TouchableOpacity>
        </View>
        <BorderContainer />
        <Spacer space={hp(1.5)} />
      </GlobalFlex>
      <Button buttonText={'Save'} buttonPress={() => onPressSave()} />
      <Spacer space={hp(3)} />
    </>
  );
};
