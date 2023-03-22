// noinspection ES6CheckImport

import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../res/fonts';
import {colors} from '../../../res/colors';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
  justify-content: center;
`;

const TitleText = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(4.5)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.BOLD};
`;

const SkipButton = styled.Pressable`
  margin-horizontal: ${wp(2)};
`;

const SkipText = styled.Text`
  text-align: center;
  color: ${colors.BLACK};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3)};
  margin-horizontal: ${wp(2)};
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

export {TitleText, ActionWrapper, MainContainer, SkipButton, SkipText, BorderContainer};

export default StyleSheet.create({
  shadowStyle: {
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
    }),
  },
});
