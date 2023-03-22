// noinspection ES6CheckImport

import React, {useState, useEffect, useContext, useRef} from 'react';
import {Platform, Pressable, Text, SectionList, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import globalStyles from '../../../../res/globalStyles';
import AsyncStorage from '@react-native-community/async-storage';
import {GET_USER_MEETINGS} from '../../../../api_helper/Api';

import {GET} from '../../../../api_helper/ApiServices';
import {underDevelopment} from '../../../../uikit-app';

import styles, {
  StatusContainer,
  Icon,
  DayTitleContainer,
  DayTitle,
  DayNumberContainer,
  DayNumber,
  EmptyEventTxt,
  EventItemContainer,
  StatusIndicator,
  EventItemTextContainer,
  EventTimes,
  EventTitle,
  EventDuration,
} from './style';

import {AuthContext} from '../../../../context/Auth.context';
import {
  IconAssets,
  LoadingSpinner,
  Palette,
} from '@sendbird/uikit-react-native-foundation';
import {getTimeDifference} from '../EventTypes';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment-timezone';

const months = [
  {label: 'January', value: 0},
  {label: 'February', value: 1},
  {label: 'March', value: 2},
  {label: 'April', value: 3},
  {label: 'May', value: 4},
  {label: 'June', value: 5},
  {label: 'July', value: 6},
  {label: 'August', value: 7},
  {label: 'September', value: 8},
  {label: 'October', value: 9},
  {label: 'November', value: 10},
  {label: 'December', value: 11},
];
export const getTime = timeStamp => {
  const date = new Date(timeStamp);

  return moment(date).format('HH:mm');
};
export default ScheduledEvents = props => {
  console.log('props?.route', props?.route?.params);
  const {NobottomTab} = props?.route?.params;
  const {state: ContextState, updateUserData} = useContext(AuthContext);
  const {userData} = ContextState;
  const [isLoading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [displyMonth, setDisplyMonth] = useState(0);
  const [bookingsList, setBookingsList] = useState([]);
  const [displayBookingsList, setDisplayBookingsList] = useState([]);
  const pickerRef = useRef(null);
  const scrollRef = useRef(null);
  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = moment(obj[property]).format('DD-MM-YYYY');
      const curGroup = acc[key] ?? [];

      return {...acc, [key]: [...curGroup, obj]};
    }, {});
  }

  const getUserBookedEvents = async () => {
    setLoading(() => true);
    try {
      const response = await GET(
        GET_USER_MEETINGS,
        ContextState?.userData?.token,
        '',
      );
      const _response = response.data;
      console.log('booked events', _response);
      return {
        success: true,
        response: _response,
      };
    } catch (e) {
      underDevelopment(e.message);
      console.log('response (error) => ', e.message);
      return {
        success: false,
        response: e.message,
      };
    }
  };
  const modifyData = data => {
    let v = groupBy(data, 'start_date');
    // console.log('=====wee>>', v);
    let x = Object.entries(v).map(e => ({title: e[0], data: e[1]}));
    // console.log('thee dat', x);
    return Object.entries(v).map(e => ({title: e[0], data: e[1]}));
    // return Object.entries(v).map(e => ({[e[0]]: e[1]}));
  };
  const filterByMonth = mon => {
    setLoading(() => true);
    let addTodayToList = true;
    let today = new Date();
    let todayIso = today.toISOString();
    let todayMonth = today.getMonth();
    let ar = [];
    ar = bookingsList?.filter(item => {
      let startDate = new Date(item?.start_date);
      if (mon == todayMonth) {
        if (todayIso.split('T')[0] === startDate.toISOString().split('T')[0]) {
          addTodayToList = false;
        }
      }

      return startDate.getMonth() == mon;
    });
    if (addTodayToList) {
      if (mon == todayMonth) {
        ar.push({start_date: todayIso});
      }
    }
    ar.sort((a, b) => new Date(a?.start_date) - new Date(b?.start_date));
    let modedData = modifyData(ar);
    setDisplayBookingsList(modedData);
    if (ar.length) {
      let searchedIndex = 0;
      if (mon === todayMonth) {
        searchedIndex = Number(
          modedData?.findIndex(
            it =>
              it?.title?.split('-').reverse().join('-') ==
              todayIso?.split('T')[0],
          ),
        );
      }
      setTimeout(
        function () {
          if (scrollRef?.current) {
            scrollRef?.current?.scrollToLocation({
              animated: false,
              sectionIndex: searchedIndex,
              itemIndex: 0,
            });
          }
          setTimeout(() => setLoading(() => false), 100);
        },

        100,
      );
    } else {
      setLoading(() => false);
    }

    setDisplyMonth(mon);
  };
  useEffect(() => {
    getUserBookedEvents().then(res => {
      if (res.success) {
        setBookingsList(() => res.response);
        // setBookingsList(() => newData);
      } else {
        setLoading(() => false);
      }
    });
  }, []);
  useEffect(() => {
    if (bookingsList?.length) {
      filterByMonth(selectedMonth);
    } else {
      setLoading(() => false);
    }
  }, [bookingsList]);
  const handleEventPressed = event => {
    console.log('You pressed ===> ', JSON.stringify(event));
  };

  const newData = [
    {
      start_date: '2023-02-25T05:00:00.000Z',

      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-05T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },

    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-05T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-05T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-05T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173322',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-15T11:00:30.000Z',
      event_type: 1,
      id: 'c5998186-9261-471d-a20f-d57ddabb2b99',
      location: 'Moon Plannet',
      price: '100',
      product_id: '86',
      sendbird_channel: null,
      start_date: '2023-03-15T10:00:00.000Z',
      title: 'Event 303',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173322',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-15T11:00:30.000Z',
      event_type: 1,
      id: 'c5998186-9261-471d-a20f-d57ddabb2b99',
      location: 'Moon Plannet',
      price: '100',
      product_id: '86',
      sendbird_channel: null,
      start_date: '2023-03-15T10:00:00.000Z',
      title: 'Event 303',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173322',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-15T11:00:30.000Z',
      event_type: 1,
      id: 'c5998186-9261-471d-a20f-d57ddabb2b99',
      location: 'Moon Plannet',
      price: '100',
      product_id: '86',
      sendbird_channel: null,
      start_date: '2023-03-15T10:00:00.000Z',
      title: 'Event 303',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173322',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-15T11:00:30.000Z',
      event_type: 1,
      id: 'c5998186-9261-471d-a20f-d57ddabb2b99',
      location: 'Moon Plannet',
      price: '100',
      product_id: '86',
      sendbird_channel: null,
      start_date: '2023-03-15T10:00:00.000Z',
      title: 'Event 303',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173322',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-15T11:00:30.000Z',
      event_type: 1,
      id: 'c5998186-9261-471d-a20f-d57ddabb2b99',
      location: 'Moon Plannet',
      price: '100',
      product_id: '86',
      sendbird_channel: null,
      start_date: '2023-03-15T10:00:00.000Z',
      title: 'Event 303',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173322',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-15T11:00:30.000Z',
      event_type: 1,
      id: 'c5998186-9261-471d-a20f-d57ddabb2b99',
      location: 'Moon Plannet',
      price: '100',
      product_id: '86',
      sendbird_channel: null,
      start_date: '2023-03-15T10:00:00.000Z',
      title: 'Event 303',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },

    {
      availableSlots: '0',
      booking_id: '173322',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-15T11:00:30.000Z',
      event_type: 1,
      id: 'c5998186-9261-471d-a20f-d57ddabb2b99',
      location: 'Moon Plannet',
      price: '100',
      product_id: '86',
      sendbird_channel: null,
      start_date: '2023-03-15T10:00:00.000Z',
      title: 'Event 303',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '0',
      booking_id: '173315',
      date_created: null,
      date_updated: null,
      description:
        'This is a test event. The name of the event is Event 101 and anyone can book this event. This is a one-to-one event. So, only one person can join this event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-03-10T10:00:30.000Z',
      event_type: 1,
      id: 'ed71dc11-be7b-42da-bffb-198bed661ab1',
      location: 'Punjab',
      price: '100',
      product_id: '84',
      sendbird_channel: null,
      start_date: '2023-03-10T09:00:00.000Z',
      title: 'Event 101',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },

    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-05T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-05T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-05T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-05T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
    {
      availableSlots: '1',
      booking_id: '173317',
      date_created: null,
      date_updated: null,
      description:
        'This is yet another test event. You can book the event. This is yet another test event. This is yet another test event. This is yet another test event. This is yet another test event.',
      email: 'devuser@yopmail.com',
      end_date: '2023-02-17T06:00:30.000Z',
      event_type: 1,
      id: '46b6d1c0-5a0a-43ee-8b7e-785a62c3fa0c',
      location: 'Mars Plannet',
      price: '100',
      product_id: '85',
      sendbird_channel: null,
      start_date: '2023-02-17T05:00:00.000Z',
      title: 'Event 201',
      totalSlots: '1',
      user: 'e1b7c855-2581-4f0b-a2a5-e32a429e8236',
    },
  ];

  const getWeekday = (s, name) => {
    const [dd, mm, yyyy] = s.split('-');
    let date = new Date(yyyy, mm - 1, dd);
    return name ? moment(date).format('ddd') : dd;
  };
  const checkToday = s => {
    const [dd, mm, yyyy] = s.split('-');
    const stDay = moment(new Date(yyyy, mm - 1, parseInt(dd))).format(
      'DD-MM-YYYY',
    );
    const today = moment(new Date()).format('DD-MM-YYYY');

    return stDay === today;
  };
  const checkIsBefore = (s, title) => {
    let inpDate = s;

    if (title) {
      inpDate = s.split('-').reverse().join('-');
    }

    const [yyyy, mm, dd] = inpDate.split('-');
    // console.log('dd==dd', yyyy, mm, dd);
    const stDay = moment(new Date(yyyy, mm - 1, parseInt(dd)));
    const today = moment(new Date()).format('YYYY-MM-DD');

    return stDay.isBefore(today, 'DD-MM-YYYY');
  };

  return (
    <>
      <RNPickerSelect
        ref={Platform.OS === 'ios' ? pickerRef : null}
        pickerProps={{ref: Platform.OS === 'android' ? pickerRef : null}}
        value={selectedMonth}
        onValueChange={v => {
          if (Platform.OS === 'android') {
            setSelectedMonth(v);
            v == displyMonth ? null : filterByMonth(v);
          } else {
            setSelectedMonth(v);
          }
        }}
        items={months}
        placeholder={{}}
        style={{
          inputAndroid: styles.eventTypePickerStyle,
          ...globalStyles.hideIconsRNPicker,
        }}
        textInputProps={{
          style: styles.eventTypePickerStyle,
        }}
        Icon={() => null}
        onDonePress={() =>
          selectedMonth == displyMonth ? null : filterByMonth(selectedMonth)
        }
      />

      <Pressable
        onPress={() => {
          Platform.OS === 'ios'
            ? pickerRef.current?.togglePicker()
            : pickerRef.current?.focus();
        }}
        style={styles.eventTypePickerContainerStyle}>
        <Text style={styles.eventTypeTextInputStyle}>
          {months[displyMonth].label}
        </Text>
        <Icon source={IconAssets['chevron-down']} />
      </Pressable>

      <SectionList
        sections={
          // modifyData(newData)
          displayBookingsList.length ? displayBookingsList : []
        }
        ref={scrollRef}
        scrollEventThrottle={1000}
        // initialScrollIndex={}
        keyExtractor={(item, index) => item + index}
        stickySectionHeadersEnabled
        onScrollToIndexFailed={() => console.log('')}
        ListFooterComponent={
          displayBookingsList?.length !== 0 ? (
            <View
              style={{
                height:
                  Platform.OS === 'ios'
                    ? NobottomTab
                      ? wp(150)
                      : wp(123)
                    : NobottomTab
                    ? wp(128)
                    : wp(105),
              }}
            />
          ) : null
        }
        ListEmptyComponent={
          <>
            {!isLoading ? (
              <EmptyEventTxt style={{marginLeft: 0, marginTop: 0}}>
                No buzzmi events in this month
              </EmptyEventTxt>
            ) : null}
          </>
        }
        renderItem={({item, index}) => (
          <>
            {item?.id ? (
              <EventItemContainer
                onPress={() => {
                  // console.log(item);
                  props.navigation.navigate('EventDetails', {
                    item: item,
                    scheduled: true,
                  });
                }}
                style={styles.shadowStyle}
                index={index}
                opaque={checkIsBefore(item?.start_date.split('T')[0])}>
                <StatusContainer>
                  <StatusIndicator />
                </StatusContainer>
                <EventItemTextContainer>
                  <EventTimes>
                    {getTime(item.start_date)} - {getTime(item.end_date)}
                  </EventTimes>
                  <EventTitle numberOfLines={2}>{item?.title}</EventTitle>
                  <EventDuration numberOfLines={2}>
                    {item?.description}{' '}
                    {getTimeDifference(item.start_date, item.end_date)}
                  </EventDuration>
                </EventItemTextContainer>
              </EventItemContainer>
            ) : (
              <EmptyEventTxt>No buzzmi events on this date</EmptyEventTxt>
            )}
          </>
        )}
        renderSectionHeader={({section: {title}}) => (
          <DayTitleContainer opaque={checkIsBefore(title, true)}>
            <DayTitle>{getWeekday(title, true)}</DayTitle>
            <DayNumberContainer enable={checkToday(title)}>
              <DayNumber enable={checkToday(title)}>
                {getWeekday(title)}
              </DayNumber>
            </DayNumberContainer>
          </DayTitleContainer>
        )}
      />
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            marginTop: hp(11),
            height: hp(80),
            backgroundColor: 'white',
          }}>
          <LoadingSpinner
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              width: wp(100),
              height: hp(90),
              // backgroundColor: 'red',
            }}
            size={40}
            color={Palette.primary300}
          />
        </View>
      )}
    </>
  );
};
