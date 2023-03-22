import {Alert, Platform} from 'react-native';
import {Image} from 'react-native-compressor';
import RNFetchBlob from 'rn-fetch-blob';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export {default as GroupChannelTabs} from './GroupChannelTabs';
export {default as GroupChannelScreen} from './GroupChannelScreen';
export {default as GroupChannelSettingsScreen} from './GroupChannelSettingsScreen';
export {default as GroupChannelCreateScreen} from './GroupChannelCreateScreen';
export {default as GroupChannelInviteScreen} from './GroupChannelInviteScreen';
export {default as GroupChannelMembersScreen} from './GroupChannelMembersScreen';
export {default as GroupChannelOperatorsScreen} from './GroupChannelOperatorsScreen';
export {default as GroupChannelOperatorPermissionsScreen} from './GroupChannelOperatorPermissionsScreen';

// @ts-ignore
// eslint-disable-next-line
Array.prototype.unique = function () {
  let a = this.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
};

Date.prototype.addDays = function (days) {
  let dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
};

export const removeSpecialCharacters = str => {
  const regex = /[^\w\+]/g;
  return str.replace(regex, '');
};

export const getChannelWithCustomType = channel => {
  if (!channel.isDistinct && !channel.isSuper) {
    // Group
    return {
      ...channel,
      customType: CONST_TYPES.ROOM_GROUP,
    };
  } else if (channel.isPublic) {
    // Channel
    return {
      ...channel,
      customType: CONST_TYPES.ROOM_CHANNEL,
    };
  } else {
    // Direct
    return {
      ...channel,
      customType: CONST_TYPES.ROOM_DIRECT,
    };
  }
};

export const underDevelopment = (message?: string) =>
  Alert.alert('', message || 'Under Development!');

export const CONST_TABS = {
  ALL: 'All',
  GROUP: 'Group',
  CHANNEL: 'Channel',
};

export const CONST_REPORT_TYPE = {
  USER: 'user',
  CHANNEL: 'channel',
};

export const CONST_TYPES = {
  ROOM_ALL: 'ALL',
  ROOM_DIRECT: 'DIRECT',
  ROOM_GROUP: 'GROUP',
  ROOM_CHANNEL: 'CHANNEL',
};

export const getSearchParamsFromURL = url => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    _params = {},
    match;
  while ((match = regex.exec(url))) {
    _params[match[1]] = match[2];
  }

  return _params;
};

export const createChannelInviteLink = async channel => {
  const searchParams = new URLSearchParams();
  searchParams.append('url', channel.url);
  searchParams.append('channelName', channel.name);
  searchParams.append('type', 'joinSuperGroup');

  return await dynamicLinks().buildShortLink({
    link: 'https://www.onesay.app' + '?' + searchParams,
    // Platform.OS === 'android'
    //   ? 'https://www.buzzmi.app'
    //   : 'https://buzzmi.page.link' + '?' + searchParams,
    domainUriPrefix: 'https://buzzmi.page.link',
    ios: {
      bundleId: 'com.app.buzzmi',
      appStoreId: '1616151447',
      minimumVersion: '1.0',
    },
    android: {
      packageName: 'com.app.buzzmi',
      minimumVersion: '1',
    },
    social: {
      title: channel.name,
      descriptionText: 'Buzzmi channel Invite',
      imageUrl:
        'https://trivabucket.s3.amazonaws.com/ce256bfc-0f8d-4ff0-892a-8e551dd7ba5d-Image%403x.png',
    },
  });
};

export const makeAudioPath = name =>
  Platform.OS === 'android'
    ? RNFetchBlob.fs.dirs.SDCardDir +
      `/Android/media/com.app.buzzmi/Buzzmi/Media/${name}`
    : `${RNFetchBlob.fs.dirs.CacheDir}/${name}`;

export const downloadFile = (url, fileName) => {
  const {config, fs} = RNFetchBlob;
  const downloads =
    Platform.OS === 'android'
      ? fs.dirs.SDCardDir + '/Android/media/com.app.buzzmi/Buzzmi/Media'
      : fs.dirs.CacheDir;
  return config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache: true,
    overwrite: true,
    path: downloads + '/' + fileName,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: false,
      path: downloads + '/' + fileName,
    },
  }).fetch('GET', url);
};

export const deleteFile = (path, callback = null) => {
  const {fs} = RNFetchBlob;
  checkFileExists(path, exists => {
    if (exists) {
      fs.unlink(path)
        .then(_res => {
          console.log('File deleted!');
          if (callback) {
            callback();
          }
        })
        .catch(e => console.log('error while deleting file => ', e.message));
    } else {
      console.log('File not found!');
      callback();
    }
  }).then();
};

export const checkFileExists = (path, callback) =>
  RNFetchBlob.fs
    .exists(path)
    .then(callback)
    .catch(e => console.log('error => ', e.message));

export const compressImage = async image => {
  let compressed = image;

  console.log('image ===> ', image);

  const result = await Image.compress(image.uri, {
    // maxWidth: 500,
    // quality: 0.8,
    compressionMethod: 'auto',
  });

  try {
    const stats = await RNFetchBlob.fs.stat(result.replace('file:///', ''));

    console.log('Recorder file stats => ', stats);

    compressed = {
      name: stats.filename,
      size: stats.size,
      type: image.type,
      uri: result,
    };

    console.log('result ===> ', compressed);
  } catch (e) {
    console.log('Recorder file path => ', e.message);
  }

  return compressed;
};
