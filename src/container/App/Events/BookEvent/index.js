// noinspection ES6CheckImport

import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Switch,
  View,
  ScrollView,
  Image,
  Text as RnText,
  Platform,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import {GlobalFlex} from '../../../../res/globalStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles, {
  ActionWrapper,
  BorderContainer,
  Text,
  LabelText,
  LocationDivider,
} from './style';
import {BackHeader} from '../../../../components/BackHeader';
import CalendarPicker from 'react-native-calendar-picker';
import {Input} from '../../../../components/Input';
import {RegularText} from '../../Account/style';
import {images} from '../../../../res/images';
import {colors} from '../../../../res/colors';
import {Spacer} from '../../../../res/spacer';
import {fonts} from '../../../../res/fonts';
import moment from 'moment-timezone';
import {
  DELETE_MEETING_BY_ID,
  GET_MEETING_DETAILS_BY_ID,
  POST_BOOK_MEETING,
  POST_USER_MEETINGS,
  POST_EVENT_ORDER,
  POST_BOOK_1_TO_1_MEETING,
  GET_USER_AVAILABILITY,
  PATCH_EVENT_BY_ID,
} from '../../../../api_helper/Api';
import {
  DELETE,
  GET,
  PATCH,
  POST,
  PUT_SENDBIRD,
} from '../../../../api_helper/ApiServices';
import AsyncStorage from '@react-native-community/async-storage';
import {underDevelopment} from '../../../../uikit-app';
import DatePicker from 'react-native-date-picker';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import RNCalendarEvents from 'react-native-calendar-events';
import {HeaderShadowLine} from '../EventSettings/style';
import {TimePicker} from './components/TimePicker';
import type {EventDetails} from '../types';
import {AuthContext} from '../../../../context/Auth.context';
import {getLanguageValueFromKey} from '../../../../commonAction';
import {Button} from '../../../../components/Button';
import {
  generateAvailableTimeSlots,
  getAvailableDates,
  getAvailableTimeSlots,
  getMergedStartEndTimes,
  getMissingDays,
} from './utils';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Routes} from '../../../../libs/navigation';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {EventRegister} from 'react-native-event-listeners';
import Strings from '../../../../string_key/Strings';

const ToggleSwitch = props => {
  const {title, onValueChange, isLastSeen, setIsLastSeen} = props;
  return (
    <>
      <ActionWrapper onPress={() => setIsLastSeen(!isLastSeen)}>
        <Text style={[{alignSelf: 'center', fontFamily: fonts.REGULAR}]}>
          {title || 'Title here'}
        </Text>

        <Switch
          trackColor={{
            false: colors.DARK_GRAY_91,
            true: colors.LIGHT_PRIMARY_COLOR,
          }}
          thumbColor={isLastSeen ? colors.PRIMARY_COLOR : colors.DARK_THUMB}
          onValueChange={onValueChange}
          value={isLastSeen}
        />
      </ActionWrapper>
      <BorderContainer />
    </>
  );
};

const CONST_DATE_FORMAT = 'MMM D, YYYY';
const HALF_MINUTE_MILLIS = 30 * 1000;
const ONE_MINUTE_MILLIS = 60 * 1000;
export const TWO_MONTHS_PLUS_WEEK = 5259600000 + 604800016.56;
const ONE_HOUR_MILLIS = 3600 * 1000;
const location_Obj = {description: '', latitude: '', longitude: ''};
const CONST_GOOGLE_PLACES_QUERY = {
  key: 'AIzaSyBTfypSbx_zNMhWSBXMTA2BJBMQO7_9_T8',
  language: 'en',
  // types: '(cities)',
};
const CONST_PAGE = {
  SELECT_DATE: 1,
  SELECT_TIME: 2,
  ENTER_DETAILS: 3,
};

