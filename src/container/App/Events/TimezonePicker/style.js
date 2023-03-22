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
const Button = styled.Pressable`
  flex: 1;
  flex-direction: row;
  align-items: center;
  border-color: rgba(0, 0, 0, 0.25);
  border-bottom-width: 0.5px;
  justify-content: space-between;
  background-color: ${colors.WHITE};
  padding-vertical: ${wp('5%')};
  padding-horizontal: ${wp('3%')};
`;
const CheckIcon = styled.Image`
  width: ${wp('5%')}px;
  height: ${wp('5%')}px;
  tint-color: ${colors.PRIMARY_COLOR};
  margin-end: ${wp('2%')};
`;
const DeleteIcon = styled.Image`
  width: ${wp('5%')}px;
  height: ${wp('5%')}px;
  tint-color: ${colors.DARK_RED};
  margin-end: ${wp('2%')};
`;
const SelectedText = styled.Text`
  color: black;
  margin-end: ${wp(2)};
`;
const SelectedContainer = styled.View`
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  align-self: baseline;
  justify-content: space-between;
  margin-start: ${wp(3)};
  padding-start: ${wp(2)};
  border-radius: ${wp(2)};
  padding-vertical: ${wp(2)};
  background-color: ${colors.COTTON_BALL};
`;

export {MainContainer, CheckIcon, DeleteIcon, Button, SelectedContainer, SelectedText};

export default StyleSheet.create({
  someStyle: {},
});
