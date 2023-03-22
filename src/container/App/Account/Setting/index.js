
import React, { useContext, useState, useEffect } from 'react';
import { Switch, View, Image, TouchableOpacity } from 'react-native';
import { Spacer } from '../../../../res/spacer';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';


// style themes and components
import {
  GlobalFlex,
  MainTitle,
  SubContainer,
  SubTitle,
} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
// Third Party library
import AsyncStorage from '@react-native-community/async-storage';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ActionWrapper, BorderContainer, styles, Text} from './style';
import {fonts} from '../../../../res/fonts';
import {images} from '../../../../res/images';
import Strings from '../../../../string_key/Strings';


export default Setting = props => {
  const [isLastseen, setIsLastSeen] = useState(false);
  const {sdk, currentUser: sbUser} = useSendbirdChat();

  const toggleSwitchLastSeen = value => {
    console.log('value => ', value);
    AsyncStorage.setItem('show-last-seen', JSON.stringify(value));
    setIsLastSeen(() => value);
    if (value){
      sbUser.updateMetaData(
        {
          UserConfigInfo: '{"showProfile":true,"readReceipt":true,"showLastSeen":true}',
        },
        true,
      );
      
    }else{
      sbUser.updateMetaData(
        {
          UserConfigInfo: '{"showProfile":true,"readReceipt":true,"showLastSeen":false}',
        },
        true,
      );
    }
 
  };

  useEffect(() => {
    AsyncStorage.getItem('show-last-seen')
      .then(s => (typeof s !== 'string' ? true : JSON.parse(s)))
      .then(show => {
        setIsLastSeen(() => show)
        setLastSeenValue()
    
      });
  }, []);

  const setLastSeenValue = () => {
    let meta = sbUser.metaData;
    console.log('meta ==> ');
    let userConfig = meta.UserConfigInfo
    try {
      let showLastSeen =  JSON.parse(userConfig).showLastSeen;
      console.log("Show Last Seens",showLastSeen);
      switch(showLastSeen) {
        case true:
          // code block
          setIsLastSeen(true)
          break;
        case false:
          setIsLastSeen(false)
          break;
        default:
          break
      }
    }
    catch(err) {
      console.log(err.message);
      setIsLastSeen(true)
    }

  }

  return (
    <GlobalFlex>
      <BackHeader
        isModal
        onBackPress={() => props.navigation.goBack()}
        is_center_text
        title={Strings.Settings}
      />
      <Spacer space={hp(1)} />

      <TouchableOpacity
        style={{flexDirection: 'row', padding: wp(5)}}
        onPress={() => {
          props.navigation.pop(), props.navigation.navigate('ChatFont');
        }}>
        <Image
          resizeMode={'contain'}
          source={images.chat_ic}
          style={{
            width: wp(6),
            alignSelf: 'center',
            height: wp(6),
            tintColor: colors.PRIMARY_COLOR,
          }}></Image>
        <View>
          <Text
            style={{
              marginLeft: wp(4),
              fontFamily: fonts.REGULAR,
              textAlign: 'left',
            }}>
            {Strings.Chats}
          </Text>
          <Text
            style={{
              marginLeft: wp(4),
              fontFamily: fonts.REGULAR,
              textAlign: 'left',
              fontSize: wp(3),
              color: colors.DARK_GRAY_91,
              marginTop: wp(1),
            }}>
            {Strings.Font_size}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{flex: 1}}>
        <View
          onPress={() => {
            setIsLastSeen(!isLastseen);
          }}
          style={{
            paddingVertical: wp(3),
            backgroundColor: colors.BORDER_SPACE_COLOR,
          }}>
          <Text
            style={{
              textAlign: 'left',
              fontSize: wp(5),
              marginLeft: wp(5),
              fontFamily: fonts.BOLD,
            }}>
            {Strings.Privacy}
          </Text>
        </View>
        <ActionWrapper
          onPress={() => {
            setIsLastSeen(!isLastseen);
          }}>
          <Text style={[{alignSelf: 'center', fontFamily: fonts.REGULAR}]}>
            {Strings.Show_last_seen}
          </Text>

          <Switch
            trackColor={{
              false: colors.DARK_GRAY_91,
              true: colors.LIGHT_PRIMARY_COLOR,
            }}
            thumbColor={isLastseen ? colors.PRIMARY_COLOR : colors.DARK_THUMB}
            onValueChange={toggleSwitchLastSeen}
            value={isLastseen}
          />
        </ActionWrapper>
        <BorderContainer />
      </View>
    </GlobalFlex>
  );
};
