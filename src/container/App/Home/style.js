// noinspection ES6CheckImport

import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../res/colors';
import {fonts} from '../../../res/fonts';
import styled from 'styled-components/native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';

const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
  justify-content: center;
`;

const Text = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(4.5)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.BOLD};
`;

const LabelText = styled.Text`
  font-family: ${fonts.BOLD};
  color: ${colors.PRIMARY_COLOR};
  font-size: ${wp(4.5)};
  margin-left: ${wp(5)};
`;

const UsernameText = styled.Text`
  align-self: center;
  color: ${colors.BLACK};
  font-family: ${fonts.MEDIUM};
  font-size: ${wp(4)};
`;

const MenuContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export {
  MainContainer,
  Text,
  LabelText,
  MenuContainer,
  UsernameText,
};

export const styles = StyleSheet.create({
  image_ic: {
    width: wp(6),
    height: wp(6),
    marginHorizontal: wp(1),
  },
  wrapper: {
    alignSelf: 'center',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  header: {
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: fonts.REGULAR,
    fontSize: 30,
    color: colors.PRIMARY_COLOR,
    paddingVertical: 10,
  },
  post: {
    padding: 15,
    borderRadius: 10,
    margin: 4,
    width: wp(44),
    backgroundColor: '#EFEFEF',
  },
  postTitle: {color: colors.REGULAR_TEXT_COLOR, textTransform: 'capitalize'},
  imageWrapper: {
    paddingTop:
      Platform.OS == 'ios' ? (isIphoneX ? getStatusBarHeight() + 15 : 10) : 16,
    height: isIphoneX ? hp(14) : Platform.OS == 'ios' ? hp(12) : hp(14),
    width: wp(90),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  icon_ic: {
    width: wp(7),
    height: wp(7),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  flexWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexInnerWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  profile_ic: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(10),
  },
});
