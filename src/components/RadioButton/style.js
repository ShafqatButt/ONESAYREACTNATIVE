/**
    * @description      : 
    * @author           : 
    * @group            : 
    * @created          : 14/07/2021 - 17:16:40
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 14/07/2021
    * - Author          : 
    * - Modification    : 
**/
import { StyleSheet } from 'react-native'
import { moderateScale } from 'react-native-size-matters';
import { colors } from "../../res/colors";
import { fonts } from '../../res/fonts';
export const styles = StyleSheet.create({

    radioCircle: {
        height: moderateScale(20),
        width: moderateScale(20),
        borderRadius: moderateScale(100),
        borderWidth: 1,
        borderColor: colors.OR_GRAY,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: moderateScale(10),
        height: moderateScale(10),
        borderRadius: moderateScale(50),
        backgroundColor: colors.GREEN,
    },
    lblsettigsub: {
        fontSize: moderateScale(12),
        fontFamily: fonts.REGULAR,
        marginLeft: moderateScale(14),
    },
})