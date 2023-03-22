import styled from 'styled-components/native';
import {fonts} from '../../../../../../res/fonts';
import {colors} from '../../../../../../res/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const TabTitle = styled.Text`
  text-align: center;
  font-family: ${props => (props.isSelected ? fonts.REGULAR : fonts.BOLD)};
  font-size: ${wp('2.9%')};
  color: ${props => (props.isSelected ? colors.PRIMARY_COLOR : colors.WHITE)};
`;
const TabItem = styled.Pressable`
  // flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  // width: ${wp('20%')};
  margin-vertical: ${wp('1%')};
  padding-horizontal: ${wp('2%')};
  background-color: ${props =>
  props.isSelected ? colors.WHITE : colors.PRIMARY_COLOR};
`;

const TabContainer = styled.View`
  overflow: hidden;
margin-left:${wp('2.5%')}
  flex-direction: row;
  border-radius: 9px;
  border-width: 0.5px;
  border-color: #7e8da6;
  justify-content: space-evenly;
  width: ${wp('66%')};
  height: ${wp('9.5%')};
  margin-vertical: ${wp('2.5%')};
  background-color: ${colors.PRIMARY_COLOR};
`;

export {TabItem, TabTitle, TabContainer};