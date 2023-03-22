import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
// style themes and components
import Palette from '../../../../styles/palette';
// Third Party library
import axios from 'axios';
import {Button} from '../../../../components/Button';
import {styles} from './style';
import {Spacer} from '../../../../res/spacer';
import {
  COMMUNITY_POST_REEL,
  POST_FILES,
  COMMUNITY_REEL_BY_ID,
  BASE_URL,
} from '../../../../api_helper/Api';
import {
  POST,
  POST_MULTIPART,
  PUT_MULTIPART,
} from '../../../../api_helper/ApiServices';
import Loading from '../../../../components/Loading';

import {
  Image,
  LoadingSpinner,
  useHeaderStyle,
  TextInput,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import {usePlatformService} from '@sendbird/uikit-react-native/src';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useIIFE} from '@sendbird/uikit-utils';
import {ReelContext} from '../../../../context/ReelContext';
import Strings from '../../../../string_key/Strings';

export default PostFileViewer = props => {
  const {file_url} = props.route.params;
  const {fileType} = props.route.params;
  const {is_reel} = props.route.params;
  const {is_edit} = props.route.params;
  const {post_data} = props.route.params;

  const toast = useToast();
  const {topInset, statusBarTranslucent, defaultHeight} = useHeaderStyle();
  const {bottom} = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [is_next, setIsNext] = useState(is_edit ? true : false);

  const {mediaService} = usePlatformService();
  const basicTopInset = statusBarTranslucent ? topInset : 0;
  const [inputLine, setInputLine] = useState(
    is_edit ? post_data?.content : null,
  );
  const [isLoad, setIsLoad] = useState(false);
  const {
    state: ContextState,
    actionGetReelList,
    actionGetUserReels,
    actionClearData,
    actionAppendReelList,
  } = useContext(ReelContext);

  // useEffect(() => {
  //   if (!mediaService?.VideoComponent || fileType === 'file') {
  //     onClose();
  //   }
  // }, [mediaService]);

  const getFileName = url => {
    return url.substring(url.lastIndexOf('/') + 1);
  };

  const onUpload = async () => {
    if (inputLine.trim() != '') {
      if (inputLine.length > 2) {
        const fd = new FormData();
        fd.append('file', {
          name: getFileName(file_url),
          uri: file_url,
          type: 'video/mp4',
        });
        const userData = await AsyncStorage.getItem('userDetails');
        const uniqueID = await DeviceInfo.getUniqueId();
        setIsLoad(true);
        POST_MULTIPART(
          POST_FILES,
          JSON.parse(userData).token,
          fd,
          (data, flag) => {
            // console.log('data (POST_MULTIPART) ===> ', data, flag, getFileName(file_url));

            const postData = {
              content: inputLine,
              // videos: [Object.assign(data, {src: data.url})],
              videos: [
                {
                  meta: {
                    formatType: 'video/mp4',
                    name: getFileName(file_url),
                  },
                  code: data?.code,
                  src: data?.url,
                },
              ],
            };

            if (flag == false) {
              axios
                .post(BASE_URL + COMMUNITY_POST_REEL, postData, {
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Session-Token': JSON.parse(userData).token,
                  },
                })
                .then(res => {
                  const result = res.data;
                  if (result) {
                    setTimeout(() => {
                      actionAppendReelList(
                        Object.assign({
                          content: result.content,
                          _id: 0,
                          postItem: result,
                          counts: result.counts,
                          comments: result.comments,
                          uri: {uri: result?.videos[0]?.original},
                        }),
                      );
                      setIsLoad(false);
                      props.navigation.replace('Reel');
                      setTimeout(() => {
                        toast.show(Strings.reels_added_successfully);
                      }, 500);
                    }, 3000);
                  } else {
                    setIsLoad(false);
                    props.navigation.replace('Reel');
                    setTimeout(() => {
                      toast.show(Strings.error_while_uploading_reels);
                    }, 500);
                  }
                })
                .catch(e => console.log('error => ', e.message));
              // POST(
              //   COMMUNITY_POST_REEL,
              //   true,
              //   JSON.parse(userData).token,
              //   uniqueID,
              //   postData,
              //   async result => {
              //     if (result) {
              //       setTimeout(() => {
              //         actionAppendReelList(
              //           Object.assign({
              //             content: result.content,
              //             _id: 0,
              //             postItem: result,
              //             counts: result.counts,
              //             comments: result.comments,
              //             uri: {uri: result?.videos[0]?.original},
              //           }),
              //         );
              //         setIsLoad(false);
              //         props.navigation.replace('Reel');
              //         setTimeout(() => {
              //           toast.show('Reels added Successfully');
              //         }, 500);
              //       }, 3000);
              //     } else {
              //       setIsLoad(false);
              //       props.navigation.replace('Reel');
              //       setTimeout(() => {
              //         toast.show('Error while uploading reels');
              //       }, 500);
              //     }
              //   },
              // );
            } else {
              alert(data);
              setIsLoad(false);
            }
          },
        );
      } else {
        setInputLine('');
        Alert.alert(Strings.content_should_be_at_least);
      }
    }
  };

  const onUpdate = async () => {
    if (inputLine == null) {
      alert(Strings.please_enter_content);
    } else {
      let postData = {
        content: inputLine,
      };
      setIsLoad(true);
      const userData = await AsyncStorage.getItem('userDetails');
      PUT_MULTIPART(
        COMMUNITY_REEL_BY_ID(post_data?.id),
        JSON.parse(userData).token,
        postData,
        async data => {
          if (data) {
            actionGetReelList();
            actionGetUserReels();
            setTimeout(() => {
              setIsLoad(false);
              props.navigation.goBack();
              setTimeout(() => {
                toast.show(Strings.reels_updated_successfully);
              }, 1000);
            }, 2000);
          } else {
            setIsLoad(false);
          }
        },
      );
    }
  };

  const fileViewer = useIIFE(() => {
    switch (fileType) {
      case 'image': {
        return (
          <Image
            source={{uri: file_url}}
            style={StyleSheet.absoluteFill}
            resizeMode={'contain'}
            onLoadEnd={() => setLoading(false)}
          />
        );
      }

      case 'video': {
        if (!mediaService?.VideoComponent) {
          return null;
        }
        return (
          <mediaService.VideoComponent
            source={{uri: file_url}}
            style={[
              StyleSheet.absoluteFill,
              {
                top: basicTopInset + defaultHeight,
                bottom: defaultHeight + bottom,
              },
            ]}
            resizeMode={'contain'}
            ignoreSilentSwitch={'ignore'}
            onLoad={() => setLoading(false)}
          />
        );
      }

      default: {
        return null;
      }
    }
  });

  return (
    <View style={{flex: 1, backgroundColor: Palette.background700}}>
      <StatusBar barStyle={'light-content'} animated />

      {!is_next && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {fileViewer}
          {loading && (
            <LoadingSpinner
              style={{position: 'absolute'}}
              size={40}
              color={Palette.primary300}
            />
          )}
        </View>
      )}

      {is_next && is_reel && (
        <>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'interactive'}
            keyboardShouldPersistTaps={'handled'}>
            <View style={{height: hp(100), justifyContent: 'center'}}>
              <View style={{width: wp(90), alignSelf: 'center'}}>
                <TextInput
                  style={styles.input}
                  value={inputLine}
                  onChangeText={text => setInputLine(text)}
                  multiline={true}
                  textAlignVertical={'top'}
                  underlineColorAndroid="transparent"
                  placeholder={Strings.whats_on_your_mind}
                />
                <Spacer space={hp(1)} />
                <Button
                  buttonText={is_edit ? Strings.edit : Strings.upload}
                  buttonPress={() => {
                    is_edit ? onUpdate() : onUpload();
                  }}
                />
              </View>
            </View>
          </ScrollView>
          {Platform.OS === 'ios' && (
            <KeyboardAvoidingView behavior={'padding'} />
          )}
        </>
      )}

      {!is_next && is_reel && (
        <View style={{width: wp(95), alignSelf: 'center', bottom: wp(5)}}>
          <Button
            buttonText={Strings.next}
            buttonPress={() => {
              setIsNext(true);
            }}
          />
        </View>
      )}

      {isLoad && (
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
    </View>
  );
};
