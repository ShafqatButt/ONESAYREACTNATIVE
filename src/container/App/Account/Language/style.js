// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import styled from 'styled-components/native';

const Text = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(4)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.BOLD};
`;

const ActionWrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  padding-vertical: ${wp(3.8)};
  width: ${wp(94)};
`;

const BorderContainer = styled.View`
  background-color: ${colors.BORDER_COLOR};
  height: ${wp(0.4)};
  width: ${wp(100)};
`;

export {Text, BorderContainer, ActionWrapper};

export const styles = StyleSheet.create({});
