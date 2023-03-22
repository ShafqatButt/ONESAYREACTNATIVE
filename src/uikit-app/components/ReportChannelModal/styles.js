// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {fonts} from '../../../res/fonts';
import {colors} from '../../../res/colors';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const Title = styled.Text`
  color: ${colors.BLACK};
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.5%')};
`;

const Message = styled.Text`
  color: #8f9eb3;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('3.5%')};
`;

const Button = styled.Text`
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.3%')};
  padding-start: ${wp('9%')};
  color: ${colors.PRIMARY_COLOR};
`;

const MainContainer = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${'rgba(0,0,0,0.4)'};
`;

const Container = styled.View`
  width: 85%;
  height: 33%;
  padding: 19px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const Flex = styled.View`
  flex: 1;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-self: flex-end;
`;

const CheckBox = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.Image`
  width: ${wp('5%')};
  height: ${wp('5%')};
  margin-end: ${wp('2.3%')};
  tint-color: ${colors.PRIMARY_COLOR};
`;

export {
  Icon,
  Flex,
  Title,
  Button,
  Message,
  CheckBox,
  Container,
  MainContainer,
  ButtonContainer,
};

export default StyleSheet.create({
  someStyle: {
    transform: [{rotate: '90deg'}],
  },
});
