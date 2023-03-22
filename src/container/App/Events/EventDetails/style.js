// noinspection ES6CheckImport

import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';
import {RNSVGSymbol} from 'react-native-svg';

const EventNameText = styled.Text`
  color: ${colors.BLACK};
  font-family: ${fonts.MEDIUM};
  font-size: ${wp(4.5)};
  margin-horizontal: ${wp(5)};
  margin-bottom: 3px;
`;
const EventTypeText = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(4)};
  margin-bottom: 3px;
  margin-horizontal: ${wp(5)};
`;
const EventTimeText = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(3.5)};
`;
const TitleText = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.BOLD};
  font-size: ${wp(3.5)};
`;
const SmTitleText = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.BOLD};
  font-size: ${wp(3)};
  margin-bottom: 5px;
`;
const DetailText = styled.Text`
  color: ${props => (props.link ? colors.BLUE_ACTION : colors.BLACK)};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(4)};
  max-width: ${props => (props.half ? wp(70) : wp(90))};
`;
const EventCreateText = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.REGULAR};
  font-size: ${wp(4)};
`;
const Line = styled.View`
  width: ${wp(95)};
  margin-vertical: ${wp(3)};
  height: 0.5px;
  background-color: ${colors.OSLO_GRAY};
`;

export {
  EventNameText,
  EventTypeText,
  EventTimeText,
  DetailText,
  TitleText,
  SmTitleText,
  Line,
  EventCreateText,
};

export default StyleSheet.create({
  ////////
  BGContainer: {backgroundColor: 'rgb(250,250,250)', flex: 1},
  eventHeaderBox: {
    // backgroundColor: 'lightblue',
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  eventStatusCircle: {
    height: wp(14),
    width: wp(14),
    borderRadius: wp(14),
    backgroundColor: colors.PRIMARY_COLOR,
  },
  eventTimingsBox: {
    // backgroundColor: 'lightblue',

    paddingHorizontal: wp(5),
  },
  titleBox: {
    paddingTop: wp(5),
    paddingBottom: wp(2),
    paddingLeft: wp(5),
    borderBottomWidth: 0.5,
    borderColor: colors.OSLO_GRAY,
    // backgroundColor: 'lightgreen',
  },
  detailBox: {
    paddingVertical: wp(4),

    paddingHorizontal: wp(5),
    borderBottomWidth: 0.5,
    borderColor: colors.OSLO_GRAY,
    backgroundColor: colors.WHITE,
  },
  NameBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBox: {
    paddingVertical: wp(7),

    paddingHorizontal: wp(5),
  },
});
