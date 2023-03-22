// noinspection ES6CheckImport

import { Platform } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { DirectRoutes } from '../../navigations/routes';
import { Routes } from '../../libs/navigation';

export const options_modal = {
  presentation: 'modal',
  headerShown: false,
  gestureEnabled: Platform.OS !== 'android',
};

export const options = {
  headerShown: false,
  gestureEnabled: Platform.OS !== 'android',
};

/**
 * Hide Show Tab bar Visibility
 * @param route
 * @returns {boolean}
 */
export const getTabBarVisibility = route => {
  const routeName = getFocusedRouteNameFromRoute(route);
  const hideOnScreens = [
    DirectRoutes.VIDEO_CALLING,
    DirectRoutes.VOICE_CALLING,
    'BannedMembers',
    'ReportedMemberList',
    'ProfileView',
    'ContactCard',
    'Notifications',
    'Setting',
    'Contacts',
    'CreatePost',
    'PostViewer',
    Routes.FileViewer,
    Routes.GroupChannel,
    Routes.GroupChannelSettings,
    Routes.GroupChannelMembers,
    Routes.GroupChannelOperators,
  ];
  return hideOnScreens.indexOf(routeName) <= -1;
};
