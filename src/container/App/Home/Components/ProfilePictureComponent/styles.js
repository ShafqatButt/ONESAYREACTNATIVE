import styled from 'styled-components/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../../../res/colors';
import {StyleSheet} from 'react-native';

const ProfilePhoto = styled.Image`
  align-self: center;
  width: ${props => (props?.withBorder ? wp('24%') : wp('30%'))};
  height: ${props => (props?.withBorder ? wp('24%') : wp('30%'))};
  border-radius: ${wp('20%')};
  border-width: ${props => (props.withBorder ? 1 : 0)}px;
  border-color: ${colors.PRIMARY_COLOR};
`;

const ButtonIcon = styled.Image`
  align-self: center;
  width: ${props => (props?.withBorder ? wp('3.8%') : wp('5%'))};
  height: ${props => (props?.withBorder ? wp('3.8%') : wp('5%'))};
  tint-color: ${props =>
    props?.withBorder ? colors.PRIMARY_COLOR : '#dcdcdc'};
`;

const Container = styled.View`
  align-self: center;
  width: ${props => (props?.withBorder ? wp('24%') : wp('30%'))};
  height: ${props => (props?.withBorder ? wp('24%') : wp('30%'))};
  border-radius: ${wp('20%')};
  overflow: ${props => (props.withBorder ? 'visible' : 'hidden')};
`;

const ButtonContainer = styled.TouchableOpacity`
  bottom: 0;
  position: absolute;
  align-self: flex-end;
  width: ${wp('30%')};
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: ${wp('0.5%')};
  height: ${wp('30%') / 4.5};
`;

const ButtonContainerAbsolute = styled.Pressable`
  bottom: 0;
  position: absolute;
  border-radius: 90px;
  align-items: center;
  align-self: flex-end;
  justify-content: center;
  width: ${wp('6%')};
  height: ${wp('6%')};
  background-color: ${colors.WHITE};
  padding-top: ${wp('0.5%')};
`;

export {
  Container,
  ButtonIcon,
  ProfilePhoto,
  ButtonContainer,
  ButtonContainerAbsolute,
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
