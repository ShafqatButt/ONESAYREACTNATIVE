// noinspection ES6CheckImport

import React, {useContext, useRef, useState} from 'react';
import {
  View,
  Switch,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  POST_BOOK_MEETING,
  POST_USER_MEETINGS,
  DELETE_MEETING_BY_ID,
  POST_CREATE_EVENT_TYPE,
  GET_MEETING_DETAILS_BY_ID,
  GET_USER_EVENTS_TYPES,
  PATCH_EVENT_BY_ID,
} from '../../../../api_helper/Api';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import styles, {
  ActionWrapper,
  BorderContainer,
  Text,
  LocationDivider,
} from './style';
import {DELETE, GET, PATCH, POST} from '../../../../api_helper/ApiServices';
import AsyncStorage from '@react-native-community/async-storage';
import {BackHeader} from '../../../../components/BackHeader';
import {AuthContext} from '../../../../context/Auth.context';
import RNCalendarEvents from 'react-native-calendar-events';
import CalendarPicker from 'react-native-calendar-picker';
import {HeaderShadowLine} from '../EventSettings/style';
import RNPickerSelect from 'react-native-picker-select';
import globalStyles, {GlobalFlex} from '../../../../res/globalStyles';
import {CONST_TYPES, underDevelopment} from '../../../../uikit-app';
import {Input} from '../../../../components/Input';
import {TWO_MONTHS_PLUS_WEEK} from '../BookEvent';
import DatePicker from 'react-native-date-picker';
import {ItemDivider, RegularText} from '../../Account/style';
import {colors} from '../../../../res/colors';
import {Spacer} from '../../../../res/spacer';
import {LabelText} from '../BookEvent/style';
import {fonts} from '../../../../res/fonts';
import moment, { duration } from 'moment-timezone';
import {numOnly} from '../utils';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';

import {Routes} from '../../../../libs/navigation';
import {Modalize} from 'react-native-modalize';
import {EventRegister} from 'react-native-event-listeners';
import Strings from "../../../../string_key/Strings";

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
const ONE_HOUR_MILLIS = 3600 * 1000;
const FIFTEEN_MINUTE_MILLIS = 900 * 1000;
const location_Obj = {description: '', latitude: '', longitude: ''};
const CONST_GOOGLE_PLACES_QUERY = {
  key: 'AIzaSyBTfypSbx_zNMhWSBXMTA2BJBMQO7_9_T8',
  language: 'en',
  // types: '(cities)',
};

const time = [
  {lable: 15 },
  {lable: 30},
  {lable: 45 },
  {lable: 60 },
];

