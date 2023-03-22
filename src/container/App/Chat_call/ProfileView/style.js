import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';
import styled from 'styled-components/native';
import { isIphoneX } from 'react-native-iphone-x-helper';

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
    btnWrapper:{
        flexDirection: "row", justifyContent: "center", width: wp(92), alignSelf: "center"
    },
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
    txtMobile: {
        fontSize: wp(4),
        fontFamily: fonts.REGULAR,
        textAlign: 'left',
        color: colors.WHITE
    },
    callOptionContainer: {
        // backgroundColor: 'red',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: wp(65),
        alignSelf: 'center',
        alignItems: 'center'
    },
    callOptionImg: {
        resizeMode: 'contain',
        height: wp(12),
        width: wp(12)
    },
    userActionsContainer: {
        padding: wp(2),
        paddingLeft: wp(1),
        paddingRight: wp(1),
        borderRadius: wp(2),
        borderWidth: 1,
        borderColor: colors.TINT_BORDER,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.WHITE,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        borderBottomWidth: wp(0.6),
        borderBottomColor: colors.GRAY2
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4.5,

    },
    activeItem: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    active: {
        color: colors.PRIMARY_COLOR,
    },
    inactive: {
        color: colors.REGULAR_TEXT_COLOR,
    },
    label: {
        fontSize: wp(3.5),
        fontFamily: fonts.BOLD,
        paddingVertical: wp(2),
        backgroundColor: colors.RED,
    },
    tabBarIcon: {
        paddingVertical: wp(6),
        height: wp(6),
        width: wp(6),
    },
    listItemContainer: {
        paddingVertical: wp(3),
        flexDirection: 'row',
        borderTopColor: colors.BORDER_COLOR,
        borderTopWidth: 1,
        paddingLeft: wp(4),
    },
    backBtnContainer: {
        position: 'absolute',
        top: isIphoneX() ? wp(8) : wp(5),
        left: wp(7)
    }
})