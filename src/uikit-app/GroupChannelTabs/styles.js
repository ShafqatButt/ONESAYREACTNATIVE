// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';

const TabTitle = styled.Text`
  font-family: ${fonts.REGULAR};
  font-size: ${wp('4%')};
  text-align: center;
  color: ${props => (props.isSelected ? colors.WHITE : '#7e8da6')};
`;

const TabItem = styled.Pressable`
  width: ${wp('30%')};
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isSelected ? colors.PRIMARY_COLOR : colors.WHITE};
`;

const TabContainer = styled.View`
  margin-vertical: ${wp('5%')};
  align-self: center;
  overflow: hidden;
  flex-direction: row;
  border-radius: 50px;
  justify-content: space-evenly;
  height: ${wp('9.5%')};
  width: ${wp('90%')};
  border-width: 0.5px;
  border-color: #7e8da6;
`;

const SearchBarContainer = styled.View`
  overflow: hidden;
  align-self: center;
  flex-direction: row;
  border-radius: 50px;
  align-items: center;
  background-color: #d8dde4;
  justify-content: space-evenly;
  width: ${wp('90%')};
  height: ${wp('9.5%')};
  margin-bottom: ${wp('2%')};
  padding-horizontal: ${wp('5%')};
`;

const SearchBarContainerMember = styled.View`
  overflow: hidden;
  align-self: center;
  flex-direction: row;
  border-radius: 50px;
  align-items: center;
  background-color: #d8dde4;
  justify-content: space-evenly;
  width: ${wp('90%')};
  height: ${wp('9.5%')};

  margin-top: ${wp('2%')};
  padding-horizontal: ${wp('5%')};
`;

const SearchInput = styled.TextInput`
  width: 100%;
  height: 100%;
  //background-color: red;
  color: #7b7d83;
  font-size: ${wp('4.5%')};
  padding-horizontal: ${wp('4%')};
`;

const Button = styled.Pressable`
  position: absolute;
  bottom: ${wp(5)};
  right: ${wp(5)};
`;

const Icon = styled.Image`
  width: ${wp(16)};
  height: ${wp(16)};
`;

const SearchIcon = styled.Image`
  tint-color: #b4c1d0;
  width: ${wp(4.5)};
  height: ${wp(4.5)};
`;

const ClearIcon = styled.Image`
  tint-color: #d8dde4;
  width: ${wp(3)};
  height: ${wp(3)};
`;

const ClearButton = styled.Pressable`
  opacity: ${props => (props.isActive ? 1 : 0)};
  background-color: #7b7d83;
  border-radius: 90px;
  padding: 4px;
`;

export {
  Icon,
  Button,
  TabItem,
  TabTitle,
  ClearIcon,
  SearchIcon,
  ClearButton,
  SearchInput,
  TabContainer,
  SearchBarContainer,
  SearchBarContainerMember
};

export default StyleSheet.create({
  searchIconStyle: {
    transform: [{rotate: '90deg'}],
  },
});
