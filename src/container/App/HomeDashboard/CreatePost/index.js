// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {TouchableOpacity, View, FlatList, ScrollView} from 'react-native';
import {Spacer} from '../../../../res/spacer';
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {POST_MULTIPART, POST} from '../../../../api_helper/ApiServices';
import {COMMUNITY_POST, POST_FILES} from '../../../../api_helper/Api';
import {styles, Text} from './style';
import {AuthContext} from '../../../../context/Auth.context';
import {colors} from '../../../../res/colors';
import {compressImage} from '../../../../uikit-app';
import * as Icons from 'react-native-heroicons/solid';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {
  useLocalization,
  usePlatformService,
} from '@sendbird/uikit-react-native/src';
import {
  ActionMenu,
  LoadingSpinner,
  Palette,
  TextInput,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import {
  Icon,
  Image,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import {saveData} from '../../../../res/asyncStorageHelper';
import {images} from '../../../../res/images';
import {fonts} from '../../../../res/fonts';
import Strings from '../../../../string_key/Strings';

let f_array = [];
let file_data = [];

export default CreatePost = props => {
  const [state, setState] = useState({thumbnail: null, loading: true});
  const [inputLine, setInputLine] = useState(null);

  const [fileData, setFileData] = useState(null);
  const [visible, setVisible] = useState(false);

  const [filesArray, setFilesArray] = useState([]);
  const [sRandom, setRandom] = useState(Math.random());

  const [loading, setLoading] = useState(false);
  const {state: ContextState} = useContext(AuthContext);
  const {userData} = ContextState;
  const {fileService} = usePlatformService();
  const {mediaService} = usePlatformService();

  const toast = useToast();

  const fetchThumbnail = async videoFileUrl => {
    const result = await mediaService?.getVideoThumbnail({
      url: videoFileUrl,
      timeMills: 1000,
    });
    setState({loading: false, thumbnail: result?.path ?? null});
  };

  const getFileName = url => {
    return url.substring(url.lastIndexOf('/') + 1);
  };

  const onPostFile = async file_param => {
    const fd = new FormData();
    fd.append('file', file_param);
    const user = await AsyncStorage.getItem('userDetails');
    POST_MULTIPART(POST_FILES, JSON.parse(user).token, fd, data => {
      if (data) {
        var fileSuccess = new Promise((resolve, reject) => {
          file_data.push(
            Object.assign(data, {
              src: data.url,
              meta: {
                name: getFileName(data.url),
                formatType: data?.meta.formatType,
              },
            }),
          );
          resolve();
        });
        fileSuccess.then(() => {
          setLoading(false);
          console.log(file_data);
          setFileData(file_data);
        });
      }
    });
  };

  const onCreatePost = async () => {
    if (inputLine == null) {
      alert(Strings.please_enter_content);
    } else {
      let postData = {
        content: inputLine,
        images: fileData,
      };
      const userDatas = await AsyncStorage.getItem('userDetails');
      const uniqueID = await DeviceInfo.getUniqueId();
      setLoading(() => true);
      POST(
        COMMUNITY_POST,
        true,
        JSON.parse(userDatas).token,
        uniqueID,
        postData,
        async data => {
          setLoading(() => false);
          if (data) {
            file_data = [];
            f_array = [];
            saveData(
              'userDetails',
              Object.assign(JSON.parse(userDatas), {tribeUserId: data.user.id}),
            );
            userData.tribeUserId = data.user.id;
            props.navigation.goBack();
            setTimeout(() => {
              toast.show(Strings.post_added_success);
            }, 350);
          }
        },
      );
    }
  };

  const onRemove = index => {
    var removeFileData = file_data;
    removeFileData.splice(index, 1);
    setFileData(removeFileData);
    var removeImage = filesArray;
    removeImage.splice(index, 1);
    setFilesArray(removeImage);
    setRandom(Math.random());
  };
  const is_Image = type => {
    let v_type = type;
    return v_type.split('/')[0] == 'video' ? 2 : 1;
  };

  return (
    <GlobalFlex>
      <BackHeader
        textColor={{color: colors.BLACK}}
        onNextPress={() => onCreatePost()}
        rightText={Strings.post}
        isRightText={true}
        onBackPress={() => props.navigation.goBack()}
        is_center_text
        title={Strings.create_post}
      />
      <Spacer space={hp(1)} />
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: wp(5),
              marginBottom: wp(2),
              alignItems: 'center',

              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={
                  userData?.avatar?.length > 0
                    ? {uri: userData?.avatar}
                    : images.avatar
                }
                style={{width: wp(10), height: wp(10), borderRadius: wp(10)}}
              />
              <View style={{alignSelf: 'center', marginLeft: wp(1)}}>
                <Text
                  style={{
                    color: colors.BLACK,
                    fontSize: wp(4),
                    textAlign: 'left',
                  }}>
                  {userData?.displayName}{' '}
                </Text>
                <Text
                  style={{
                    color: colors.BLACK,
                    fontSize: wp(3),
                    textAlign: 'left',
                    fontFamily: fonts.MEDIUM,
                  }}>
                  {`@${userData?.username}`}{' '}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Image
                source={images.add_full}
                style={{height: wp(8), width: wp(8), borderRadius: wp(8)}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: wp(96.5),
              alignSelf: 'center',
              marginTop: hp(0.5),
            }}>
            <TextInput
              style={styles.input}
              value={inputLine}
              onChangeText={text => setInputLine(text)}
              multiline={true}
              textAlignVertical={'top'}
              underlineColorAndroid="transparent"
              placeholder={Strings.whats_on_your_mind}
            />
          </View>
          <Spacer space={hp(1)} />
          {/* <TouchableOpacity
            onPress={() => {
              setVisible(!visible);
            }}
            style={{
              alignSelf: 'flex-start',
              width: wp(90),
              alignSelf: 'center',
              padding: wp(4),
              backgroundColor: colors.PRIMARY_COLOR,
            }}>
            <Text style={{color: colors.WHITE}}>Choose File</Text>
          </TouchableOpacity> */}

          <ActionMenu
            onHide={() => setVisible(false)}
            onDismiss={() => setVisible(false)}
            visible={visible}
            title={Strings.choose_file}
            menuItems={[
              {
                title: Strings.take_photo,
                onPress: async () => {
                  const file = await fileService.openCamera({
                    mediaType: 'photo',
                    onOpenFailureWithToastMessage: () =>
                      toast.show(Strings.error_open_camera, 'error'),
                  });
                  if (!file) {
                    return;
                  }
                  setLoading(true);
                  var data = new Promise((resolve, reject) => {
                    var fileSuccess = new Promise(async (resolve, reject) => {
                      const compressed = await compressImage(file);
                      resolve(compressed);
                    });
                    fileSuccess.then(blobdata => {
                      onPostFile(blobdata);
                      f_array.push(blobdata);
                    });

                    resolve(f_array);
                  });
                  data.then(FinalData => {
                    setFilesArray(FinalData);
                  });
                },
              },
              {
                title: Strings.choose_photo,
                onPress: async () => {
                  const files = await fileService.openMediaLibrary({
                    selectionLimit: 5,
                    mediaType: 'photo',
                    onOpenFailureWithToastMessage: () =>
                      toast.show(Strings.error_open_photo_lib, 'error'),
                  });
                  if (!files || !files[0]) {
                    return;
                  }
                  setLoading(true);
                  var data = new Promise((resolve, reject) => {
                    files.map(val => {
                      var fileSuccess = new Promise(async (resolve, reject) => {
                        const compressed = await compressImage(val);
                        resolve(compressed);
                      });
                      fileSuccess.then(blobdata => {
                        onPostFile(blobdata);
                        f_array.push(blobdata);
                      });
                    });
                    resolve(f_array);
                  });
                  data.then(FinalData => {
                    setFilesArray(FinalData);
                  });
                },
              },
            ]}
          />
          <Spacer space={hp(1)} />
          {filesArray.length > 0 && (
            <FlatList
              data={filesArray}
              renderItem={({item, index}) => (
                <View
                  key={index}
                  style={{flex: 1, flexDirection: 'column', margin: 2}}>
                  {is_Image(item.type) == 1 ? (
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('PostViewer', {
                          file_url: item.uri,
                          fileType: 'image',
                        })
                      }>
                      <Image
                        style={styles.imageThumbnail}
                        source={{uri: item.uri}}
                      />
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          right: 5,
                          top: 5,
                          zIndex: 1,
                        }}
                        onPress={() => {
                          onRemove(index);
                        }}>
                        <Icons.XCircleIcon
                          color={colors.HAWKES_BLUE}
                          size={wp(8)}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ) : (
                    (fetchThumbnail(item.uri),
                    (
                      <TouchableOpacity
                        style={{justifyContent: 'center'}}
                        onPress={() =>
                          props.navigation.navigate('PostViewer', {
                            file_url: item.uri,
                            fileType: 'video',
                          })
                        }>
                        <Image
                          source={{uri: state?.thumbnail || null}}
                          style={styles.imageThumbnail}
                          resizeMode={'cover'}
                          resizeMethod={'resize'}
                        />
                        <PlayIcon />
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{width: wp(94), alignSelf: 'center'}}
            />
          )}
        </ScrollView>
        {loading && (
          <LoadingSpinner
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              width: wp(100),
              height: hp(90),
            }}
            size={40}
            color={Palette.primary300}
          />
        )}
      </View>
    </GlobalFlex>
  );
};

const PlayIcon = () => {
  const {colors} = useUIKitTheme();

  return (
    <Icon
      icon={'play'}
      size={18}
      color={colors.onBackground02}
      containerStyle={[
        styles.playIcon,
        {backgroundColor: colors.onBackgroundReverse01},
      ]}
    />
  );
};
