import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Platform, StyleSheet } from 'react-native';
import { colors } from "../../../res/colors";
import { fonts } from "../../../res/fonts";
import styled from 'styled-components/native';
import { getStatusBarHeight, isIphoneX, getBottomSpace, ifIphoneX } from "react-native-iphone-x-helper";

const SlideContainer = styled.View`
    alignItems: center;
    width: ${wp(100)};
    height: ${hp(100)};
    backgroundColor: ${colors.WHITE}`;

const SkipWrapper = styled.TouchableOpacity`
    paddingTop: ${Platform.OS == "ios" ? isIphoneX ? getStatusBarHeight() + 15 : 10 : 16};
    position: absolute;
    zIndex: 1;
    right: ${wp(5)}`;

const SliderImageWrapper = styled.View`
    height: ${hp(58)}; justifyContent: center`;

const SliderTextWrapper = styled.View`
    height: ${hp(42)}; justifyContent: flex-start`;

const ContinueText = styled.Text`
    alignSelf: center;fontFamily: ${fonts.BOLD};fontSize: ${wp(3.4)};marginRight: ${wp(2)};color: ${colors.WHITE}`;

export {
    SlideContainer,
    SkipWrapper,
    SliderImageWrapper,
    SliderTextWrapper,
    ContinueText
}

export const styles = StyleSheet.create({
    BottomWrapper: {
        ...ifIphoneX(
            {
                bottom: getBottomSpace()
            },
            {
                bottom: 12
            }
        ),
        // alignSelf: 'baseline',
        maxWidth: wp('56%'),
        position: "absolute",
        backgroundColor: colors.PRIMARY_COLOR,
        height: wp('9.5%'),
        borderRadius: wp(6),
        right: wp(5),
    },

    continue_txt: {
        alignSelf: "center", fontFamily: fonts.BOLD, fontSize: wp(3.4), marginRight: wp(2), color: colors.WHITE
    }

});
