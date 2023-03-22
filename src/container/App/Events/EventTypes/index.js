// noinspection ES6CheckImport

import React, {useState, useEffect, useContext} from 'react';
import {FlatList, View, Image, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles, {
  Icon,
  PlusIcon,
  ItemTitle,
  RoundButton,
  EventTypeText,
  TitleContainer,
  EmptyListTitle,
  ItemDescription,
  HeaderContainer,
  SubHeaderContainer,
  ListItemContainer,
  EmptyListContainer,
  FooterContainer,
  FooterItem,
  FooterText,
} from './style';

import {AuthContext} from '../../../../context/Auth.context';
import {GlobalFlex} from '../../../../res/globalStyles';

import {getEventTypeText} from '../BookedEvents';

import IconAssets from '../../../../assets';
import moment from 'moment';
import {images} from '../../../../res/images';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';

export const getTimeDifference = (strtTime, endTime) => {
  let a = moment(strtTime);
  let b = moment(endTime);
  let hourDiff = b.diff(a, 'hours');
  let minDiff = b.diff(a, 'minutes');
  let secDiff = b.diff(a, 'seconds');
  return secDiff >= 60
    ? minDiff >= 60
      ? hourDiff + ' HR . '
      : minDiff + ' MIN . '
    : secDiff + ' SEC . ';
};
export default EventTypes = props => {
  const {eventTypes, setEventTypes, loading} = props;
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  const {userData} = ContextState;

  const handleEventPressed = event => {
    console.log('You pressed ===> ', JSON.stringify(event));
    props.navigation.navigate('EventDetails', {item: event});
  };

  function _renderRoundedButton() {
    return (
      <RoundButton
        style={styles.shadowStyle}
        onPress={() =>
          // props.navigation.navigate('ProfileNav', {
          //   screen: 'CreateEvent',
          //   params: {
          //     onEventCreated: event => {
          //       setEventTypes(prevState => [...prevState, event]);
          //     },
          //   },
          // })

          props.navigation.navigate('CreateEvent', {
            onEventCreated: event => {
              setEventTypes(prevState => [...prevState, event]);
            },
          })
        }>
        <PlusIcon source={IconAssets.ic_plus} />
      </RoundButton>
    );
  }

  const getWeekday = strtTime => {
    let a = moment(strtTime).isoWeekday();
    return a === 1
      ? 'Mon'
      : a === 2
      ? 'Tue'
      : a === 3
      ? 'Wed'
      : a === 4
      ? 'Thu'
      : a === 5
      ? 'Fri'
      : a === 6
      ? 'Sat'
      : 'Sun';
  };
  return (
    <GlobalFlex>
      {/* <View style={styles.flexInnerWrapper}>
        <Image
          source={
            userData?.avatar?.length > 0
              ? {uri: userData?.avatar}
              : images.avatar
          }
          style={styles.profile_ic}
        />
        <View style={styles.userDetsBox}>
          <Text style={styles.userNameText1}>{userData?.displayName}</Text>
          <Text style={styles.userNameText2}>{`@${userData?.username}`} </Text>
        </View>
      </View> */}
      <FlatList
        data={eventTypes}
        ListEmptyComponent={() => (
          <EmptyListContainer>
            <EmptyListTitle>No events yet...</EmptyListTitle>
          </EmptyListContainer>
        )}
        renderItem={({item, index}) => {
          return (
            <ListItemContainer
              style={styles.shadowStyle}
              onPress={() => handleEventPressed(item)}>
              <HeaderContainer>
                <SubHeaderContainer>
                  <TitleContainer>
                    <EventTypeText>
                      {getTimeDifference(item.start_date, item.end_date)}

                      {getEventTypeText(item?.event_type)}
                    </EventTypeText>
                    <ItemTitle>{item?.title}</ItemTitle>
                  </TitleContainer>
                  {/* <Icon source={IconAssets.Back} /> */}
                </SubHeaderContainer>
                <ItemDescription>
                  {getWeekday(item?.start_date)}
                </ItemDescription>
              </HeaderContainer>
              <FooterContainer>
                <FooterItem>
                  <FooterText>Copy Link</FooterText>
                </FooterItem>
                <FooterItem border>
                  <FooterText>Copy single-use link</FooterText>
                </FooterItem>
                <FooterItem>
                  <FooterText>Share</FooterText>
                </FooterItem>
              </FooterContainer>
            </ListItemContainer>
          );
        }}
        keyExtractor={item => item?.booking_id}
      />
      {loading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            marginTop: hp(11),
            height: hp(60),
            backgroundColor: 'white',
          }}>
          <LoadingSpinner
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              width: wp(100),
              height: hp(80),
            }}
            size={40}
            color={Palette.primary300}
          />
        </View>
      )}
      {_renderRoundedButton()}
    </GlobalFlex>
  );
};
