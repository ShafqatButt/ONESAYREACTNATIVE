// noinspection ES6CheckImport

import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import {SearchComponent} from '../../../../uikit-app/GroupChannelTabs/GroupChannelListScreen';
import styles, {
  CheckIcon,
  Button,
  DeleteIcon,
  SelectedContainer,
  SelectedText,
} from './style';
import {BackHeader} from '../../../../components/BackHeader';
import {GlobalFlex} from '../../../../res/globalStyles';
import {underDevelopment} from '../../../../uikit-app';
import {colors} from '../../../../res/colors';
import {Spacer} from '../../../../res/spacer';
import IconAssets from '../../../../assets';
import moment from 'moment-timezone';

export default TimezonePicker = props => {
  const {currentTimezone, onTimezoneSelected} = props.route.params;
  const [timezoneList, setTimezoneList] = useState([]);
  const [selected, setSelected] = useState(currentTimezone);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchList = async () =>
    moment?.tz?.names().map(s => ({
      title: s,
      timeText: moment().tz(s).format('hh:mmA'),
      ui: isSelected => (
        <Button onPress={() => setSelected(() => s)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {isSelected === s && (
              <CheckIcon source={IconAssets.ic_verified_green} />
            )}
            <Text style={{color: 'black'}}>{s}</Text>
          </View>
          <Text style={{color: 'black'}}>
            {moment().tz(s).format('hh:mmA')}
          </Text>
        </Button>
      ),
    }));

  useEffect(() => {
    setTimeout(() =>
      fetchList().then(list => {
        setLoading(() => false);
        setTimezoneList(() => list);
      }, 200),
    );
  }, []);

  return (
    <GlobalFlex>
      <BackHeader
        isModal
        isRightText
        is_center_text
        rightText={'Save'}
        title={'Time zone'}
        onNextPress={() => {
          if (selected.length < 1) {
            underDevelopment('Please select timezone');
            return;
          }
          onTimezoneSelected(selected);
          props.navigation.goBack();
        }}
        nextTextStyle={{color: colors.PRIMARY_COLOR}}
        onBackPress={() => props.navigation.goBack()}
      />
      <Spacer space={hp(1.5)} />
      <SearchComponent onQuery={setQuery} />
      {selected.length > 0 && (
        <SelectedContainer>
          <SelectedText>{selected}</SelectedText>
          <Pressable onPress={() => setSelected(() => '')}>
            <DeleteIcon source={IconAssets.btnCallDecline} />
          </Pressable>
        </SelectedContainer>
      )}
      <Spacer space={hp(1)} />
      <ScrollView>
        {timezoneList
          .filter(d => d.title.toLowerCase().includes(query.toLowerCase()))
          .map(d => d.ui(selected))}
      </ScrollView>
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
