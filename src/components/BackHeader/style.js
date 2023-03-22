// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';
import styled from 'styled-components/native';

const Icon = styled.Image`
  tint-color: ${colors.PRIMARY_COLOR};
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
`;

export {Icon};

export default StyleSheet.create({
  backIcon: {
    width: wp(5),
    height: wp(5),
    alignSelf: 'center',
  },
  text_center: {
    zIndex: -1,
    alignSelf: 'center',
    fontSize: wp(4),
    fontFamily: fonts.MEDIUM,
    position: 'absolute',
    width: wp(90),
    textAlign: 'center',
    color: 'black',
  },
});
