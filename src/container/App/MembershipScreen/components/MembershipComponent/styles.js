// noinspection ES6CheckImport

import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../../res/colors';
import {fonts} from '../../../../../res/fonts';
import styled from 'styled-components/native';

const ColorLine = styled.View`
  width: 80%;
  align-self: center;
  border-radius: 90px;
  height: ${wp('1%')};
  background-color: ${props => props?.color || colors.PRIMARY_COLOR};
`;

const Container = styled.Pressable`
  border-radius: 20px;
  justify-content: center;
  background-color: ${colors.WHITE};
  margin-horizontal: ${wp('5%')};
`;

const TitleText = styled.Text`
  text-align: center;
  color: ${colors.BLACK};
  font-family: ${fonts.BOLD};
  font-size: ${wp(4)};
  margin-horizontal: ${wp(2)};
`;

const DescriptionText = styled.Text`
  color: ${colors.BLACK};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3.5)};
  margin-horizontal: ${wp(2)};
`;

const IconContainer = styled.View`
  padding: 3px;
  position: absolute;
  border-radius: 90px;
  align-self: baseline;
  justify-content: center;
  top: ${wp('2%')};
  right: ${wp('2%')};
  background-color: ${colors.DARK_GREEN};
  opacity: ${props => (props?.isSelected ? 1 : 0)};
`;

const Icon = styled.Image`
  align-self: center;
  tint-color: ${props => props?.tint || colors.WHITE};
  width: ${props => wp(props?.size || '5%')};
  height: ${props => wp(props?.size || '5%')};
`;

export {ColorLine, Container, TitleText, DescriptionText, IconContainer, Icon};

export default StyleSheet.create({
  shadowStyle: {
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
    }),
  },
});
