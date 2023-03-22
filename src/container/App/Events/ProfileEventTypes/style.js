// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const containerBorderRadius = 12;
const RoundButton = styled.Pressable`
  position: absolute;
  border-radius: 90px;
  align-items: center;
  justify-content: center;
  right: ${wp('8%')};
  width: ${wp('13%')};
  height: ${wp('13%')};
  bottom: ${wp('25%')};
  background-color: ${colors.PRIMARY_COLOR};
`;
const PlusIcon = styled.Image`
  tint-color: white;
  margin-start: 3px;
  resize-mode: contain;
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`;

const EmptyListTitle = styled.Text`
  color: black;
  align-self: center;
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.5%')};
  margin-top: ${wp('1.5%')}px;
`;

const EmptyListContainer = styled.View`
  justify-content: flex-end;
  height: ${hp('35%')};
`;

const ListItemContainer = styled.Pressable`
  width: 95%;
  margin-top: 10px;
  align-self: center;
  border-top-width: 4px;
  background-color: white;
  min-height: ${wp('25%')};
  border-top-color: ${colors.PRIMARY_COLOR};
  border-radius: ${containerBorderRadius}px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
`;
const Icon = styled.Image`
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
  margin: ${wp('4%')}px;
`;
const ItemTitle = styled.Text`
  color: black;
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.5%')};
  margin-top: ${wp('1.5%')}px;
`;

const TitleContainer = styled.View`
  flex: 1;
`;
const EventTypeText = styled.Text`
  color: black;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('3%')};
  margin-top: ${wp('1%')}px;
`;
const ItemDescription = styled.Text`
  flex: 1;
  color: black;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('3%')};
  padding-vertical: ${wp('1%')}px;
  padding-horizontal: ${wp('4%')}px;
`;

export {
  ItemDescription,
  EventTypeText,
  TitleContainer,
  HeaderContainer,
  Icon,
  ItemTitle,
  RoundButton,
  ListItemContainer,
  PlusIcon,
  EmptyListTitle,
  EmptyListContainer,
};

export default StyleSheet.create({
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
