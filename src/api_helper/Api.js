import {APP_ID} from '../container/env';
import {Linking} from 'react-native';
// API Environment
const BE = {
  live: 'https://api-stg.trivacall.com/',
  stagging: 'https://api-demo.trivacall.com/',
  development: 'https://api-dev.onesay.app/',
};

const TOKEN = {
  live: 'a095bcd4c72aca4b857d9e16d08c8745c7523821',
  stagging: '5098447a3b258ba46cb0bb2e9f9899e20bcab273',
  development: '1ba7b10be3ac1bb8f0eab4e7237ee956dbc5a759',
};

// Api common variable
export const serviceID = 'triva';
export const apiVersion = '2';
export const hash_key = 'sam_22@@';

// Base URL and API
export const BASE_URL = BE.development;
export const ACCESS_TOKEN = TOKEN.development;

export const LOGIN = 'v1/auth/login';
export const EXIGO_LOGIN = 'v1/auth/exigo-sso/login'

export const USER = 'v4/users/profile';
export const REGISTER = 'v1/auth/register';
export const EXIGO_REGISTER = 'v1/auth/exigo-sso/register';

export const REGISTER_SOCIAL = 'v1/auth/social/login';
export const LOGIN_SOCIAL = 'v1/auth/social/signin';
export const PATCH_USER = id => `v1/users/${id}`;

// export const NEW_RECOVER_PASSWORD = 'auth/new-recover-password';
export const NEW_RECOVER_PASSWORD = 'v1/auth/recover-password';
export const SERVICES = 'services';

//Categories
export const CATEGORY = 'v1/category';
export const VENDOR = 'v1/vendor';
export const PRODUCT = 'v1/product';
export const ORDER = 'v1/order';
export const CATEGORY_ID = id => `v1/category/${id}`;

export const USER_ORDER = 'v1/user/order';
export const CONTRIBUTORS = 'v1/users/contribution-score';

//Community Services
export const POST_FILES = 'v1/community/upload';
export const COMMUNITY_POST = 'v1/community/post';
export const COMMUNITY_POST_REEL = 'v1/community/reel';
export const COMMUNITY_POST_LIST_REEL = 'v1/community/reel';
export const COMMUNITY_USER_POST_LIST_REEL = 'v1/community/user/reel';
export const GET_DELETE_REASON = 'v1/users/delete-reasons';

export const COMUNITY_POST_BY_ID = id => `v1/community/post/${id}`;
export const POST_VOTE = id => `v1/community/post/${id}/vote`;
export const COMMUNITY_POST_REPORT = id => `v1/community/post/${id}/report`;
export const COMMUNITY_COMMENT_REPORT = id => `v1/community/comment/${id}/report`
export const POST_COMMENT = id => `v1/community/post/${id}/comment`;

export const COMMUNITY_POST_SEARCH = 'v1/community/search';
export const COMMUNITY_REEL_BY_ID = id => `v1/community/reel/${id}`;

export const COMMUNITY_COMMENT_VOTE = id => `v1/community/comment/${id}/vote`;

export const ACTIVITIES = 'v1/users/activities';

export const CHECK_SENDBIRD_USER = 'v1/actions/check-sendbird-user';
export const POST_ORDER = 'v1/order';
export const POST_EVENT_ORDER = 'v1/order/event';
export const POST_FILE_UPLOAD = 'file/upload';
export const POST_CONTACT_US ='v1/contact-us'
export const GET_USER_DETAILS_FOR_REFER_CODE = code =>
  `v1/users/${code}/user-details`;
export const GET_MEMBERSHIPS = (skip = 0, limit = 6) =>
  `v1/membership?skip=${skip}&limit=${limit}`;
export const PATCH_UPDATE_PROFILE = userId => `v1/users/${userId}`;
export const POST_SENDBIRD_OPERATOR_PERMISSION = id =>
  `v1/sendbird-operator-permissions/${id}`;
