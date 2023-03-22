// noinspection ES6CheckImport

import React, {useState, useEffect, useRef} from 'react';
import {View, Switch, Text, Image, Platform} from 'react-native';
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {colors} from '../../../../res/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import * as Animatable from 'react-native-animatable';
import {useIsForeground} from '../../../../hooks/useIsForeground';
import {images} from '../../../../res/images';
import Video from 'react-native-video';
import styles, {
  Dot,
  Icon,
  Button,
  ActiveText,
  FooterContainer,
  ToggleContainer,
} from './style';
import {deleteFile, underDevelopment} from '../../../../uikit-app';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Strings from "../../../../string_key/Strings";

const getFilePath = path => 'file://' + path;

export const toHHMMSS = secs => {
  let sec_num = parseInt(secs, 10);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor(sec_num / 60) % 60;
  let seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map(v => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

const CameraScreen = props => {
  const {onSendFile} = props.route.params;
  const isAppForeground = useIsForeground();
  const devices = useCameraDevices();
  const {top} = useSafeAreaInsets();
  const refCamera = useRef(null);
  const refCameraTimeout = useRef(null);

  const [isFileAvailable, setFileAvailable] = useState({
    value: false,
    file: null,
  });
  const [isRecordingVideo, setRecordingVideo] = useState(false);
  const [isBackCameraActive, setBackCameraActive] = useState(true);
  const [videoProgress, setVideoProgress] = useState({
    progress: 0,
    text: '00:00/00:00',
  });
  const [isPhotoEnabled, setPhotoEnabled] = useState(true);
  const [isAudioEnabled, setAudioEnabled] = useState(false);
  const takePhoto = async () => {
    let photo = {};
    const options = {
      quality: 80,
      skipMetadata: false,
    };
    if (Platform.OS == 'ios') {
      photo = await refCamera?.current?.takePhoto(options);
    } else {
      photo = await refCamera?.current?.takeSnapshot(options);
    }

    const file = {
      ...photo,
      customFileType: 'photo',
      uri: getFilePath(photo.path),
    };
    console.log('photo ===> ', JSON.stringify(file));
    setFileAvailable(() => ({
      value: true,
      file: file,
    }));
  };

  const takeVideo = async () => {
    setRecordingVideo(() => true);
    await refCamera?.current?.startRecording({
      fileType: 'mp4',
      onRecordingError: error => {
        setRecordingVideo(() => false);
        console.log('video (error) ===> ', error);
      },
      onRecordingFinished: video => {
        setRecordingVideo(() => false);
        console.log('video ===> ', video);
        const file = {
          ...video,
          uri: video.path,
          customFileType: 'video',
        };
        setFileAvailable(() => ({
          value: true,
          file: file,
        }));
      },
    });
  };

  const deletePhoto = () => {
    deleteFile(isFileAvailable?.file?.uri, () => {
      setFileAvailable({
        value: false,
        file: null,
      });
    });
  };

  const sendFileToChat = () => {
    onSendFile(isFileAvailable.file);
    props.navigation.goBack();
  };

  useEffect(() => {
    if (isPhotoEnabled) {
      setAudioEnabled(() => false);
    } else {
      setTimeout(() => setAudioEnabled(() => true), 600);
    }
  }, [isPhotoEnabled]);

  useEffect(() => {
    if (refCameraTimeout?.current !== null) {
      clearTimeout(refCameraTimeout.current);
    }
    refCameraTimeout.current = setTimeout(() => {
      if (devices.back == null || devices.front == null) {
        underDevelopment(Strings.error_cam_not_available);
        props.navigation.goBack();
      } else {
        console.log('Camera ready!');
      }
    }, 800);
    return () => {
      if (refCameraTimeout?.current !== null) {
        clearTimeout(refCameraTimeout.current);
        refCameraTimeout.current = null;
      }
    };
  }, [devices]);

  function _renderHeaderLayout() {
    return (
      <BackHeader
        is_center_text
        title={''}
        isLeftText={false}
        isRightText={false}
        textColor={{color: colors.WHITE}}
        onBackPress={() => props.navigation.goBack()}
        background={[
          {top: Platform.OS === 'ios' ? top : 0},
          styles.headerStyle,
        ]}>
        <ToggleContainer>
          <ActiveText>{isPhotoEnabled ? Strings.photo : 'Video'}</ActiveText>
          <Switch
            trackColor={{
              false: colors.PRIMARY_COLOR,
              true: colors.LIGHT_PRIMARY_COLOR,
            }}
            thumbColor={
              isPhotoEnabled ? colors.PRIMARY_COLOR : colors.LIGHT_PRIMARY_COLOR
            }
            onValueChange={setPhotoEnabled}
            value={isPhotoEnabled}
          />
        </ToggleContainer>
      </BackHeader>
    );
  }

  function _renderCameraLayout(renderDummy = false) {
    return (
      <>
        {renderDummy ? (
          <View
            style={{height: '100%', width: '100%', backgroundColor: 'orange'}}
          />
        ) : (
          <Camera
            ref={refCamera}
            device={isBackCameraActive ? devices.back : devices.front}
            photo={isPhotoEnabled}
            video={!isPhotoEnabled}
            audio={isAudioEnabled}
            style={styles.fullScreenStyle}
            isActive={isAppForeground && !isFileAvailable?.value}
          />
        )}
      </>
    );
  }

  const playBackStatusUpdate = playbackStatus => {
    try {
      let currentTime = Math.round(playbackStatus.currentTime);
      let duration = Math.round(playbackStatus.seekableDuration);
      if (currentTime) {
        if (duration) {
          const progress = (currentTime / duration) * 100;
          setVideoProgress(() => ({
            progress: progress,
            text: `${toHHMMSS(currentTime)}/${toHHMMSS(duration)}`,
          }));
        }
      }
    } catch (error) {}
  };

  if (devices.back == null || devices.front == null) {
    return (
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
    );
  }

  return (
    <GlobalFlex>
      {_renderCameraLayout()}
      {isFileAvailable?.value &&
      isFileAvailable.file.customFileType === 'video' ? (
        <Video
          muted={false}
          repeat={true}
          paused={false}
          resizeMode={'cover'}
          playInBackground={false}
          progressUpdateInterval={1000}
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
          }}
          onProgress={playBackStatusUpdate}
          source={{uri: isFileAvailable?.file?.uri}}
        />
      ) : isFileAvailable?.value ? (
        <Image
          style={styles.fullScreenStyle}
          source={{uri: isFileAvailable.file.uri}}
        />
      ) : null}
      {!isFileAvailable?.value && !isRecordingVideo && _renderHeaderLayout()}
      {isFileAvailable?.value &&
        isFileAvailable?.file?.customFileType === 'video' && (
          <View
            style={{
              top: top,
              left: 0,
              right: 0,
              alignItems: 'center',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.4)',
              paddingVertical: wp('5%'),
            }}>
            <Text>{videoProgress?.text}</Text>
          </View>
        )}
      {isRecordingVideo && (
        <Animatable.View
          delay={100}
          animation={'fadeIn'}
          direction={'alternate'}
          iterationCount={'infinite'}
          style={{
            top: top,
            left: 0,
            right: 0,
            flexDirection: 'row',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: wp('2%'),
          }}>
          <View
            style={{backgroundColor: 'red', padding: 5, borderRadius: 90}}
          />
          <Text> Recording</Text>
        </Animatable.View>
      )}
      <FooterContainer>
        {isFileAvailable?.value ? (
          isFileAvailable.file.customFileType === 'video' ? (
            <>
              <Button onPress={() => deletePhoto()}>
                <Icon source={images.ic_cancel} />
              </Button>
              <Button onPress={() => sendFileToChat()}>
                <Icon source={images.ic_done} />
              </Button>
            </>
          ) : (
            <>
              <Button onPress={() => deletePhoto()}>
                <Icon source={images.ic_cancel} />
              </Button>
              <Button onPress={() => sendFileToChat()}>
                <Icon source={images.ic_done} />
              </Button>
            </>
          )
        ) : (
          <>
            <Button
              noBorder
              disabled={isRecordingVideo}
              style={{opacity: isRecordingVideo ? 0 : 1}}
              onPress={() => setBackCameraActive(prevState => !prevState)}>
              <Icon source={images.ic_flip_camera} />
            </Button>
            <Button
              onPress={() =>
                isPhotoEnabled
                  ? takePhoto()
                  : isRecordingVideo
                  ? refCamera.current.stopRecording()
                  : takeVideo()
              }>
              <Dot
                color={isPhotoEnabled ? 'white' : 'red'}
                stopEnabled={!isPhotoEnabled && isRecordingVideo}
              />
            </Button>
            <Button
              noBorder
              disabled={true}
              style={{opacity: 0}}
              onPress={() => setBackCameraActive(prevState => !prevState)}>
              <Icon source={images.ic_flip_camera} />
            </Button>
          </>
        )}
      </FooterContainer>
    </GlobalFlex>
  );
};

export default CameraScreen;
