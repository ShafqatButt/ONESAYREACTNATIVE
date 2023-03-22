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


export {
    MainContainer,
    Text
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
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    post: {
        borderRadius: 10,
        margin: 5,
        flex: 0.5,
        borderColor: '#ECECEC',
        borderWidth: 1,
        backgroundColor: colors.WHITE,
    },
    item: {
        paddingVertical: 8,
        paddingHorizontal: 2,
    },
    postTitle: {
        color: colors.REGULAR_TEXT_COLOR,
        fontSize: wp(3.5),
        textAlign: 'left'
    },
    float_wrapper: {
        position: "absolute", zIndex: 1, bottom: wp(4), right: wp(5)
    },
    float_add_ic: {
        width: wp(15), height: wp(15), borderRadius: wp(6),
    },
})