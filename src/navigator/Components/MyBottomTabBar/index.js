import React, {useContext, useState, useEffect, useRef} from 'react';
import {Pressable, View, ActivityIndicator} from 'react-native';
import {getTabIcon, TAB_NAMES} from '../Constants';
import {useNavigation} from '@react-navigation/native';
import {Container, BannerContainer} from './styles';
import TabMenuComponent from '../TabMenuComponent';
import {
  CONST_FLOW_TYPES,
  sendOtp,
} from '../../../container/Auth/VerifyOTPScreen';
import IconAssets from '../../../assets';
// import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {TitleComponent} from '../../../container/App/Account/AccountVerification';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {LabelIcon} from '../../../container/App/Account/AccountVerification/style';
import AsyncStore from '@react-native-community/async-storage';
import {AuthContext} from '../../../context/Auth.context';
import {colors} from '../../../res/colors';
import {useDirectNavigation} from '../../../navigations/useDirectNavigation';
import Video from 'react-native-video';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import {images} from '../../../res/images';
import {
  useLocalization,
  usePlatformService,
} from '@sendbird/uikit-react-native/src';
import {RNCamera} from 'react-native-camera';
import {
  ActionMenu,
  LoadingSpinner,
  Palette,
  useBottomSheet,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import Strings from '../../../string_key/Strings';
import {Video as CompressVideo} from 'react-native-compressor';

const MyBottomTabBar = props => {
  const BUTTONS = [
    Strings.home,
    Strings.chat,
    'PlusButton',
    Strings.trip,
    Strings.hub,
  ];
  const {navigate, goBack} = useNavigation();
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  const {navigation} = useDirectNavigation();

  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [Paused, SetPaused] = useState(false);

  // ref for Video Player
  const VideoPlayer = useRef(null);
  const videoRecorder = useRef(null);

  const {fileService} = usePlatformService();
  const {STRINGS} = useLocalization();
  const {openSheet} = useBottomSheet();

  // useEffect(() => {
  //   console.log('1st showPhoneVerify',showPhoneVerify);
  //   if (ContextState?.userData?.isMobileVerified && showPhoneVerify) {
  //     setShowPhoneVerify(() => false);
  //   }
  // }, [ContextState?.userData?.isMobileVerified]);

  useEffect(() => {
    console.log('2nd showPhoneVerify', showPhoneVerify);
    if (!ContextState?.userData?.isMobileVerified) {
      AsyncStore.getItem('phone-verify-skipped')
        .then(s => (s?.length > 0 ? JSON.parse(s) : null))
        .then(skipped => {
          if (skipped === null) {
            setShowPhoneVerify(() => true);
          }
        });
    } else {
      setShowPhoneVerify(() => false);
    }
  }, [ContextState?.userData?.isMobileVerified]);

  const onPressAttachment = () => {
    openSheet({
      sheetItems: [
        {
          title: Strings.post,
          icon: 'camera',
          onPress: () => props.navigation.navigate('CreatePost'),
        },
        {
          title: Strings.reel,
          icon: 'camera',
          // onPress: () => startRecorder(),
          onPress: () => onPressAttachmentForReelUpload(),
        },
      ],
    });
  };

  const startRecorder = () => {
    SetPaused(true);

    if (videoRecorder && videoRecorder.current) {
      console.log('Ref Is working', videoRecorder, videoRecorder.current);
      videoRecorder.current.open(
        {
          maxDuration: 30,
          quality: RNCamera.Constants.VideoQuality['480p'],
        },
        data => {
          setTimeout(() => {
            props.navigation.navigate('PostViewer', {
              is_reel: true,
              file_url: data.uri,
              fileType: 'video',
            });
          }, 150);
        },
      );
    }
  };

  const onCompressFileInclude = file_str => {
    if (file_str.includes('file://')) {
      return file_str.replace('file://', 'file:///');
    } else {
      return 'file:///' + file_str;
    }
  };


  const onPressAttachmentForReelUpload = () => {
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
              console.log('result==>>',result);

              if (result) {
                setLoading(false);
                setTimeout(() => {
                  console.log('result viewer==>>');
                  // console.log(result)
                  console.log('onCompressFieldInclude==>>', onCompressFileInclude(result));
                  navigate('PostViewer', {
                    is_reel: true,
                    file_url:
                      Platform.OS == 'android'
                        ? onCompressFileInclude(result)
                        : result,
                    fileType: 'video',
                  });
                }, 1000);
              }
              // onSendFileMessage(photo[0]).catch(() => toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error'));
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


  return (
    <>
      <VideoRecorder
        ref={videoRecorder}
        recordOptions={{
          maxDuration: 30,
          quality: RNCamera.Constants.VideoQuality['480p'],
        }}
      />
      {showPhoneVerify && (
        <BannerContainer>
          <Pressable
            onPress={() => {
              console.log('showPhoneVerify', showPhoneVerify);
              AsyncStore.setItem('phone-verify-skipped', JSON.stringify(true));
              setShowPhoneVerify(() => false);
            }}
            style={{
              marginStart: wp('5%'),
              zIndex: 99,
            }}>
            <LabelIcon
              style={{
                tintColor: undefined,
                width: wp('6%'),
                height: wp('6%'),
              }}
              resizeMode={'contain'}
              source={IconAssets.ic_cancel}
            />
          </Pressable>
          <TitleComponent
            title={Strings.sa_str_verify_number_1}
            onPress={() => {
              setLoading(() => true);
              sendOtp().then(({success, response}) => {
                setLoading(() => false);
                if (success) {
                  console.log('response ===> ', response);
                  props.navigation.navigate('Auth', {
                    screen: 'VerifyOTPScreen',
                    params: {
                      type: CONST_FLOW_TYPES.VERIFY_PHONE,
                      flowId: '', // Not required for this flow...
                      expireTime: 10,
                      email: ContextState?.userData?.mobile,
                    },
                  });
                }
              });
              // console.log('the ver+++==>',ContextState?.userData?.isMobileVerified);
            }}
            isEditable={null}
            isVerified={null}
            icon={IconAssets.ic_one_say_sign}
          />
          {isLoading && (
            <View
              style={{
                width: '107%',
                height: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.75)',
              }}>
              <ActivityIndicator size={'large'} color={colors.PRIMARY_COLOR} />
            </View>
          )}
        </BannerContainer>
      )}
      <Container>
        {BUTTONS.map((title, index) => (
          <TabMenuComponent
            index={index}
            tabText={index === 2 ? '' : title}
            onPressed={() => {
              console.log('hello!', index, title);
              if (TAB_NAMES[index].length > 0 && TAB_NAMES[index] !== ' ') {
                if (props?.state?.routes[index]?.state?.routes?.length > 1) {
                  console.log('going back', props?.state?.routes);
                  goBack();
                } else if (index === 2) {
                  // console.log(
                  //   'props?.state?.routes[index]?.state?.routes?.length==>>',
                  //   props?.state?.routes[index]?.state?.routes?.length,
                  // );
                  //  navigate('CreatePost')

                  onPressAttachment();
                } else {
                  console.log('navigating,', TAB_NAMES[index]);

                  navigate(TAB_NAMES[index]);
                }
                // if (index === 0) {
                //   navigate('Home');
                // } else {
                //   navigate(TAB_NAMES[index]);
                // }
              } else {
                console.log('Add Pressed!');
                navigate('CreatePost');
              }
            }}
            tabName={TAB_NAMES[index]}
            tabImage={getTabIcon(index)}
            focused={index === props.index}

            // width={index === 2 ? wp(40) : wp(5)}
            // height={index === 2 ? wp(30) : wp(5)}
            // bottom={index === 2 ? wp(4) : 0}
          />
        ))}
      </Container>
    </>
  );
};

export default MyBottomTabBar;
