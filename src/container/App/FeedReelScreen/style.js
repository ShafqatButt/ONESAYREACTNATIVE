// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../res/fonts';
import {colors} from '../../../res/colors';
import styled from 'styled-components/native';

const RegularText = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(4)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.REGULAR};
`;
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
export {MainContainer, RegularText, HeaderShadowLine};
const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,

  // elevation: 2,
};
export default StyleSheet.create({
  icon_ic: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: wp(6),
    height: wp(6),
  },
  flex_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',

    marginLeft: wp(5),
  },
  tab_wrapper: {
    ...shadow,
    paddingTop: wp(2),

    paddingBottom: wp(0.5),
    minWidth: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {fontSize: wp(3.8), ...shadow},
});
