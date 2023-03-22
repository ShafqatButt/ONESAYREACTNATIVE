// noinspection ES6CheckImport

import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../../res/fonts';
import {colors} from '../../../../res/colors';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${colors.WHITE};
`;

const Text = styled.Text`
  text-align: center;
  color: ${colors.BLACK};
  font-family: ${fonts.BOLD};
  font-size: ${wp(4)};
  margin-horizontal: ${wp(2)};
`;

const ActionWrapper = styled.TouchableOpacity`
  align-self: center;
  flex-direction: row;
  width: ${wp(90)};
  background-color: ${props =>
    props?.isSelected ? colors.PRIMARY_COLOR : colors.WHITE};
  justify-content: space-between;
  padding-vertical: ${wp(3.8)};
`;

const BorderContainer = styled.View`
  align-self: center;
  width: ${wp(90)};
  height: ${wp(0.6)};
  background-color: ${colors.BORDER_COLOR};
`;

const LocationDivider = styled.View`
  height: ${hp('0.2')};
  background-color: ${colors.BORDER_COLOR};
  width: 100%;
`;

export {MainContainer, Text, BorderContainer, ActionWrapper, LocationDivider};

export default StyleSheet.create({
  eventTypeContainerStyle: {
    flexDirection: 'row',
    width: wp(88),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  eventTypePickerContainerStyle: {
    backgroundColor: colors.COTTON_BALL,
    paddingVertical: wp(2),
    paddingHorizontal: wp(1),
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  eventTypePickerStyle: {
    fontSize: wp(4.5),
    fontFamily: fonts.REGULAR,
    paddingLeft: 0,
    width: wp(36),
    color: colors.BLACK,
  },
  eventTypeTextInputStyle: {
    fontSize: wp(4),
    fontFamily: fonts.MEDIUM,
    textAlign: 'center',
    paddingLeft: 0,
    justifyContent: 'center',
    color: colors.BLACK,
  },
  chipContainerStyle: {
    backgroundColor: colors.COTTON_BALL,
    paddingVertical: wp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
  },
  rowContainerStyle: {
    flexDirection: 'row',
    width: wp(90),
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: wp(3),
    justifyContent: 'space-between',
  },
  mainDescriptionContainerStyle: {
    alignSelf: 'center',
    borderBottomWidth: 1.5,
    width: wp(88),
    height: wp('40%'),
    borderColor: colors.LIGHT_GRAY,
  },
  descriptionStyle: {
    paddingBottom: wp(2),
  },
  descriptionContainerStyle: {
    margin: 0,
    padding: 0,
    marginEnd: 0,
    width: '100%',
    marginRight: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
    marginTop: wp('5%'),
  },
  nextTextStyle: {
    fontFamily: fonts.MEDIUM,
    color: colors.PRIMARY_COLOR,
  },
  topTextStyle: {
    fontFamily: fonts.MEDIUM,
    color: colors.BLUE_ACTION,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  icon_ic: {
    tintColor: 'black',
    alignSelf: 'center',
    resizeMode: 'contain',
    width: wp(3),
    height: wp(3),
  },
  elevation_ic: {
    alignSelf: 'center',
    width: wp(12),
    height: wp(12),
    marginTop: wp(5),
  },
  locationItem: {
    height: hp('4'),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
