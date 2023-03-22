// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../res/fonts';
import {colors} from '../../../res/colors';
import styled from 'styled-components/native';

const Title = styled.Text`
  text-align: center;
  color: ${colors.BLACK};
  font-family: ${fonts.REGULAR};
  font-size: ${wp('4.2%')};
`;

const Button = styled.Pressable`
  align-items: center;
  flex-direction: row;
  border-bottom-width: 0.6px;
  border-bottom-color: #e4e6e7;
  padding-vertical: ${wp('3%')};
  padding-horizontal: ${wp('5%')};
`;

const Icon = styled.Image`
  width: ${wp('6%')};
  height: ${wp('6%')};
  margin-end: ${wp('3%')};
`;

export {Title, Button, Icon};

export default StyleSheet.create({
  someStyle: {
    transform: [{rotate: '90deg'}],
  },
});
