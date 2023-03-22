import {Platform, StyleSheet} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../res/fonts';

export const styles = StyleSheet.create({
  image_ic: {
    width: wp(6),
    height: wp(6),
    marginHorizontal: wp(1),
  },
  imageWrapper: {
    paddingTop:
      Platform.OS == 'ios' ? (isIphoneX ? getStatusBarHeight() + 15 : 10) : 10,
    height: Platform.OS == 'ios' ? (isIphoneX ? hp(14) : hp(12)) : hp(14),
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
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
  },
  icBackStyle: {
    width: wp(5),
    height: wp(5),
    marginEnd: wp('2%'),
  },
});
