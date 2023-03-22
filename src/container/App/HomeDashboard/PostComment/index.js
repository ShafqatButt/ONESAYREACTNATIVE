import React, {useRef, useState, useContext, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
// style themes and components
import {GlobalBorder, GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {styles, Text} from './style';
import {colors as mcolors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import { COMMUNITY_COMMENT_VOTE } from '../../../../api_helper/Api';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  Icon,
  LoadingSpinner,
  Palette,
  TextInput,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {Image} from '@sendbird/uikit-react-native-foundation';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {DELETE_DATA, POST_DATA} from '../../../../api_helper/ApiServices';
import {POST_COMMENT, COMMUNI_COMMENT_VOTE} from '../../../../api_helper/Api';
import {Spacer} from '../../../../res/spacer';
import * as mIcons from 'react-native-heroicons/outline';
import * as sIcons from 'react-native-heroicons/solid';

import {ReelContext} from '../../../../context/ReelContext';
import {AuthContext} from '../../../../context/Auth.context';
import Strings from '../../../../string_key/Strings';
import { images } from '../../../../res/images';

export default PostComment = props => {
  const {item} = props.route.params;
  const [commentData, setCommentData] = useState(item?.comments || []);
  const [message_send, setMessage_send] = useState('');
  const {colors} = useUIKitTheme();

  const [loading, setLoading] = useState(false);

  const flatListRef = useRef();
  const {state: ContextState} = useContext(AuthContext);
  const {userData} = ContextState;
  const {actionGetUserReels, actionGetReelList} = useContext(ReelContext);
  const [sRandom, setRandom] = useState(Math.random());

  const renderItem = ({item}) =>{  {


    console.log("My items is here",item)
    console.log("My Trive is here",userData?.tribeUserId)

    return(<Item item={item} />)

  }};

  // useEffect(() => {
  //     console.log(userData)
  //     console.log(JSON.stringify(commentData))
  // }, [userData])

  

  const onActionCommentLike = async objComment => {
    const user = await AsyncStorage.getItem('userDetails');
    let postData = {comment_id: objComment?.id};
    POST_DATA(
      COMMUNITY_COMMENT_VOTE(objComment?.id),
      JSON.parse(user).token,
      postData,
      (data, flag) => {
        if (flag == false) {
          objComment?.upvotes.push(userData?.tribeUserId);
          setRandom(Math.random());
        }
      },
    );
  };

  const actionPostDisLike = async objComment => {
    const user = await AsyncStorage.getItem('userDetails');
    DELETE_DATA(
      COMMUNITY_COMMENT_VOTE(objComment?.id),
      JSON.parse(user).token,
      (data, flag) => {
        if (flag == false) {
          const index = objComment?.upvotes.indexOf(userData?.tribeUserId);
          if (index > -1) {
            objComment?.upvotes.splice(index, 1);
            setRandom(Math.random());
          }
        }
      },
    );
  };

  const Item = ({item}) => (
    <>
      <View
        style={{...styles.flex_wrapper, width: wp(92), paddingVertical: wp(4),}}>
        <Image
          source={{uri: item?.user.profile.picture}}
          style={styles.card_profile}
        />
        <View style={[styles.flex_start, {width: wp(72), marginRight: wp(2)}]}>
          <Text style={{fontSize: wp(3.8), fontFamily: fonts.MEDIUM}}>
            {item.user.profile.username}{' '}
            <Text style={{fontSize: wp(3.5), fontFamily: fonts.REGULAR}}>
              {item?.summary}
            </Text>
            {'\n'}
            <Text
              style={{
                fontSize: wp(2.5),
                fontFamily: fonts.REGULAR,
                color: mcolors.DARK_GRAY_91,
              }}>
              {moment(item?.createdAt, 'h:mm:ss A').format('DD MMM hh:mm A')}
            </Text>
          </Text>
        </View>

        {item?.upvotes.length > 0 &&
        item?.upvotes.filter(item => item === userData?.tribeUserId).length >
          0 ? (
          <>
            <TouchableOpacity
              onPress={() => {
                actionPostDisLike(item);
              }}>
              <sIcons.HeartIcon color={mcolors.PRIMARY_COLOR} size={wp(6)} />
              <Text
                style={{
                  fontFamily: fonts.REGULAR,
                  fontSize: wp(2.5),
                  marginHorizontal: 0,
                  textAlign: 'center',
                }}>
                {item?.upvotes.length}
              </Text>
            </TouchableOpacity>

            { (userData?.tribeUserId != item.user._id ) && 
            <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Report', {postId:item._id});

          // setPost(item?.post);
          setUserAction(!userAction);
            }}>
          <Image
            source={images.more_ic}
            style={{...styles.medium_card_ic}}
          />
          </TouchableOpacity>
          }

            
          </>
        ) : (
          <>
          <View style={styles.reportlikeContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("Press", item);
              onActionCommentLike(item);
            }}>
            <mIcons.HeartIcon color={mcolors.DARK_BORDER_GRAY} size={wp(6)} />
            <Text
              style={{
                fontFamily: fonts.REGULAR,
                fontSize: wp(2.5),
                marginHorizontal: 0,
                textAlign: 'center',
              }}>
              {item?.upvotes.length > 0 ? item?.upvotes.length : ''}
            </Text>
          </TouchableOpacity>
          { (userData?.tribeUserId != item.user._id ) && 
          <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Report', {postId:item._id});
            
            // setPost(item?.post);
            // setUserAction(!userAction);
          }}>
          <Image
            source={images.more_ic}
            style={{...styles.medium_card_ic}}
            />
          </TouchableOpacity>
          }
            </View>
          </>


        )}
        
      </View>

    

      {/* <Spacer space={hp(1)} /> */}
      {/* <GlobalBorder /> */}
    </>
  );

  const onPressSend = async () => {
    if (message_send.trim() != '') {
      const user = await AsyncStorage.getItem('userDetails');
      let postData = {body: message_send};
      setLoading(true);
      POST_DATA(
        POST_COMMENT(item.id),
        JSON.parse(user).token,
        postData,
        (data, flag) => {
          setLoading(false);
          if (flag == false) {
            setCommentData([...commentData, data]);
            setTimeout(() => {
              let temp = commentData.length - 1 || 1;
              console.log(temp);
              flatListRef.current.scrollToIndex({
                animated: true,
                index: temp == -1 ? 0 : temp,
              });
            }, 500);
            setMessage_send('');
            actionGetUserReels();
            actionGetReelList();
          }
        },
      );
    }
  };

  return (
    <GlobalFlex>
      <BackHeader
        textColor={{color: mcolors.BLACK}}
        onNextPress={() => {
          onCreatePost();
        }}
        isRightText={false}
        onBackPress={() => {
          props.navigation.goBack();
        }}
        is_center_text
        title={Strings.comments}
      />

      <>
        <View
          style={{
            ...styles.flex_wrapper,
            width: wp(92),
            paddingVertical: wp(4),
          }}>
          <Image
            source={{uri: item?.user.profile.picture}}
            resizeMode="cover"
            style={styles.card_profile}
          />
          <View style={styles.flex_start}>
            <Text style={{fontSize: wp(3.5), fontFamily: fonts.REGULAR}}>
              <Text style={{fontSize: wp(3.8), fontFamily: fonts.MEDIUM}}>
                {item.user.profile.username}
              </Text>{' '}
              {item?.content}
              {'\n'}
              <Text
                style={{
                  fontSize: wp(3),
                  fontFamily: fonts.REGULAR,
                  color: colors.DARK_GRAY_91,
                }}>
                {moment(item?.createdAt, 'h:mm:ss A').format('DD MMM hh:mm A')}
              </Text>
            </Text>
          </View>
        </View>
        <GlobalBorder />
      </>

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        contentContainerStyle={{flexGrow: 1}}
        snapToInterval={200}
        data={commentData}
        extraData={sRandom}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onLayout={() => {
          flatListRef.current.scrollToEnd({animated: true});
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={[{textAlign: 'center'}]}>
                {Strings.no_comment_found}
              </Text>
            </View>
          );
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.bottomContainer}>
          <View style={{...styles.messageInput, alignSelf: 'center'}}>
            <TextInput
              multiline
              value={message_send}
              onChangeText={message_send => {
                setMessage_send(message_send);
              }}
              placeholder={Strings.post_comment}
              placeholderTextColor={mcolors.TRIPLET_PLACEHOLDER}
              style={{
                marginTop: wp(Platform.OS == 'android' ? 0 : 3),
                maxHeight: 100,
                padding: wp(Platform.OS == 'android' ? 3 : 3.5),
                paddingVertical: wp(Platform.OS == 'android' ? 3 : 4.5),
              }}
            />
          </View>
          <TouchableOpacity
            onPress={onPressSend}
            style={{
              marginTop: wp(3),
              alignSelf: 'center',
              padding: wp(3.2),
            }}>
            <Icon
              color={colors.ui.input.default.active.highlight}
              icon={'send'}
              size={24}
              containerStyle={{
                marginLeft: 4,
              }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: hp(90),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </GlobalFlex>
  );
};
