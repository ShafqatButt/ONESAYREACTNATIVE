// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';
import {fonts} from '../../../../res/fonts';

const TopTabText = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(3.8)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.BOLD};
`;

export {TopTabText};

export default StyleSheet.create({
  flex_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  tab_wrapper: {
    paddingVertical: wp(2),
    marginLeft: wp(2),

    alignSelf: 'center',
  },
  profile_ic: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
  },
  topTabWrapper: {flexDirection: 'row', paddingLeft: wp(10)},
});
