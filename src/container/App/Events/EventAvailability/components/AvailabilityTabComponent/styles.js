import styled from 'styled-components/native';
import {fonts} from '../../../../../../res/fonts';
import {colors} from '../../../../../../res/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const TabTitle = styled.Text`
  text-align: center;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('4%')};
  color: ${props => (props.isSelected ? colors.WHITE : '#7e8da6')};
`;
const TabItem = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: ${wp('30%')};
  background-color: ${props =>
    props.isSelected ? colors.PRIMARY_COLOR : colors.WHITE};
`;

const TabContainer = styled.View`
  overflow: hidden;
  align-self: center;
  flex-direction: row;
  border-radius: 50px;
  border-width: 0.5px;
  border-color: #7e8da6;
  justify-content: space-evenly;
  width: ${wp('90%')};
  height: ${wp('9.5%')};
  margin-vertical: ${wp('5%')};
`;

export {TabItem, TabTitle, TabContainer};
