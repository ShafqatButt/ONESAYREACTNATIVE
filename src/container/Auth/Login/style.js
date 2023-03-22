import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../../res/colors';
import {isIphoneX} from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';
import {fonts} from '../../../res/fonts';

const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const ImgBackGroundgContainer = styled.ImageBackground`
  width: ${wp(100)};
  height: ${isIphoneX ? hp(14) : Platform.OS == 'ios' ? hp(12) : hp(14)};
`;

const LogoWrapper = styled.View`
  background-color: ${colors.WHITE};
  height: ${wp(16)};
  width: ${wp(16)};
  padding: ${wp(1)}px;
  border-radius: ${wp(3)};
  top: ${-wp(8)};
  align-self: center;
`;

const BackWrapper = styled.TouchableOpacity`
  position: absolute;
  bottom: ${wp(8)};
  left: ${wp(4)};
  zindex: 1;
`;

const ForgotWrapper = styled.TouchableOpacity`
  padding: 2px;
  align-self: flex-end;
  margin-right: 5px;
  justify-content: center;
  margin-bottom: -5px;
`;

export {
  MainContainer,
  ImgBackGroundgContainer,
  LogoWrapper,
  ForgotWrapper,
  BackWrapper,
};

export const styles = StyleSheet.create({
  shadowStyle: {
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: colors.PRIMARY_COLOR,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.41,
      },
    }),
  },
  back_ic: {
    height: wp(5),
    width: wp(5),
  },
  logo_ic: {
    height: wp(14),
    width: wp(14),
    alignSelf: 'center',
  },
  bold_font: {
    fontSize: wp(8),
    fontFamily: fonts.BOLD,
    color: colors.BLACK,
    textAlign: 'center',
  },
  txtNormalStyle: {
    color: colors.PRIMARY_COLOR,
    fontSize: wp(4),
    alignSelf: 'center',
    marginRight: wp(2),
    fontFamily: fonts.BOLD,
  },
});
