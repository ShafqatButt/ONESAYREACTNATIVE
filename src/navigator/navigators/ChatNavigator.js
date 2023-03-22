// noinspection ES6CheckImport

import React from 'react';
import {Platform} from 'react-native';
import {Routes} from '../../libs/navigation';
import {
  GroupChannelScreen,
  GroupChannelCreateScreen,
  GroupChannelInviteScreen,
  GroupChannelMembersScreen,
  GroupChannelSettingsScreen,
  GroupChannelOperatorsScreen,
  GroupChannelOperatorPermissionsScreen,
} from '../../uikit-app';
import DirectCallVideoCallingScreen from '../../container/App/CallContainer/DirectCallVideoCallingScreen';
import DirectCallVoiceCallingScreen from '../../container/App/CallContainer/DirectCallVoiceCallingScreen';
import ChannelInviteViaLinkScreen from '../../uikit-app/ChannelInviteViaLinkScreen';
import ReportMemberDetails from '../../container/App/Chat_call/ReportMemberDetails';
import SearchMessageScreen from '../../container/App/Chat_call/SearchMessageScreen';
import ReportedMemberList from '../../container/App/Chat_call/ReportedMemberList';
import CreateGroupChannel from '../../container/App/Chat_call/CreateGroupChannel';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BannedMembers from '../../container/App/Chat_call/BannedMembers';
import UserListModal from '../../container/App/Chat_call/UserListModal';
import CameraScreen from '../../container/App/Chat_call/CameraScreen';
import ProfileView from '../../container/App/Chat_call/ProfileView';
import ContactCard from '../../container/App/Chat_call/ContactCard';
import CreateNext from '../../container/App/Chat_call/CreateNext';
import ReportUser from '../../container/App/Chat_call/ReportUser';
import InviteUser from '../../container/App/Chat_call/InviteUser';
import FileViewerScreen from '../../uikit-app/FileViewerScreen';
import Contacts from '../../container/App/Chat_call/Contacts';
import NewChats from '../../container/App/Chat_call/NewChats';
import {DirectRoutes} from '../../navigations/routes';
import Chat_call from '../../container/App/Chat_call';
import {options, options_modal} from './utils';
import ProfileEventTypes from '../../container/App/Events/ProfileEventTypes';
import StripePaymentScreen from '../../container/App/StripePaymentScreen';
import BookEvent from '../../container/App/Events/BookEvent';

const Stack = createNativeStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={Routes.GroupChannel}>
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
        name={Routes.GroupChannelInviteViaLink}
        options={options}
        component={ChannelInviteViaLinkScreen}
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

      <Stack.Screen
        name={Routes.GroupChannelOperatorPermissions}
        options={options}
        component={GroupChannelOperatorPermissionsScreen}
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
        screenOptions={{presentation: 'containedModal', headerShown: false}}>
        <Stack.Screen name={Routes.FileViewer} component={FileViewerScreen} />
      </Stack.Group>
      <Stack.Screen
        name={'BannedMembers'}
        component={BannedMembers}
        options={options}
      />
      <Stack.Screen
        name={'ProfileView'}
        component={ProfileView}
        options={options}
      />
      <Stack.Screen
        options={options}
        name={'ProfileEventTypes'}
        component={ProfileEventTypes}
      />
      <Stack.Screen
        name={'StripePaymentScreen'}
        options={options_modal}
        component={StripePaymentScreen}
      />
      <Stack.Screen
        name={'BookEvent'}
        options={options_modal}
        component={BookEvent}
      />

      <Stack.Screen
        name={'ContactCard'}
        component={ContactCard}
        options={options}
      />
      <Stack.Screen
        name={'Chat_call'}
        component={Chat_call}
        options={options}
      />
      <Stack.Screen
        name={'ReportedMemberList'}
        component={ReportedMemberList}
        options={options}
      />
      <Stack.Screen
        name={'CameraScreen'}
        component={CameraScreen}
        options={options}
      />
      <Stack.Group screenOptions={options_modal}>
        <Stack.Screen name={'Contacts'} component={Contacts} />
        <Stack.Screen name={'NewChats'} component={NewChats} />
        <Stack.Screen name={'UserListModal'} component={UserListModal} />
        <Stack.Screen
          name={'CreateGroupChannel'}
          component={CreateGroupChannel}
        />
        <Stack.Screen
          name={'SearchMessageScreen'}
          component={SearchMessageScreen}
          options={{
            headerShown: false,
            presentation: 'card',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen name={'CreateNext'} component={CreateNext} />
        <Stack.Screen name={'ReportUser'} component={ReportUser} />
        <Stack.Screen
          name={'ReportMemberDetails'}
          component={ReportMemberDetails}
        />
        <Stack.Screen name={'InviteUser'} component={InviteUser} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ChatNavigator;
