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
   `;

const CardContainer = styled.TouchableOpacity` flex: 1; width: ${wp(90)}; alignSelf: center;marginBottom: ${wp(5)}`

const CardWrapper = styled.View`  borderRadius: ${wp(5)}`

const CandInnerWrapper = styled.View` width: ${wp(90)}; flexDirection: row; justifyContent: space-between`

const CandInnerContainerWrapper = styled.View` flexDirection: row; width: ${wp(30)}; justifyContent: space-between`

const BorderContainer = styled.View`
    backgroundColor: ${colors.BORDER_COLOR}; height: ${wp(0.4)}; width: ${wp(100)}`;

export {
    MainContainer,
    Text,
    BorderContainer,
    CardContainer,
    CardWrapper,
    CandInnerWrapper,
    CandInnerContainerWrapper
}


export const styles = StyleSheet.create({
    image_wrapper: {
        borderRadius: wp(10), padding: wp(0.5)
    },
    left_align: {
        alignSelf: "center", paddingLeft: wp(1)
    },
    image_container: {
        width: wp(82), borderRadius: wp(2), flexDirection: "row", padding: wp(2.5)
    },
    image_bg: {
        width: wp(15), height: wp(15), borderRadius: wp(2)
    },
    image_mg: {
        height: wp(12), width: wp(12)
    },
    musicContainer: {
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        elevation: 8,
        height: wp(15),
        backgroundColor: colors.WHITE,
        borderRadius: wp(2),
        flexDirection: 'row',
    }
})