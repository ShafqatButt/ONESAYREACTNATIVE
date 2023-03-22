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
    color: ${colors.BLACK};
    fontSize: ${wp(4)};
    textAlign: center;
    marginHorizontal: ${wp(2)};
    fontFamily: ${fonts.BOLD}`;

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
    item: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    icon_ic: {
        width: wp(3), height: wp(3), alignSelf: "center", resizeMode: "contain"
    },
    elevation_ic: {
        width: wp(12), height: wp(12), alignSelf: "center", marginTop: wp(5)
    },
    listItemContainer: {
        paddingVertical: wp(3),
        flexDirection: 'row',
        borderBottomColor: colors.DARK_BORDER_GRAY,
        borderBottomWidth: 0.5,
        paddingLeft: wp(4),
        paddingRight: wp(4),

        backgroundColor: colors.WHITE,
        justifyContent: "space-between"
    },

    listItemLabel: {
        color: colors.REGULAR_TEXT_COLOR,
        fontSize: wp(3.8),
        fontFamily: fonts.REGULAR,
        textAlign: "left",
    },
    input: {
        width: wp(90),
        height: hp(20),
        borderRadius: wp(4)
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: wp(30),
        maxWidth: wp(30),
        height: wp(30),
        borderRadius: 5,
    },
    playIcon: {
        position: 'absolute',
        padding: 10,
        alignSelf: "center",
        borderRadius: 50,
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(25),
    },
})