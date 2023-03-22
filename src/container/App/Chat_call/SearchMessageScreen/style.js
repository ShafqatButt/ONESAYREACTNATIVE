import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styled from 'styled-components/native';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';

const MainContainer = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const Text = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(4.5)};

  font-family: ${fonts.REGULAR};
`;
const TimeText = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-size: ${wp(3.5)};

  font-family: ${fonts.REGULAR};
`;
const SearchInput = styled.TextInput`
  width: 100%;
  height: 100%;
  color: ${colors.BLACK};
  font-size: ${wp('4%')};
  padding-horizontal: ${wp('3%')};
`;

const SearchIcon = styled.Image`
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
  background-color: rgb(140, 137, 140);
  border-radius: 90px;
  padding: 4px;
`;

export {
  MainContainer,
  Text,
  SearchInput,
  SearchIcon,
  ClearButton,
  ClearIcon,
  TimeText,
};

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: 'red'},
  searchIconStyle: {
    // transform: [{rotate: '90deg'}],
    alignSelf: 'center',
    tintColor: 'rgb(140,137,140)',
    width: wp(4.5),
    height: wp(4.5),
  },
  SearchBarContainer: {
    position: 'absolute',
    overflow: 'hidden',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: wp(5),
    alignItems: 'center',
    backgroundColor: 'rgb(238,235,239)',

    justifyContent: 'space-evenly',
    width: wp('67%'),
    height: wp('11%'),
    marginLeft: wp(10),
    paddingLeft: wp('5%'),
    paddingRight: wp('6.4%'),
    zIndex: 100,
  },
  img: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(12),
    resizeMode: 'cover',
  },
  mainItem: {
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    height: hp(8),
  },
  itemInnerBox: {
    flex: 1,
    marginLeft: wp(2),

    flexDirection: 'row',
  },
  seperator: {
    backgroundColor: colors.BORDER_COLOR,
    height: 1,
    width: wp(83),
    alignSelf: 'flex-end',
  },
});
