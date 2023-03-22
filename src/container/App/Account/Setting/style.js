// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
  justify-content: center;
`;

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

export {MainContainer, Text, BorderContainer, ActionWrapper};

export const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  icon_ic: {
    width: wp(3),
    height: wp(3),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  elevation_ic: {
    width: wp(12),
    height: wp(12),
    alignSelf: 'center',
    marginTop: wp(5),
  },
});