export default CreateEvent = props => {
  const {onEventCreated} = props.route.params;
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(location_Obj);
  // const [location, setLocation] = useState('');
  const locEdited = useRef('');
  const {sdk, currentUser} = useSendbirdChat();

  const [price, setPrice] = useState('');
  const [slots, setSlots] = useState('1');
  const [eventType, setEventType] = useState(3);
  const [description, setDescription] = useState('');
  const [isLastSeen, setIsLastSeen] = useState(false);
  const [datePressed, setDatePressed] = useState(false);
  const [timeZone, setTimezone] = useState(moment?.tz.guess());
  const [timeDuration, setTimeDuration] = useState(15);
  const [selectedDate, setSelectedDate] = useState({
    _date: new Date(),
    date: moment(new Date()),
    text: moment(new Date()).format(CONST_DATE_FORMAT),
  });
  const pickerRef = useRef(null);
  const eventTypeValues = [
    // {label: 'One to one', value: 1},
    {label: 'Video', value: 2},
    {label: 'Event', value: 3},
  ];
  const getEventValue = (id = 3) => {
    return eventTypeValues.find(obj => obj.value === id).label;
  };
  // console.log('moment.tz.names(); ===> ', moment?.tz.names());
  // console.log('moment.tz.names(); ===> ', moment?.tz.guess());

  /**
   * Time picker stuff...
   * @param value
   */
  const sheetRef = useRef();

  const openSheet = () => {
    sheetRef?.current?.open();
  };

  const closeSheet = () => {
    sheetRef?.current?.close();
  };

  const todayDate = new Date();
  const refCurrentMinDate = useRef(new Date());
  const refCurrentDate = useRef(new Date());
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
  const [minDate, setMinDate] = useState();
  //console.log('minDate==>>', minDate);
  const [maxDate, setMaxDate] = useState();
  //console.log('maxDate==>>', maxDate);

  // const date =
  //   selection === 1
  //     ? minDate
  //       ? new Date(minDate)
  //       : new Date()
  //     : maxDate
  //     ? new Date(maxDate)
  //     : new Date();

  // const minimumDate =
  //   selection === 1
  //     ? maxDate
  //       ? moment(maxDate).subtract(60, 'm').toDate()
  //       : null
  //     : selection === 2
  //     ? minDate
  //     : null;

  // const maximumDate =
  //   selection === 1
  //     ? maxDate
  //     : selection === 2
  //     ? minDate
  //       ? moment(minDate).add(60, 'm').toDate()
  //       : null
  //     : null;

  const onDateSelection = date => {
    if (selection === 1) {
      setStartTime(moment(date).format('HH:mm'));
      setMinDate(date);

      refMinDate.current = date;
     

     //let newDate = date.setHours(date.getHours(),date.getMinutes()+5,0,0);
      var endDate = moment(date, "hh:mm:ss A")
        .add(timeDuration, 'minutes')
      refMaxDate.current = endDate
      console.log('Start date',date);
      console.log('End Date  ',endDate);
      setEndTime(moment(endDate).format('HH:mm'));

    } else {
      setEndTime(moment(date).format('HH:mm'));
      setMaxDate(date);
    }
  };

  const toggleSwitchLastSeen = value => setIsLastSeen(() => value);

  const createCalendarEvent = event => {
    const {
      startTime: startDate,
      endTime: endDate,
      attendees,
      user,
    } = event.booking;
    const {email: adminEmail, name: adminName, timeZone} = user;
    const {email, name} = attendees;

    RNCalendarEvents.requestPermissions().then(status => {
      if (status === 'authorized') {
        // TODO: Create an event...
        RNCalendarEvents.saveEvent(title, {
          startDate: startDate,
          endDate: endDate,
          timeZone: timeZone,
          location: location?.description,
          attendees: [
            {name: adminName, email: adminEmail},
            {name: name, email: email},
          ],
          ...Platform.select({
            android: {
              description: description,
            },
            ios: {
              notes: description,
            },
          }),
        })
          .then(res => {
            console.log('RNCalendarEvents.saveEvent => ', JSON.stringify(res));
            // TODO: Fetch created event...
            RNCalendarEvents.findEventById(res).then(_res => {
              console.log(
                'RNCalendarEvents.findEventById => ',
                JSON.stringify(_res),
              );
              underDevelopment('Event booked successfully!');
              props.navigation.goBack();
            });
          })
          .catch(e => console.log('error => ', e.message));
      }
    });
  };

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

  const onCreateChannel = async event => {
    const params = new sdk.GroupChannelParams();
    params.isSuper = true;
    params.isPublic = true;
    params.isEphemeral = false;
    if (currentUser) {
      params.operatorUserIds = [currentUser.userId];
    }
    params.isDistinct = false;
    params.name = event.title;

    params.customType = 'Event';

    const channel = await sdk.GroupChannel.createChannel(params);
    if (channel) {
      channel.sendUserMessage('Hi members', (response, error) => {
        if (!error) {
          console.log('res', response);
        }
      });

      channel.freeze();
      console.log('channe cretaed===>', channel);
      PATCH(
        PATCH_EVENT_BY_ID(event.id),
        ContextState?.userData?.token,
        '',
        {channelUrl: channel?.url},
        (response, e) => {
          const success = !e;
          if (success) {
            // navigateToGroupChannelScreen(channel);
            console.log('Patch event success==>', response);
            EventRegister.emit('group-channel-update');
          } else {
            console.log('Patch event failed==>', response);
            underDevelopment('An Error Occured');
          }
        },
      );
    }
  };
  const createBookingEvent = async () => {
    // const status = await RNCalendarEvents.requestPermissions();
    //
    // if (status !== 'authorized') {
    //   underDevelopment('Need calendar permission to book event.');
    //   return;
    // }

    const currentTime = new Date().getTime();
    console.log(location);
    if (title.length < 1) {
      underDevelopment('Please enter the title.');
      return;
    } else if (location?.description.length < 1) {
      underDevelopment('Please enter the location.');
      return;
    } else if (slots === '') {
      underDevelopment('Please enter slots.');
      return;
    } else if (refMinDate.current.getTime() < currentTime) {
      underDevelopment('Please enter valid start time.');
      return;
    } else if (description.length < 1) {
      underDevelopment('Please enter notes.');
      return;
    }

    const sDate = selectedDate.date.toISOString().split('T')[0];

    const sStartTime = refMinDate?.current?.toISOString()?.split('T')[1];
    const sEndTime = refMaxDate?.current?.toISOString()?.split('T')[1];

    const _startTime = `${sDate}T${sStartTime}`;
    const _endTime = `${sDate}T${sEndTime}`;

    const params = {
      title: title,
      event_type: eventType,
      price: parseInt(price, 10),
      description: description,
      location: {
        longitude: location.longitude, // TODO: Need to add location lib to get this value...
        latitude: location.latitude, // TODO: Need to add location lib to get this value...

        location: location.description,
      },
      slot: parseInt(slots, 10),
      start: _startTime,
      end: _endTime,
    };
    console.log('params in creating event===>', params);

    setLoading(() => true);
    POST(
      POST_CREATE_EVENT_TYPE,
      true,
      ContextState?.userData?.token,
      '',
      params,
      (res, e) => {
        setLoading(() => false);
        const success = !e;
        if (success) {
          // underDevelopment('Event created!');
          onEventCreated(res);
          props.navigation.goBack();
          console.log(res);
          onCreateChannel(res);
          // getBookingDetailsById(res?.id, eventDetails =>
          //   createCalendarEvent(eventDetails),
          // );
        } else {
          underDevelopment(res);
          console.log('response (success) => ', res);
        }
      },
    );
  };
  const getBookingDetailsById = async (meetingId, callback) => {
    const userData = await AsyncStorage.getItem('userDetails').then(data =>
      JSON.parse(data),
    );

    GET(GET_MEETING_DETAILS_BY_ID(meetingId), userData.token, '')
      .then(res => {
        const _response = res.data;
        console.log('response (success) => ', JSON.stringify(_response));
        callback(_response);
      })
      .catch(e => {
        underDevelopment(e.message);
        console.log('response (error) => ', e.message);
      });
  };
  const deleteBookingById = async meetingId => {
    const userData = await AsyncStorage.getItem('userDetails').then(data =>
      JSON.parse(data),
    );

    DELETE(DELETE_MEETING_BY_ID(meetingId), userData.token, '')
      .then(res => {
        const _response = res.data;
        console.log('response (success) => ', JSON.stringify(_response));
      })
      .catch(e => {
        underDevelopment(e.message);
        console.log('response (error) => ', e.message);
      });
  };
  const _renderTimePickerLayout = () => {
    return (
      <>
        <View style={styles.rowContainerStyle}>
          <RegularText>Start Time</RegularText>
          <TouchableOpacity
            onPress={() => {
              refCurrentDate.current = selectedDate._date;
              refCurrentMinDate.current = new Date();
              setOpenTimePicker(!openTimePicker);
              setSelection(1);
            }}
            style={styles.chipContainerStyle}>
            <Text style={[{letterSpacing: wp(1)}]}>{startTime}</Text>
          </TouchableOpacity>
        </View>
        <BorderContainer />
        <View style={styles.rowContainerStyle}>
          <RegularText>End Time</RegularText>
          <TouchableOpacity
            onPress={() => {
              // refCurrentDate.current = selectedDate._date;
              // refCurrentMinDate.current = new Date();
              // setOpenTimePicker(!openTimePicker);
              // setSelection(2);
            }}
            style={styles.chipContainerStyle}>
            <Text style={[{letterSpacing: wp(1)}]}>{endTime}</Text>
          </TouchableOpacity>
        </View>
        <BorderContainer />
      </>
    );
  };

  return (
    <GlobalFlex>
      <DatePicker
        modal
        mode={'time'}
        title={Strings.select_date}
        confirmText={Strings.confirm}
        cancelText={Strings.Cancel}
        minuteInterval={15}
        open={openTimePicker}
        is24hourSource={'locale'}
        date={refCurrentDate.current}
        minimumDate={refCurrentMinDate?.current}
        onCancel={() => setOpenTimePicker(false)}
        onConfirm={date => {
          onDateSelection(date);

          // TODO: Need to send date in range of 1 hr.
          //       endDate-startDate =1. and any of dates should not be past dates
          // const _date = new Date();
          // const hours = parseInt(moment(date).format('HH'));
          // const minutes = parseInt(moment(date).format('mm'));

          // if (selection === 1) {
          // TODO: Need to fix this part...
          // const selectedTime =
          //   date.getTime() + FIFTEEN_MINUTE_MILLIS + HALF_MINUTE_MILLIS;
          // refMinDate.current = date;
          // refStartHour.current = hours;
          // refStartMin.current = minutes;
          // setStartTime(moment(date).format('HH:mm'));
          // const endDate = new Date(selectedTime);
          // const _hours = parseInt(moment(endDate).format('HH'), 10);
          // const _minutes = parseInt(moment(endDate).format('mm'), 10);
          // refMaxDate.current = endDate;
          // refEndHour.current = _hours;
          // refEndMin.current = _minutes;
          // setEndTime(moment(endDate).format('HH:mm'));
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
          // } else {
          // TODO: This part is fixed...
          // const currentTime =
          //   _date.getTime() + ONE_HOUR_MILLIS + HALF_MINUTE_MILLIS;
          // console.log(
          //   'date.getTime() < currentTime ==> ',
          //   date.getTime() < currentTime,
          //   currentTime,
          //   date.getTime(),
          // );
          // if (date.getTime() < currentTime) {
          //   const newEndDate = new Date(currentTime + ONE_HOUR_MILLIS);
          //   let _hours = parseInt(moment(newEndDate).format('HH'), 10);
          //   let _minutes = parseInt(moment(newEndDate).format('mm'), 10);
          //   refMaxDate.current = newEndDate;
          //   refEndHour.current = _hours;
          //   refEndMin.current = _minutes;

          //   refMinDate.current = _date;
          //   _hours = parseInt(moment(_date).format('HH'), 10);
          //   _minutes = parseInt(moment(_date).format('mm'), 10);
          //   refStartHour.current = _hours;
          //   refStartMin.current = _minutes;
          //   // setStartTime(moment(_date).format('HH:mm'));

          //   setEndTime(moment(currentTime).format('HH:mm'));
          //   return;
          // }

          // refMaxDate.current = date;
          // refEndHour.current = hours;
          // refEndMin.current = minutes;
          // setEndTime(moment(date).format('HH:mm'));

          // const startDate = new Date(date.getTime() - FIFTEEN_MINUTE_MILLIS);
          // const _hours = parseInt(moment(startDate).format('HH'), 10);
          // const _minutes = parseInt(moment(startDate).format('mm'), 10);
          // refMinDate.current = startDate;
          // refStartHour.current = _hours;
          // refStartMin.current = _minutes;
          // setStartTime(moment(startDate).format('HH:mm'));

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
          // }
          setOpenTimePicker(false);
        }}
      />
      <Modalize
        ref={sheetRef}
        modalHeight={600}
        modalStyle={{
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: 'white',
        }}
        handlePosition={'inside'}>
        <>
          <Spacer space={wp(2)} />
          {/* <BackHeader
            isLeftText={true}
            isRightText={true}
            rightText={'Done'}
            title={'Edit Duration'}
            is_center_text
            nextTextStyle={styles.topTextStyle}
            leftTextColor={styles.topTextStyle}
    
          /> */}
          {time.map(item => {
            //console.log('item==>>', item);
            return (
              <TouchableOpacity
                onPress={() => {
                  setTimeDuration(item.lable);
                  console.log('New Duration',item.lable);
                  closeSheet();
                  console.log('New Time Duration',timeDuration);
                  if (startTime !== '00:00') {
                    console.log("Start Time on modal dismiss",refMinDate.current ,"User Friend",  moment(refMinDate.current, "hh:mm:ss A"));
                    console.log( "Start Time on modal dismiss",refMaxDate.current,"User Friend",  moment(refMaxDate.current, "hh:mm:ss A"));
                  var endDate1 = moment(refMinDate.current, "hh:mm:ss A")
                    .add(item.lable, 'minutes')
                  refMaxDate.current = endDate1
                  console.log('New End Date  ',endDate1, timeDuration);
                  setEndTime(moment(endDate1).format('HH:mm'));
                  }
                }}>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginHorizontal: wp(5),
                    paddingVertical: wp(5),
                  }}>
                 {item.lable === 60 ? "1 hour" : `${item.lable} minutes`}
                </Text>
                <BorderContainer />
              </TouchableOpacity>
            );
          })}
        </>
      </Modalize>
      <BackHeader
        isModal
        is_center_text
        isRightText={true}
        title={'New Event'}
        rightText={'Done'}
        nextTextStyle={styles.nextTextStyle}
        onNextPress={() => createBookingEvent()}
        onBackPress={() => props.navigation.goBack()}
        // onNextPress={() => getUserBookedEvents()}
        // onNextPress={() =>
        //   getBookingDetailsById('0cb82ff7-46fb-4815-af2e-6a0d2ad55005')
        // }
        // onNextPress={() =>
        //   deleteBookingById('0cb82ff7-46fb-4815-af2e-6a0d2ad55005')
        // }
      />
      <Spacer space={wp(1.5)} />
      <HeaderShadowLine />
      <Spacer space={wp(2)} />
      <View style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }>
          <View style={styles.eventTypeContainerStyle}>
            <RegularText
              style={{
                marginHorizontal: 0,
                alignSelf: 'center',
              }}>
              Select Event Type
            </RegularText>
            <Pressable
              onPress={() => {
                Platform.OS === 'ios'
                  ? pickerRef.current?.togglePicker()
                  : pickerRef.current?.focus();
                console.log('pree');
              }}
              style={styles.eventTypePickerContainerStyle}>
              <RNPickerSelect
                ref={Platform.OS === 'ios' ? pickerRef : null}
                pickerProps={{
                  ref: Platform.OS === 'android' ? pickerRef : null,
                }}
                value={eventType}
                onValueChange={setEventType}
                items={eventTypeValues}
                placeholder={
                  {
                    // label: 'Gender',
                    // value: 'Gender',
                    // color: colors.TRIPLET_PLACEHOLDER,
                  }
                }
                style={{
                  inputAndroid: {height: 0, width: 0, position: 'absolute'},
                  ...globalStyles.hideIconsRNPicker,
                }}
                textInputProps={{
                  placeholderTextColor: colors.TRIPLET_PLACEHOLDER,
                  style: {height: 0, width: 0, position: 'absolute'},
                }}
                Icon={() => null}
              />
              <Text style={styles.eventTypeTextInputStyle}>
                {getEventValue(eventType)}
              </Text>
            </Pressable>
          </View>
          <Spacer space={wp(1)} />
          <View style={{width: wp(88), alignSelf: 'center'}}>
            <LabelText>Title *</LabelText>
            <Input
              value={title}
              onChange={setTitle}
              placeholder={'Title'}
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
                    // onChange={setLocation}
                    placeholder={'Location'}
                    mainstyle={{width: '100%'}}
                    style={{paddingBottom: wp(2)}}
                    placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                    {..._props}
                  />
                ),
                errorStyle: {color: 'red'},
                // onChangeText: v =>
                //   v.length < 1 ? setLocation(location_Obj) : null,
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
          <View style={{width: wp(88), alignSelf: 'center'}}>
            <LabelText>Price *</LabelText>
            <Input
              value={price}
              placeholder={'Price'}
              keyboardType={'number-pad'}
              mainstyle={{width: '100%'}}
              style={{paddingBottom: wp(2)}}
              onChange={s => setPrice(() => numOnly(s))}
              placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
            />
          </View>
          {eventType !== 1 && (
            <>
              <Spacer space={wp(1)} />
              <View style={{width: wp(88), alignSelf: 'center'}}>
                <LabelText>Slots *</LabelText>
                <Input
                  value={slots}
                  placeholder={'Slots'}
                  keyboardType={'number-pad'}
                  mainstyle={{width: '100%'}}
                  style={{paddingBottom: wp(2)}}
                  onChange={s => setSlots(() => numOnly(s))}
                  placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
                />
              </View>
            </>
          )}
          {/*<ToggleSwitch
            title={'All-day'}
            isLastSeen={isLastSeen}
            setIsLastSeen={setIsLastSeen}
            onValueChange={toggleSwitchLastSeen}
          />*/}
          <ActionWrapper
            // isSelected={datePressed}
            onPress={() => setDatePressed(prevState => !prevState)}>
            <RegularText
              style={{
                alignSelf: 'center',
              }}>
              Select Date
            </RegularText>
            <Text
              style={{
                marginRight: 0,
                overflow: 'hidden',
                borderRadius: wp(2),
                paddingVertical: wp(2),
                color: datePressed ? colors.WHITE : colors.BLACK,
                backgroundColor: datePressed
                  ? colors.PRIMARY_COLOR
                  : colors.COTTON_BALL,
                paddingHorizontal: wp(2),
              }}>
              {selectedDate.text}
            </Text>
          </ActionWrapper>
          <BorderContainer />
          <ActionWrapper onPress={openSheet}>
            <RegularText style={{alignSelf: 'center'}}>Duration</RegularText>
            <Text
              style={{
                marginRight: 0,
                overflow: 'hidden',
                borderRadius: wp(2),
                paddingVertical: wp(2),
                color: datePressed ? colors.WHITE : colors.BLACK,
                backgroundColor: datePressed
                  ? colors.PRIMARY_COLOR
                  : colors.COTTON_BALL,
                paddingHorizontal: wp(2),
              }}>
                {timeDuration === 60 ? "1 hour" : `${timeDuration} minutes`}
            </Text>
          </ActionWrapper>
          <BorderContainer />
          {datePressed && (
            <CalendarPicker
              minDate={new Date()}
              width={wp(94)}
              onDateChange={date => {
                console.log('date => ', date);
                console.log('new Date(date) => ', new Date(date));
                setSelectedDate(() => ({
                  _date: new Date(date),
                  date: date,
                  text: date.format(CONST_DATE_FORMAT),
                }));
              }}
              nextTitleStyle={{color: 'black'}}
              previousTitleStyle={{color: 'black'}}
              selectedStartDate={selectedDate.date}
              selectedDayTextStyle={{
                color: 'white',
              }}
              selectedDayStyle={{
                backgroundColor: colors.PRIMARY_COLOR,
              }}
              maxDate={new Date(new Date().getTime() + TWO_MONTHS_PLUS_WEEK)}
            />
          )}
          {_renderTimePickerLayout()}
          <Spacer space={wp(2)} />
          <View style={styles.mainDescriptionContainerStyle}>
            <LabelText>Enter Details *</LabelText>
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
          <ActionWrapper
            onPress={() =>
              props.navigation.navigate('TimezonePicker', {
                currentTimezone: timeZone,
                onTimezoneSelected: timezone => {
                  setTimezone(() => timezone);
                },
              })
            }>
            <RegularText
              style={{
                alignSelf: 'center',
              }}>
              Select Timezone
            </RegularText>
            <Text
              style={{
                backgroundColor: colors.COTTON_BALL,
                paddingVertical: wp(2),
                paddingHorizontal: wp(1),
                marginRight: wp(2),
                borderRadius: wp(2),
                overflow: 'hidden',
              }}>
              {timeZone}
            </Text>
          </ActionWrapper>
        </ScrollView>
      </View>
      {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
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
