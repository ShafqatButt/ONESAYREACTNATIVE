import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

const styles =  StyleSheet.create({
    container: {
        alignItems : "center",
        justifyContent : 'center',
        backgroundColor: 'red',
        borderRadius: 20,
        // padding: 5,
        height : hp(2),
        width : wp(4),
        // height:'60%',
        // width:'70%',
         position: 'absolute', top: -4, right: 1,
        zIndex: 1
      },
      text: {
        fontWeight: 'bold',
        fontSize:hp('1.2%'),
        color: 'white',
        marginLeft : wp(0.2),
      },
      containerPlus: {
        alignItems : "center",
        justifyContent : 'center',
        backgroundColor: 'red',
        borderRadius: 20,
        // padding: 5,
        // height : 15,
        // width : 22,

        // height:'60%',
        // width:'70%',
        height : hp(2),
        width : wp(6),
         position: 'absolute', top: -4, right: -7,
        zIndex: 1
      },
      textPlus: {
        fontWeight: 'bold',
        fontSize:hp('1.2%'),
        color: 'white',
        marginLeft : wp(0.5),
        // backgroundColor : 'purple',

      },
});

export {styles};