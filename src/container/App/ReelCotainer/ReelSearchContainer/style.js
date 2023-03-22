import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';
import styled from 'styled-components/native';

const MainContainer = styled.View`
    flex: 1;
    backgroundColor: ${colors.WHITE};`;

const Text = styled.Text`
    color: ${colors.BLACK};
    fontSize: ${wp(4.5)};
    textAlign: center;
    marginHorizontal: ${wp(2)};
    fontFamily: ${fonts.BOLD}`;

const SearchBarContainer = styled.View`
    overflow: hidden;
    align-self: center;
    flex-direction: row;
    border-radius: 50px;
    align-items: center;
    background-color: #E8F1FB;
    justify-content: space-evenly;
    width: ${wp('76%')};
    height: ${wp('9.5%')};
    margin-bottom: ${wp('2%')};
    margin-right: ${wp('5%')};
    padding-horizontal: ${wp('5%')};
`;

const SearchInput = styled.TextInput`
    width: 100%;
    height: 100%;
    color: #7b7d83;
    font-size: ${wp('4.5%')};
    padding-horizontal: ${wp('4%')};
`;

const SearchIcon = styled.Image`
    tint-color: #b4c1d0;
    width: ${wp(4.5)};
    height: ${wp(4.5)};   
`;

const ClearIcon = styled.Image`
    tint-color: #d8dde4;
    width: ${wp(3)};
    height: ${wp(3)};             
`;

const ClearButton = styled.Pressable`
    opacity: ${props => (props.isActive ? 1 : 0)};
    background-color: #7b7d83;
    border-radius: 90px;
    padding: 4px;
`;

export {
    MainContainer,
    Text,
    SearchBarContainer,
    SearchInput,
    SearchIcon,
    ClearIcon,
    ClearButton
}


export const styles = StyleSheet.create({
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
        flexDirection: 'row', justifyContent: "space-between", alignSelf: "center",
    },
    tab_wrapper: {
        paddingVertical: wp(2), width: wp(100 / 3), alignSelf: "center",
    },
    card_profile: {
        width: wp(15), height: wp(15), borderRadius: wp(15), resizeMode: "contain"
    },
    medium_card_ic: {
        width: wp(7), height: wp(7), alignSelf: 'center'
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
        alignItems: "flex-start", marginVertical: wp(4)
    },
    searchIconStyle: {
        transform: [{ rotate: '90deg' }],
        alignSelf: "center"
    },
})