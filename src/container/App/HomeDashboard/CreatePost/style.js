import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
  justify-content: center;
`;

const Text = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(4)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.BOLD};
`;

const ActionWrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  padding-vertical: ${wp(3.8)};
  width: ${wp(94)};
`;

const BorderContainer = styled.View`
  background-color: ${colors.BORDER_COLOR};
  height: ${wp(0.4)};
  width: ${wp(100)};
`;

export {MainContainer, Text, BorderContainer, ActionWrapper};

export const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  icon_ic: {
    width: wp(3),
    height: wp(3),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  elevation_ic: {
    width: wp(12),
    height: wp(12),
    alignSelf: 'center',
    marginTop: wp(5),
  },
  listItemContainer: {
    paddingVertical: wp(3),
    flexDirection: 'row',
    borderBottomColor: colors.DARK_BORDER_GRAY,
    borderBottomWidth: 0.5,
    paddingLeft: wp(4),
    paddingRight: wp(4),

    backgroundColor: colors.WHITE,
    justifyContent: 'space-between',
  },


//   listItemLabel: {
//     color: colors.REGULAR_TEXT_COLOR,
//     fontSize: wp(3.8),
//     fontFamily: fonts.REGULAR,
//     textAlign: 'left',
//   },
//   input: {
//     width: '100%',
//     minHeight: hp(10),
//     borderRadius: wp(4),
//     backgroundColor: 'transparent',
//     fontSize: wp(5),
//     fontFamily: fonts.REGULAR,
//   },
//   container: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: wp(30),
//     maxWidth: wp(30),
//     height: wp(30),
//     borderRadius: 5,
//   },
//   playIcon: {
//     position: 'absolute',
//     padding: 10,
//     alignSelf: 'center',
//     borderRadius: 50,
//   },
//   imageThumbnail: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: hp(25),
//   },
// });



  listItemLabel: {
    color: colors.REGULAR_TEXT_COLOR,
    fontSize: wp(3.8),
    fontFamily: fonts.REGULAR,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    minHeight: hp(10),
    borderRadius: wp(4),
    backgroundColor: 'transparent',
    fontSize: wp(5),
    fontFamily: fonts.REGULAR,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: wp(30),
    maxWidth: wp(30),
    height: wp(30),
    borderRadius: 5,
  },
  playIcon: {
    position: 'absolute',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 50,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(25),
  },
});

