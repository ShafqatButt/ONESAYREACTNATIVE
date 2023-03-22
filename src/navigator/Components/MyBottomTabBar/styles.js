import styled from 'styled-components/native';
import {IS_IPHONE_X} from '../../../constants';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const BannerContainer = styled.View`
  width: ${wp('100%')};
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-top-width: 0.5px;
  justify-content: space-evenly;
  border-top-color: rgba(0, 0, 0, 0.18);
  height: ${IS_IPHONE_X ? wp(23) : wp(16)};
`;
const Container = styled.View`
  border-top-width: 0.5px;
  flex-direction: row;
  background-color: white;
  width: 100%;
  justify-content: space-evenly;
  border-top-color: rgba(0, 0, 0, 0.18);
  height: ${IS_IPHONE_X ? wp(23) : wp(16)};
`;

export {Container, BannerContainer};
