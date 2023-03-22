// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${colors.WHITE};
`;
const HeaderShadowLine = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-color: ${colors.LIGHT_GRAY};
  border-bottom-width: ${props => (props?.light ? 0.8 : 1.5)}px;
`;
export {MainContainer, HeaderShadowLine};
export default StyleSheet.create({
  flexInnerWrapper: {
    marginLeft: wp(10),
    marginBottom: hp(1.5),
    marginTop: hp(1),
  },
  icon_ic: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: wp(6),
    height: wp(6),
  },
  profile_ic: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(20),
    borderWidth: 2,
    borderColor: colors.PRIMARY_COLOR,
  },
  userDetsBox: {marginTop: hp(1.5), marginBottom: hp(2)},
  userNameText1: {
    color: colors.BLACK,
    fontSize: wp(5),
    textAlign: 'left',
    fontFamily: fonts.MEDIUM,
  },
  userNameText2: {
    color: colors.DARK_BORDER_GRAY,
    fontSize: wp(4),
    textAlign: 'left',
    fontFamily: fonts.MEDIUM,
  },
});