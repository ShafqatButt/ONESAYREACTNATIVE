import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../res/colors';
import styled from 'styled-components/native';
import {fonts} from '../../res/fonts';

const ButtonContainer = styled.TouchableOpacity`
  height: ${wp('12%')};
  align-items: center;
  justify-content: center;
  width: ${wp(88)};
  align-self: center;
  opacity: ${props => (props?.disabled ? 0.2 : 1)};
  padding-horizontal: ${wp(5)};
  padding-vertical: ${wp(3.5)};
  background-color: ${props =>
    !props.isLoading ? colors.PRIMARY_COLOR : 'transparent'};
  border-radius: ${wp(8)};
`;

const TextWrapper = styled.Text`
  font-size: ${wp(4)};
  text-align: center;
  color: ${colors.WHITE};
  font-family: ${fonts.MEDIUM};
`;

export {ButtonContainer, TextWrapper};
