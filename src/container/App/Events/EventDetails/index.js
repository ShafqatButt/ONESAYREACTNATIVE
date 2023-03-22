// noinspection ES6CheckImport

import React, {useContext, useRef, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {GET_EVENT_DETAILS_BY_ID} from '../../../../api_helper/Api';

import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import styles, {
  EventNameText,
  EventTypeText,
  EventTimeText,
  TitleText,
  DetailText,
  SmTitleText,
  Line,
  EventCreateText,
} from './style';
import {DELETE, GET, POST} from '../../../../api_helper/ApiServices';

import {BackHeader} from '../../../../components/BackHeader';
import {AuthContext} from '../../../../context/Auth.context';

import {HeaderShadowLine} from '../EventSettings/style';

import {GlobalFlex} from '../../../../res/globalStyles';

import {Spacer} from '../../../../res/spacer';
import {getTime} from '../ScheduledEvents';

import moment from 'moment-timezone';
import {numOnly} from '../utils';
import {underDevelopment} from '../../../../uikit-app';

const getDate = s => {
  let date = new Date(s);
  return s ? moment(date).format('ddd, MMMM YYYY') : '';
};
const getTimeZone = (s, e) => {
  return s && e
    ? moment.tz(s, moment.tz.guess()).format('hh:mm a -') +
        moment.tz(e, moment.tz.guess()).format('hh:mm a [(GMT]Z[)]')
    : '';
};
export default EventDetails = props => {
  const {item, scheduled} = props.route.params;
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  const [eventDet, setEventDet] = useState(null);

  const getUserEvent = async id => {
    setLoading(() => true);
    try {
      const response = await GET(
        GET_EVENT_DETAILS_BY_ID(id),
        ContextState?.userData?.token,
        '',
      );
      const _response = response.data;
      setLoading(() => false);
      return {
        success: true,
        response: _response,
      };
    } catch (e) {
      underDevelopment(e.message);
      setLoading(() => false);
      console.log('response (error) => ', e.message);
      return {
        success: false,
        response: e.message,
      };
    }
  };
  useEffect(() => {
    console.log('it', item);
    getUserEvent(item?.id).then(res => {
      if (res.success) {
        console.log('success', res.response);

        setEventDet(() => res.response?.booking);
      }
    });
  }, [item]);

  const [loading, setLoading] = useState(false);

  return (
    <GlobalFlex>
      <BackHeader
        isModal
        is_center_text
        title={'Event Details'}
        nextTextStyle={styles.nextTextStyle}
        onBackPress={() => props.navigation.goBack()}
      />
      <Spacer space={wp(1.5)} />
      <HeaderShadowLine />
      <View style={styles.BGContainer}>
        <View style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="always">
            <Spacer space={wp(2)} />
            <View style={styles.eventHeaderBox}>
              <View style={styles.eventStatusCircle} />
              <View>
                <EventNameText>{eventDet?.title}</EventNameText>
                <EventTypeText>Bussiness meetings</EventTypeText>
              </View>
            </View>
            <Spacer space={wp(2)} />
            <View style={styles.eventTimingsBox}>
              <EventTimeText>{getDate(eventDet?.startTime)}</EventTimeText>
              <EventTimeText>
                {getTimeZone(eventDet?.startTime, eventDet?.endTime)}
              </EventTimeText>
            </View>

            <View style={styles.titleBox}>
              <TitleText>NAME</TitleText>
            </View>
            <View style={[styles.detailBox, styles.NameBox]}>
              <DetailText half>{eventDet?.user?.name}</DetailText>
              <DetailText>{eventDet?.status}</DetailText>
            </View>
            <View style={styles.titleBox}>
              <TitleText>LOCATION</TitleText>
            </View>
            <View style={styles.detailBox}>
              <DetailText>{eventDet?.location}</DetailText>
            </View>
            <View style={styles.titleBox}>
              <TitleText>INVITEE DETAILS</TitleText>
            </View>
            <View style={styles.detailBox}>
              <SmTitleText>Email Address</SmTitleText>
              <DetailText>{eventDet?.user?.email}</DetailText>
              <Line />
              <SmTitleText>Time zone</SmTitleText>
              <DetailText>{eventDet?.user?.timeZone}</DetailText>

              {eventDet?.attendees.length ? (
                <>
                  {!scheduled ? (
                    <>
                      <Line />
                      <SmTitleText>Guests</SmTitleText>
                      <DetailText>
                        {eventDet?.attendees.reduce((res, item, index) => {
                          res +=
                            item.email +
                            (index == eventDet?.attendees.length - 1
                              ? ''
                              : ', ');
                          return res;
                        }, '')}
                      </DetailText>
                    </>
                  ) : null}
                </>
              ) : null}
            </View>
            <View style={styles.footerBox}>
              <EventCreateText>
                Event Created on January 18,2023
              </EventCreateText>
            </View>
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
      </View>
    </GlobalFlex>
  );
};
