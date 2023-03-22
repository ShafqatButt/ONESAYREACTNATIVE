// noinspection ES6CheckImport

import React, {useContext, useState, useEffect} from 'react';
import {View, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import {Spacer} from '../../../../res/spacer';
import {
  GlobalFlex,
  MainTitle,
  SubContainer,
} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {
  POST,
  POST_MULTIPART,
  PUT_MULTIPART,
} from '../../../../api_helper/ApiServices';
import {styles, Text} from './style';
import {AuthContext} from '../../../../context/Auth.context';
import {colors} from '../../../../res/colors';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import {
  CATEGORY_ID,
  POST_FILE_UPLOAD,
  VENDOR,
} from '../../../../api_helper/Api';
import {Input} from '../../../../components/Input';
import {Button} from '../../../../components/Button';
import CategoryPictureComponent from '../CategoryPictureComponent';
import {CATEGORY} from '../../../../api_helper/Api';
import {compressImage} from '../../../../uikit-app';
import {images} from '../../../../res/images';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ActionMenu, useToast} from '@sendbird/uikit-react-native-foundation';
import AsyncStorage from '@react-native-community/async-storage';
import deviceInfoModule from 'react-native-device-info';
import {
  useLocalization,
  usePlatformService,
} from '@sendbird/uikit-react-native/src';
import {launchCamera} from 'react-native-image-picker';
import {LoadingSpinner, Palette} from '@sendbird/uikit-react-native-foundation';
import Strings from '../../../../string_key/Strings';

export default AddCategory = props => {
  const {is_edit} = props.route.params;
  const {onClearLength} = props.route.params;

  const {category_id} = props.route.params;
  const {category} = props.route.params;
  const {category_image} = props.route.params;

  const [visible, setVisible] = useState(false);
  const [categoryImage, setCategoryImage] = useState(category_image || null);

  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;
  const [title, setTitle] = useState(category || '');
  const [isLoad, setIsLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {navigation, params} = useAppNavigation();

  const toast = useToast();
  const {STRINGS} = useLocalization();
  const {fileService} = usePlatformService();

  async function uploadImageAndUpdateUserData(compressed) {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('file', compressed);
    POST_MULTIPART(POST_FILE_UPLOAD, userData.token, fd, (res, e) => {
      setIsLoading(false);
      if (!e) {
        setCategoryImage(res?.link);
      } else {
        console.log('res (error) ===> ', res);
      }
    });
  }

  const onSubmit = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    const company_id = await AsyncStorage.getItem('company_id');
    if (title === '') {
      toast.show('please enter category title');
    } else {
      if (is_edit) {
        const userData = await AsyncStorage.getItem('userDetails');
        let postData = {
          category: title,
          company_id: JSON.parse(userData).vendorId + '',
          status: 'A',
          imageUrl: categoryImage,
        };
        PUT_MULTIPART(
          CATEGORY_ID(category_id),
          JSON.parse(userData).token,
          postData,
          async data => {
            if (data) {
              if (data?.category_id) {
                onClearLength();
                navigation.goBack();
                setTimeout(() => {
                  toast.show('Category updated successfully');
                }, 200);
              } else {
                toast.show(data);
              }
            }
          },
        );
      } else {
        setIsLoad(true);
        let postData = {
          category: title,
          company_id: company_id,
          imageUrl: categoryImage,
        };
        POST(CATEGORY, true, userData.token, uniqueID, postData, async data => {
          setIsLoad(false);
          if (data) {
            navigation.goBack();
          }
        });
      }
    }
  };

  return (
    <GlobalFlex>
      <>
        <BackHeader
          textColor={{color: colors.DARK_GRAY}}
          isRightText={false}
          onBackPress={() => {
            props.navigation.goBack();
          }}
          is_center_text
          title={is_edit ? Strings.edit_category : Strings.add_category}
        />
        <Spacer space={hp(0.6)} />
        <View style={styles.borderView} />
      </>
      <SubContainer>
        <Spacer space={hp(1)} />
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <CategoryPictureComponent
            resizeMode={'cover'}
            source={
              categoryImage && categoryImage != ''
                ? {uri: categoryImage}
                : images.categories
            }
            onPressed={() => {
              setVisible(!visible);
            }}
          />
          <Spacer space={hp(2)} />
          <Input
            value={title}
            onChange={setTitle}
            placeholder={Strings.category_title}
            style={{paddingBottom: wp(2)}}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />
          <Spacer space={hp(1.5)} />
          <Button
            isLoading={isLoad}
            buttonText={is_edit ? Strings.update : Strings.save}
            buttonPress={() => onSubmit()}
          />
        </ScrollView>
        {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
      </SubContainer>

      <ActionMenu
        onHide={() => {
          setVisible(false);
        }}
        onDismiss={() => {
          setVisible(false);
        }}
        visible={visible}
        title={Strings.choose_image}
        menuItems={[
          {
            title: Strings.take_photo,
            onPress: async () => {
              let file;
              const result = await launchCamera({
                mediaType: 'photo',
                maxHeight: 1080,
                maxWidth: 1080,
                quality: 1,
              });

              if (result.errorCode === 'permission') {
                alert({
                  title: Strings.allow_permission,
                  message: STRINGS.DIALOG.ALERT_PERMISSIONS_MESSAGE(
                    'camera',
                    'UIKitSample',
                  ),
                  buttons: [
                    {
                      text: Strings.cap_settings,
                      onPress: () => SBUUtils.openSettings(),
                    },
                  ],
                });
              } else if (
                result.errorCode === 'camera_unavailable' ||
                result.errorCode === 'others'
              ) {
                toast.show(Strings.error_open_camera, 'error');
              } else if (result.didCancel) {
                // Cancel
              } else {
                const {fileName, uri, width, height, fileSize, type} =
                  result.assets[0];

                file = {
                  name: fileName,
                  size: fileSize,
                  type: type,
                  uri: uri,
                };
              }
              console.log('photo ==> ', file);
              if (!file) {
                return;
              }

              let compressed = null;

              try {
                compressed = await compressImage(file);
              } catch (e) {
                console.log('my error ==> ', e.message, file);
                Alert.alert('Error', Strings.error_upload_image);
              }

              if (!compressed) {
                return;
              }

              await uploadImageAndUpdateUserData(compressed);
            },
          },
          {
            title: Strings.choose_photo,
            onPress: async () => {
              const files = await fileService.openMediaLibrary({
                selectionLimit: 1,
                mediaType: 'photo',
                onOpenFailureWithToastMessage: () =>
                  toast.show(Strings.error_open_photo_lib, 'error'),
              });
              if (!files || !files[0]) {
                return;
              }

              let compressed = null;

              try {
                compressed = await compressImage(files[0]);
              } catch (e) {
                console.log('my error ==> ', e.message, files);
                Alert.alert('Error', Strings.error_upload_image);
              }

              if (!compressed) {
                return;
              }

              await uploadImageAndUpdateUserData(compressed);
            },
          },
        ]}
      />

      {isLoading && (
        <LoadingSpinner
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignSelf: 'center',
            width: wp(100),
            height: hp(60),
          }}
          size={40}
          color={Palette.primary300}
        />
      )}
    </GlobalFlex>
  );
};
