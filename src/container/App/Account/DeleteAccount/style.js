import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';
import styled from 'styled-components/native';

const MainContainer = styled.View`
    flex: 1;
    backgroundColor: ${colors.WHITE};
    justifyContent: center`;

const Text = styled.Text`
    fontSize: ${wp(3.2)};
    lineHeight: ${wp(5)};
    fontFamily: ${fonts.REGULAR}`;

const ActionWrapper = styled.TouchableOpacity`
    flexDirection: row;
    justifyContent: space-between;
    alignSelf: center;
    paddingVertical: ${wp(3.8)};
    width:${wp(94)}`

const BorderContainer = styled.View`
    backgroundColor: ${colors.BORDER_COLOR}; height: ${wp(0.4)}; width: ${wp(100)}`;

export {
    MainContainer,
    Text,
    BorderContainer,
    ActionWrapper
}


export const styles = StyleSheet.create({
    borderView: {
        borderBottomWidth: wp(0.5),
        borderBottomColor: colors.PAINT_BORDER,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5
    },
    viewWrapper: {
        width: wp(100),
        alignSelf: "center",
        backgroundColor: colors.WHITE,
        paddingHorizontal: wp(6)
    }
})
