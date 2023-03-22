// noinspection ES6CheckImport

import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const Button = styled.TouchableOpacity`
  padding: 2px;
  border-width: ${props => (props?.noBorder ? 0 : 2.5)}px;
  border-radius: 90px;
  border-color: white;
  margin-bottom: 10px;
`;
const Dot = styled.View`
  border-radius: ${props => (props?.stopEnabled ? 10 : 90)}px;
  padding: ${props => (props?.stopEnabled ? wp('4%') : wp('7.5%'))}px;
  margin: ${props => (props?.stopEnabled ? wp('3.5%') : 0)}px;
  background-color: ${props => props.color};
`;
const Icon = styled.Image`
  border-radius: 90px;
  tint-color: ${colors.WHITE};
  width: ${wp('10%')}px;
  height: ${wp('10%')}px;
`;
const ActiveText = styled.Text`
  color: white;
  margin-end: 10px;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('4.5%')}px;
`;

const FooterContainer = styled.View`
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: ${wp('30%')}px;
  background-color: rgba(0, 0, 0, 0.4);
`;
const ToggleContainer = styled.View`
  top: 0;
  bottom: 0;
  position: absolute;
  align-items: center;
  flex-direction: row;
  right: ${wp('4%')}px;
`;

export {Button, Dot, FooterContainer, ActiveText, ToggleContainer, Icon};

export default StyleSheet.create({
  fullScreenStyle: {height: '100%', width: '100%'},
  headerStyle: {
    position: 'absolute',
    width: wp('100%'),

    paddingTop: wp(4),
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingBottom: wp(3.5),
  },
});
