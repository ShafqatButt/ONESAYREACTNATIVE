import {StyleSheet, Platform} from 'react-native';
// Styles
import {colors} from './colors';
import {fonts} from './fonts';
// Third Party Lib
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  getBottomSpace,
  getStatusBarHeight,
  ifIphoneX,
  isIphoneX,
} from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';
import {IS_IPHONE_X} from '../constants';

const ImgBackGroundgContainer = styled.ImageBackground`
  width: ${wp(100)};
  height: ${isIphoneX ? hp(14) : Platform.OS === 'ios' ? hp(12) : hp(14)};
`;

const SubContainer = styled.View`
  flex: 1;
  width: ${wp(90)};
  align-self: center;
`;

const GlobalFlex = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
`;

// const GlobalHeader = styled.View`
//   padding-bottom: 5px;
//   padding-top: ${props =>
//     Platform.OS === 'ios'
//       ? IS_IPHONE_X
//         ? getStatusBarHeight() + (props?.isModal ? 0 : 24)
//         : 10
//       : 16};
//   background-color: ${colors.WHITE};
// `;
const GlobalHeader = styled.View`
  padding-bottom: 5px;
  padding-top: ${props =>
    Platform.OS === 'ios' ? (props?.isModal ? wp('7%') : 0) : 16};
  background-color: ${colors.WHITE};
`;

const GlobalSubHeader = styled.View`
  flex-direction: row;
  width: ${wp(90)};
  align-self: center;
`;

const GlobalBorder = styled.View`
  background-color: ${colors.BORDER_COLOR};
  height: ${hp(0.15)};
  width: ${wp(100)};
`;

const MainTitle = styled.Text`
  text-align: center;
  font-size: ${wp(6.5)};
  font-family: ${fonts.BOLD};
  color: ${colors.REGULAR_TEXT_COLOR};
`;

const SubTitle = styled.Text`
  text-align: center;
  align-self: center;
  font-size: ${wp(4.2)};
  width: ${wp(80)};
  font-family: ${fonts.REGULAR};
  color: ${colors.REGULAR_TEXT_COLOR};
`;

const MenuTitle = styled.Text`
  text-align: center;
  align-self: center;
  font-size: ${wp(3.5)};
  font-family: ${fonts.MEDIUM};
  margin-top: ${hp('1%')};
  color: ${colors.REGULAR_TEXT_COLOR};
`;

const ActivityDot = styled.View`
  position: absolute;
  right: 0;
  background-color: #f32808;
  border-radius: 90px;
  height: ${wp(2)};
  width: ${wp(2)};
`;

export {
  ActivityDot,
  SubContainer,
  GlobalFlex,
  GlobalHeader,
  GlobalSubHeader,
  MainTitle,
  SubTitle,
  GlobalBorder,
  MenuTitle,
  ImgBackGroundgContainer,
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + 10,
      },
      {
        paddingTop: getStatusBarHeight(),
      },
    ),
  },
  width: {
    width: wp(90),
    alignSelf: 'center',
  },
  oneFlex: {
    flex: 1,
  },
  bottomSpace: {
    ...ifIphoneX(
      {
        marginBottom: getBottomSpace(),
      },
      {
        marginBottom: 10,
      },
    ),
  },
  lg_bottomSpace: {
    ...ifIphoneX(
      {
        marginBottom: getBottomSpace(),
      },
      {
        marginBottom: 16,
      },
    ),
  },
  lg_topSpace: {
    marginTop: 16,
  },
  hideIconsRNPicker: {
    chevronDown: {
      display: 'none',
    },
    chevronUp: {
      display: 'none',
    },
  },
});

export default globalStyles;
