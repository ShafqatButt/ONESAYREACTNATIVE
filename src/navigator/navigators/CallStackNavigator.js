// noinspection ES6CheckImport

import React from 'react';
import {Platform} from 'react-native';
import {
  GroupChannelScreen,
  GroupChannelCreateScreen,
  GroupChannelInviteScreen,
  GroupChannelMembersScreen,
  GroupChannelSettingsScreen,
  GroupChannelOperatorsScreen,
} from '../../uikit-app';
import DirectCallVideoCallingScreen from '../../container/App/CallContainer/DirectCallVideoCallingScreen';
import DirectCallVoiceCallingScreen from '../../container/App/CallContainer/DirectCallVoiceCallingScreen';
import DirectCallHistoryScreen from '../../container/App/CallContainer/DirectCallHistoryScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Contacts from '../../container/App/Chat_call/Contacts';
import {DirectRoutes} from '../../navigations/routes';
import {Routes} from '../../libs/navigation';
import {options} from './utils';

const Stack = createNativeStackNavigator();

const CallStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'Call'}>
      <Stack.Screen
        name={'CallHistory'}
        component={DirectCallHistoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Group screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen
          name={DirectRoutes.VIDEO_CALLING}
          component={DirectCallVideoCallingScreen}
        />
        <Stack.Screen
          name={DirectRoutes.VOICE_CALLING}
          component={DirectCallVoiceCallingScreen}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          gestureEnabled: Platform.OS !== 'android',
        }}>
        <Stack.Screen name={'Contacts'} component={Contacts} />
      </Stack.Group>
      <Stack.Screen
        name={Routes.GroupChannel}
        options={options}
        component={GroupChannelScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelSettings}
        options={options}
        component={GroupChannelSettingsScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelCreate}
        options={options}
        component={GroupChannelCreateScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelInvite}
        options={options}
        component={GroupChannelInviteScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelMembers}
        options={options}
        component={GroupChannelMembersScreen}
      />
      <Stack.Screen
        name={Routes.GroupChannelOperators}
        options={options}
        component={GroupChannelOperatorsScreen}
      />
    </Stack.Navigator>
  );
};

export default CallStackNavigator;
