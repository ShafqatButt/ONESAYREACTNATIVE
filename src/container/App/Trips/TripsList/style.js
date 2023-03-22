// noinspection ES6CheckImport

import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import styled from 'styled-components/native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';

const shadowMain = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,

  elevation: 2,
};
const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
  justify-content: center;
`;

// const Text = styled.Text`
//   color: ${colors.BLACK};
//   font-size: ${wp(4.5)};
//   text-align: center;
//   margin-horizontal: ${wp(2)};
//   font-family: ${fonts.BOLD};
// `;

const LabelText = styled.Text`
  font-family: ${fonts.MEDIUM};
  color: ${colors.DARK_PINK};
  font-size: ${wp(5)}px;
  margin-horizontal: ${wp(5)}px;
  margin-top: ${wp(5)}px;
`;

// const UsernameText = styled.Text`
//   align-self: center;
//   color: ${colors.BLACK};
//   font-family: ${fonts.MEDIUM};
//   font-size: ${wp(4)};
// `;

// const MenuContainer = styled.View`
//   flex-direction: row;
//   flex-wrap: wrap;
// `;

export {
  MainContainer,
  // Text,
  LabelText,
  // MenuContainer,
  // UsernameText,
};

export const styles = StyleSheet.create({
  emptyTextStyle: {
    color: 'black',
    fontFamily: fonts.BOLD,
    paddingTop: wp('50%'),
    fontSize: wp(4),
    alignSelf: 'center',
    textAlign: 'center',
  },
  shadow: {
    ...shadowMain,
  },
  itemOuter: {
    ...shadowMain,
    marginHorizontal: wp(5),
    // backgroundColor: 'red',
    marginTop: hp(2),
  },
  cityTxt: {
    ...shadowMain,
    fontFamily: fonts.MEDIUM,

    color: colors.BLACK,
    fontSize: wp(5),
    marginVertical: wp(2),
  },
  dateTxt: {
    ...shadowMain,
    fontFamily: fonts.REGULAR,

    color: colors.BLACK2,

    marginBottom: wp(1),
  },

  itemInner: {
    ...shadowMain,
    backgroundColor: colors.WHITE,
    padding: wp(3.5),
    flexDirection: 'row',
    marginTop: hp(1),
  },
  itemImg: {height: wp(14), width: wp(14), marginTop: wp('0.8%')},
  TextBox: {flex: 1, paddingHorizontal: wp(3)},
  IconBox: {},
  hotelNameTxt: {
    ...shadowMain,
    fontFamily: fonts.MEDIUM,

    color: colors.BLACK,
    fontSize: wp(3.5),
    marginBottom: wp(1),
  },
  statusTxt: {
    ...shadowMain,
    fontFamily: fonts.REGULAR,

    color: colors.DARK_BORDER_GRAY,
    fontSize: wp(3.5),
    marginBottom: wp(1),
  },
  searchWrapper: {marginTop: hp(2)},
});
