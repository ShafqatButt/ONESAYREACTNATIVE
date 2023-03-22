import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../res/colors';
import { fonts } from '../../../res/fonts';
import styled from 'styled-components/native';

c

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
        height: wp(15), backgroundColor: colors.WHITE, borderRadius: wp(2), flexDirection: 'row'
    }
})