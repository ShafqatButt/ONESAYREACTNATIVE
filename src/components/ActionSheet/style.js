import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

const ActionWrapper = styled.TouchableOpacity`
    flexDirection: row;
    paddingVertical: ${wp(4)};
    paddingHorizontal: ${wp(5)}`

const Text = styled.Text`
    color: ${colors.BLACK};
    fontSize: ${wp(4.5)};
    textAlign: center;
    marginHorizontal: ${wp(2)};
    fontFamily: ${fonts.BOLD}`;

const BorderContainer = styled.View`
    backgroundColor: ${colors.BORDER_COLOR}; height: ${wp(0.4)}; width: ${wp(100)}`;

export {
    ActionWrapper,
    BorderContainer,
    Text
}

export const styles = StyleSheet.create({
    icon_ic: {
        width: wp(7), height: wp(7), alignSelf: "center", resizeMode: "contain"
    }
})