import React from 'react';
import PostFileViewer from '../../container/App/HomeDashboard/PostFileViewer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostComment from '../../container/App/HomeDashboard/PostComment';
import CreatePost from '../../container/App/HomeDashboard/CreatePost';
import EditPost from '../../container/App/HomeDashboard/EditPost';
import HomeDashboard from '../../container/App/HomeDashboard';
import {options} from './utils';

const Stack = createNativeStackNavigator();

const DiscoverStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'HomeDashboard'}>
      <Stack.Screen
        name={'HomeDashboard'}
        options={options}
        component={HomeDashboard}
      />
      {/* <Stack.Screen
        name={'CreatePost'}
        options={options}
        component={CreatePost}
      /> */}
      {/* <Stack.Screen name={'EditPost'} options={options} component={EditPost} /> */}
      <Stack.Screen
        name={'PostViewer'}
        options={options}
        component={PostFileViewer}
      />
      <Stack.Screen
        name={'PostComment'}
        options={options}
        component={PostComment}
      />
    </Stack.Navigator>
  );
};

export default DiscoverStackNavigator;
