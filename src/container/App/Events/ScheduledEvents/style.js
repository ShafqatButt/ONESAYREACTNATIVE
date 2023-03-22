// noinspection ES6CheckImport

import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';
import {fonts} from '../../../../res/fonts';
import {Platform} from 'react-native';

const DayTitleContainer = styled.View`
 opacity:${props => (props.opaque ? 0.4 : 1)}
  width: 20%;
  align-items: center;
  margin-top: ${hp('1.5%')}; ;
`;
const Icon = styled.Image`
  tint-color: ${colors.BLUE_ACTION};

  width: ${wp('5%')}px;
  height: ${wp('5%')}px;
  position: absolute;
  right: 0;
  // top: ${hp('0.5')}px;
  z-index: -1;
`;
const DayTitle = styled.Text`
  color: ${colors.DARK_BORDER_GRAY};
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.5%')};
`;

const EmptyEventTxt = styled.Text`
  color: ${colors.OSLO_GRAY};
  font-family: ${fonts.REGULAR};
  font-size: ${wp('4.5%')};
  align-self: center;
  margin-left: ${wp('13%')};

  margin-top: ${-hp('4%')};
`;

const EventItemContainer = styled.Pressable`
opacity:${props => (props.opaque ? 0.4 : 1)}
  background-color: white;
  width: 72%;
align-self:flex-end
  min-height: ${wp('20%')};
margin-right: ${wp('5%')};
  border-width: 0.167;
  border-color: ${colors.OSLO_GRAY};
  flex-direction: row;
  margin-top: ${props =>
    props.index == 0 ? (Platform.OS == 'ios' ? -hp('7.2%') : -hp('8%')) : 0};
`;
const EventItemTextContainer = styled.View`
  flex: 1;
  padding-vertical: ${wp('2%')};
  padding-right: ${wp('2%')};
`;
const EventTimes = styled.Text`
  color: black;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('3.5%')};
  margin-bottom: 2px;
`;
const EventTitle = styled.Text`
  color: black;
  font-family: ${fonts.BOLD};
  font-size: ${wp('4.8%')};
  margin-bottom: 2px;
`;
const EventDuration = styled.Text`
  color: black;
  font-family: ${fonts.REGULAR};
  font-size: ${wp('3.5%')};
  margin-bottom: 2px;
`;
const DayNumberContainer = styled.Pressable`
  background-color: ${props => (props.enable ? colors.PRIMARY_COLOR : 'null')};
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('10%')};
  align-items: center;
  justify-content: center;
  margin-top: ${wp('1%')};
`;
const DayNumber = styled.Text`
  color: ${props => (props.enable ? 'white' : colors.DARK_BORDER_GRAY)};
  font-family: ${fonts.MEDIUM};
  font-size: ${wp('4.5%')};
`;
const StatusContainer = styled.View`
  // background-color: white;
  width: 13%;
  align-items: center;
  padding-top: ${wp('2.3%')};
`;
const StatusIndicator = styled.View`
  background-color: rgb(250, 80, 29);
  width: ${wp('4%')};
  height: ${wp('4%')};
  border-radius: ${wp('4%')};
`;

const RoundButton = styled.Pressable`
  position: absolute;
  border-radius: 90px;
  align-items: center;
  justify-content: center;
  right: ${wp('8%')};
  width: ${wp('13%')};
  height: ${wp('13%')};
  bottom: ${wp('25%')};
  background-color: ${colors.PRIMARY_COLOR};
`;
const PlusIcon = styled.Image`
  tint-color: white;
  margin-start: 3px;
  resize-mode: contain;
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`;

const TopTabText = styled.Text`
  color: ${colors.BLACK};
  font-size: ${wp(3.8)};
  text-align: center;
  margin-horizontal: ${wp(2)};
  font-family: ${fonts.BOLD};
`;

export {
  PlusIcon,
  Icon,
  RoundButton,
  StatusContainer,
  DayTitleContainer,
  DayTitle,
  DayNumberContainer,
  DayNumber,
  EmptyEventTxt,
  EventItemContainer,
  StatusIndicator,
  EventItemTextContainer,
  EventTimes,
  EventTitle,
  EventDuration,
  TopTabText,
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
  flex_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  tab_wrapper: {
    paddingVertical: wp(2),
    marginLeft: wp(2),

    alignSelf: 'center',
  },
  profile_ic: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
  },
  topTabWrapper: {flexDirection: 'row', paddingLeft: wp(10)},
  eventTypePickerContainerStyle: {
    paddingVertical: hp(1),
    // backgroundColor: 'green',
    alignSelf: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeTextInputStyle: {
    ...(Platform.OS === 'android' && {height: '100%'}),
    fontSize: wp(4),
    fontFamily: fonts.REGULAR,
    textAlign: 'center',
    color: colors.BLUE_ACTION,
    paddingRight: wp(5),
    // backgroundColor:'red'
  },
  eventTypePickerStyle: {position: 'absolute', height: 0, width: 0},
});
