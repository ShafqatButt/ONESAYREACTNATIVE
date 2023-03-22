// noinspection ES6CheckImport

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../../res/colors';
import {getBottomSpace, ifIphoneX} from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';
import {fonts} from '../../../res/fonts';

const MessageText = styled.Text`
  text-align: center;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('4.5%^')};
  padding-top: ${wp('4%')};
  padding-bottom: ${wp('7%')};
`;
const TitleText = styled.Text`
  font-family: ${fonts.BOLD};
  font-size: ${wp('4.5%^')};
`;

const LoginText = styled.Text`
  font-family: ${fonts.BOLD};
  color: ${colors.PRIMARY_COLOR};
  font-size: ${wp('4%')};
`;

export {MessageText, LoginText, TitleText};

export default StyleSheet.create({
  btnWrapper: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    width: '90%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tickContainerStyle: {
    borderRadius: 90,
    padding: wp('1%'),
    backgroundColor: colors.PRIMARY_COLOR,
  },
  tickIconStyle: {
    height: wp('14%'),
    width: wp('14%'),
    tintColor: 'white',
  },
  mainContainerStyle: {flex: 1, justifyContent: 'center'},
  innerContainerStyle: {
    shadowColor: colors.PRIMARY_COLOR,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.41,
      },
    }),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: wp('5%'),
    padding: wp('5%'),
  },
  leftAlign: {alignSelf: 'flex-start', textAlign: 'left'},
  btnStyle: {
    height: wp(8),
    width: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY_COLOR,
    // paddingHorizontal: wp(15),
    // paddingVertical: wp(2),
    borderRadius: wp(1),
  },
});
