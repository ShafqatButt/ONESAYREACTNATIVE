// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import {colors} from '../../../res/colors';
import {fonts} from '../../../res/fonts';

const MainTitle = styled.Text`
  text-align: center;
  font-family: ${fonts.BOLD};
  font-size: ${wp(5)};
  color: ${colors.REGULAR_TEXT_COLOR};
`;

export {MainTitle};

export default StyleSheet.create({});
