//#region RN
import React, {useEffect} from 'react';
import {Alert} from 'react-native';
//#region third party libs
import NetInfo from '@react-native-community/netinfo';
import Strings from '../../one-say-frontend/src/string_key/Strings';

export const Network = props => {
  useEffect(() => {
    NetInfo.addEventListener(state => {
      if (state.isConnected != true) {
        onNetworkAlert();
      }
    });
  }, []);

  // On network alert
  const onNetworkAlert = () => {
    Alert.alert(
      Strings.couldnt_reach_server,
      [
        {
          text: Strings.OK,
          onPress: () => {},
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  return <></>;
};
