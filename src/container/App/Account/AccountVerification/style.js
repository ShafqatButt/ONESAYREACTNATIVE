// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import styled from 'styled-components/native';
const TitleText = styled.Text`
  color: ${colors.BLACK};
  font-family: ${fonts.BOLD};
  font-size: ${wp(4.5)};
  margin-horizontal: ${wp(2)};
  max-width: ${wp(50)};
`;

const LabelText = styled.Text`
  bottom: -16px;
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3)};
  color: ${colors.TRIPLET_PLACEHOLDER};
  margin-start: ${wp('5.5%')};
`;
const BText = styled.Text`
  font-family: ${fonts.MEDIUM};
  color: ${colors.PRIMARY_COLOR};
  font-size: ${wp(3)};
`;

const Button = styled.Pressable`
  border-width: 1.3px;
  border-radius: 20px;
  border-color: ${colors.PRIMARY_COLOR};
  padding-vertical: ${wp('1.5%')};
  padding-horizontal: ${wp('5%')};
`;

const MainTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${wp(100)};
  justify-content: space-between;
  padding-horizontal: ${wp('5%')};
`;
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LabelIcon = styled.Image`
  width: ${wp('6%')};
  height: ${wp('6%')};
  tint-color: ${colors.PRIMARY_COLOR};
`;
const VerifyIcon = styled.Image`
  width: ${wp('5%')};
  height: ${wp('5%')};
`;

export {
  BText,
  Button,
  TitleText,
  LabelText,
  LabelIcon,
  VerifyIcon,
  TitleContainer,
  MainTitleContainer,
};

export default StyleSheet.create({
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
