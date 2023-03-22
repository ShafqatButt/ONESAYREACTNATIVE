// noinspection ES6CheckImport

import React, {useState, useEffect, useContext} from 'react';
import {
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Text,
  Pressable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CONST_EVENT_TABS,
  EventTabComponent,
} from './components/EventTabComponent';

import AsyncStorage from '@react-native-community/async-storage';
import {
  GET_USER_EVENTS_TYPES,
  GET_USER_MEETINGS,
  POST_USER_MEETINGS,
} from '../../../../api_helper/Api';

import {GlobalFlex, GlobalHeader} from '../../../../res/globalStyles';
import {GET} from '../../../../api_helper/ApiServices';
import {underDevelopment} from '../../../../uikit-app';

import styles, {TopTabText} from './style';

import {AuthContext} from '../../../../context/Auth.context';

import EventTypes from '../EventTypes';
import {colors} from '../../../../res/colors';
import {images} from '../../../../res/images';
import EventSettings from '../EventSettings';

import ScheduledEvents from '../ScheduledEvents';
import HubScreen from '../../Hub/HubScreen';

export const getEventTypeText = eventType => {
  if (typeof eventType !== 'number') {
    return '';
  }

  switch (eventType) {
    case 1:
      return 'One To One';
    case 2:
      return 'Event';
    case 3:
      return 'Video';
    default:
      return '';
  }
};

export default BookedEvents = props => {
  const {topTabIndex} = props?.route?.params;

  const {state: ContextState, updateUserData} = useContext(AuthContext);
  const {userData} = ContextState;

  const [tabIndex, setTabIndex] = useState(topTabIndex ? topTabIndex : 0);
  const [selectedTab, setSelectTab] = useState(CONST_EVENT_TABS.MY_EVENTS);
  const [eventTypes, setEventTypes] = useState([
    // {
    //   event_type: 1,
    //   booking_id: 123,
    //   status: 'PENDING',
    //   title: 'Test event',
    //   description:
    //     'Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    // },
    // {
    //   event_type: 2,
    //   booking_id: 124,
    //   status: 'PENDING',
    //   title: 'Test event',
    //   description:
    //     'Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    // },
    // {
    //   event_type: 3,
    //   booking_id: 125,
    //   status: 'PENDING',
    //   title: 'Test event',
    //   description:
    //     'Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    // },
  ]);
  const [eventTypesLoading, setEventTypesLoading] = useState(false);
  useEffect(() => {
    getUserEvents().then();
  }, []);
  const getUserEvents = async () => {
    setEventTypesLoading(true);
    GET(GET_USER_EVENTS_TYPES, ContextState?.userData?.token, '')
      .then(res => {
        //  LOG  response (success) =>
        //  [
        //  {
        //  "booking_id": "160757",
        //  "email": "robocop@yopmail.com",
        //  "end_date": "2022-12-20T08:20:57.909Z",
        //  "id": "0cb82ff7-46fb-4815-af2e-6a0d2ad55005",
        //  "start_date": "2022-12-20T08:19:57.908Z",
        //  "status": "ACCEPTED",
        //  "user": "8352e6b4-9779-43cf-966c-a27e6d60feab"
        //  }
        //  ]
        const _response = res.data;
        console.log('response events (success) => ', _response);

        setEventTypes(() => _response.filter(i => i.event_type !== 1));
        setEventTypesLoading(false);
      })
      .catch(e => {
        underDevelopment(e.message);
        console.log('response (error) => ', e.message);
        setEventTypesLoading(false);
      });
  };

  const TopTabs = ['Hub', 'My Calender', 'My Program'];
  return (
    <>
      <SafeAreaView style={{backgroundColor: 'white'}} />
      <GlobalHeader style={{paddingBottom: 0}}>
        {/* <Spacer space={hp(0.8)} /> */}
        <View style={styles.topTabWrapper}>
          <Pressable onPress={() => props.navigation.goBack()}>
            <Image
              source={
                userData?.avatar?.length > 0
                  ? {uri: userData?.avatar}
                  : images.avatar
              }
              style={styles.profile_ic}
            />
          </Pressable>
          <View
            style={{
              ...styles.flex_wrapper,
            }}>
            {TopTabs.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setTabIndex(index)}
                style={{
                  ...styles.tab_wrapper,
                  borderBottomColor:
                    index == tabIndex ? colors.PRIMARY_COLOR : 'white',
                  borderBottomWidth: index == tabIndex ? wp(0.5) : 0,
                }}>
                <TopTabText
                  style={{
                    fontSize: index == tabIndex ? wp(3.8) : wp(3.4),
                    color:
                      index == tabIndex ? colors.PRIMARY_COLOR : colors.BLACK,
                  }}>
                  {item}
                </TopTabText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </GlobalHeader>
      {tabIndex == 1 ? (
        <GlobalFlex>
          <EventTabComponent
            selectedTab={selectedTab}
            setSelectTab={setSelectTab}
          />
          {selectedTab === CONST_EVENT_TABS.MY_EVENTS ? (
            <EventTypes
              {...props}
              eventTypes={eventTypes}
              setEventTypes={setEventTypes}
              loading={eventTypesLoading}
            />
          ) : selectedTab === CONST_EVENT_TABS.BOOKED_EVENTS ? (
            <ScheduledEvents {...props} />
          ) : (
            <EventSettings {...props} />
          )}
        </GlobalFlex>
      ) : tabIndex == 2 ? (
        <GlobalFlex style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Under development</Text>
        </GlobalFlex>
      ) : (
        <HubScreen {...props} />
      )}
    </>
  );
};
