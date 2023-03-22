import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../res/colors';
import {fonts} from '../../../res/fonts';
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

const RegularText = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(4)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.REGULAR};
`;

const SubtitleText = styled.Text`
  margin-top: 4px;
  align-self: flex-start;
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.REGULAR};
  width: ${wp('60%')};
  font-size: ${wp(3.5)};
  margin-horizontal: ${wp(2)};
`;

const ActionWrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  padding-vertical: ${wp(3.8)};
  width: ${wp(90)};
`;

const BorderContainer = styled.View`
  width: ${wp(100)};
  height: ${wp(0.4)};
  background-color: ${colors.BORDER_COLOR};
`;

const ItemDivider = styled.View`
  width: ${wp(100)};
  height: ${hp(2.5)};
  background-color: ${colors.BORDER_SPACE_COLOR};
`;

export {
  Text,
  RegularText,
  ItemDivider,
  SubtitleText,
  MainContainer,
  ActionWrapper,
  BorderContainer,
};

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
});
