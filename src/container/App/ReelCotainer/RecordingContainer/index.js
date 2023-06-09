import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import {RNCamera} from 'react-native-camera';

import {Colors} from 'react-native/Libraries/NewAppScreen';

export default RecordingContainer = props => {
  const videoRecorder = useRef(null);
  function startRecorder() {
    if (videoRecorder && videoRecorder.current) {
      videoRecorder.current.open({maxLength: 30}, data => {
        console.log('captured data', data);
      });
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                onPress={startRecorder}
                style={styles.btnCapture}>
                <Text style={styles.sectionTitle}>Capture video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <VideoRecorder
        ref={videoRecorder}
        compressQuality={'medium'}
        recordOptions={{
          maxDuration: 30,
          quality: RNCamera.Constants.VideoQuality['480p'],
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
  btnCapture: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 25,
  },
});
