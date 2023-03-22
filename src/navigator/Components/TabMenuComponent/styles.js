import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {IS_IPHONE_X} from '../../../constants';
import styled from 'styled-components/native';
import {colors} from '../../../res/colors';
import {fonts} from '../../../res/fonts';

const Container = styled.Pressable`
  width: 50px;
  align-items: center;
`;
const MenuIcon = styled.Image`
  width: ${props =>
    wp(props.index ===2 ? 15 : 5)
  }; 
  height:  ${props =>
    wp(props.index ===2 ? 15 : 5)
  }; 
  margin-top:${props =>
    IS_IPHONE_X  ? wp( props.index === 2 ? 0 : 4) : wp(props.index === 2 ? 0 : 2)
  };
  
  tint-color: ${props =>
    (props.index != 2 ?  (props.focused)  ? colors.PRIMARY_COLOR : colors.REGULAR_TEXT_COLOR : null )
  };

`;

const MenuTitle = styled.Text`
  text-align: center;
  align-self: center;
  width: ${wp(80)};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(4.2)};
  color: ${colors.REGULAR_TEXT_COLOR};
  font-size: ${props => (props.focused ? wp(3.8) : wp(3))};
  font-family: ${props => (props.focused ? fonts.MEDIUM : fonts.REGULAR)};
  margin-vertical: 5px;
  color: ${props =>
    props.focused ? colors.PRIMARY_COLOR : colors.REGULAR_TEXT_COLOR};
`;

export {Container, MenuIcon, MenuTitle};
