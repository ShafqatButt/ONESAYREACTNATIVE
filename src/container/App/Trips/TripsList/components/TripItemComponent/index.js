// noinspection ES6CheckImport

import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {images} from '../../../../../../res/images';
import {styles} from '../../style';
import {readHtml} from '../../../../../../commonAction';
import moment from 'moment';

const getDay = da => moment(new Date(da)).format('ll');

const TripItem = ({item}) => {
  const {navigate} = useNavigation();
  return (
    <View style={styles.itemOuter}>
      <Text style={styles.cityTxt}>
        {item?.location?.length ? item?.location : 'Unknown Location'}
      </Text>
      {item.startDate?.length ? (
        <Text style={styles.dateTxt}>
          {getDay(item.startDate)} - {getDay(item.endDate)}
        </Text>
      ) : null}
      <TouchableOpacity
        style={styles.itemInner}
        onPress={() => navigate('TripDetails', {id: item.id})}>
        <Image
          resizeMode="cover"
          source={item?.thumbnail ? {uri: item.thumbnail} : images.add_cat}
          style={styles.itemImg}
        />
        <View style={styles.TextBox}>
          <Text style={styles.hotelNameTxt}>{item.title}</Text>
          <Text numberOfLines={3} style={styles.dateTxt}>
            {readHtml(item.description)}
          </Text>

          <Text style={styles.statusTxt}>completed</Text>
        </View>

        <View style={styles.IconBox}>
          <Ionicons
            name={'ios-ellipsis-vertical'}
            size={wp(3.5)}
            onPress={() => {}}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TripItem;
