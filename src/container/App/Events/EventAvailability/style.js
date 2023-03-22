// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const TimeColContainer = styled.View`
  align-items: center;
  justify-content: space-evenly;
`;
const InnerContainer = styled.View`
  margin-top: ${props => (props?.padTop ? wp('2%') : 0)}px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
`;
const DayMainContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.WHITE};
  margin-top: ${wp('2%')};
  margin-horizontal: ${wp('4%')};
`;
const PlusIcon = styled.Image`
  resize-mode: contain;
  width: ${wp('6%')};
  height: ${wp('6%')};
  tint-color: ${props =>
    props?.disabled ? colors.DARK_GRAY_91 : colors.PRIMARY_COLOR};
`;
const TimeContainer = styled.View`
  width: ${wp('42%')}
  border-radius: 4px;
  border-width: 0.5px;
  border-color: rgba(0, 0, 0, 0.4);
  margin-end: ${wp('2%')};
  align-items: center;
  justify-content: space-evenly;
  padding-vertical: ${wp('4%')};

`;
const Button = styled.Pressable`
  padding: ${props => (props?.disabled ? 0 : 2)}px;
  opacity: ${props => (props?.disabled ? 0 : 1)};
`;
const DayText = styled.Text`
  color: ${colors.BLACK};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3.5)};
  margin-start: ${wp('3%')};
`;
const TimeText = styled.Text`
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3.5)};
  color: ${props => (props?.isEnabled ? 'black' : 'rgba(0,0,0,0.13)')};
`;
const HeaderShadowLine = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-color: ${colors.LIGHT_GRAY};
  border-bottom-width: ${props => (props?.light ? 0.8 : 1.5)}px;
`;
export {
  Button,
  DayText,
  PlusIcon,
  TimeText,
  TimeContainer,
  InnerContainer,
  TimeColContainer,
  HeaderShadowLine,
  DayMainContainer,
};
export default StyleSheet.create({
  icon_ic: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: wp(6),
    height: wp(6),
  },
});
