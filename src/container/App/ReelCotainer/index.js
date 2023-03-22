import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  TouchableOpacity,
  Platform,
  Image,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils';
import {colors} from '../../../res/colors';
import {images} from '../../../res/images';
import {Spacer} from '../../../res/spacer';
import {
  Text,
  styles,
  SearchBarContainer,
  SearchIcon,
  SearchInput,
  ClearButton,
  ClearIcon,
} from './style';
import {GlobalFlex, GlobalHeader} from '../../../res/globalStyles';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Reels from '../../../components/ReelContainer/components/Reels';
import {useIsFocused} from '@react-navigation/native';
import {ReelContext} from '../../../context/ReelContext';
import {AuthContext} from '../../../context/Auth.context';
import {RNCamera} from 'react-native-camera';
import {fonts} from '../../../res/fonts';
import {
  useLocalization,
  usePlatformService,
} from '@sendbird/uikit-react-native/src';
import {
  LoadingSpinner,
  Palette,
  useBottomSheet,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import SBUError from '@sendbird/uikit-react-native/src/libs/SBUError';
import {Video as CompressVideo} from 'react-native-compressor';
import {useEventEmitter} from '../../../hooks/useEventEmitter';

export default ReelContainer = props => {
  const [index, setIndex] = useState(props.index);
  const [HeaderHeight, setHeaderHeight] = useState(0);
  const [is_search, setIsSearch] = useState(false);
  const [query, setQuery] = useState('');
  const videoRecorder = useRef(null);

  // const isFocused = useIsFocused();

  const {
    state: ContextState,
    actionGetReelList,
    actionGetUserReels,
  } = useContext(ReelContext);
  const {userReelData, globalReelData, fetchingCommunityReels} = ContextState;
  const {state: authContextState} = useContext(AuthContext);
  const {userData} = authContextState;
  // console.log('props o n reecontainer', props);
  const [myreelData, setMyReelData] = useState(props.myreelData || []);
  const [reelData, setReelData] = useState(props.reelData || []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [setRandom, setMathRandom] = useState(Math.random());

  const {fileService} = usePlatformService();
  const {STRINGS} = useLocalization();
  const {openSheet} = useBottomSheet();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const startRecorder = () => {
    if (videoRecorder && videoRecorder.current) {
      videoRecorder.current.open({maxLength: 30}, data => {
        setTimeout(() => {
          props.navigation.navigate('PostViewer', {
            is_reel: true,
            file_url: data.uri,
            fileType: 'video',
          });
        }, 150);
      });
    }
  };

  const onCompressFileInclude = file_str => {
    if (file_str.includes('file://')) {
      return file_str.replace('file://', 'file:///');
    } else {
      return 'file:///' + file_str;
    }
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    if (!props.isHome) {
      console.log('getting data');
      actionGetReelList();
      actionGetUserReels();
    }
  }, []);

  useEffect(() => {
    if (props.isHome) {
      
      actionGetReelList();
      actionGetUserReels();
    }
  }, []);
 
  useEffect(() => {
    
      
      actionGetReelList();
      actionGetUserReels();
    
  }, []);
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    wait(2000).then(() => {
      setIsRefreshing(false);
      actionGetReelList();
    });
  }, []);

  // open create with camera and gallery option
  const onPressAttachment = () => {
    openSheet({
      sheetItems: [
        {
          title: STRINGS.GROUP_CHANNEL.DIALOG_ATTACHMENT_CAMERA,
          icon: 'camera',
          onPress: () => startRecorder(),
        },
        {
          title: STRINGS.GROUP_CHANNEL.DIALOG_ATTACHMENT_PHOTO_LIBRARY,
          icon: 'photo',
          onPress: async () => {
            const photo = await fileService.openMediaLibrary({
              selectionLimit: 1,
              mediaType: 'video',
              onOpenFailure: error => {
                if (error.code === SBUError.CODE.ERR_PERMISSIONS_DENIED) {
                  alert({
                    title: STRINGS.DIALOG.ALERT_PERMISSIONS_TITLE,
                    message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                      'device storage',
                      'UIKitSample',
                    ),
                    buttons: [
                      {
                        text: STRINGS.DIALOG.ALERT_PERMISSIONS_OK,
                        onPress: () => SBUUtils.openSettings(),
                      },
                    ],
                  });
                } else {
                  toast.show(STRINGS.TOAST.OPEN_PHOTO_LIBRARY_ERROR, 'error');
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
                  props.navigation.navigate('PostViewer', {
                    is_reel: true,
                    file_url:
                      Platform.OS === 'android'
                        ? onCompressFileInclude(result)
                        : result,
                    fileType: 'video',
                  });
                }, 150);
              }
            }
          },
        },
        {
          title: 'Cancel',
          titleColor: '#6c2dcd',
          // onPress: () => console.log('Cancel pressed!'),
        },
      ],
    });
  };
  const loadReel = () => {
    setMyReelData(userReelData), setReelData(globalReelData);
    setMathRandom(Math.random());
  };
  useEffect(() => {
    if (!props?.isHome) {
      loadReel();
    }
  }, [userReelData, globalReelData]);

  useEffect(() => {
    if (props?.isHome) {
      setMyReelData(props.myreelData);
    }
  }, [props.myreelData]);
  useEffect(() => {
    if (props?.isHome) {
      setReelData(props.reelData);
    }
  }, [props.reelData]);

  if (index == 0) {
    console.log('index == 0 ', myreelData?.length < 1);
  }

  return (
    <>
      <StatusBar barStyle={'dark-content'} />

      {!props?.isHome ? (
        <>
          <SafeAreaView style={{backgroundColor: 'white'}} />
          <GlobalHeader
            style={{paddingBottom: 0}}
            onLayout={event => {
              var {height} = event.nativeEvent.layout;
              setHeaderHeight(height);
            }}>
            <VideoRecorder
              ref={videoRecorder}
              recordOptions={{
                maxDuration: 30,
                quality: RNCamera.Constants.VideoQuality['480p'],
              }}
              compressQuality={'medium'}
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

            <View style={styles.HeaderWrapper}>
              {!is_search && (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{marginLeft: wp(5)}}>
                    <Image
                      source={
                        userData?.avatar
                          ? {uri: userData?.avatar}
                          : images.avatar
                      }
                      style={styles.menu_avatar}
                    />
                  </TouchableOpacity>

                  <View style={styles.header_title}>
                    <Text>Reel</Text>
                  </View>

                  <View style={styles.header_flex_wrapper}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        setTimeout(() => {
                          setIsSearch(!is_search);
                        }, 100);
                      }}>
                      <Image
                        style={styles.header_icon_ic}
                        resizeMode={'contain'}
                        source={images.search_blue}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {is_search && (
                <View style={{marginHorizontal: wp(5), flexDirection: 'row'}}>
                  <SearchBarContainer>
                    <View style={{width: wp(10), alignSelf: 'center'}}>
                      <SearchIcon
                        style={styles.searchIconStyle}
                        source={images.search_ic}
                      />
                    </View>
                    <SearchInput
                      autoFocus={true}
                      value={query}
                      placeholder={'Search'}
                      placeholderTextColor={'#7b7d83'}
                      onChangeText={val => {
                        setQuery(() => val);
                      }}
                      returnKeyType={'search'}
                      onSubmitEditing={() => {
                        if (query.trim()) {
                          props.navigation.navigate('ReelSearch', {
                            searchParamData: query,
                          });
                        }
                      }}
                    />
                    <ClearButton
                      disabled={query.length <= 0}
                      isActive={query.length > 0}
                      onPress={() => {
                        setQuery(() => ''), setIsSearch(!is_search);
                      }}>
                      <ClearIcon source={images.iconDecline_3x} />
                    </ClearButton>
                  </SearchBarContainer>

                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      setQuery(() => ''), setIsSearch(!is_search);
                    }}>
                    <Text
                      style={{
                        fontSize: wp(3.8),
                        fontFamily: fonts.REGULAR,
                        marginHorizontal: 0,
                      }}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Spacer space={hp(0.8)} />
            <View
              style={{
                ...styles.flex_wrapper,
                borderBottomWidth: wp(1),
                borderBottomColor: colors.PAINT_BORDER,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIndex(0);
                }}
                style={{
                  ...styles.tab_wrapper,
                  borderBottomColor:
                    index == 0 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
                  borderBottomWidth: index == 0 ? wp(0.5) : 0,
                }}>
                <Text
                  style={[
                    {
                      fontSize: wp(3.8),
                      color: index == 0 ? colors.PRIMARY_COLOR : colors.BLACK,
                    },
                  ]}>
                  My clips
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(1);
                }}
                style={{
                  ...styles.tab_wrapper,
                  borderBottomColor:
                    index == 1 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
                  borderBottomWidth: index == 1 ? wp(0.5) : 0,
                }}>
                <Text
                  style={[
                    {
                      fontSize: wp(3.8),
                      color: index == 1 ? colors.PRIMARY_COLOR : colors.BLACK,
                    },
                  ]}>
                  For You
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(2);
                }}
                style={{
                  ...styles.tab_wrapper,
                  borderBottomColor:
                    index == 2 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
                  borderBottomWidth: index == 2 ? wp(0.5) : 0,
                }}>
                <Text
                  style={[
                    {
                      fontSize: wp(3.8),
                      color: index == 2 ? colors.PRIMARY_COLOR : colors.BLACK,
                    },
                  ]}>
                  Following
                </Text>
              </TouchableOpacity>
            </View>
          </GlobalHeader>
        </>
      ) : null}
      <GlobalFlex>
        {index == 0 && myreelData.length > 0 ? (
          <Reels
            videos={myreelData}
            headerHeight={HeaderHeight}
            my_reels={true}
            isSearch={false}
            isHome={props?.isHome}
          />
        ) : (
          index == 0 && (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={[{textAlign: 'center'}]}>No Reels Found</Text>
              <TouchableOpacity
                style={styles.float_wrapper}
                onPress={() => {
                  onPressAttachment();
                }}>
                <Image source={images.add_full} style={styles.float_add_ic} />
              </TouchableOpacity>
            </View>
          )
        )}
        {index == 1 && reelData?.length > 0 ? (
          <Reels
            videos={reelData}
            headerHeight={HeaderHeight}
            isSearch={false}
            onRefresh={() => onRefresh()}
            refreshing={isRefreshing}
            isHome={props?.isHome}
          />
        ) : (
          index == 1 &&
          !fetchingCommunityReels && (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={[{textAlign: 'center'}]}>No Reels Found</Text>
              <TouchableOpacity
                style={styles.float_wrapper}
                onPress={() => {
                  onPressAttachment();
                }}>
                <Image source={images.add_full} style={styles.float_add_ic} />
              </TouchableOpacity>
            </View>
          )
        )}
      </GlobalFlex>

      {(props?.isHome
        ? (index == 0 && myreelData?.length < 1 && isRefreshing) ||
          (index == 1 && reelData?.length < 1 && isRefreshing)
        : index == 1 && fetchingCommunityReels && !isRefreshing) && (
        <LoadingSpinner
          style={{
            alignSelf: 'center',
            position: 'absolute',
            justifyContent: 'center',
            width: wp(100),
            height: hp(60),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </>
  );
};
