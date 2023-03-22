import {useRef} from 'react';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {EventRegister} from 'react-native-event-listeners';
import AudioRecorderPlayer, {
  AudioSet,
  AVEncodingOption,
  AudioSourceAndroidType,
  AudioEncoderAndroidType,
  AVEncoderAudioQualityIOSType,
} from 'react-native-audio-recorder-player';

export const useAudioRecorderPlayer = () => {
  const refAudioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const startRecording = async () => {
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: Date.now() + '.m4a',
      android: `${dirs.CacheDir}/${Date.now()}.mp3`,
    });

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const result = await refAudioRecorderPlayer.startRecorder(path, audioSet);
    refAudioRecorderPlayer.addRecordBackListener(e => {
      const res = {
        recordSecs: e.currentPosition,
        recordTime: refAudioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ),
      };

      const minutes = res.recordTime.split(':')[0];
      const seconds = res.recordTime.split(':')[1];
      const totalSeconds = Math.floor(res.recordSecs / 1000);

      console.log('Record back listener => ', res);

      EventRegister.emitEvent('on-count-update', {
        limitReached: totalSeconds >= 2, // Minimum needs to be 2 seconds
        count: minutes + ':' + seconds,
      });
    });
    console.log(result);
  };

  const endRecording = async callback => {
    const result = await refAudioRecorderPlayer.stopRecorder();
    refAudioRecorderPlayer.removeRecordBackListener();
    console.log('Record back listener => ', {
      recordSecs: 0,
    });
    EventRegister.emitEvent('on-count-update', {
      limitReached: false,
      count: '00:00',
    });
    callback(result);
  };

  return [startRecording, endRecording];
};
