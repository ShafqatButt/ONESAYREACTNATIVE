// noinspection ES6CheckImport

import React, {useRef, useContext, useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Animated,
  Platform,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TripsContext} from '../../../../context/TripsContext';
import {AuthContext} from '../../../../context/Auth.context';
import {GlobalFlex} from '../../../../res/globalStyles';
import {useNavigation} from '@react-navigation/core';
import Loading from '../../../../components/Loading';
import ImageSlider from 'react-native-image-slider';
import {readHtml} from '../../../../commonAction';
import {images} from '../../../../res/images';
import {colors} from '../../../../res/colors';
import {DetailText, styles} from './style';
import moment from 'moment';
import {Spacer} from '../../../../res/spacer';

const H_MAX_HEIGHT = hp(40);
const H_MIN_HEIGHT = wp(38);
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

const CollapsibleHeader = props => {
  const {header, children} = props;
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <View style={{flex: 1}}>
      <ScrollView
        onScroll={Animated.event([
          {nativeEvent: {contentOffset: {y: scrollOffsetY}}},
        ])}
        scrollEventThrottle={16}>
        <View style={{paddingTop: H_MAX_HEIGHT}}>{children}</View>
      </ScrollView>

      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: headerScrollHeight,
          width: '100%',
          overflow: 'hidden',
          zIndex: 999,
        }}>
        {header()}
      </Animated.View>
    </View>
  );
};

const TripDetails = props => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const getDay = da => moment(new Date(da)).format('ll');
  const getDayMonth = da => moment(new Date(da)).format('D MMM');

  const {state: AuthState} = useContext(AuthContext);
  const {state: TripsState, getTravelPackageDetails} = useContext(TripsContext);

  const [isLoading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState([]);

  useEffect(() => {
    getTravelPackageDetails(
      AuthState?.userData,
      props.route.params.id,
      response => {
        setLoading(() => false);
        setTripDetails(() => response);
      },
    );
  }, []);

  const _renderHeaderLayout = () => {
    return (
      <ImageBackground
        resizeMode={tripDetails?.thumbnail ? 'cover' : 'center'}
        source={
          tripDetails?.thumbnail
            ? {uri: tripDetails?.thumbnail}
            : images.add_cat
        }
        style={styles.img}>
        <View
          style={{
            ...styles.opaqueView,
            opacity: tripDetails?.thumbnail ? 1 : 0,
          }}>
          {tripDetails?.startDate?.length ? (
            <Text style={styles.dateTxt}>
              {getDay(tripDetails?.startDate)} - {getDay(tripDetails?.endDate)}
            </Text>
          ) : null}
          <Text style={styles.TitleTxt}>{tripDetails?.title}</Text>
        </View>
      </ImageBackground>
    );
  };

  function _renderTripDayLayout(day) {
    return (
      <>
        <Spacer top={wp('4%')} />
        <View style={styles.dayHeaderBox}>
          <Text style={styles.dayHeaderTxt}>
            {day.title} {day?.date?.length ? getDayMonth(day?.date) : ''}
          </Text>
        </View>
        {tripDetails?.tripEvents
          ?.filter(e => e.tripDayId === day.id)
          .map(e => (
            <>
              <Text style={styles.eventTitleStyle}>{e?.name}</Text>
              {e?.images?.length > 0 && (
                <ImageSlider
                  style={{backgroundColor: 'transparent'}}
                  images={e?.images}
                  customSlide={({index, item, style, width}) => (
                    <Image
                      source={{
                        uri: item.imageUrl,
                      }}
                      style={styles.card_image}
                    />
                  )}
                />
              )}
              <DetailText>{readHtml(e?.description)}</DetailText>
            </>
          ))}
      </>
    );
  }

  return (
    <GlobalFlex>
      <CollapsibleHeader header={() => <>{_renderHeaderLayout()}</>}>
        {tripDetails?.description?.length ? (
          <DetailText>{readHtml(tripDetails?.description)}</DetailText>
        ) : null}
        <View style={{flex: 1}}>
          {tripDetails?.tripDays?.map((day, index) => {
            if (index === 0) {
              return null;
            }
            return _renderTripDayLayout(day);
          })}
          {tripDetails?.tripDays?.map((day, index) => {
            if (index !== 0) {
              return null;
            }
            return _renderTripDayLayout(day);
          })}
        </View>
        <Spacer top={wp('4%')} />
      </CollapsibleHeader>
      <TouchableOpacity
        style={[
          styles.backBtnContainer,
          {
            position: 'absolute',
            top: hp('5%'),
            left: wp('4%'),
            padding: wp('2%'),
            borderRadius: 90,
            backgroundColor: 'rgba(0,0,0,0.5)',
            ...Platform.select({
              android: {
                top: wp('5%'),
              },
              ios: {top: top},
            }),
          },
        ]}
        onPress={() => navigation.goBack()}>
        <Image
          source={images.back_black}
          style={{
            ...styles.backImg,
            tintColor: colors.WHITE,
          }}
        />
      </TouchableOpacity>
      <Loading visible={isLoading} />
    </GlobalFlex>
  );
};

export default TripDetails;
