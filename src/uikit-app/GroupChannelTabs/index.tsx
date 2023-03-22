// @ts-ignore
import React from 'react';
import { Platform } from 'react-native';
import ReportMemberDetails from '../../container/App/Chat_call/ReportMemberDetails';
import CreateGroupChannel from '../../container/App/Chat_call/CreateGroupChannel';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserListModal from '../../container/App/Chat_call/UserListModal';
import CreateNext from '../../container/App/Chat_call/CreateNext';
import ReportUser from '../../container/App/Chat_call/ReportUser';
import InviteUser from '../../container/App/Chat_call/InviteUser';
import GroupChannelListScreen from './GroupChannelListScreen';
import Contacts from '../../container/App/Chat_call/Contacts';
import NewChats from '../../container/App/Chat_call/NewChats';
import { options } from '../../navigator/navigators/utils';
import { Routes } from '../../libs/navigation';
import DirectCallHistoryScreen from '../../container/App/CallContainer/DirectCallHistoryScreen';
// import {Icon, useUIKitTheme} from '@sendbird/uikit-react-native-foundation/src';
// import {useTotalUnreadMessageCount} from '@sendbird/uikit-chat-hooks/src';
// import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
// import SettingsScreen from './SettingsScreen';

const Stack = createNativeStackNavigator();

const GroupChannelTabs = () => {
  // const {colors, typography} = useUIKitTheme();
  // @ts-ignore
  // const {sdk} = useSendbirdChat();
  // const totalUnreadMessages = useTotalUnreadMessageCount(sdk);

  return (
    <Stack.Navigator
      initialRouteName={Routes.GroupChannelList}
      screenOptions={{
        headerShown: false,
        // tabBarActiveTintColor: colors.primary,
        // tabBarLabelStyle: typography.caption2,
      }}>
      <Stack.Screen
        name={Routes.GroupChannelList}
        component={GroupChannelListScreen}
        options={
          {
            // tabBarLabel: 'Channels',
            // tabBarStyle: {display: 'none'},
            // tabBarBadge:
            //   totalUnreadMessages === '0' ? undefined : totalUnreadMessages,
            // tabBarIcon: ({color}) => <Icon icon={'chat-filled'} color={color} />,
          }
        }
      />
      <Stack.Screen name={"DirectCallHistory"} options={options} component={DirectCallHistoryScreen} />

      <Stack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: Platform.OS !== 'android',
        }}>
        <Stack.Screen name={'Contacts'} component={Contacts} />
        <Stack.Screen name={'NewChats'} component={NewChats} />
        <Stack.Screen name={'UserListModal'} component={UserListModal} />
        <Stack.Screen name={'CreateGroupChannel'} component={CreateGroupChannel} />
        <Stack.Screen name={'CreateNext'} component={CreateNext} />
        <Stack.Screen name={'ReportUser'} component={ReportUser} options={options} />
        <Stack.Screen
          name={'ReportMemberDetails'}
          component={ReportMemberDetails}
          options={options}
        />
        <Stack.Screen
          name={'InviteUser'}
          component={InviteUser}
          options={options}
        />
      </Stack.Group>

      {/*TODO: Not being used... Need to use/remove this and related code*/}
      {/*<Tab.Screen
        name={Routes.Settings}
        component={SettingsScreen}
        options={{
          tabBarLabel: 'My settings',
          tabBarStyle: {display: 'none'},
          tabBarIcon: ({color}) => (
            <Icon icon={'settings-filled'} color={color} />
          ),
        }}
      />*/}
    </Stack.Navigator>
  );
};

export default GroupChannelTabs;
