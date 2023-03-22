import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../../res/colors';
import {getBottomSpace, ifIphoneX} from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';
import {fonts} from '../../../res/fonts';

const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const ImgBackGroundgContainer = styled.ImageBackground`
  justify-content: center;
  width: ${wp(100)};
  height: ${hp(45)};
`;

const LogoWrapper = styled.View`
  background-color: ${colors.WHITE};
  height: ${wp(25)};
  width: ${wp(25)};
  padding: ${wp(1)}px;
  border-radius: ${wp(3)};
  top: ${-wp(12)};
  align-self: center;
`;

export {MainContainer, ImgBackGroundgContainer, LogoWrapper};

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
  logo_ic: {
    height: wp(22),
    width: wp(22),
    alignSelf: 'center',
  },
  txtNormalStyle: {
    color: colors.BLACK,
    fontSize: wp(3),
    alignSelf: 'center',
    fontFamily: fonts.MEDIUM,
  },
  BottomWrapper: {
    ...ifIphoneX(
      {
        bottom: getBottomSpace(),
      },
      {
        bottom: 12,
      },
    ),
    position: 'absolute',
    alignSelf: 'center',
  },
});
