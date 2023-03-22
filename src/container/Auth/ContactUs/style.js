import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import {StyleSheet, Platform} from 'react-native';
  import {colors} from '../../../res/colors';
  import {isIphoneX} from 'react-native-iphone-x-helper';
  import styled from 'styled-components/native';
  import {fonts} from '../../../res/fonts';
  
  const MainContainer = styled.View`
    flex: 1;
    background-color: ${colors.WHITE};
  `;
  
  const ImgBackGroundgContainer = styled.ImageBackground`
    width: ${wp(100)};
    height: ${isIphoneX ? hp(14) : Platform.OS == 'ios' ? hp(12) : hp(14)};
  `;
  
  const LogoWrapper = styled.View`
    background-color: ${colors.WHITE};
    height: ${wp(16)};
    width: ${wp(16)};
    padding: ${wp(1)}px;
    border-radius: ${wp(3)};
    top: ${-wp(8)};
    align-self: center;
  `;
  
  const BackWrapper = styled.TouchableOpacity`
    
    left: ${wp(4)};
    marginTop:${wp(12)}
    
  `;
  
  const ForgotWrapper = styled.TouchableOpacity`
    padding: 2px;
    align-self: flex-end;
    margin-right: 5px;
    justify-content: center;
    margin-bottom: -5px;
  `;
  
  export {
    MainContainer,
    ImgBackGroundgContainer,
    LogoWrapper,
    ForgotWrapper,
    BackWrapper,
  };
  
  export const styles = StyleSheet.create({
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
    inputHeaderLabel:{
        color:colors.LIGHT_GRAY
    },
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
    pickerInput: {
        fontSize: wp(4.5),
        fontFamily: fonts.REGULAR,
        padding: wp(5),
        paddingLeft: 0,
        width: wp(85),
        paddingBottom: wp(2),
        color: colors.BLACK
    },
  });
  