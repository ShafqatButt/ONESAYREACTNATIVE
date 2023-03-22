import styled from 'styled-components/native';
import {colors} from '../../../../../res/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const TitleContainer = styled.View`
  align-self: center;
  padding-horizontal: ${wp(1.5)};
`;

const MenuIcon = styled.Image`
  width: ${wp(8)};
  height: ${wp(8)};
  tint-color: ${colors.PRIMARY_COLOR};
`;

const MenuButton = styled.TouchableOpacity`
  //margin-bottom: ${wp('12%')};
  margin-vertical: ${wp('4%')};
  width: ${wp('100%') / 3};
  justify-content: center;
  align-items: center;
`;

export {TitleContainer, MenuIcon, MenuButton};
