import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';
import styled from 'styled-components/native';

const MainContainer = styled.View`
    flex: 1;
    backgroundColor: ${colors.WHITE};
    justifyContent: center`;

const MText = styled.Text`
    color: ${colors.BLACK};
    fontSize: ${wp(3.5)};
    textAlign: center;
    marginHorizontal: ${wp(2)};
    fontFamily: ${fonts.MEDIUM}`;

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
    MText,
    BorderContainer,
    ActionWrapper
}


export const styles = StyleSheet.create({

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
    flex_wrapper: {
        flexDirection: "row", paddingVertical: wp(2), paddingHorizontal: wp(4)
    },
    label: {
        marginTop: wp(2), fontFamily: fonts.REGULAR, fontSize: wp(4), width: wp(50)
    },
    sublabel: {
        marginTop: wp(2), fontFamily: fonts.REGULAR, fontSize: wp(3.8), width: wp(40), color: colors.TRIPLET_PLACEHOLDER
    }

})