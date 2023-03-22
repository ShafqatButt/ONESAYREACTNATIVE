import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';

const InputWrapper = styled.View`
  align-self: center;
  border-bottom-width: 1.5px;
  width: ${wp(88)};
  margin: ${wp(2)}px;
  border-color: ${props =>
    props?.isFocused
      ? colors.PRIMARY_COLOR
      : props?.editable !== false
      ? colors.LIGHT_GRAY
      : colors.HUSKY};
`;

const TextInput = styled.TextInput`
  padding-start: 0;
  color: ${props =>
    props?.editable !== false ? colors.BLACK : colors.TRIPLET_PLACEHOLDER};
  font-family: ${fonts.REGULAR};
  padding: ${wp(5)}px;
  font-size: ${wp(4.5)};
  padding-bottom: ${wp(3)};
`;

const ShowTouch = styled.TouchableOpacity`
  padding: 2px;
  margin-right: 5px;
  align-self: center;
  margin-bottom: -5px;
  justify-content: center;
`;

const ChevronWrapper = styled.View`
  padding: 2px;
  margin-right: 5px;
  align-self: center;
  margin-bottom: -15px;
  justify-content: center;
`;

const ChevronWrapper1 = styled.TouchableOpacity`
  padding: 2px;
  margin-right: 5px;
  align-self: center;
  margin-bottom: -15px;
  justify-content: center;
`;

export {InputWrapper, TextInput, ShowTouch, ChevronWrapper,ChevronWrapper1};
