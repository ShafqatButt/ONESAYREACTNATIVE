// noinspection ES6CheckImport

import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const PickerContainer = styled.View`
  align-self: center;
  align-items: center;
  flex-direction: row;
  border-bottom-width: 1.5px;
  width: ${wp(88)};
  margin: ${wp(2)}px;
  justify-content: space-between;
  border-color: ${colors.LIGHT_GRAY};
  padding-vertical: ${wp('2%')}px;
`;

const LabelText = styled.Text`
  bottom: -16px;
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3)};
  color: ${colors.TRIPLET_PLACEHOLDER};
  margin-start: ${wp('5.5%')};
`;

const Text = styled.Text`
  text-align: center;
  color: ${colors.BLACK};
  font-family: ${fonts.BOLD};
  font-size: ${wp(4)};
  margin-horizontal: ${wp(2)};
`;

export {Text, LabelText, PickerContainer};

export default StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  icon_ic: {
    width: wp(3),
    height: wp(3),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  elevation_ic: {
    width: wp(12),
    height: wp(12),
    alignSelf: 'center',
    marginTop: wp(5),
  },
  dropArrowStyle: {
    top: 0,
    right: 0,
    bottom: 0,
    marginBottom: 0,
    position: 'absolute',
  },
  androidPickerStyle: {
    fontSize: wp(4.5),
    fontFamily: fonts.REGULAR,
    paddingLeft: 0,
    width: wp(88),
    color: colors.BLACK,
  },
  pickerStyle: {
    ...(Platform.OS === 'android' && {height: '100%'}),
    fontSize: wp(4.5),
    width: wp(88),
    fontFamily: fonts.REGULAR,
    paddingLeft: 0,
    justifyContent: 'center',
    paddingBottom: wp(0.5),
    color: colors.BLACK,
  },
});
