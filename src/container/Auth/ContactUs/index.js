import { Text, View,StatusBar,Image, TouchableOpacity,ScrollView,KeyboardAvoidingView,TextInput,Keyboard, Alert} from 'react-native'
import React,{useState,useRef,useEffect,useContext} from 'react';
import * as HOC from '../../HOC';
import {
    MainContainer,
    styles,
    
  } from './style';
  import { images } from '../../../res/images';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { colors } from '../../../res/colors';
import { Spacer } from '../../../res/spacer';
import { PhoneTextInput } from '../../../components/PhoneTextInput';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input/index';
import globalStyles, {
    SubContainer,
    GlobalFlex,
    MainTitle,
    SubTitle,
  } from '../../../res/globalStyles';
  import RNPickerSelect from 'react-native-picker-select';
import { fonts } from '../../../res/fonts';
import {ChevronWrapper1} from '../../../components/Input/style';
import * as Icons from 'react-native-heroicons/solid';
import { AuthContext } from '../../../context/Auth.context';
import {getLanguageValueFromKey} from '../../../commonAction'
import deviceInfoModule from 'react-native-device-info';
import { POST} from '../../../api_helper/ApiServices';
import{POST_CONTACT_US} from '../../../api_helper/Api'
import AsyncStorage from '@react-native-community/async-storage';


const phoneValidator = require('phone').phone;
const countries = require('country-data').countries;

const getReasonList = [
    {value:'Signup Issue', label:'Signup Issue'},
    {value:'Login Issue', label:'Login Issue'},
    {value:'Issue with Messaging', label:'Issue with Messaging'},
    {value:'Issue with Calling', label:'Issue with Calling'},
    {value:'Issue with My Wallet', label:'Issue with My Wallet'},
    {value:'Issue on Invite', label: 'Issue on Invite'},
    {value:'Other', label: 'Other'},    
]




