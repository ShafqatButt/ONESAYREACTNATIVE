import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    input: {
        width: wp(90),
        height: hp(20),
        borderRadius: wp(2)
    }
})