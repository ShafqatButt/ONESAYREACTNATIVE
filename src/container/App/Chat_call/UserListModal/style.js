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
  margin-top: ${hp('4%')};
  margin-start: ${wp('4')};
`;

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${hp('0.5%')};
`;

const ProfileImage = styled.Image`
  width: ${hp('4%')}
  height: ${hp('4%')};
`;

const UnderLine = styled.View`
  height: 0.5px;
  background-color: rgba(0, 0, 0, 0.15);
  margin-start: ${props => (props.marginAtStart ? wp('2%') : 0)};
`;

const TitleText = styled.Text`
  color: rgba(0, 0, 0, 0.24);
  font-weight: bold;
`;

const NameText = styled.Text`
  margin-start: ${wp('4%')};
`;

export {
  MainContainer,
  ItemContainer,
  UnderLine,
  TitleText,
  NameText,
  ProfileImage,
};

export default StyleSheet.create({
  someStyle: {},
});
