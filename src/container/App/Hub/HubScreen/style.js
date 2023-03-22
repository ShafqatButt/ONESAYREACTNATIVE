// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const RegularText = styled.Text`
  text-align: center;
  color: ${colors.WHITE};
  font-family: ${fonts.BOLD};
  font-size: ${wp(4.5)};
  margin-horizontal: ${wp(2)};
`;
const HeaderText = styled.Text`

  color: ${colors.WHITE};
  font-family: ${fonts.BOLD};
  font-size: ${wp(4.5)};
  margin-horizontal: ${wp(5)};
`;
const ButtonText = styled.Text`
  text-align: center;
  color: ${colors.WHITE};
  font-family: ${fonts.MEDIUM};
  font-size: ${wp(5)};
  margin-horizontal: ${wp(2)};
`;
const MainContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${colors.WHITE};
`;
const RoundButton = styled.Pressable`
  border-radius: 40px;
  justify-content: center;
  background-color: #06bdc5;
  padding-vertical: ${wp('1.8%')};
  padding-horizontal: ${wp('3%')};
`;
const InviteContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  height: ${wp('35%')};
  background-color: ${colors.PRIMARY_COLOR};
`;
const LoadingContainer = styled.View`
  // flex-direction: row;
  // align-items: center;
  justify-content: space-evenly;
  height: ${wp('35%')};
  background-color: ${colors.PRIMARY_COLOR};
`;
const HeaderShadowLine = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-color: ${colors.LIGHT_GRAY};
  border-bottom-width: ${props => (props?.light ? 0.8 : 1.5)}px;
`;
export {
  MainContainer,
  HeaderShadowLine,
  InviteContainer,
  RegularText,
  ButtonText,
  RoundButton,LoadingContainer,HeaderText
};
export default StyleSheet.create({
  icon_ic: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: wp(6),
    height: wp(6),
  },
});
