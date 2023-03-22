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
    color: ${colors.DARK_GRAY_91};
    fontSize: ${wp(3.5)};
    textAlign: left;
    marginHorizontal: ${wp(2)};
    fontFamily: ${fonts.REGULAR}`;


const BorderContainer = styled.View`
    backgroundColor: ${colors.BORDER_COLOR}; height: ${wp(0.4)}; width: ${wp(100)}`;

export {
    MainContainer,
    Text,
    BorderContainer
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
    postInnerWrapper: {
        alignSelf: 'center',
        borderRadius: hp(8),
        width: hp(8),
        height: hp(8)
    },
    post: {
        borderRadius: 20,
        margin: 5,
        flex: 0.5,
        borderColor: '#ECECEC',
        borderWidth: 1,
        backgroundColor: colors.WHITE,
    },
    item: {
        //  paddingVertical: 8,
        //  paddingHorizontal: 2,
    },
    postTitle: {
        color: colors.REGULAR_TEXT_COLOR,
        fontSize: wp(3.5),
        textAlign: 'left',
        width: wp(40)
    },
    float_wrapper: {
        position: "absolute", zIndex: 1, bottom: wp(4), right: wp(5)
    },
    float_add_ic: {
        width: wp(15), height: wp(15), borderRadius: wp(6),
    },
})