// noinspection ES6CheckImport

import React, { useState, useRef, useContext } from "react";
import {View, TouchableOpacity} from 'react-native';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
// style themes and components
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {styles, BorderContainer, Text} from './style';
import {Button} from '../../../../components/Button';
import {colors} from '../../../../res/colors';
import {Spacer} from '../../../../res/spacer';
import {underDevelopment} from '../../../../uikit-app';
import Strings from '../../../../string_key/Strings';
import { AuthContext } from "../../../../context/Auth.context";

export default Snooze = props => {
  const {onSnoozeEnabled} = props.route.params;
  const {sdk, currentUser} = useSendbirdChat();
  const {state: AuthState} = useContext(AuthContext);

  const refTodayDate = useRef(new Date());
  const todayDatePlusOneMinute = new Date(new Date().getTime() + 60 * 1000);

  const [openDatePicker, setOpenDatePicker] = useState(false);

  const refEndTs = useRef(todayDatePlusOneMinute);
  const refStartTs = useRef(refTodayDate?.current);

  const refSelection = useRef(1);
  const [selection, setSelection] = useState(1);

  const [endTs, setEndTs] = useState(todayDatePlusOneMinute);
  const [startTs, setStartTs] = useState(refTodayDate?.current);

  const update = () => {
    const mTodayDatePlus = new Date().getTime();
    if (refStartTs.current.getTime() < mTodayDatePlus) {
      underDevelopment(Strings.please_select_valid_start_date);
      return;
    }

    sdk.setSnoozePeriod(
      true,
      refStartTs.current.getTime(),
      refEndTs.current.getTime(),
      (res, e) => {
        let meta = {
          snoozData: JSON.stringify({
            isEnable: true,
            endTimestamp: refEndTs.current.getTime(),
            startTimestamp: refStartTs.current.getTime(),
          }),
        };
        currentUser.updateMetaData(meta, true);
        setTimeout(() => {
          onSnoozeEnabled(true, res);
          props.navigation.goBack();
        }, 800);
      },
    );
  };

  return (
    <>
      <GlobalFlex>
        <DatePicker
          modal
          title={Strings.select_date}
          confirmText={Strings.confirm}
          cancelText={Strings.Cancel}
          locale={AuthState.selectedLang === 'en' ? 'en_GB' : 'es_GT'}
          mode={'datetime'}
          open={openDatePicker}
          is24hourSource={'locale'}
          date={refTodayDate?.current}
          onConfirm={date => {
            if (refSelection.current === 1) {
              const bufferDate = new Date(
                new Date().getTime() + 30 * 1000,
              ).getTime();
              if (date.getTime() < bufferDate) {
                const _eDate = new Date(new Date().getTime() + 60 * 1000);
                refStartTs.current = _eDate;
                setStartTs(_eDate);
                if (
                  _eDate.getTime() >=
                  refEndTs.current.getTime() - 30 * 1000
                ) {
                  const endDate = new Date(_eDate.getTime() + 60 * 1000);
                  refEndTs.current = endDate;
                  setEndTs(endDate);
                }
              } else {
                refStartTs.current = date;
                setStartTs(date);
                if (date.getTime() >= refEndTs.current.getTime() - 30 * 1000) {
                  const endDate = new Date(date.getTime() + 60 * 1000);
                  refEndTs.current = endDate;
                  setEndTs(endDate);
                }
              }
            } else {
              if (date.getTime() >= refStartTs.current.getTime() + 60 * 1000) {
                console.log('Here...');
                refEndTs.current = date;
                setEndTs(date);
              } else {
                console.log('There...');
                const _eDate = new Date(
                  refStartTs.current.getTime() + 60 * 1000,
                );

                refEndTs.current = _eDate;
                setEndTs(_eDate);
              }

              // if (date.getTime() <= new Date().getTime()) {
              //   const _sDate = new Date();
              //   const _eDate = new Date(_sDate.getTime() + 60 * 1000);
              //   refEndTs.current = _sDate;
              //   setEndTs(_sDate);
              //
              //   refEndTs.current = _eDate;
              //   setEndTs(_eDate);
              // } else {
              //   refEndTs.current = date;
              //   setEndTs(date);
              // }
              //
              // if (refStartTs?.current?.getTime() < new Date().getTime()) {
              //   const startDate = new Date();
              //   refStartTs.current = startDate;
              //   setStartTs(startDate);
              // }
            }

            setOpenDatePicker(false);
          }}
          onCancel={() => setOpenDatePicker(false)}
          // maximumDate={selection === 1 ? refEndTs.current : undefined}
          minimumDate={selection === 1 ? new Date() : refStartTs.current}
        />
        <BackHeader
          is_center_text
          title={Strings.Snooze}
          textColor={{color: colors.WHITE}}
          background={styles.backHeaderStyle}
          onBackPress={() => props.navigation.goBack()}
        />

        <Spacer space={hp(1.5)} />
        <View style={styles.rowItemContainerStyle}>
          <Text style={styles.titleTextStyle}>{Strings.start_time}</Text>

          <View style={styles.timeChipsContainerStyle}>
            <TouchableOpacity
              onPress={() => {
                setSelection(() => {
                  refSelection.current = 1;
                  return 1;
                });
                refTodayDate.current = new Date();
                setOpenDatePicker(!openDatePicker);
              }}
              style={styles.dateContainerStyle}>
              <Text>{moment(startTs).format('DD-MMM-YYYY')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelection(() => {
                  refSelection.current = 1;
                  return 1;
                });
                refTodayDate.current = new Date();
                setOpenDatePicker(!openDatePicker);
              }}
              style={styles.timeContainerStyle}>
              <Text style={[{letterSpacing: wp(1)}]}>
                {moment(startTs).format('HH:mm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <BorderContainer />
        <View style={styles.rowItemContainerStyle}>
          <Text style={styles.titleTextStyle}>{Strings.end_time}</Text>
          <View style={styles.timeChipsContainerStyle}>
            <TouchableOpacity
              onPress={() => {
                setSelection(() => {
                  refSelection.current = 2;
                  return 2;
                });
                refTodayDate.current = new Date();
                setOpenDatePicker(!openDatePicker);
              }}
              style={styles.dateContainerStyle}>
              <Text>{moment(endTs).format('DD-MMM-YYYY')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelection(() => {
                  refSelection.current = 2;
                  return 2;
                });
                refTodayDate.current = new Date();
                setOpenDatePicker(!openDatePicker);
              }}
              style={styles.timeContainerStyle}>
              <Text style={[{letterSpacing: wp(1)}]}>
                {moment(endTs).format('HH:mm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <BorderContainer />
        <Spacer space={hp(1.5)} />
      </GlobalFlex>
      <Button buttonText={Strings.save} buttonPress={() => update()} />
      <Spacer space={hp(3)} />
    </>
  );
};