const EnterDetails = props => {
  const {state: ContextState, updateUserData} = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [name, setName] = useState(ContextState?.userData?.displayName);
  const [location, setLocation] = useState(location_Obj);
  // const [locEdited, setLocEdited] = useState('');
  const locEdited = useRef('');
  const [email, setEmail] = useState(ContextState?.userData?.email);
  React.useEffect(() => {
    props.onDataChanged({
      isFormValid:
        description.length > 0 &&
        name.length > 0 &&
        location.description.length > 0 &&
        email.length > 0,
      name,
      email,
      location,
      description,
    });
  }, [description, name, location, email]);
  return (
    <>
      <Spacer space={wp(2)} />
      <Text>Enter Details</Text>
      <Spacer space={wp(1)} />
      <View style={{width: wp(88), alignSelf: 'center'}}>
        <LabelText>Name *</LabelText>
        <Input
          value={name}
          onChange={setName}
          placeholder={'Name'}
          mainstyle={{width: '100%'}}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
      </View>
      <Spacer space={wp(1)} />
      <View style={{width: wp(88), alignSelf: 'center'}}>
        <LabelText>Location *</LabelText>
        {/* <Input
          value={location}
          onChange={setLocation}
          placeholder={'Location'}
          mainstyle={{width: '100%'}}
          keyboardType={'email-address'}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        /> */}
        <GooglePlacesAutocomplete
          placeholder="Location"
          suppressDefaultStyles={true}
          enablePoweredByContainer={false}
          fetchDetails
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            // locEdited.current = data?.description;
            setLocation({
              description: data?.description,
              longitude: details?.geometry?.location.lng,
              latitude: details?.geometry?.location?.lat,
            });
            console.log(data?.description);
            console.log(details?.geometry?.location);
          }}
          renderRow={
            (item, i) => (
              <>
                <View style={styles.locationItem}>
                  <RegularText>
                    {item?.structured_formatting?.main_text}
                  </RegularText>
                </View>
                <LocationDivider />
              </>
            )
            // console.log('item => ', item?.structured_formatting?.main_text)
          }
          textInputProps={{
            InputComp: _props => (
              <Input
                value={location.description}
                placeholder={'Location'}
                mainstyle={{width: '100%'}}
                style={{paddingBottom: wp(2)}}
                placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                {..._props}
              />
            ),
            errorStyle: {color: 'red'},
            onEndEditing: c =>
              setLocation({
                description: locEdited.current,
                latitude: '',
                longitude: '',
              }),
            onChangeText: v => (locEdited.current = v),
          }}
          styles={{
            textInput: {
              color: 'black',
            },
          }}
          query={CONST_GOOGLE_PLACES_QUERY}
        />
      </View>
      <Spacer space={wp(1)} />
      <View style={{width: wp(88), alignSelf: 'center'}}>
        <LabelText>Email *</LabelText>
        <Input
          value={email}
          onChange={setEmail}
          placeholder={'Email'}
          mainstyle={{width: '100%'}}
          keyboardType={'email-address'}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
      </View>
      <Spacer space={wp(1)} />
      <View style={styles.mainDescriptionContainerStyle}>
        <Input
          topPlaceholder
          multiline={true}
          value={description}
          onChange={setDescription}
          placeholder={'Notes'}
          style={styles.descriptionStyle}
          mainstyle={styles.descriptionContainerStyle}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
      </View>
    </>
  );
};

const getDurationText = (startDate, endDate) => {
  if (startDate === '') {
    return '';
  }
  let a = moment(endDate);
  let b = moment(startDate);
  let diff_s = a.diff(b, 'seconds');
  const values = moment
    .utc(moment.duration(diff_s, 'seconds').asMilliseconds())
    .format('hh:mm')
    .split(':');
  const hours = parseInt(values[0], 10);
  const mins = parseInt(values[1], 10);

  let hoursText = '';
  if (hours > 0) {
    hoursText = hours;
  }

  let minText = '';
  if (mins > 0) {
    minText = mins;
  }

  let durationText = `${hours} hrs & ${mins} mins`;

  if (hoursText.length !== '') {
    durationText = `${hoursText} ${hours > 1 ? 'hrs' : 'h'}`;
  }

  if (minText !== '') {
    durationText = `${durationText} & ${minText} ${mins > 1 ? 'mins' : 'm'}`;
  }

  return durationText;
};

