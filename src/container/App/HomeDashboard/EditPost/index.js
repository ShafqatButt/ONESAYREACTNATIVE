// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {TouchableOpacity, View, FlatList, ScrollView} from 'react-native';
import {Spacer} from '../../../../res/spacer';
import {GlobalFlex} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {
  POST_MULTIPART,
  PUT_MULTIPART,
} from '../../../../api_helper/ApiServices';
import {COMUNITY_POST_BY_ID, POST_FILES} from '../../../../api_helper/Api';
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
import Strings from '../../../../string_key/Strings';

let f_array = [];
let file_data = [];

export default EditPost = props => {
  const {post_data} = props.route.params;
  const [inputLine, setInputLine] = useState(post_data?.content);

  const [fileData, setFileData] = useState([]);
  const [visible, setVisible] = useState(false);

  const [filesArray, setFilesArray] = useState([]);
  const [sRandom, setRandom] = useState(Math.random());

  const [loading, setLoading] = useState(false);
  const {fileService} = usePlatformService();

  const toast = useToast();

  useEffect(() => {
    setFileData(post_data?.images);
  }, [post_data]);

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
          setFileData([...fileData, ...file_data]);
        });
      }
    });
  };

  const onUpdatePost = async () => {
    if (inputLine == null) {
      alert(Strings.please_enter_content);
    } else {
      let postData = {
        content: inputLine,
        images: fileData,
      };
      const userData = await AsyncStorage.getItem('userDetails');
      PUT_MULTIPART(
        COMUNITY_POST_BY_ID(post_data?.id),
        JSON.parse(userData).token,
        postData,
        async data => {
          if (data) {
            file_data = [];
            f_array = [];
            props.navigation.goBack();
            setTimeout(() => {
              toast.show(Strings.post_update_success);
            }, 350);
          }
        },
      );
    }
  };

  const onRemove = index => {
    var removeFileData = fileData;
    removeFileData.splice(index, 1);
    setFileData(removeFileData);
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
        onNextPress={() => onUpdatePost()}
        rightText={Strings.update}
        isRightText={true}
        onBackPress={() => props.navigation.goBack()}
        is_center_text
        title={Strings.edit_post}
      />
      <Spacer space={hp(1)} />
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{flexDirection: 'row', width: wp(90), alignSelf: 'center'}}>
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
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            style={{
              width: wp(90),
              alignSelf: 'center',
              padding: wp(4),
              backgroundColor: colors.PRIMARY_COLOR,
            }}>
            <Text style={{color: colors.WHITE}}>{Strings.choose_file}</Text>
          </TouchableOpacity>

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
                  f_array.push(file);
                  onPostFile(file);
                  setFilesArray(f_array);
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
          {!loading && fileData.length > 0 && (
            <FlatList
              data={fileData}
              renderItem={({item, index}) => (
                <View
                  key={index}
                  style={{flex: 1, flexDirection: 'column', margin: 2}}>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('PostViewer', {
                        file_url: item.uri,
                        fileType: 'image',
                      })
                    }>
                    <Image
                      style={styles.imageThumbnail}
                      source={{
                        uri: item.src
                          ? item.src
                          : `https://app-us-east-1.t-cdn.net/637e7659c38ca4d56de49d13/posts/${item.code}/${item.meta.name}`,
                      }}
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
