// noinspection ES6CheckImport

import React, {useEffect, useState} from 'react';
import {View, Image, FlatList, TouchableOpacity} from 'react-native';
import styles, {
  Text,
  TimeText,
  ClearIcon,
  SearchIcon,
  ClearButton,
  SearchInput,
} from './style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import {useLocalization, useSendbirdChat} from '@sendbird/uikit-react-native';
import {useGroupChannelMessages} from '@sendbird/uikit-chat-hooks';
import {HeaderShadowLine} from '../../Events/EventSettings/style';
import {BackHeader} from '../../../../components/BackHeader';
import {getrelamContactName} from '../../../../commonAction';
import {EventRegister} from 'react-native-event-listeners';
import {GlobalFlex} from '../../../../res/globalStyles';
import {Routes} from '../../../../libs/navigation';
import {images} from '../../../../res/images';
import {Spacer} from '../../../../res/spacer';
import {colors} from '../../../../res/colors';
import moment from 'moment';
import Strings from '../../../../string_key/Strings';

const SearchMessageScreen = props => {
  const [query, setQuery] = useState('');
  const [messageArr, setMessageArr] = useState('');
  const {sdk, currentUser} = useSendbirdChat();
  const channel = sdk.GroupChannel.buildFromSerializedData(
    props?.route?.params?.serializedChannel,
  );
  const {STRINGS} = useLocalization();

  const {messages, loading} = useGroupChannelMessages(
    sdk,
    channel,
    currentUser?.userId,
  );
  const onPressSearchedItem = item => {
    props.navigation.goBack();
    props.navigation.replace(Routes.GroupChannel, {
      serializedChannel: channel.serialize(),
      scrollToItem: item,
    });
    setTimeout(() => EventRegister.emit('scroll_chat_index', item), 3000);
  };
  function getTime(time) {
    let a = moment();
    let b = moment(new Date(time));
    const differenceInDays = a.diff(b, 'days');
    let lastSeenString = '';

    if (differenceInDays < 1) {
      /* Same day */ lastSeenString = `${moment(time).format('hh:mm A')}`;
    } else if (differenceInDays < 2) {
      /* Yesterday */ lastSeenString = `${
        Strings.sa_str_group_yesterday
      }, ${moment(time).format('hh:mm A')}`;
    } else if (differenceInDays >= 2 && differenceInDays <= 6) {
      /* same week */ lastSeenString = `${moment(time).format(
        'dddd, hh:mm A',
      )}`;
    } else if (differenceInDays >= 7 && differenceInDays <= 13) {
      /* 1 week ago */ lastSeenString = Strings.one_week_ago;
    } else if (differenceInDays >= 14 && differenceInDays <= 27) {
      /* 2 weeks ago */ lastSeenString = Strings.few_weeks_ago;
    } else {
      lastSeenString = `${moment(time).format('DD/MM/YYYY')}`;
    }
    return lastSeenString;
  }
  return (
    <GlobalFlex>
      <BackHeader
        onBackPress={() => props.navigation.goBack()}
        isRightText
        rightText={Strings.cancel}
        title=""
        onNextPress={() => props.navigation.goBack()}
        textColor={{color: colors.PRIMARY_COLOR}}
        searchBar={
          <View style={styles.SearchBarContainer}>
            <View style={{width: wp(10), alignSelf: 'center'}}>
              <SearchIcon
                style={styles.searchIconStyle}
                source={images.search_ic}
              />
            </View>

            <SearchInput
              autoFocus={true}
              value={query}
              placeholder={Strings.search}
              placeholderTextColor={'#7b7d83'}
              onChangeText={val => {
                setQuery(() => val);
                //   val.length > 0 && getUserSearchPost(val, 1)
              }}
            />

            <ClearButton
              disabled={query.length <= 0}
              isActive={query.length > 0}
              onPress={() => {
                setQuery(() => '');
                //       setIsSearch(!is_search)
              }}>
              <ClearIcon source={images.iconDecline_3x} />
            </ClearButton>
          </View>
        }
      />
      <Spacer space={wp(1.5)} />
      <HeaderShadowLine light />
      <Spacer space={hp(0.5)} />
      {/* {query.length > 0} */}
      {query.length > 0 && (
        <FlatList
          data={
            messages.length > 0
              ? messages.filter(
                  it =>
                    it?.messageType !== 'admin' &&
                    it?.message?.toLowerCase()?.indexOf(query?.toLowerCase()) >
                      -1,
                )
              : []
          }
          keyExtractor={(ite, ind) => ind?.toString()}
          renderItem={({item, index}) => (
            <>
              <TouchableOpacity
                style={styles.mainItem}
                onPress={() => onPressSearchedItem(item)}>
                <Image
                  source={
                    item?.sender?.plainProfileUrl
                      ? {uri: item?.sender?.plainProfileUrl}
                      : images.avatar
                  }
                  style={styles.img}
                />
                <View style={styles.itemInnerBox}>
                  <View style={{flex: 1}}>
                    <Text>
                      {item?._sender?.userId == currentUser?.userId
                        ? Strings.you
                        : getrelamContactName(item?._sender?.metaData?.phone)}
                    </Text>
                    <TimeText>{item.message}</TimeText>
                  </View>
                  <View>
                    <TimeText>{getTime(item.createdAt)}</TimeText>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.seperator} />
            </>
          )}
        />
      )}
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

export default SearchMessageScreen;