const ContactUs = props => {

    const MessageShow = new HOC.MessageShow();

  let _email = '';

const [cca2, setcca2] = useState('US');
const [isDisable, setIsDisable] = useState(true);
console.log('isDisable==>>',isDisable);
const [reasonType, setReasonType] = useState(null);
console.log('reasonType==>>',reasonType);
const [reasonList, setReasonList] = useState([]);
console.log('reasonList==>>',reasonList);
const [reason, setReason] = useState('');
console.log('reason==>>',reason);
const [phone, setPhone] = useState('');
const [countryName, setCountryName] = useState(countries[1]?.name);
const [email, setEmail] = useState(_email);
const [newuserName, setNewUserName] = useState('');
let inputRef = useRef();
let refCallingCode = useRef('+1');

const {
    state: ContextState,
    register,
    socialRegister,
    socialLogin,
    clear,
  } = useContext(AuthContext);
  const {isRegistrationPending, registrationError,userData} = ContextState;
  console.log('userData==>>',userData);

const openPicker = () => {
    
}


useEffect(() => {
    if (reasonType != null && reason != '') {
      setIsDisable(false);
    }
  }, [reason, reasonType]);

  const hasEmojis = text => {
    return (
      text.match(
        /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g,
      ) !== null
    );
  };

  const onSubmit = async () => {
    const phoneWithPlus = refCallingCode.current + phone;
    const userNameReg = /\s/;
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const nameReg = /^[A-Za-z]$/;
    

    

    const validateUsername = name =>
      name.length < 3 ||
      name.length > 20 ||
      nameReg.test(name) ||
      hasEmojis(name) ||
      userNameReg.test(name);
    // ||noNumberReg.test(name);

    
   if(!userData){
    if (email === '') {
      MessageShow.showToastAlert(getLanguageValueFromKey('please_enter_email'));
    } else if (!emailReg.test(email)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_email'),
      );
    } else if (newuserName === '') {
      MessageShow.showToastAlert(getLanguageValueFromKey('enter_username'));
    } else if (validateUsername(newuserName)) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('enter_valid_username'),
      );
    } 
     else if (!phoneValidator(phoneWithPlus).isValid) {
      MessageShow.showToastAlert(
        getLanguageValueFromKey('please_enter_valid_phone'),
      );
    } 

   }
    
    else {
      let params = {
        fullName: newuserName,
        email: email,
        mobile: phoneWithPlus,
        requestType: reasonType,
        message: reason

      };
      const uniqueID = await deviceInfoModule.getUniqueId();
      const user = await AsyncStorage.getItem('userDetails');
      console.log('userData on==>>',userData);

      
      console.log('params => ',params);
      // register(params, props);
      if(userData){
        
        let params ={
          fullName:userData?.username,
          email:userData?.email,
          mobile:userData?.mobile,
          requestType:reasonType,
          message:reason,
        }
        console.log('params After Login==>>',params);
        POST(POST_CONTACT_US, false, null, null, params, (res, isError) => {
          if (isError) {
            Alert.alert(res);
          } else {
            props.navigation.goBack();
            Alert.alert('Your feedback submitted successfully');
          }
        }
      );
        
      } else{
        POST(POST_CONTACT_US, false, null, null, params, (res, isError) => {
          if (isError) {
            Alert.alert(res);
          } else {
            props.navigation.goBack();
            Alert.alert('Your feedback submitted successfully');
          }
        }
      );
      }

      

    }
  };
  return (
   <>
   <MainContainer>
   <StatusBar barStyle={'light-content'} />
    <>
   <View style={{backgroundColor:colors.PRIMARY_COLOR,height:wp(20),flexDirection:'row',alignItems:'center',paddingHorizontal:wp(5),justifyContent:'center'}}>
   <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }} style={{marginTop:Platform.OS == 'ios' ? wp(6): wp(5),}}>
              <Image
                source={images.back_white}
                style={{height: wp(5),
                    width: wp(5),right:wp(30)}}
                resizeMode={'contain'}
              />
    </TouchableOpacity>
    <Text style={{marginTop:Platform.OS == 'ios'? wp(6): wp(5),color:colors.WHITE,fontWeight:'bold',right:wp(3),fontSize:Platform.OS == 'ios' ? wp(4.5) : wp(3)}}>Contact Us</Text>
    </View>
    </>
    <SubContainer>
    
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
     <>
     {
      userData ? (
        <>
        <Spacer space={hp(1.5)} />
          <View style={styles.pickerWrapper}>
           
              <RNPickerSelect
               onValueChange={value => setReasonType(value)}
               items={getReasonList}
                placeholder={{
                    label: 'Select Type',
                    value: 'Select Reason',
                  color: colors.DARK_GRAY,
                  fontSize:wp(10),
                  fontWeight:'bold'
                }}
                placeholderTextColor={colors.DARK_GRAY}
                
                style={{
                  inputAndroid: {
                    fontSize: wp(4.5),
                    fontFamily: fonts.REGULAR,
                    paddingLeft: 0,
                    width: wp(90),
                    color: colors.BLACK,

                  },
                  fontSize:wp(10),
                  fontWeight:'bold'
                  
                 
                }}
                
                
              />
          
            {Platform.OS == 'ios' && (
              <ChevronWrapper1 style={[{marginRight: 10}]} onPress={openPicker}>
              <Icons.ChevronDownIcon
                color={colors.LIGHT_GRAY}
                size={wp(5)}
                style={{marginBottom:wp(5)}}
              />
            </ChevronWrapper1>
            )}
          </View>
          <Spacer space={hp(1.5)} />
          <View>
          <Text style={styles.inputHeaderLabel}>
              Message
            </Text>
            <Spacer space={hp(0.8)} />
            <TextInput
              placeholder={'Write your reason please'}
              placeholderTextColor={colors.LIGHT_GRAY}
              multiline={true}
              numberOfLines={4}
              returnKeyType="done"
              value={reason}
              onChangeText={text => {
                setReason(text), text == '' && setIsDisable(true);
              }}
              style={styles.inputWrapper}
              blurOnSubmit={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            </View>
        
        </>

      ) : 
      (
      <>
      <Spacer space={hp(1)} />
         <Input
            value={newuserName}
            onChange={setNewUserName}
            placeholder={'ex.Sam Scott'}
            style={{paddingBottom: wp(2)}}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />
          
         <Input
            value={email}
            // editable={typeof props?.route?.params?.loginType !== 'string'}
            onChange={setEmail}
            placeholder={'example@gmail.com'}
            style={{
              paddingBottom: wp(2),
              
            }}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />
         <Spacer space={hp(0.5)} />
          
          <PhoneTextInput
            cca2={cca2}
            value={phone}
            withFlag={false}
            onRef={ref => {
              inputRef = ref;
            }}
            returnKeyType={'done'} 
            keyboardType={'phone-pad'}
            placeholder={'Mobile Number'}
            onChange={value => setPhone(value)}
            selectCountry={async value => {
              console.log('country => ', value);
              refCallingCode.current = '+' + value.callingCode[0];
              setcca2(value.cca2);
              setCountryName(value.name);
            }}
          />
          <Spacer space={hp(1.5)} />
          <View style={styles.pickerWrapper}>
           
              <RNPickerSelect
               onValueChange={value => setReasonType(value)}
               items={getReasonList}
                placeholder={{
                    label: 'Select Type',
                    value: 'Select Reason',
                  color: colors.DARK_GRAY,
                  fontSize:wp(10),
                  fontWeight:'bold'
                }}
                placeholderTextColor={colors.DARK_GRAY}
                
                style={{
                  inputAndroid: {
                    fontSize: wp(4.5),
                    fontFamily: fonts.REGULAR,
                    paddingLeft: 0,
                    width: wp(90),
                    color: colors.BLACK,

                  },
                  fontSize:wp(10),
                  fontWeight:'bold'
                  
                 
                }}
                
                
              />
          
            {Platform.OS == 'ios' && (
              <ChevronWrapper1 style={[{marginRight: 10}]} onPress={openPicker}>
              <Icons.ChevronDownIcon
                color={colors.LIGHT_GRAY}
                size={wp(5)}
                style={{marginBottom:wp(5)}}
              />
            </ChevronWrapper1>
            )}
          </View>
          <Spacer space={hp(1.5)} />
          <View>
          <Text style={styles.inputHeaderLabel}>
              Message
            </Text>
            <Spacer space={hp(0.8)} />
            <TextInput
              placeholder={'Write your reason please'}
              placeholderTextColor={colors.LIGHT_GRAY}
              multiline={true}
              numberOfLines={4}
              returnKeyType="done"
              value={reason}
              onChangeText={text => {
                setReason(text), text == '' && setIsDisable(true);
              }}
              style={styles.inputWrapper}
              blurOnSubmit={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            </View>

      </>
      )
     }
          <Spacer space={hp(1.5)} />
          <Button
            isLoading={isRegistrationPending}
            buttonText={'Submit'}
            buttonPress={() => isDisable == false && onSubmit()}
            btnstyle={{marginTop:wp(20)}}
          />
          </>

        </ScrollView>
        {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
        </SubContainer>
       

   </MainContainer>
   </>
  )
};

export default ContactUs;