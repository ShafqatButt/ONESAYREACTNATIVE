import {
  Route,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { GroupChannelType } from '@sendbird/uikit-react-native/src';
import { Logger, SendbirdChatSDK } from '@sendbird/uikit-utils/src';

import { GetSendbirdSDK } from '../factory';
import { authManager } from './authentication';
import GroupChannelOperatorsScreen from '../uikit-app/GroupChannelOperatorsScreen';

export enum Routes {
  SignIn = 'SignIn',
  Home = 'Home',

  Storybook = 'Storybook',
  Palette = 'Palette',
  ThemeColors = 'ThemeColors',

  GroupChannelTabs = 'GroupChannelTabs',
  GroupChannelList = 'GroupChannelList',
  GroupChannel = 'GroupChannel',
  GroupChannelSettings = 'GroupChannelSettings',
  GroupChannelCreate = 'GroupChannelCreate',
  GroupChannelInvite = 'GroupChannelInvite',
  GroupChannelInviteViaLink = 'GroupChannelInviteViaLink',
  GroupChannelMembers = 'GroupChannelMembers',
  GroupChannelOperators = 'GroupChannelOperators',
  GroupChannelOperatorPermissions = 'GroupChannelOperatorPermissions',
  Settings = 'Settings',
  FileViewer = 'FileViewer',

  Chat = 'Chat_call',
  Contacts = 'Contacts',
  NewChats = 'NewChats',
  UserListModal = 'UserListModal',
  CreateChannel = 'CreateChannel',

  MyOrders = 'MyOrders',
}

export type RouteParamsUnion =
  | {
    route: Routes.SignIn;
    params: undefined;
  }
  | {
    route: Routes.Home;
    params: undefined;
  }
  | {
    route: Routes.Storybook;
    params: undefined;
  }
  | {
    route: Routes.Palette;
    params: undefined;
  }
  | {
    route: Routes.ThemeColors;
    params: undefined;
  }
  | {
    route: Routes.GroupChannelList;
    params: undefined;
  }
  | {
    route: Routes.GroupChannelCreate;
    params: { channelType: GroupChannelType };
  }
  | {
    route: Routes.GroupChannel;
    params: { serializedChannel: object };
  }
  | {
    route: Routes.GroupChannelSettings;
    params: { serializedChannel: object };
  }
  | {
    route: Routes.GroupChannelMembers;
    params: { serializedChannel: object };
  }
  | {
    route: Routes.GroupChannelInvite;
    params: { serializedChannel: object };
  }
  | {
    route: Routes.Chat;
    params: { serializedChannel: object };
  }
  | {
    route: Routes.Contacts;
    params: { serializedChannel: object };
  }
  | {
    route: Routes.Settings;
    params: undefined;
  }
  | {
    route: Routes.GroupChannelTabs;
    params: undefined;
  }
  | {
    route: Routes.FileViewer;
    params: {
      serializedFileMessage: object;
      deleteMessage: () => Promise<void>;
    };
  };

type ExtractParams<R extends Routes, U extends RouteParamsUnion> = U extends {
  route: R;
  params: infer P;
}
  ? P
  : never;
export type RouteParams<R extends Routes> = ExtractParams<R, RouteParamsUnion>;
export type ParamListBase<T extends RouteParamsUnion = RouteParamsUnion> = {
  [k in T['route']]: T extends { route: k; params: infer P } ? P : never;
};

export type RouteProps<
  T extends Routes,
  P extends Record<string, unknown> = Record<string, string>,
  > = {
    navigation: NativeStackNavigationProp<ParamListBase, T>;
    route: Route<T, RouteParams<T>>;
  } & P;

export type ScreenPropsNavigation<T extends Routes> =
  RouteProps<T>['navigation'];
export type ScreenPropsRoute<T extends Routes> = RouteProps<T>['route'];

export const navigationRef = createNavigationContainerRef<ParamListBase>();
export const navigationActions = {
  navigate<T extends Routes>(name: T, params: RouteParams<T>) {
    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute?.name === name) {
        // navigationRef.setParams(params);
        navigationRef.dispatch(StackActions.replace(name, params));
      } else {
        navigationRef.navigate<Routes>(name, params);
      }
    }
  },
  push<T extends Routes>(name: T, params: RouteParams<T>) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name, params));
    }
  },
  goBack() {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    }
  },
};

export const runAfterAppReady = (
  callback: (sdk: SendbirdChatSDK, actions: typeof navigationActions) => void,
) => {
  const id = setInterval(async () => {
    if (navigationRef?.isReady() && GetSendbirdSDK()) {
      const sdk = GetSendbirdSDK();
      if (sdk.getConnectionState() === 'OPEN') {
        clearInterval(id);
        callback(sdk, navigationActions);
      }
    }
  }, 500);
};
