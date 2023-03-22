import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { StyleSheet, Platform } from 'react-native';
import { colors } from "../../../res/colors";


import styled from 'styled-components/native';
import { fonts } from "../../../res/fonts";

const ChevronWrapper = styled.View`
    padding: 2px;
    alignSelf: center;
    marginRight: 5px;
    justifyContent: center;
    marginBottom: -15px`;

export {
    ChevronWrapper
}

export const styles = StyleSheet.create({
    pickerWrapper: {
        width: wp(42),
        ...Platform.OS === 'android' && {height: '80%'},
        alignSelf: "center",
        margin: wp(2),
        borderColor: colors.LIGHT_GRAY,
        borderBottomWidth: 1.5,
        flexDirection: 'row'
    },
    pickerInput: {
        ...Platform.OS === 'android' && {height: '100%'},
        fontSize: wp(4.5),
        fontFamily: fonts.REGULAR,
        padding: wp(5),
        paddingLeft: 0,
        // alignItems: 'center',
        justifyContent: 'center',
        width: wp(36),
        paddingBottom: wp(2),
        color: colors.BLACK
    },
    flexing_row: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    check_wrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginLeft: Platform.OS == "ios" ? 8 : 0
    },
    checkbox: {
        width: wp(5),
        height: wp(5)
    },
});
