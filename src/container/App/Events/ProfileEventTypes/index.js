// noinspection ES6CheckImport

import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
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
  ListItemContainer,
  EmptyListContainer,
} from './style';
import {GET_ALL_EVENT_TYPES} from '../../../../api_helper/Api';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {HeaderShadowLine} from '../EventSettings/style';
import {GET} from '../../../../api_helper/ApiServices';
import {underDevelopment} from '../../../../uikit-app';
import {getEventTypeText} from '../BookedEvents';
import {Spacer} from '../../../../res/spacer';
import IconAssets from '../../../../assets';
import {AuthContext} from '../../../../context/Auth.context';
import {colors} from '../../../../res/colors';

export default ProfileEventTypes = props => {
  const {filterId} = props.route.params;
  const {state: ContextState, updateUserData} = useContext(AuthContext);
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

  useEffect(() => {
    getUserBookedEvents().then();
  }, []);
  const getUserBookedEvents = async () => {
    GET(GET_ALL_EVENT_TYPES, ContextState?.userData?.token, '')
      .then(res => {
        const _response = res.data;
        console.log('_response', _response);
        setEventTypes(() =>
          _response.filter(e => {
            // console.log(
            //   'onEventBooked',
            //   e.availableSlots,
            //   parseInt(e.availableSlots, 10),
            // );
            return e.user === filterId && e.event_type != 1;
          }),
        );
      })
      .catch(e => {
        underDevelopment(e.message);
        console.log('response (error) => ', e.message);
      });
  };

  const handleEventPressed = event => {
    console.log('You pressed ===> ', JSON.stringify(event));
    props.navigation.navigate('BookEvent', {
      data: event,
      filterId: filterId,
      isOneToOneEvent: false,
      onEventBooked: () => getUserBookedEvents().then(),
    });
  };
  function _renderRoundedButton() {
    return (
      <RoundButton
        style={styles.shadowStyle}
        onPress={() => {
          props.navigation.navigate('ProfileNav', {screen: 'CreateEvent'});
        }}>
        <PlusIcon source={IconAssets.ic_plus} />
      </RoundButton>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <GlobalFlex>
        <BackHeader
          isRightText
          is_center_text
          title={'Book Event'}
          rightText={'1-to-1'}
          // rightIcon={IconAssets.ic_settings}
          nextTextStyle={{color: colors.PRIMARY_COLOR}}
          onBackPress={() => props.navigation.goBack()}
          onNextPress={() =>
            props.navigation.navigate('BookEvent', {
              filterId: filterId,
              data: {
                id: '',
                start_date: '',
                end_date: '',
                email: '',
                booking_id: '',
                title: 'One to One',
                description: '',
                price: '',
                product_id: '',
                user: '',
                event_type: 1,
                location: '',
                totalSlots: '',
                availableSlots: '',
              },
              isOneToOneEvent: true,
            })
          }
        />
        <Spacer space={wp(1.8)} />
        <HeaderShadowLine />
        <Spacer space={wp(0.5)} />
        <FlatList
          data={eventTypes}
          ListEmptyComponent={() => (
            <EmptyListContainer>
              <EmptyListTitle>No events yet...</EmptyListTitle>
            </EmptyListContainer>
          )}
          renderItem={({item, index}) => (
            <ListItemContainer
              style={styles.shadowStyle}
              onPress={() => handleEventPressed(item)}>
              <HeaderContainer>
                <Icon source={IconAssets.ic_avatar} />
                <TitleContainer>
                  <ItemTitle>{item?.title}</ItemTitle>
                  <EventTypeText>
                    Event Type: {getEventTypeText(item?.event_type)}
                  </EventTypeText>
                </TitleContainer>
              </HeaderContainer>
              <ItemDescription>{item?.description}</ItemDescription>
            </ListItemContainer>
          )}
          keyExtractor={item => item?.booking_id}
        />
        {/*{_renderRoundedButton()}*/}
      </GlobalFlex>
    </SafeAreaView>
  );
};
