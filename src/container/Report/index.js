import { Text, View ,TextInput,Alert} from 'react-native';
import React,{useState,useEffect} from 'react';
import styles from './style';
import globalStyles, {
    GlobalFlex,
    SubContainer,
  } from '../../res/globalStyles';
import {BackHeader} from '../../components/BackHeader';
import { colors } from '../../res/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import Strings from '../../string_key/Strings';
import Loading from '../../components/Loading';
import { Spacer } from '../../res/spacer';
import RNPickerSelect from 'react-native-picker-select';
import { fonts } from '../../res/fonts';
import {ChevronWrapper1} from '../../components/Input/style';
import * as Icons from 'react-native-heroicons/solid';
import { Button } from '../../components/Button';
import AsyncStorage from '@react-native-community/async-storage';
import { POST } from '../../api_helper/ApiServices';
import {COMMUNITY_POST_REPORT,COMMUNITY_COMMENT_REPORT} from '../../api_helper/Api';
import DeviceInfo from 'react-native-device-info';


const Report = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState('');
    const [reasonType, setReasonType] = useState();
    const [isDisable, setIsDisable] = useState(true);

    const {isFromPost} = props?.route?.params;
    
    const {postId} = props.route.params;
    
    const getPostReasonList = isFromPost ? ( 
        [
        {value:'Harrasment', label:'Harrasment',id:1},
        {value:'Spam', label:'Spam',id:2},
        {value:'PoorlyWritten', label:'PoorlyWritten',id:3},
        {value:'IncorrectTopics', label:'IncorrectTopics',id:4},
        {value:'AgainstRules', label:'AgainstRules',id:5},
           
    ]
    ):(
        [
            {value:'Harrasment', label:'Harrasment',id:1},
            {value:'Spam', label:'Spam',id:2},
            {value:'Plagiarism', label:'Plagiarism',id:3},
            {value:'OutOfDate', label:'OutOfDate',id:4},
            {value:'PoorlyWritten', label:'PoorlyWritten',id:5},
            {value:'FactuallyIncorrect', label:'FactuallyIncorrect',id:6},
            {value:'AgainstRules', label:'AgainstRules',id:7},
            {value:'JokeComment', label:'JokeComment',id:8},
               
        ]

    )

    const onSubmit = async() => {
       if(isFromPost){
        console.log('isfromPost in API==>>')
        const user = await AsyncStorage.getItem('userDetails');
        const uniqueID = await DeviceInfo.getUniqueId();
        console.log('user==>>',user);
        let postData = {
            // postId:postId,
            type:reasonType,
            description:reason
        };
        console.log('postData===>>',postData);
        POST(
        COMMUNITY_POST_REPORT(postId),
        true,
        JSON.parse(user).token,
        uniqueID,
          postData,
          (res,isError) => {
           if(isError){
            Alert.alert(res)
           }else{
            props.navigation.goBack();
            Alert.alert('Your Report is submitted successfully');
           }
          },
        );
    } else {
        console.log('isnotfromPost in API==>>')
        const user = await AsyncStorage.getItem('userDetails');
        const uniqueID = await DeviceInfo.getUniqueId();
        console.log('user==>>',user);
        let postData = {
            // postId:postId,
            type:reasonType,
            description:reason
        };
        console.log('postData===>>',postData);
        POST(
        COMMUNITY_COMMENT_REPORT(postId),
        true,
        JSON.parse(user).token,
        uniqueID,
          postData,
          (res,isError) => {
           if(isError){
            Alert.alert(res)
           }else{
            props.navigation.goBack();
            Alert.alert('Your Report is submitted successfully');
           }
          },
        );
    }
    

    };

    useEffect(() => {
        if (reasonType != null && reason != '') {
          setIsDisable(false);
        }
      }, [reason, reasonType]);
    
  return (
    <GlobalFlex>
    <BackHeader
      onBackPress={() => {
        props.navigation.goBack();
      }}
      isRightText={false}
      isLeftText={false}
      background={{
        backgroundColor: colors.PRIMARY_COLOR,
        paddingTop: wp(4),
        paddingBottom: wp(3.5),
      }}
      textColor={{color: colors.WHITE}}
      is_center_text
      title={Strings.report}
    />

    <SubContainer>
      
    <Spacer space={hp(1.5)} />
          <View style={styles.pickerWrapper}>
           
              <RNPickerSelect
               onValueChange={value => setReasonType(value)}
               items={getPostReasonList}
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
              <ChevronWrapper1 style={[{marginRight: 10}]}>
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
                setReason(text),text == '' && setIsDisable(true);
              }}
              style={styles.inputWrapper}
              blurOnSubmit={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            </View>
            {/* <Spacer space={hp(0.1)} /> */}
            <Button
            
            buttonText={'Submit'}
            buttonPress={() => !isDisable  && onSubmit()}
            btnstyle={{marginTop:wp(10)}}
            />
    </SubContainer>
    <Loading visible={isLoading} />
  </GlobalFlex>
  )
}

export default Report;



