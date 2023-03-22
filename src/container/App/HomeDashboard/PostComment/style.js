import { StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';
import styled from 'styled-components/native';
import { ifIphoneX } from 'react-native-iphone-x-helper'

const MainContainer = styled.View`
    flex: 1;
    backgroundColor: ${colors.WHITE};
    justifyContent: center`;

const Text = styled.Text`
    color: ${colors.BLACK};
    fontSize: ${wp(4)};
    textAlign: left;
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
    HeaderWrapper: {
        flexDirection: "row", justifyContent: "space-between", width: wp(100), alignSelf: 'center',
    },
    menu_avatar: {
        width: wp(10), height: wp(10), borderRadius: wp(5)
    },
    header_title: {
        position: "absolute", width: wp(100), alignSelf: 'center'
    },
    header_icon_ic: {
        width: wp(5), height: wp(5)
    },
    header_flex_wrapper: {
        flexDirection: "row", justifyContent: "space-between", width: wp(14), marginRight: wp(5)
    },
    flex_wrapper: {
        flexDirection: 'row', alignSelf: "center",alignItems:'center'
    },
    tab_wrapper: {
        paddingVertical: wp(2), width: wp(100 / 3), alignSelf: "center",
    },
    card_profile: {
        width: wp(12), height: wp(12), borderRadius: wp(15)
    },
    medium_card_ic: {
        width: wp(7), height: wp(7), 
    },
    card_image: {
        width: wp(100), height: hp(45), resizeMode: "cover"
    },
    add_new: {
        width: wp(4.5), height: wp(4.5), position: "absolute", bottom: wp(7), right: wp(2.8), zIndex: 1
    },
    float_wrapper: {
        position: "absolute", zIndex: 1, bottom: wp(4), right: wp(5)
    },
    float_add_ic: {
        width: wp(15), height: wp(15), borderRadius: wp(6),
    },
    flex_start: {
        flexDirection: "row", marginRight: wp(5), alignSelf: "center"
    },
    bottomContainer: {
        width: wp(90),
        justifyContent: "space-between",
        alignSelf: "center",
        flexDirection: 'row',
        ...ifIphoneX(
            {
                marginBottom: wp(5)
            },
            {
                marginBottom: wp(4)
            }
        ),
    },
    messageInput: {
        width: wp(75),
        borderRadius: 12,

    },
    reportlikeContainer:{
        // alignItems:'center',
        flexDirection:'row',
        // justifyContent:'center',
        right:30
        

    }
})