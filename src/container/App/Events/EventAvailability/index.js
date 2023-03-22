// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {Pressable, ScrollView, Switch} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles, {
  Button,
  DayText,
  PlusIcon,
  TimeText,
  TimeContainer,
  InnerContainer,
  TimeColContainer,
  DayMainContainer,
  HeaderShadowLine,
} from './style';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {colors} from '../../../../res/colors';
import {Spacer} from '../../../../res/spacer';
import IconAssets from '../../../../assets';
import {GET, POST} from '../../../../api_helper/ApiServices';
import {
  GET_ALL_EVENT_TYPES,
  GET_USER_AVAILABILITY,
  POST_USER_AVAILABILITY,
} from '../../../../api_helper/Api';
import {underDevelopment} from '../../../../uikit-app';
import {AuthContext} from '../../../../context/Auth.context';
import moment from 'moment';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';

const CONST_WEEK_DAYS = {
  Sunday: 'sun',
  Monday: 'mon',
  Tuesday: 'tue',
  Wednesday: 'wed',
  Thursday: 'thu',
  Friday: 'fri',
  Saturday: 'sat',
};
const apiData = {
  sun: [
    // {
    //   startTime: '2023-01-10T04:00:35.542Z',
    //   endTime: '2023-01-10T04:34:12.974Z',
    // },
    // {
    //   startTime: '2023-01-10T04:34:12.974Z',
    //   endTime: '2023-01-10T12:00:00.000Z',
    // },
  ],
  mon: [
    // {
    //   startTime: '2023-01-10T13:22:25.836Z',
    //   endTime: '2023-01-10T13:25:36.650Z',
    // },
  ],
  tue: [
    // {
    //   startTime: '2023-01-10T09:00:00.000Z',
    //   endTime: '2023-01-10T09:00:00.000Z',
    // },
  ],
  wed: [
    // {
    //   startTime: '2023-01-10T09:00:00.000Z',
    //   endTime: '2023-01-10T09:00:00.000Z',
    // },
  ],
  thu: [
    // {
    //   startTime: '2023-01-10T09:00:00.000Z',
    //   endTime: '2023-01-10T09:00:00.000Z',
    // },
  ],
  fri: [
    // {
    //   startTime: '2023-01-10T09:00:00.000Z',
    //   endTime: '2023-01-10T09:00:00.000Z',
    // },
  ],
  sat: [
    // {
    //   startTime: '2023-01-10T09:00:00.000Z',
    //   endTime: '2023-01-10T09:00:00.000Z',
    // },
  ],
};
export default EventAvailability = props => {
  const {state: ContextState, updateUserData} = useContext(AuthContext);
  console.log('token', ContextState.userData.userId);
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 1);

  const dummyStartdate = new Date();
  const dummyEnddate = new Date();
  dummyStartdate.setMinutes(0);
  dummyStartdate.setHours(9);
  dummyEnddate.setMinutes(0);
  dummyEnddate.setHours(17);

  const [isLoading, setLoading] = useState(false);
  const [dayStatus, setDayStatus] = useState({});
  const getUserAvailability = async () => {
    setLoading(true);
    const url = GET_USER_AVAILABILITY(
      ContextState.userData.userId,
      fromDate.toISOString(),
      toDate.toISOString(),
    );

    try {
      const response = await GET(url, ContextState?.userData?.token, '');
      const _response = response.data;

      const rez = _response?.availability;
      if (rez) {
        let x = {...rez};
        Object?.keys(CONST_WEEK_DAYS).forEach(day => {
          let y = CONST_WEEK_DAYS[day];
          let z = x[y];
          console.log(z);
          z?.forEach((item, index) => {
            console.log('it==>', item);
            if (item?.startTime && item?.endTime) {
              console.log(
                'this log===>',
                moment
                  .utc(moment(item?.startTime, 'hh:mm:ss'))
                  .local()
                  .format('YYYY-MM-DDTHH:mm:ss'),
              );

              let st = moment
                .utc(moment(item?.startTime, 'hh:mm:ss'))
                .local()
                .format('YYYY-MM-DDTHH:mm:ss');
              let et = moment
                .utc(moment(item?.endTime, 'hh:mm:ss'))
                .local()
                .format('YYYY-MM-DDTHH:mm:ss');
              item.startTime = st;
              item.endTime = et;
            }
          });
        });
        console.log('x==>', x);
        setDayStatus(x);
        // setDayStatus(apiData);
        setLoading(false);
      }
    } catch (e) {
      underDevelopment('An Eroor Occured');
      console.log('response (error) => ', e.message);
      // return {
      //   success: false,
      //   response: e.message,
      // };
    }
  };
  useEffect(() => {
    getUserAvailability();
  }, []);

  const editTimeSlot = () => {
    console.log('Next pressed!');
  };
  const addTimeSlot = () => {
    console.log('Next pressed!');
  };
  const removeTimeSlot = () => {
    console.log('Next pressed!');
  };
  const onPressNext = () => {
    setLoading(() => true);
    console.log('Next pressed!', dayStatus);

    let params = {};
    Object.keys(dayStatus).forEach(key => {
      if (dayStatus[key].length > 0) {
        const obj = {};
        console.log('before', obj[key]);
        obj[key] = dayStatus[key];
        const dt = new Date();

        obj[key].map(it => {
          if (typeof it.startTime === 'string') {
            if (!it.startTime.includes('Z')) {
              let nowst = new Date(it.startTime);
              nowst.setMinutes(nowst.getMinutes() - dt.getTimezoneOffset());
              nowst = nowst.toISOString();

              let nowet = new Date(it.endTime);
              nowet.setMinutes(nowet.getMinutes() - dt.getTimezoneOffset());
              nowet = nowet.toISOString();

              it.startTime = nowst;
              it.endTime = nowet;
            }
          }
        });

        params = {
          ...params,
          ...obj,
        };
      }
    });

    // correct time zone offset for generating iso string

    console.log('params ===> ', params);
    // return;
    POST(
      POST_USER_AVAILABILITY,
      true,
      ContextState.userData.token,
      '',
      dayStatus,
      (res, e) => {
        setLoading(() => false);
        if (!e) {
          console.log('Success => ', JSON.stringify(res));
        } else {
          underDevelopment(res.includes(':') ? res.split(':')[1].trim() : res);
          console.log('Error => ', res);
        }
      },
    );
  };
  return (
    <GlobalFlex>
      <BackHeader
        isRightText
        is_center_text
        title={'Availability'}
        rightIcon={IconAssets.ic_done}
        onBackPress={() => props.navigation.goBack()}
        onNextPress={onPressNext}
      />
      <Spacer space={wp(1.5)} />
      <HeaderShadowLine />
      <Spacer space={hp(0.5)} />

      <ScrollView>
        {Object.keys(CONST_WEEK_DAYS).map(day => (
          <DayMainContainer>
            <InnerContainer>
              <Spacer space={wp(5.5)} />
              <Switch
                trackColor={{
                  false: colors.DARK_GRAY_91,
                  true: colors.LIGHT_PRIMARY_COLOR,
                }}
                thumbColor={
                  dayStatus[CONST_WEEK_DAYS[day]]?.length > 0
                    ? colors.PRIMARY_COLOR
                    : colors.DARK_THUMB
                }
                onValueChange={val => {
                  if (val == false) {
                    setDayStatus(prev => {
                      let keyToUpdate = {};
                      keyToUpdate[CONST_WEEK_DAYS[day]] = [];
                      return {
                        ...prev,
                        ...keyToUpdate,
                      };
                    });
                  } else {
                    setDayStatus(prev => {
                      let keyToUpdate = {};
                      keyToUpdate[CONST_WEEK_DAYS[day]] = apiData[
                        CONST_WEEK_DAYS[day]
                      ]?.length
                        ? apiData[CONST_WEEK_DAYS[day]]
                        : [
                            {
                              startTime: dummyStartdate.toISOString(),
                              endTime: dummyEnddate.toISOString(),
                            },
                          ];
                      return {
                        ...prev,
                        ...keyToUpdate,
                      };
                    });
                  }
                }}
                value={
                  dayStatus[CONST_WEEK_DAYS[day]]?.length > 0 ? true : false
                }
              />
              <DayText>{day}</DayText>
            </InnerContainer>
            <TimeColContainer>
              {!dayStatus[CONST_WEEK_DAYS[day]] ||
              dayStatus[CONST_WEEK_DAYS[day]]?.length == 0 ? (
                <InnerContainer>
                  <TimeContainer padHor={wp('7.8%')}>
                    <TimeText isEnabled={false}>{'Unavailable'}</TimeText>
                  </TimeContainer>
                  <Button disabled={false}>
                    <PlusIcon source={IconAssets.ic_plus} disabled />
                  </Button>
                </InnerContainer>
              ) : (
                dayStatus[CONST_WEEK_DAYS[day]]?.map((item, index) => (
                  <InnerContainer padTop={!index == 0}>
                    <Pressable
                      onPress={() => {
                        console.log('On press add schedule');
                        props.navigation.navigate('TimeSlotPicker', {
                          edit: true,
                          item,
                          index,
                          day,
                          dayStatus,
                          CONST_WEEK_DAYS,
                          setDayStatus: setDayStatus,
                        });
                      }}>
                      <TimeContainer>
                        <TimeText isEnabled={true}>
                          {moment.utc(item.startTime).local().format('hh:mm a')}{' '}
                          - {moment.utc(item.endTime).local().format('hh:mm a')}
                        </TimeText>
                      </TimeContainer>
                    </Pressable>
                    {index == 0 ? (
                      <Button
                        disabled={false}
                        onPress={() => {
                          console.log('On press add schedule');
                          props.navigation.navigate('TimeSlotPicker', {
                            item: {
                              startTime: dummyStartdate.toISOString(),
                              endTime: dummyEnddate.toISOString(),
                            },
                            index,
                            day,
                            dayStatus,
                            CONST_WEEK_DAYS,
                            setDayStatus: setDayStatus,
                          });
                        }}>
                        <PlusIcon source={IconAssets.ic_plus} />
                      </Button>
                    ) : (
                      <Button
                        disabled={false}
                        onPress={() =>
                          setDayStatus(prev => {
                            let keyToUpdate = {};
                            keyToUpdate[CONST_WEEK_DAYS[day]] = prev[
                              CONST_WEEK_DAYS[day]
                            ].filter((it, ind) => ind !== index);
                            return {
                              ...prev,
                              ...keyToUpdate,
                            };
                          })
                        }>
                        <PlusIcon source={IconAssets.btnCallDecline} />
                      </Button>
                    )}
                  </InnerContainer>
                ))
              )}
            </TimeColContainer>
          </DayMainContainer>
        ))}

        <Spacer space={wp(15)} />
      </ScrollView>
      {isLoading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: hp(90),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </GlobalFlex>
  );
};
