// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../../../res/colors';
import {fonts} from '../../../../../res/fonts';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const Container = styled.TouchableOpacity`
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const TitleText = styled.Text`
  font-size: ${wp(4)};
  color: ${colors.PRIMARY_COLOR};
  font-family: ${fonts.MEDIUM};
`;

export {Container, TitleText, MainContainer};

export default StyleSheet.create({});
