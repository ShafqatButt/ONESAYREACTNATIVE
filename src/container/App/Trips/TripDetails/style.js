// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import styled from 'styled-components/native';
import {IS_IPHONE_X} from '../../../../constants';
// import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';

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

const DetailText = styled.Text`
  font-family: ${fonts.REGULAR};
  color: ${colors.BLACK};
  font-size: ${wp(3.5)}px;
  margin-horizontal: ${wp(4)}px;
  margin-top: ${wp(4)}px;
`;

const HeaderShadowLine = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-color: ${colors.LIGHT_GRAY};
  border-bottom-width: ${props => (props?.light ? 0.8 : 1.5)}px;
`;
export {HeaderShadowLine, DetailText};

export const styles = StyleSheet.create({
  card_image: {
    width: wp(100),
    height: hp(45),
    resizeMode: 'cover',
  },
  // img: {width: '100%', height: hp(40), justifyContent: 'flex-end'},
  img: {width: '100%', height: '100%', justifyContent: 'flex-end'},
  backImg: {width: wp(6), height: wp(6)},
  shadow: {
    ...shadowMain,
  },

  TitleTxt: {
    ...shadowMain,
    fontFamily: fonts.REGULAR,

    color: colors.WHITE,
    fontSize: wp(4),
    marginBottom: wp(2),
    marginLeft: wp(4),
    marginTop: wp(2),
  },
  eventTitleStyle: {
    alignSelf: 'center',
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontSize: wp(4.5),
    marginVertical: wp(5),
    marginHorizontal: wp(4),
  },
  dateTxt: {
    ...shadowMain,
    fontFamily: fonts.REGULAR,
    color: colors.WHITE,
    fontSize: wp(3),
    marginTop: wp(2),
    marginLeft: wp(4),
  },
  opaqueView: {backgroundColor: 'rgba(99,40,225,0.3)'},
  backBtnContainer: {
    position: 'absolute',

    left: wp(4),
  },
  dayHeaderBox: {
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.3,
  },
  dayHeaderTxt: {
    color: colors.BLACK,
    fontFamily: fonts.MEDIUM,
    fontSize: wp(3.5),
    marginHorizontal: wp(2),
  },
});
