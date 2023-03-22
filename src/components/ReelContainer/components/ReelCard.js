// packages Imports
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  Alert,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import Buttons from './Buttons';
import {colors} from '../../../res/colors';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {fonts} from '../../../res/fonts';
import {IS_IPHONE_X} from '../../../constants';
import {ReelContext} from '../../../context/ReelContext';
import {
  ActionMenu,
  LoadingSpinner,
  Palette,
  useBottomSheet,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '../../../context/Auth.context';
import {RNCamera} from 'react-native-camera';
import {
  useLocalization,
  usePlatformService,
} from '@sendbird/uikit-react-native/src';
import SBUError from '@sendbird/uikit-react-native/src/libs/SBUError';
import {Video as CompressVideo} from 'react-native-compressor';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Strings from '../../../string_key/Strings';
import { images } from '../../../res/images';

// Screen Dimensions
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const CONST_REEL_HEIGHT_ADJUSTMENT = insetVal =>
  IS_IPHONE_X ? insetVal : wp('5.5%');

function ReelCard({
  uri,
  _id,
  content,
  comments,
  counts,
  postItem,
  ViewableItem,
  liked = false,
  disliked = false,
  index,
  isHome,
  // Container Props
  backgroundColor = 'black',
  my_reels = false,
  isSearch = false,
  // Header Props
  headerTitle = 'Reels',
  headerIconName,
  headerIconColor,
  headerIconSize,
  headerIcon,
  headerComponent,
  onHeaderIconPress = () => {},
  // Options Props
  optionsComponent,
  pauseOnOptionsShow = true,
  onSharePress = () => {},
  onCommentPress = () => {},
  onLikePress = () => {},
  onDislikePress = () => {},
  headerHeight,
  // Player Props
  onFinishPlaying = () => {},
  onRefresh = () => {},
  
  // Slider Props
  minimumTrackTintColor = 'white',
  maximumTrackTintColor = 'grey',
  thumbTintColor = 'white',

  // Time Props
  timeElapsedColor = 'white',
  totalTimeColor = 'white',
}) {
  // ref for Video Player
  const VideoPlayer = useRef(null);
  const videoRecorder = useRef(null);
  const {navigate} = useNavigation();
  const {top} = isHome ? {top: 0} : useSafeAreaInsets();

  const {state: authContextState} = useContext(AuthContext);
  const {userData} = authContextState;

  const {
    state: ContextState,
    actionGetUserReels,
    actionClearData,
    actionPostLike,
    actionPostDisLike,
    actionReelDelete,
    actionGetReelList,
  } = useContext(ReelContext);
  const [setRandom, setMathRandom] = useState(Math.random());

  // States
  const [VideoDimensions, SetVideoDimensions] = useState({
    width: ScreenWidth,
    height: ScreenWidth,
  });
  const [Progress, SetProgress] = useState(0);
  const [Duration, SetDuration] = useState(0);
  const [Paused, SetPaused] = useState(false);
  const [muteSound, setMuteSound] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1.0);
  const [ShowOptions, SetShowOptions] = useState(true);
  const screenIsFocused = useIsFocused();
  const toast = useToast();
  const [userAction, setUserAction] = useState(false);
  const [loading, setLoading] = useState(false);

  const {fileService} = usePlatformService();
  const {STRINGS} = useLocalization();
  const {openSheet} = useBottomSheet();

  const [likeVideo, setLikeVideo] = useState(
    postItem.upvotes.filter(o => o.id === userData?.tribeUserId).length > 0 ||
      false,
  );
  const [likeCount, setLikeCount] = useState(postItem.counts.upvotes || 0);

  console.log("The post items are :",postItem)
  // Play/Pause video according to viisibility
  useEffect(() => {
    if (ViewableItem == _id) {
      SetPaused(false);
    } else {
      SetPaused(true);
    }
  }, [ViewableItem]);

  // Pause when use toggle options to True
  useEffect(() => {
    if (pauseOnOptionsShow) {
      if (ShowOptions) {
        SetPaused(true);
      } else {
        SetPaused(false);
      }
    }
  }, [ShowOptions, pauseOnOptionsShow]);

  // Callbhack for Seek Update
  const SeekUpdate = useCallback(
    async seekTime => {
      try {
        if (VideoPlayer.current) {
          VideoPlayer.current.seek((seekTime * Duration) / 100 / 1000);
        }
      } catch (error) {}
    },
    [Duration, ShowOptions],
  );

  // Callback for PlayBackStatusUpdate
  const PlayBackStatusUpdate = playbackStatus => {
    try {
      let currentTime = Math.round(playbackStatus.currentTime);
      let duration = Math.round(playbackStatus.seekableDuration);
      if (currentTime) {
        if (duration) {
          SetProgress((currentTime / duration) * 100);
        }
      }
    } catch (error) {}
  };

  // function for getting video dimensions on load complete
  const onLoadComplete = event => {
    const {naturalSize} = event;

    try {
      const naturalWidth = naturalSize.width;
      const naturalHeight = naturalSize.height;
      if (naturalWidth > naturalHeight) {
        SetVideoDimensions({
          width: ScreenWidth,
          height: ScreenWidth * (naturalHeight / naturalWidth),
        });
      } else {
        SetVideoDimensions({
          width:
            (ScreenHeight - CONST_REEL_HEIGHT_ADJUSTMENT(top)) *
            (naturalWidth / naturalHeight),
          height: ScreenHeight - CONST_REEL_HEIGHT_ADJUSTMENT(top),
        });
      }
      SetDuration(event.duration * 1000);
    } catch (error) {}
  };

  // function for showing options
  const onMiddlePress = async () => {
    try {
      SetShowOptions(!ShowOptions);
    } catch (error) {}
  };

  // Manage error here
  const videoError = error => {};

  const startRecorder = () => {
    SetPaused(true);
    if (videoRecorder && videoRecorder.current) {
      videoRecorder.current.open(
        {
          maxDuration: 30,
          quality: RNCamera.Constants.VideoQuality['480p'],
        },
        data => {
          setTimeout(() => {
            navigate('PostViewer', {
              is_reel: true,
              file_url: data.uri,
              fileType: 'video',
            });
          }, 150);
        },
      );
    }
  };

  const onLikePost = async () => {
    const user = await AsyncStorage.getItem('userDetails');
    //postItem.upvotes?.length > 0 && postItem.upvotes.filter(o => o.id === JSON.parse(user).tribeUserId).length > 0
    if (likeVideo) {
      actionPostDisLike(postItem?._id, (data, flag) => {
        if (flag == false) {
          setLikeVideo(false);
          postItem.counts.upvotes = postItem.counts.upvotes - 1;
          setLikeCount(likeCount - 1);
          toast.show(Strings.reel_downvoted_successfully);
        }
      });
    } else {
      actionPostLike(postItem?._id, (data, flag) => {
        if (flag == false) {
          setLikeVideo(true);
          postItem.counts.upvotes = postItem.counts.upvotes + 1;
          setLikeCount(likeCount + 1);
          toast.show(Strings.reel_upvoted_successfully);
        }
      });
    }
  };

  const onReelDelete = async () => {
    Alert.alert(Strings.delete_reel, STRINGS.are_you_sure_delete_this_reel, [
      {
        text: Strings.yes,
        onPress: () => {
          actionReelDelete(userData?.token, postItem?._id, (data, flag) => {
            if (flag == false) {
              if (data.success) {
                actionGetUserReels();
                actionGetReelList();
                setTimeout(() => {
                  onRefresh();
                }, 1500);
              }
            }
          });
        },
      },
      {
        text: Strings.no,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  // useMemo for Options
  const GetButtons = useMemo(
    () => (
      <View
        style={[
          styles.OptionsContainer,
          {
            bottom: isHome
              ? hp(Platform.OS == 'ios' ? 13 : 20)
              : isSearch
              ? hp(Platform.OS == 'ios' ? 25 : 20)
              : hp(Platform.OS == 'ios' ? 23.6 : 25),
          },
        ]}>
        {optionsComponent ? null : (
          <>
            {my_reels && (
              <Buttons
                name={'ios-ellipsis-vertical'}
                text={' '}
                isFontIonic
                size={32}
                onPress={() => {
                  setUserAction(!userAction);
                }}
              />
            )}

            <Buttons
              name={`${muteSound ? 'volume-mute' : 'volume-up'}`}
              text={' '}
              isFontAwesome={muteSound ? false : true}
              isFontIonic={muteSound ? true : false}
              size={32}
              onPress={() => {
                if (muteSound === true) {
                  setMuteSound(false);
                  setVideoVolume(1.0);
                } else {
                  setMuteSound(true);
                  setVideoVolume(0.0);
                }
              }}
            />

            <Buttons
              name="message1"
              text={comments?.length}
              size={34}
              onPress={() => {
                navigate('PostComment', {item: postItem});
              }}
            />

            <Buttons
              name={'dollar'}
              text={likeCount}
              pressStyle={{
                borderColor: likeVideo ? colors.PRIMARY_COLOR : colors.WHITE,
                borderWidth: wp(1),
                padding: wp(2),
                paddingHorizontal: wp(3),
                borderRadius: wp(12),
              }}
              isFontAwesome
              color={likeVideo ? colors.PRIMARY_COLOR : colors.WHITE}
              onPress={() => onLikePost()}
              size={18}
            />

            {/* <Buttons
              name={'heart'}
              text={counts?.upvotes}
              color={likeVideo ? colors.PRIMARY_COLOR : colors.WHITE}
              onPress={() => onLikePost()}
            /> */}

            {/* <Buttons
              pressStyle={{
                backgroundColor: colors.PRIMARY_COLOR,
                padding: wp(3),
                paddingHorizontal: wp(3),
                borderRadius: wp(6),
              }}
              name={'video-camera'}
              text={Strings.create}
              isFontAwesome
              // onPress={() => startRecorder()}
              onPress={() => {
                navigate('Report', {isFromPost : true,postId:postItem?._id});
              }}
              size={18}
            /> */}

            <TouchableOpacity
                            onPress={() => {
                              
                            navigate('Report', {postId:postItem?._id});
                            }}>
                            <Image
                              source={images.more_ic}
                              style={{...styles.medium_card_ic}}
                              
                            />
            </TouchableOpacity>

            {/* { <Buttons
              pressStyle={{
                backgroundColor: colors.PRIMARY_COLOR,
                padding: wp(3),
                paddingHorizontal: wp(3),
                borderRadius: wp(6),
              }}
              name={'more_ic'}
              text={''}
              isFontAwesome
              // onPress={() => startRecorder()}
              onPress={() => {
                // onPressAttachment();
              }}
              size={18}
            /> } */}

          </>
        )}
      </View>
    ),
    [
      ShowOptions,
      optionsComponent,
      liked,
      disliked,
      muteSound,
      likeVideo,
      likeCount,
      comments,
    ],
  );

  const onCompressFileInclude = file_str => {
    if (file_str.includes('file://')) {
      return file_str.replace('file://', 'file:///');
    } else {
      return 'file:///' + file_str;
    }
  };

  // open create with camera and gallery option
  const onPressAttachment = () => {
    openSheet({
      sheetItems: [
        {
          title: Strings.camera,
          icon: 'camera',
          onPress: () => startRecorder(),
        },
        {
          title: Strings.photo_library,
          icon: 'photo',
          onPress: async () => {
            const photo = await fileService.openMediaLibrary({
              selectionLimit: 1,
              mediaType: 'video',
              onOpenFailure: error => {
                if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
                  alert({
                    title: Strings.allow_permission,
                    message:
                      Strings.buzzmi_need_permission_to_access_your_device_storage,
                    buttons: [
                      {
                        text: Strings.Settings,
                        onPress: () => SBUUtils.openSettings(),
                      },
                    ],
                  });
                } else {
                  toast.show(Strings.error_open_photo_lib, 'error');
                }
              },
            });

            if (photo && photo[0]) {
              setLoading(true);
              console.log(photo[0].uri);
              const result = await CompressVideo.compress(
                photo[0].uri,
                {compressionMethod: 'auto'},
                progress => {
                  console.log('Compression Progress: ', progress);
                },
              );

              if (result) {
                setLoading(false);
                setTimeout(() => {
                  console.log('result viewer');
                  // console.log(result)
                  console.log(onCompressFileInclude(result));
                  navigate('PostViewer', {
                    is_reel: true,
                    file_url:
                      Platform.OS == 'android'
                        ? onCompressFileInclude(result)
                        : result,
                    fileType: 'video',
                  });
                }, 150);
              }
              // onSendFileMessage(photo[0]).catch(() => toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error'));
            }
          },
        },
        {
          title: Strings.Cancel,
          titleColor: '#6c2dcd',
          // onPress: () => console.log('Cancel pressed!'),
        },
      ],
    });
  };

  return (
    <Pressable
      style={[
        styles.container(ScreenHeight - CONST_REEL_HEIGHT_ADJUSTMENT(top)),
        {
          backgroundColor: backgroundColor,
          bottom: IS_IPHONE_X
            ? (wp(23) + headerHeight) * index
            : (wp(16) + headerHeight) * index,
        },
      ]}
      onPress={() => {
        onMiddlePress();
      }}>
      <VideoRecorder
        ref={videoRecorder}
        recordOptions={{
          maxDuration: 30,
          quality: RNCamera.Constants.VideoQuality['480p'],
        }}
      />

      {loading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: wp(100),
            zIndex: 100,
          }}
          size={40}
          color={Palette.primary300}
        />
      )}

      <Video
        ref={VideoPlayer}
        source={uri}
        style={styles.backgroundVideo}
        resizeMode={'cover'}
        onError={videoError}
        playInBackground={false}
        progressUpdateInterval={1000}
        paused={Paused || !screenIsFocused}
        muted={muteSound}
        repeat={true}
        onLoad={onLoadComplete}
        onProgress={PlayBackStatusUpdate}
        onEnd={() => onFinishPlaying(index)}
        volume={videoVolume}
        ignoreSilentSwitch="ignore"
      />

      <ActionMenu
        onHide={() => {
          setUserAction(false);
        }}
        onDismiss={() => {
          setUserAction(false);
        }}
        visible={userAction}
        title={Strings.tap_options}
        menuItems={[
          {
            title: Strings.edit,
            onPress: () => {
              navigate('PostViewer', {
                is_reel: true,
                file_url: uri,
                fileType: 'video',
                is_edit: true,
                post_data: postItem,
              });
            },
          },
          {
            title: Strings.delete,
            onPress: async () => {
              onReelDelete();
            },
          },
        ]}
      />

      {ShowOptions ? (
        <>
          <View
            style={[
              styles.SliderContainer,
              {
                bottom: isHome
                  ? hp(Platform.OS == 'ios' ? 13 : 20)
                  : isSearch
                  ? hp(Platform.OS == 'ios' ? 27 : 22)
                  : hp(Platform.OS == 'ios' ? 25 : 27),
              },
            ]}>
            <View style={{flexDirection: 'row', marginLeft: wp(6)}}>
              {postItem?.user.profile.picture && (
                <Image
                  source={{uri: postItem?.user.profile.picture}}
                  resizeMode="cover"
                  style={styles.card_profile}
                />
              )}

              <View style={{marginLeft: wp(4)}}>
                <Text
                  style={{
                    color: colors.WHITE,
                    fontSize: wp(4.5),
                    fontFamily: fonts.BOLD,
                    width: wp(62),
                    marginBottom: wp(2),
                    alignSelf: 'center',
                  }}>
                  {postItem?.user.profile.username || 'unknown'}
                </Text>

                <Text
                  style={{
                    color: colors.WHITE,
                    fontSize: wp(4.2),
                    fontFamily: fonts.REGULAR,
                    width: wp(62),
                  }}
                  numberOfLines={10}>
                  {content}
                </Text>
              </View>
            </View>
          </View>
          {GetButtons}
        </>
      ) : null}
    </Pressable>
  );
}

// Exports
export default ReelCard;

// Stylesheet
const styles = StyleSheet.create({
  card_profile: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
  },
  container: height => ({
    width: ScreenWidth,
    height: height,
    justifyContent: 'center',
  }),
  SliderContainer: {
    position: 'absolute',
    width: ScreenWidth,
    zIndex: 100,
    // bottom: hp(32)
  },
  TimeOne: {
    color: 'grey',
    position: 'absolute',
    left: 15,
    fontSize: 13,
    bottom: 5,
  },
  TimeTwo: {
    color: 'grey',
    position: 'absolute',
    right: 15,
    fontSize: 13,
    bottom: 5,
  },
  OptionsContainer: {
    position: 'absolute',
    right: 10,
    zIndex: 100,
  },
  HeaderContainer: {
    position: 'absolute',
    width: ScreenWidth,
    top: 0,
    height: 50,
    zIndex: 100,
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  medium_card_ic:{
    width:wp(10),
    height:wp(7),
    alignSelf:'center',
    tintColor:'white',
  }
});