export default BookEvent = props => {
  const isEvent: boolean = !props.route.params?.isOneToOneEvent;
  const eventDetails: EventDetails = props.route.params?.data;
  const {state: ContextState, updateUserData} = useContext(AuthContext);
  const durationText = getDurationText(
    eventDetails?.start_date,
    eventDetails?.end_date,
  );

  const refSelectedDate = useRef(undefined);
  const refSelectedTime = useRef(undefined);
  const refUserDetails = useRef({
    isFormValid: false,
    name: '',
    email: '',
    location: '',
    description: '',
  });

  const [currentPage, setCurrentPage] = useState(CONST_PAGE.SELECT_DATE);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [timeZone, setTimezone] = useState(moment?.tz.guess());
  // const [selectedDate, setSelectedDate] = useState({
  //   date: moment(new Date()),
  //   text: moment(new Date()).format(CONST_DATE_FORMAT),
  // });

  /**
   * Time picker stuff...
   * @param value
   */
  const todayDate = new Date();
  const refCurrentMinDate = useRef(new Date());
  const refMinDate = useRef(todayDate);
  const refMaxDate = useRef(todayDate);
  const refStartHour = useRef(-1);
  const refStartMin = useRef(-1);
  const refEndHour = useRef(-1);
  const refEndMin = useRef(-1);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [selection, setSelection] = useState(1);
  const {sdk, currentUser} = useSendbirdChat();
  const refTimeSlots = useRef([]);
  const refAvailableStartEnd = useRef({});
  const [availableDates, setAvailableDates] = useState([]);
  const [availabilityResponse, setAvailabilityResponse] = useState({});
  // console.log('eventDetails : ', eventDetails);

  useEffect(() => {
    const startDate = new Date().addDays(1);
    const endDate = new Date(new Date().getTime() + TWO_MONTHS_PLUS_WEEK);

    let dateArray = getAvailableDates(startDate, endDate, []);
    let availableDays = [];
    for (let i = 0; i < dateArray.length; i++) {
      // let d = dateArray[i].toISOString().split('T')[0] + 'T07:00:00.000Z';
      let d = moment(dateArray[i]).format('YYYY-MM-DD');
      // d = moment(d).utc();
      availableDays.push(
        d,
        // dateArray[i].toISOString().split('T')[0] + 'T12:00:00.000Z',
      );
    }

    setLoading(() => true);
    getUserAvailability()
      .then(({success, response}) => {
        //console.log('===>>>>>inuser avail', success, response);
        setLoading(() => false);
        if (!success) {
          underDevelopment('Backend error!');
        }

        refAvailableStartEnd.current = getMergedStartEndTimes(
          response?.availability,
        );
        // console.log('response?.availability====>>>> ', response?.availability);

        const missingDays = getMissingDays(refAvailableStartEnd?.current);

        if (missingDays.length > 0) {
          // Remove missing days from calendar...
          let realAvailableDate = [];
          availableDays.forEach(day => {
            if (
              !missingDays.includes(moment(day).format('ddd').toLowerCase())
            ) {
              realAvailableDate.push(day);
            }
          });

          setAvailableDates(() => realAvailableDate);
        } else {
          setAvailableDates(() => availableDays);
        }

        setAvailabilityResponse(() => response);
      })
      .catch(({success, response}) => {
        console.log('response', success);
        setLoading(() => false);
        underDevelopment(
          response ? response : Strings.unable_to_get_user_availability,
        );
      });
  }, []);
  function navigateToGroupChannelScreen(channel) {
    props.navigation.pop();
    props.navigation.pop();
    props.navigation.pop();
    // setTimeout(() => {
    // props.navigation.replace(Routes.GroupChannelTabs);

    setTimeout(() => {
      props.navigation.navigate('chat', {
        screen: Routes.GroupChannel,
        params: {
          serializedChannel: channel.serialize(),
        },
      });
    }, 500);
    // }, 250);
  }

  const getUserAvailability = async () => {
    const userId = props.route.params?.filterId;
    const fromDate = moment(Date.now()).toISOString();
    const toDate = moment(Date.now() + TWO_MONTHS_PLUS_WEEK).toISOString();
    const url = GET_USER_AVAILABILITY(userId, fromDate, toDate);
    console.log(url);
    try {
      const response = await GET(url, ContextState?.userData?.token, '');
      const _response = response.data;
      console.log('response in api function', _response);
      return {
        success: true,
        response: _response,
      };
    } catch (e) {
      return {
        success: false,
        response: e.message,
      };
    }
  };

  const bookOneToOneEvent = () => {
    if (!refUserDetails?.current?.isFormValid) {
      underDevelopment(Strings.please_enter_details);
      return;
    }

    // {"endTime": "2023-01-11T10:00:00.000Z", "startTime": "2023-01-11T9:30:00.000Z", "timeText": "9:30am"}
    console.log('refSelectedTime?.current ==> ', props.route.params?.filterId, {
      userId: ContextState?.userData?.userId,
      endTime: refSelectedTime?.current?.endTime,
      startTime: refSelectedTime?.current?.startTime,
      description: refUserDetails?.current?.description,
      location: {
        longitude: refUserDetails?.current?.location?.longitude,
        latitude: refUserDetails?.current?.location?.latitude,
        location: refUserDetails?.current?.location?.description,
      },
      title: refUserDetails?.current?.name,
    });
    // return;
    setLoading(() => true);
    POST(
      POST_BOOK_1_TO_1_MEETING,
      true,
      ContextState?.userData?.token,
      '',
      {
        // userId: ContextState?.userData?.userId,
        userId: props.route.params?.filterId,

        endTime: refSelectedTime?.current?.endTime,
        startTime: refSelectedTime?.current?.startTime,
        description: refUserDetails?.current?.description,
        location: {
          longitude: refUserDetails?.current?.location?.longitude,
          latitude: refUserDetails?.current?.location?.latitude,
          location: refUserDetails?.current?.location?.description,
        },
        title: refUserDetails?.current?.name,
      },
      (res, e) => {
        console.log('res in booking event@@+,', res, 'e', e);
        setLoading(() => false);
        if (!e) {
          if (res?.payment_link?.length) {
            props.navigation.navigate('StripePaymentScreen', {
              siteLink: res?.payment_link,
              isMembershipFlow: false,
              onPaymentSuccess: async () => {
                props.navigation.goBack();

                // const onEventBooked = props?.route?.params?.onEventBooked;
                // if (onEventBooked) {
                //   onEventBooked();
                // }
              },
            });
          } else underDevelopment(res?.message);
        } else {
          console.log('POST_BOOK_1_TO_1_MEETING (error) => ', res);
        }
      },
    );
  };
  const handleChannelNav = async () => {
    console.log('events detials', eventDetails?.sendbird_channel);
    const channel = await sdk.GroupChannel.getChannel(
      eventDetails?.sendbird_channel,
    );
    console.log('channel detials', channel);

    if (channel && channel.channelType == 'group') {
      console.log('the channel', channel.channelType);

      PUT_SENDBIRD(
        eventDetails.sendbird_channel,
        currentUser?.userId,
        async chan => {
          console.log('====>>>joined channel successfully');
          EventRegister.emit('group-channel-update');
          // Alert.alert(channel?.channelname, 'Thank you for joining');
          // navigateToGroupChannelScreen(channel);
        },
      );
    }
  };
  const orderOneToOneEvent = () => {
    console.log('orderOneToOneEvent', {
      event_id: eventDetails.id,
      endTime: eventDetails.end_date,
      startTime: eventDetails.start_date,
      product_id: parseInt(eventDetails.product_id, 10),
      sendbird_channel: eventDetails?.sendbird_channel,
    });

    // return;
    setLoading(() => true);
    POST(
      POST_EVENT_ORDER,
      true,
      ContextState?.userData?.token,
      '',
      {
        event_id: eventDetails.id,
        endTime: eventDetails.end_date,
        startTime: eventDetails.start_date,
        product_id: parseInt(eventDetails.product_id, 10),
      },
      (res, e) => {
        setLoading(() => false);
        if (!e) {
          if (res?.payment_link?.length) {
            props.navigation.navigate('StripePaymentScreen', {
              siteLink: res?.payment_link,
              orderId: res?.order?.order_id,
              productId: eventDetails.product_id,
              isMembershipFlow: false,
              onPaymentSuccess: () => {
                props.navigation.goBack();
                const onEventBooked = props?.route?.params?.onEventBooked;
                if (onEventBooked) {
                  onEventBooked();
                  handleChannelNav();
                }
              },
            });
          } else underDevelopment(res?.message);
        } else {
          console.log('PATCH_UPDATE_PROFILE (error) => ', res);
          underDevelopment(res);
        }
      },
    );
  };

  const createBookingEvent = async () => {
    const status = await RNCalendarEvents.requestPermissions();

    if (status !== 'authorized') {
      underDevelopment('Need calendar permission to book event.');
      return;
    }

    const currentTime = new Date().getTime();

    if (title.length < 1) {
      underDevelopment('Please enter the title.');
      return;
    } /*else if (location.length < 1) {
      underDevelopment('Please enter the location.');
      return;
    } */ else if (refMinDate.current.getTime() < currentTime) {
      underDevelopment('Please enter valid start time.');
      return;
    } else if (
      refMaxDate.current.getTime() < currentTime ||
      refMaxDate.current.getTime() < refMinDate.current.getTime()
    ) {
      underDevelopment('Please enter valid end time.');
      return;
    } else if (description.length < 1) {
      underDevelopment('Please enter notes.');
      return;
    }

    const params = {
      title: title,
      event_type: 1,
      description: description,
      start: moment(refMinDate.current.getTime()).toISOString(),
      end: moment(refMaxDate.current.getTime()).toISOString(),
    };

    const userData = await AsyncStorage.getItem('userDetails').then(data =>
      JSON.parse(data),
    );

    setLoading(() => true);
    POST(POST_BOOK_MEETING, true, userData.token, '', params, (res, e) => {
      setLoading(() => false);
      const success = !e;
      if (success) {
        console.log('response (success) => ', res);
        // getBookingDetailsById(res?.id, eventDetails =>
        //   createCalendarEvent(eventDetails),
        // );
      } else {
        underDevelopment(res);
        console.log('response (success) => ', res);
      }
    });
  };

  function handleNextPress(isDatePressed: boolean = false) {
    if (
      currentPage === CONST_PAGE.SELECT_DATE &&
      !isDatePressed
      // &&
      // refSelectedDate.current === undefined
    ) {
      underDevelopment('Please select a date to continue');
      return;
    }
    if (currentPage < CONST_PAGE.ENTER_DETAILS) {
      if (currentPage === CONST_PAGE.SELECT_TIME) {
        if (refSelectedTime?.current === undefined) {
          underDevelopment('Please select time to continue');
          return;
        }
      }
      setCurrentPage(prevState => ++prevState);
    } else {
      bookOneToOneEvent();
    }
  }

  return (
    <GlobalFlex>
      <DatePicker
        modal
        title={Strings.select_date}
        confirmText={Strings.confirm}
        cancelText={Strings.Cancel}
        mode={'time'}
        minuteInterval={15}
        open={openTimePicker}
        is24hourSource={'locale'}
        date={refCurrentMinDate.current}
        minimumDate={refCurrentMinDate?.current}
        onCancel={() => setOpenTimePicker(false)}
        onConfirm={date => {
          // TODO: Need to send date in range of 1 hr.
          //       endDate-startDate =1. and any of dates should not be past dates
          const _date = new Date();
          const hours = parseInt(moment(date).format('HH'), 10);
          const minutes = parseInt(moment(date).format('mm'), 10);

          if (selection === 1) {
            // TODO: Need to fix this part...

            const selectedTime =
              date.getTime() + ONE_HOUR_MILLIS + HALF_MINUTE_MILLIS;

            refMinDate.current = date;
            refStartHour.current = hours;
            refStartMin.current = minutes;
            setStartTime(moment(date).format('HH:mm'));

            const endDate = new Date(selectedTime);
            const _hours = parseInt(moment(endDate).format('HH'), 10);
            const _minutes = parseInt(moment(endDate).format('mm'), 10);

            refMaxDate.current = endDate;
            refEndHour.current = _hours;
            refEndMin.current = _minutes;
            setEndTime(moment(endDate).format('HH:mm'));

            // refMinDate.current = date;
            // refStartHour.current = hours;
            // refStartMin.current = minutes;
            // setStartTime(moment(date).format('HH:mm'));
            //
            // if (
            //   date.getTime() >=
            //   refMaxDate?.current?.getTime() - HALF_MINUTE_MILLIS
            // ) {
            //   const endDate = new Date(
            //     date.getTime() + ONE_HOUR_MILLIS + HALF_MINUTE_MILLIS,
            //   );
            //   const _hours = parseInt(moment(endDate).format('HH'), 10);
            //   const _minutes = parseInt(moment(endDate).format('mm'), 10);
            //   refMaxDate.current = endDate;
            //   refEndHour.current = _hours;
            //   refEndMin.current = _minutes;
            //   setEndTime(moment(endDate).format('HH:mm'));
            // }
          } else {
            // TODO: This part is fixed...
            const currentTime =
              _date.getTime() + ONE_HOUR_MILLIS + HALF_MINUTE_MILLIS;
            console.log(
              'date.getTime() < currentTime ==> ',
              date.getTime() < currentTime,
            );
            if (date.getTime() < currentTime) {
              const newEndDate = new Date(currentTime + ONE_HOUR_MILLIS);
              let _hours = parseInt(moment(newEndDate).format('HH'), 10);
              let _minutes = parseInt(moment(newEndDate).format('mm'), 10);
              refMaxDate.current = newEndDate;
              refEndHour.current = _hours;
              refEndMin.current = _minutes;

              refMinDate.current = _date;
              _hours = parseInt(moment(_date).format('HH'), 10);
              _minutes = parseInt(moment(_date).format('mm'), 10);
              refStartHour.current = _hours;
              refStartMin.current = _minutes;
              setStartTime(moment(_date).format('HH:mm'));

              setEndTime(moment(currentTime).format('HH:mm'));
              return;
            }

            refMaxDate.current = date;
            refEndHour.current = hours;
            refEndMin.current = minutes;
            setEndTime(moment(date).format('HH:mm'));

            const startDate = new Date(date.getTime() - ONE_HOUR_MILLIS);
            const _hours = parseInt(moment(startDate).format('HH'), 10);
            const _minutes = parseInt(moment(startDate).format('mm'), 10);
            refMinDate.current = startDate;
            refStartHour.current = _hours;
            refStartMin.current = _minutes;
            setStartTime(moment(startDate).format('HH:mm'));

            // if (
            //   date.getTime() <
            //   refMinDate?.current?.getTime() + HALF_MINUTE_MILLIS
            // ) {
            //   const startDate = new Date(date.getTime() - ONE_MINUTE_MILLIS);
            //   const _hours = parseInt(moment(startDate).format('HH'), 10);
            //   const _minutes = parseInt(moment(startDate).format('mm'), 10);
            //   refMinDate.current = startDate;
            //   refStartHour.current = _hours;
            //   refStartMin.current = _minutes;
            //   setStartTime(moment(startDate).format('HH:mm'));
            // }
          }
          setOpenTimePicker(false);
        }}
      />
      <BackHeader
        isModal
        is_center_text
        isRightText={true}
        onNextPress={() => {
          if (isEvent) {
            return;
          }
          handleNextPress();
        }}
        onBackPress={() => {
          if (currentPage > CONST_PAGE.SELECT_DATE) {
            if (currentPage === CONST_PAGE.SELECT_TIME) {
              refSelectedTime.current = undefined;
            }
            setCurrentPage(prevState => --prevState);
          } else {
            props.navigation.goBack();
          }
        }}
        title={eventDetails?.title}
        nextTextStyle={styles.nextTextStyle}
        // onNextPress={() => createBookingEvent()}
        rightText={
          isEvent
            ? ''
            : currentPage < CONST_PAGE.ENTER_DETAILS
            ? Strings.next
            : Strings.done
        }
      />
      <Spacer space={wp(1.5)} />
      <HeaderShadowLine />
      <View style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }>
          {currentPage === CONST_PAGE.SELECT_DATE ? (
            <>
              <Spacer space={wp(2)} />
              {durationText?.trim()?.length > 0 && (
                <>
                  <Text
                    style={{alignSelf: 'flex-start', marginStart: wp('6%')}}>
                    Event Details ({durationText})
                  </Text>
                  <Spacer space={wp(1)} />
                  <RnText style={{paddingHorizontal: wp('6%'), color: 'black'}}>
                    {eventDetails?.description}
                  </RnText>
                  <Spacer space={wp(2)} />
                  <HeaderShadowLine light />
                </>
              )}
              {!isEvent ? (
                <>
                  <Spacer space={wp(2)} />
                  <Text>Select a Day</Text>
                  <Spacer space={wp(2)} />
                  <CalendarPicker
                    nextTitleStyle={{color: 'black'}}
                    previousTitleStyle={{color: 'black'}}
                    disabledDates={date => {
                      return !availableDates.includes(
                        moment(date.toISOString()).format('YYYY-MM-DD'),
                      );
                    }}
                    customDatesStyles={date => {
                      const isoDate = date.toISOString().split('T')[0];
                      const _todayDate = moment().toISOString().split('T')[0];
                      const isTodayDate = _todayDate === isoDate;
                      if (
                        isTodayDate &&
                        !availableDates.includes(date.toISOString())
                      ) {
                        return {
                          style: {
                            backgroundColor: 'rgba(84,84,84,0.41)',
                          },
                          textStyle: {
                            color: 'black',
                            fontWeight: 'bold',
                          },
                        };
                      }
                      return {
                        style: {
                          backgroundColor: 'rgba(101,41,226,0.2)',
                        },
                        textStyle: {
                          color: colors.PRIMARY_COLOR,
                          fontWeight: 'bold',
                        },
                      };
                    }}
                    minDate={new Date()}
                    maxDate={
                      new Date(new Date().getTime() + TWO_MONTHS_PLUS_WEEK)
                    }
                    startFromMonday={true}
                    todayTextStyle={{fontWeight: 'bold'}}
                    todayBackgroundColor={'red'}
                    width={wp(94)}
                    onDateChange={date => {
                      console.log('on Press Date => ', date.toISOString());
                      refSelectedDate.current = date.toISOString();
                      const startDate = `${
                        refSelectedDate?.current?.split('T')[0]
                      }T00:00:00.000Z`;
                      const endDate = `${
                        refSelectedDate?.current?.split('T')[0]
                      }T23:00:00.000Z`;
                      const allTimeSlots = getAvailableTimeSlots(
                        startDate,
                        endDate,
                        60,
                      );

                      refTimeSlots.current = generateAvailableTimeSlots(
                        availabilityResponse?.busy,
                        allTimeSlots,
                        refSelectedDate?.current,
                        availabilityResponse?.availability,
                      );
                      //  console.log('allTimeSlots', refTimeSlots.current);

                      if (refTimeSlots.current.length < 1) {
                        underDevelopment(Strings.no_slots_available_for_date);
                        return;
                      }

                      handleNextPress(true);
                      // setSelectedDate(() => ({
                      //   date: date,
                      //   text: date.format(CONST_DATE_FORMAT),
                      // }));
                    }}
                  />
                  <Spacer space={wp(2)} />
                  <HeaderShadowLine light />
                  <Spacer space={wp(2)} />
                  <ActionWrapper
                    style={{alignItems: 'center'}}
                    onPress={() =>
                      props.navigation.navigate('TimezonePicker', {
                        currentTimezone: timeZone,
                        onTimezoneSelected: timezone => {
                          setTimezone(() => timezone);
                        },
                      })
                    }>
                    <RegularText>Timezone</RegularText>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text>{timeZone}</Text>
                      <RnText style={{fontFamily: fonts.REGULAR}}>></RnText>
                    </View>
                  </ActionWrapper>
                  <Spacer space={wp(2)} />
                </>
              ) : (
                <>
                  <Spacer space={wp(2)} />
                  <Text
                    style={{alignSelf: 'flex-start', marginStart: wp('6%')}}>
                    Available Slots:{' '}
                    <RnText
                      style={{
                        paddingHorizontal: wp('6%'),
                        color: 'black',
                        fontFamily: fonts.REGULAR,
                      }}>
                      {eventDetails?.availableSlots}
                    </RnText>
                  </Text>
                  <Spacer space={wp(2)} />
                  <Text
                    style={{alignSelf: 'flex-start', marginStart: wp('6%')}}>
                    Location:{' '}
                    <RnText
                      style={{
                        paddingHorizontal: wp('6%'),
                        color: 'black',
                        fontFamily: fonts.REGULAR,
                      }}>
                      {eventDetails?.location}
                    </RnText>
                  </Text>
                  <Spacer space={wp(2)} />
                  <Text
                    style={{alignSelf: 'flex-start', marginStart: wp('6%')}}>
                    Price:{' '}
                    <RnText
                      style={{
                        paddingHorizontal: wp('6%'),
                        color: 'black',
                        fontFamily: fonts.REGULAR,
                      }}>
                      {eventDetails?.price}
                    </RnText>
                  </Text>
                  <Spacer space={wp(2)} />
                  <Text
                    style={{alignSelf: 'flex-start', marginStart: wp('6%')}}>
                    Time:{' '}
                  </Text>
                  <Spacer space={wp(1)} />
                  <RnText
                    style={{
                      marginStart: wp('1%'),
                      paddingHorizontal: wp('6%'),
                      color: 'black',
                      // fontFamily: fonts.REGULAR,
                    }}>
                    {moment(eventDetails?.start_date).format(
                      'hh:mm A / DD MMM, yyyy',
                    )}{' '}
                    -{' \n'}
                    {moment(eventDetails?.end_date).format(
                      'hh:mm A / DD MMM, yyyy',
                    )}
                  </RnText>
                  <Spacer space={wp(4)} />
                  <Button
                    isLoading={false}
                    buttonText={`Pay (${eventDetails?.price}) & Book`}
                    buttonPress={() => orderOneToOneEvent()}
                  />
                </>
              )}
            </>
          ) : currentPage === CONST_PAGE.SELECT_TIME ? (
            <TimePicker
              timeSlots={refTimeSlots?.current}
              durationText={availabilityResponse?.slotDuration}
              selectedTime={refSelectedTime?.current}
              onTimeSelected={s => (refSelectedTime.current = s)}
            />
          ) : (
            <EnterDetails
              onDataChanged={details => (refUserDetails.current = details)}
            />
          )}
        </ScrollView>
      </View>
      {loading && (
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