export const POST_BOOK_1_TO_1_MEETING = 'v1/meeting';
export const POST_CREATE_EVENT_TYPE = 'v1/event';
export const GET_USER_EVENTS_TYPES = 'v1/user/event';
export const GET_ALL_EVENT_TYPES = 'v1/event';
export const GET_EVENT_DETAILS_BY_ID = eventId => `v1/event/${eventId}`;
export const POST_BOOK_MEETING = 'v1/event';
export const PATCH_EVENT_BY_ID = eventId => `v1/event/${eventId}`;
export const GET_USER_MEETINGS = 'v1/event/booked-event';
export const GET_SEND_VERIFY_EMAIL = 'v1/auth/send-verify-email';
export const POST_USER_AVAILABILITY = 'v1/user/availability';
export const GET_USER_AVAILABILITY = (code, dateFrom, dateTo) =>
  `v1/user/${code}/availability?dateFrom=${dateFrom}&dateTo=${dateTo}`;

export const DELETE_ACCOUNT = 'v1/users';

export const DEACTIVATE_ACCOUNT = 'v1/users/deactivate';

export const GET_SEND_OTP = 'v1/auth/send-otp';
export const POST_VERIFY_OTP = 'v1/auth/verify-otp';
export const POST_RESET_PASSWORD = 'v1/auth/reset-password';
export const GET_CONFIRM_EMAIL_VERIFICATION = token =>
  `v1/auth/confirm-email-verification?token=${token}`;
export const GET_MEETING_DETAILS_BY_ID = meetingId => `meeting/${meetingId}`;
export const DELETE_MEETING_BY_ID = meetingId => `meeting/${meetingId}/cancel`;
export const GET_SENDBIRD_OPERATOR_PERMISSION = (
  sendbirdUserId,
  sendbirdChannelId,
) => `v1/sendbird-operator-permissions/${sendbirdUserId}/${sendbirdChannelId}`;
export const INVITE_SEND_BIRD_USER = 'v1/actions/invite';

export const INVITE_LINK = id => `v1/users/${id}/invite-link`;

export const GET_ACTIONS = 'v1/actions/';
export const GET_NOTIFCATIONS_AND_INVITATIONS = 'v1/notification/sendbird/';

export const TERMS_AND_CONDITIONS_LINK = 'https://www.google.com';

export const GET_QR_CODE = user_id => `2fa/${user_id}`;
export const POST_QR_CODE = '2fa/verify-totp';

export const GET_INVITE_LIST = user_id => `v1/users/${user_id}/invite-list`;
export const GET_NETWORK_LIST = user_id => `v1/users/${user_id}/network-list`;
export const GET_WALLETS = 'v1/users/wallet';
export const GET_DASHBOARD = 'v1/dashboard';

export const GET_TRAVEL_PACKAGES = (query: string = '', page: string = '1') =>
  `v1/travel-package?query=${query}&page=${page}&limit=11`;
export const GET_TRAVEL_PACKAGE_DETAILS = package_id =>
  `v1/travel-package/${package_id}`;
export const GET_NOTIFICATIONS = 'v1/notification';

export const UPDATE_NOTIFICATIONS = id => `v1/notification/${id}`;

export const handleLink = (
  url: string = TERMS_AND_CONDITIONS_LINK,
  callback,
) => {
  // TODO: Later replace this with url received in param.
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      if (callback) {
        Linking.openURL(url).then(callback);
      } else {
        Linking.openURL(url);
      }
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  });
};

// SendBird Apis
export const BLOCK_USERS = (current_userid, userids) =>
  `https://api-${APP_ID}.sendbird.com/v3/users/${current_userid}/block?user_ids=${userids}`;
export const POST_BLOCK_USERS = current_userid =>
  `https://api-${APP_ID}.sendbird.com/v3/users/${current_userid}/block`;
export const UN_BLOCK_USERS = current_userid =>
  `https://api-${APP_ID}.sendbird.com/v3/users/${current_userid}/block`;
export const CHANNEL_MUTE_USER = channel_url =>
  `https://api-${APP_ID}.sendbird.com/v3/open_channels/${channel_url}/mute`;
export const GROUP_MUTE_USER = channel_url =>
  `https://api-${APP_ID}.sendbird.com/v3/group_channels/${channel_url}/mute`;
export const REPORT_USER = offending_user_id =>
  `https://api-${APP_ID}.sendbird.com/v3/report/users/${offending_user_id}`;
export const REPORT_CHANNEL = (channel_type, channel_url) =>
  `https://api-${APP_ID}.sendbird.com/v3/report/${channel_type}/${channel_url}`;

//Firebase Notification send
export const FCM_SEND = 'https://fcm.googleapis.com/fcm/send';
