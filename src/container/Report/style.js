import { StyleSheet} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { colors } from '../../res/colors';


const styles = StyleSheet.create({
    pickerWrapper: {
        width: wp(90),
        alignSelf: "center",
        margin: wp(2),
        borderColor: colors.LIGHT_GRAY,
        borderBottomWidth: 1.5,
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom:wp(3),
        alignItems:'center',
      
    },
    inputHeaderLabel:{
        color:colors.DARK_GRAY
    },
    inputWrapper: {
        width: wp(90),
        alignSelf: "center",
        padding: wp(2),
        paddingTop: wp(3),
        height: hp(15),
        fontSize: wp(4),
        borderRadius: wp(3),
        backgroundColor: '#F1F2F2',
    },

});


export default styles;