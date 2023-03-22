import React, {useContext, useState, useEffect, useRef} from 'react';
import {Image, View, FlatList, TouchableOpacity} from 'react-native';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import styles, {HeaderShadowLine, BorderContainer, Text} from './style';
import {Spacer} from '../../../../res/spacer';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import {GET_DATA} from '../../../../api_helper/ApiServices';
import {ACTIVITIES} from '../../../../api_helper/Api';
import {AuthContext} from '../../../../context/Auth.context';

import deviceInfoModule from 'react-native-device-info';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/en-gb';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Strings from '../../../../string_key/Strings';

export default WalletActivityScreen = props => {
  // const { title } = props?.route?.params;
  const {state: ContextState} = useContext(AuthContext);
  const {userData} = ContextState;
  const {wallet_type} = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const refTodayDate = useRef(new Date());
  // const todayDatePlusOneMinute = new Date(new Date().getTime() + 60 * 1000);
  const todayDatePlusOneMinute = new Date();
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [endTs, setEndTs] = useState(refTodayDate?.current.addDays(6));
  const [startTs, setStartTs] = useState(todayDatePlusOneMinute);

  const [walletData, setWalletData] = useState([]);
  const refStartTs = useRef(refTodayDate?.current);
  const refSelection = useRef(1);
  const [selection, setSelection] = useState(1);

  //const WALLET_TYPE = ["Gifted Diamonds", "Gems", "Buzzcoin"]

  useEffect(() => {
    getWalletActivityList(startTs, endTs);
  }, [userData]);

  const getWalletActivityList = async (starDatetTs, endDateTs) => {
    setIsLoading(true);
    const uniqueID = await deviceInfoModule.getUniqueId();
    console.log(starDatetTs);
    //console.log(moment(starDatetTs).add(moment.duration("23:59:59").toISOString))
    console.log(
      ACTIVITIES +
        `?startDate=${moment(starDatetTs).toISOString()}&endDate=${moment(
          endDateTs,
        ).toISOString()}&wallet-type=${wallet_type}`,
    );
    GET_DATA(
      ACTIVITIES +
        `?startDate=${moment(starDatetTs).toISOString()}&endDate=${moment(
          endDateTs,
        ).toISOString()}&wallet-type=${wallet_type}`,
      true,
      userData?.token,
      uniqueID,
      data => {
        setWalletData(data);
        setIsLoading(false);
      },
    );
  };

  return (
    <GlobalFlex>
      <View>
        <BackHeader
          is_center_text
          title={Strings.wallet_activity}
          onBackPress={() => props.navigation.goBack()}
        />
        <Spacer space={wp(1.5)} />
        <HeaderShadowLine />
      </View>

      <DatePicker
        modal
        title={Strings.select_date}
        confirmText={Strings.confirm}
        cancelText={Strings.Cancel}
        locale={ContextState.selectedLang === 'en' ? 'en_GB' : 'es_GT'}
        mode={'date'}
        open={openDatePicker}
        date={refSelection.current == 1 ? new Date(startTs) : new Date(endTs)}
        onConfirm={date => {
          console.log(' ======= date');
          // console.log(moment(date).add(moment.duration("00:00:00").format('MM/DD/YYYY hh:mm A')))
          // console.log(moment(moment(date).toObject()).format())

          if (refSelection.current === 1) {
            setStartTs(date);
            getWalletActivityList(date, endTs);
          } else {
            setEndTs(date);
            getWalletActivityList(startTs, date);
          }
          setOpenDatePicker(false);
        }}
        onCancel={() => setOpenDatePicker(false)}
        // minimumDate={refSelection.current == 1 ? new Date() : new Date(startTs)}
        // maximumDate={refSelection.current == 1 ? new Date(endTs) : new Date(startTs).addDays(6)}
      />

      <View style={styles.rowItemContainerStyle}>
        <View style={styles.timeChipsContainerStyle}>
          <TouchableOpacity
            onPress={() => {
              setSelection(() => {
                refSelection.current = 1;
                return 1;
              });
              refTodayDate.current = new Date();
              setTimeout(() => {
                setOpenDatePicker(!openDatePicker);
              }, 350);
            }}
            style={styles.dateContainerStyle}>
            <Text>{moment(startTs).locale('es').format('DD-MMM-YYYY')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[{alignSelf: 'center'}]}>{Strings.to}</Text>

        <View style={styles.timeChipsContainerStyle}>
          <TouchableOpacity
            onPress={() => {
              setSelection(() => {
                refSelection.current = 2;
                return 2;
              });
              refTodayDate.current = new Date();
              setTimeout(() => {
                setOpenDatePicker(!openDatePicker);
              }, 350);
            }}
            style={styles.dateContainerStyle}>
            <Text>{moment(endTs).locale('es').format('DD-MMM-YYYY')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BorderContainer />
      {walletData.length > 0 ? (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={walletData}
            renderItem={({item}) => (
              <>
                <Spacer space={hp(0.2)} />
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: wp(2),
                    paddingHorizontal: wp(4),
                  }}>
                  <View style={{width: wp(90)}}>
                    <Text style={styles.postTitle}>
                      {Strings.points + ' : '}{' '}
                      <Text
                        style={{
                          fontFamily: fonts.BOLD,
                          color:
                            item?.trasactionType == 'Credited'
                              ? colors.DARK_GREEN
                              : colors.DARK_RED,
                        }}>
                        {item?.trasactionType == 'Credited' ? '+ ' : '- '}
                        {item?.amount}
                      </Text>
                    </Text>
                    <Text style={styles.postTitle}>
                      {Strings.currency + ' : '}{' '}
                      <Text style={{fontFamily: fonts.REGULAR}}>
                        {item?.currency}
                      </Text>
                    </Text>
                    <Text style={styles.postTitle}>
                      {Strings.awarded_on + ' : '}{' '}
                      <Text style={{fontFamily: fonts.REGULAR}}>
                        {moment(item?.modifiedOn).format('DD-MMM-YYYY')}
                      </Text>
                    </Text>
                    <Text style={styles.postTitle}>
                      {Strings.award_type + ' : '}{' '}
                      <Text style={{fontFamily: fonts.REGULAR}}>
                        {item?.behaviour}
                      </Text>
                    </Text>
                  </View>
                </View>
                <Spacer space={hp(0.2)} />
                <BorderContainer />
              </>
            )}
          />
          <Spacer space={hp(2)} />
        </>
      ) : (
        <View style={{flex: 1, JustifyContent: 'center'}}>
          <Text style={{alignSelf: 'center'}}>{Strings.no_activity_found}</Text>
        </View>
      )}

      {isLoading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: hp(60),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </GlobalFlex>
  );
};
