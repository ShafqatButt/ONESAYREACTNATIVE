import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../../../res/colors';
import {fonts} from '../../../../../res/fonts';
import styled from 'styled-components/native';

const Container = styled.View`
  height: ${wp('20%')};
  width: ${wp('90%')};
  background-color: white;
  flex-direction: row;
  border-radius: 12px;
  align-self: center;
`;
const DiamondIcon = styled.Image`
  height: 24px;
  width: 24px;
  tint-color: ${colors.PRIMARY_COLOR};
`;
const Divider = styled.View`
  width: 2px;
  height: 100%;
  align-self: center;
  border-radius: 90px;
  background-color: #e8e8e8;
`;
const Item = styled.View`
  width: ${wp('90%') / 2};
`;
const SubItem = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 105%;
`;
const LabelText = styled.Text`
  color: #94989b;
  font-family: ${fonts.MEDIUM};
  font-size: ${wp(3.3)};
  margin-start: ${wp('2%')};
  margin-top: ${wp('1.5%')};
`;
const DetailText = styled.Text`
  color: #000000;
  font-family: ${fonts.REGULAR};
  font-size: ${wp(4.5)};
`;
const ClickableTextContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 5px;
  right: 10px;
`;
const ClickableText = styled.Text`
  color: ${colors.PRIMARY_COLOR};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3)};
`;

export {
  Item,
  Divider,
  SubItem,
  Container,
  LabelText,
  DetailText,
  DiamondIcon,
  ClickableText,
  ClickableTextContainer,
};

export default StyleSheet.create({
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
