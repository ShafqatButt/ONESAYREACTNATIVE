// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const containerBorderRadius = 4.5;
const RoundButton = styled.Pressable`
  position: absolute;
  border-radius: 90px;
  align-items: center;
  justify-content: center;
  right: ${wp('7%')};
  width: ${wp('13%')};
  height: ${wp('13%')};
  bottom: ${wp('8%')};
  background-color: ${colors.PRIMARY_COLOR};
`;
const PlusIcon = styled.Image`
  tint-color: white;
  margin-start: 3px;
  resize-mode: contain;
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`;

const EmptyListContainer = styled.View`
  justify-content: flex-end;
  height: ${hp('35%')};
`;

const ListItemContainer = styled.Pressable`
  width: 95%;
  margin-bottom: 15px;
  align-self: center;
  border-top-width: 7px;
  background-color: white;
  min-height: ${wp('25%')};
  border-top-color: ${colors.PRIMARY_COLOR};
  border-radius: ${containerBorderRadius}px;
`;

const SubHeaderContainer = styled.View`
  flex-direction: row;
`;
const HeaderContainer = styled.View`
  padding-top: ${wp('4%')}px;
  padding-horizontal: ${wp('3%')}px;
`;
const Icon = styled.Image`
  tint-color: ${colors.OSLO_GRAY};
  transform: ${'rotate(180deg)'};
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
  left: ${wp('1%')}px;
`;
const ItemTitle = styled.Text`
  color: black;
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.5%')};
  margin-top: ${wp('1%')}px;
`;

const TitleContainer = styled.View`
  flex: 1;
`;
const EmptyListTitle = styled.Text`
  color: black;
  align-self: center;
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.5%')};
  margin-top: ${wp('1.5%')}px;
`;
const EventTypeText = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.BOLD};
  font-size: ${wp('3%')};
`;
const ItemDescription = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.REGULAR};
  font-size: ${wp('3.5%')};
  margin-top: ${wp('0.5%')}px;
`;
const FooterContainer = styled.View`
  margin-top: ${wp('3%')}px;
  margin-horizontal: ${wp('1%')}px;
  border-top-width: 0.5px;
  border-top-color: ${colors.DARK_BORDER_GRAY};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const FooterItem = styled.View`
  // background-color: red;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding-vertical: ${wp('1.5%')}px;
  margin-vertical: ${wp('2%')}px;
  border-right-width: ${props => (props?.border ? '0.5px' : 0)};
  border-left-width: ${props => (props?.border ? '0.5px' : 0)};
  border-color: ${colors.DARK_BORDER_GRAY};
`;
const FooterText = styled.Text`
  color: ${colors.BLUE_ACTION};
  font-family: ${fonts.REGULAR};
  font-size: ${wp('3.8%')};
`;
export {
  ItemDescription,
  EventTypeText,
  TitleContainer,
  SubHeaderContainer,
  FooterItem,
  FooterText,
  HeaderContainer,
  Icon,
  ItemTitle,
  RoundButton,
  ListItemContainer,
  PlusIcon,
  EmptyListTitle,
  EmptyListContainer,
  FooterContainer,
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
  flexInnerWrapper: {
    flexDirection: 'row',
    marginLeft: wp(2.5),
    marginBottom: wp(3),
  },
  userDetsBox: {alignSelf: 'center', marginLeft: wp(2)},
  userNameText1: {
    color: colors.BLACK,
    fontSize: wp(4),
    textAlign: 'left',
  },
  userNameText2: {
    color: colors.DARK_BORDER_GRAY,
    fontSize: wp(3),
    textAlign: 'left',
    fontFamily: fonts.MEDIUM,
  },
  profile_ic: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
  },
});
