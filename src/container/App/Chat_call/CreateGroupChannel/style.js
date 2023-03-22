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
    Input: {
        backgroundColor: colors.SERACH_BACK_COLOR,
        borderRadius: wp(4),
        paddingVertical: wp(2),
        fontFamily: fonts.REGULAR,
        fontSize: wp(4),
        color: colors.OSLO_GRAY,
        flex: 1
    },
    search_wrapper: {
        backgroundColor: colors.SERACH_BACK_COLOR,
        width: wp(92),
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: wp(2)
    },
    search_ic: {
        marginHorizontal: wp(2),
        width: wp(4),
        height: wp(4),
        alignSelf: "center",
        tintColor: colors.OSLO_GRAY
    },
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.WHITE,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.WHITE
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
    listItemContainer: {
        paddingVertical: wp(3),
        flexDirection: 'row',
        borderTopColor: colors.BORDER_COLOR,
        borderTopWidth: 1,
        paddingLeft: wp(4),
    },

    listItemLabel: {
        color: colors.REGULAR_TEXT_COLOR,
        fontSize: wp(3.8),
        alignSelf: 'center',
        marginLeft: wp(2),
    },
    checkbox: {
        width: wp(5),
        height: wp(5),
        marginRight: wp(3),
        alignSelf:'center'
    },
    sectionHeaderContainer: {
        paddingVertical: wp(2.5),
        backgroundColor: colors.GHOST_WHITE,
        justifyContent: 'center',
        paddingLeft: wp(5),
    },

    sectionHeaderLabel: {
        color: colors.GHOST_DARK,
        fontSize: wp(3.2)
    },
})