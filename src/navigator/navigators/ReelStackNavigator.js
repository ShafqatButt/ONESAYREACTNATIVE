import React, {useContext, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReelContainer from '../../container/App/ReelCotainer';
import FeedReelScreen from '../../container/App/FeedReelScreen';
import {options} from './utils';
import RecordingContainer from '../../container/App/ReelCotainer/RecordingContainer';
import PostFileViewer from '../../container/App/HomeDashboard/PostFileViewer';
import PostComment from '../../container/App/HomeDashboard/PostComment';
import ReelSearchContainer from '../../container/App/ReelCotainer/ReelSearchContainer';
import {AuthContext} from '../../context/Auth.context';
import {ReelContext} from '../../context/ReelContext';
import {getData} from '../../res/asyncStorageHelper';

const Stack = createNativeStackNavigator();

const ReelStackNavigator = () => {
  const {defaultLogin} = useContext(AuthContext);

  useEffect(() => {
    getData(
      'userDetails',
      success => {
        defaultLogin(success);
      },
      failure => {},
    );
  }, []);

  return (
    <Stack.Navigator initialRouteName={'Reel'}>
      <Stack.Screen
        name={'Reel'}
        options={options}
        component={FeedReelScreen}
      />
      <Stack.Screen
        name={'Recording'}
        options={options}
        component={RecordingContainer}
      />
      <Stack.Screen
        name={'PostViewer'}
        options={options}
        component={PostFileViewer}
      />
      <Stack.Screen
        name={'ReelSearch'}
        options={options}
        component={ReelSearchContainer}
      />
      <Stack.Screen
        name={'PostComment'}
        options={options}
        component={PostComment}
      />
    </Stack.Navigator>
  );
};

export default ReelStackNavigator;
