// noinspection ES6CheckImport

import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  Alert,
  ScrollView,
  Pressable,
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useLocalization,
  usePlatformService,
} from '@sendbird/uikit-react-native/src';
import {
  POST_FILE_UPLOAD,
  PATCH_UPDATE_PROFILE,
  GET_USER_DETAILS_FOR_REFER_CODE,
  POST_USER_MEETINGS,
} from '../../../../api_helper/Api';
import ProfilePictureComponent from '../../Home/Components/ProfilePictureComponent';
import {
  ActionMenu,
  Palette,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import LoadingSpinner from '@sendbird/uikit-react-native-foundation';
import {GET, PATCH, POST_MULTIPART} from '../../../../api_helper/ApiServices';
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils';
import {compressImage, underDevelopment} from '../../../../uikit-app';
import {ChevronWrapper} from '../../../../components/Input/style';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '../../../../context/Auth.context';
import {BackHeader} from '../../../../components/BackHeader';
import styles, {LabelText, PickerContainer} from './style';
import globalStyles, {GlobalFlex} from '../../../../res/globalStyles';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera} from 'react-native-image-picker';
import * as Icons from 'react-native-heroicons/solid';
import Loading from '../../../../components/Loading';
import {Input} from '../../../../components/Input';

import DatePicker from 'react-native-date-picker';
import {Spacer} from '../../../../res/spacer';
import {colors} from '../../../../res/colors';
import {fonts} from '../../../../res/fonts';
import {numOnly} from '../../Events/utils';
import moment from 'moment/moment';
import {getLanguageValueFromKey} from '../../../../commonAction';
import Strings from '../../../../string_key/Strings';

export default EditProfile = props => {
  const {state: ContextState, logout, updateUserData} = useContext(AuthContext);
  // console.log('refered', ContextState?.userData);
  const toast = useToast();
  const {STRINGS} = useLocalization();
  const {fileService} = usePlatformService();

  const [dateOfBirth, setDateOfBirth] = useState(
    moment(ContextState?.userData?.dob).format('MM.DD.YYYY'),
  );
  const [displayName, setDisplayName] = useState(
    ContextState?.userData?.displayName,
  );
  const [username, setUsername] = useState(
    `@${ContextState?.userData?.username}`,
  );
  const [firstName, setFirstName] = useState(ContextState?.userData?.firstName);
  const [isImagePickerVisible, setShowImagePicker] = useState(false);
  const [sponsor, setSponsor] = useState(ContextState?.userData?.referredBy);
  const [lastName, setLastName] = useState(ContextState?.userData?.lastName);
  const [meetingPrice, setMeetingPrice] = useState(
    ContextState?.userData?.meetingPrice + '',
  );
  const [meetingDuration, setMeetingDuration] = useState(
    ContextState?.userData?.meetingDuration + '',
  );
  const [gender, setGender] = useState(ContextState?.userData?.gender);
  const [isLoading, setLoading] = useState(false);
  const [openDob, setOpenDob] = useState(false);
  let refDob = useRef(ContextState?.userData?.dob);
  let refLastDob = useRef(new Date());
  const verifyReferralCode = async code => {
    const url = GET_USER_DETAILS_FOR_REFER_CODE(code);
    try {
      const response = await GET(url, ContextState?.userData?.token, '');
      const _response = response.data;
      return {
        success: true,
        response: _response,
      };
    } catch (e) {
      underDevelopment(Strings.invalid_referral_code);
      // console.log('response (error) => ', e.message);
      return {
        success: false,
        response: e.message,
      };
    }
  };
  useEffect(() => {
    if (ContextState?.userData?.referredBy?.length > 0) {
      setLoading(true);
      verifyReferralCode(ContextState?.userData?.referredBy)
        .then(({response, success}) => {
          setLoading(() => false);
          if (success) {
            const finalSponsorString = `${response?.displayName} (${
              sponsor?.split('-')?.[0]
            })`;
            setSponsor(() => finalSponsorString);
          }
        })
        .catch(e => setLoading(() => false));
    }
  }, []);

  const hasEmojis = text => {
    return (
      text.match(
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
      ) !== null
    );
  };
  const hasSpecialChars = text => {
    return text.match(/[ -/:-@[-`{-~]/) !== null;
  };

  const validateForm = () => {
    const nameReg = /^[A-Za-z]$/;
    const noNumberReg = /^[^0-9]*$/;

    const validateName = name =>
      name.length < 3 ||
      name.length > 20 ||
      hasSpecialChars(name) ||
      hasEmojis(name) ||
      nameReg.test(name) ||
      !noNumberReg.test(name);
    const validateDisplayName = name =>
      name.length < 3 ||
      name.length > 20 ||
      name.includes(' ') ||
      // hasEmojis(name) ||
      hasSpecialChars(name) ||
      nameReg.test(name) ||
      !noNumberReg.test(name);

    const validateDOB = dob =>
      dob.split('-')[0] < 1900 ||
      dob.split('-')[0] > new Date().getFullYear() - 18;

    if (displayName === '') {
      underDevelopment(Strings.please_enter_display_name);
      return true;
    } else if (validateDisplayName(displayName)) {
      Alert.alert(Strings.display_name_should_not);
      return true;
    } else if (firstName === '') {
      underDevelopment(Strings.please_enter_first_name);
      return true;
    } else if (validateName(firstName)) {
      underDevelopment(Strings.please_enter_valid_first_name);
      return true;
    } else if (lastName === '') {
      underDevelopment(Strings.please_enter_last_name);
      return true;
    } else if (validateName(lastName)) {
      underDevelopment(Strings.please_enter_valid_last_name);
      return true;
    } else if (refDob?.current === '') {
      underDevelopment(Strings.please_enter_dob);
      return true;
    } else if (validateDOB(refDob?.current)) {
      underDevelopment(Strings.please_enter_valid_dob);
      return true;
    } else if (gender === '') {
      underDevelopment(Strings.please_select_gender);
      return true;

    } 
    // else if (meetingPrice == 0) {
    //   underDevelopment('Meeting price cannot be 0');
    //   return true;
    // }



    return false;
  };

  async function updateAccountDetails(
    referString: string = '',
    updateRefer: boolean = false,
  ) {
    if (checkEditable() && sponsor?.length > 0 && referString.length < 1) {
      setLoading(() => true);
      const {response, success} = await verifyReferralCode(sponsor);
      setLoading(() => false);
      const sRefer = `${response?.displayName} \n(${response?.referralCode})`;

      if (success) {
        Alert.alert(
          Strings.sponsor_id,
          Strings.are_you_sure_you_want +
            ` ${sRefer} ` +
            Strings.as_your_sponsor +
            '?',
          [
            {
              text: Strings.Cancel,
              style: 'cancel',
              onPress: async () => setSponsor(() => ''),
            },
            {
              text: Strings.okay,
              onPress: async () =>
                updateAccountDetails(response?.referralCode, true),
            },
          ],
          {cancelable: false},
        );
      } else {
        console.log('verifyReferralCode (error) => ', response);
      }
      return;
    }
    const isInvalid = validateForm();

    if (isInvalid) {
      return;
    }
    const url = PATCH_UPDATE_PROFILE(ContextState?.userData?.userId);

    setLoading(() => true);

    let params = {
      gender: gender,
      lastName: lastName,
      dob: refDob?.current,
      firstName: firstName,
      displayName: displayName,
      meetingPrice: parseInt(meetingPrice, 10),
      meetingDuration: parseInt(meetingDuration, 10),
    };

    if (updateRefer) {
      params = {
        ...params,
        referredBy: sponsor,
      };
    }

    PATCH(url, ContextState?.userData?.token, '', params, (response, e) => {
      setLoading(() => false);
      if (!e) {
        let _user = {
          ...ContextState?.userData,
          gender: gender,
          lastName: lastName,
          dob: refDob?.current,
          firstName: firstName,
          displayName: displayName,
          meetingPrice: parseInt(meetingPrice),
          meetingDuration: parseInt(meetingDuration),
        };
        if (updateRefer) {
          _user = {
            ..._user,
            referredBy: referString,
          };
        }
        updateUserData(_user);
        underDevelopment(response.message);
        props.navigation.goBack();
      } else {
        underDevelopment(response);
        console.log('PATCH_UPDATE_PROFILE (error) => ', response);
      }
    });
  }
  async function uploadImageAndUpdateUserData(compressed) {
    const fd = new FormData();
    fd.append('file', compressed);
    setLoading(() => true);
    POST_MULTIPART(
      POST_FILE_UPLOAD,
      ContextState?.userData?.token,
      fd,
      (res, e) => {
        if (!e) {
          const avatarURL = res.link;
          const url = PATCH_UPDATE_PROFILE(ContextState?.userData?.userId);

          PATCH(
            url,
            ContextState?.userData?.token,
            '',
            {
              avatar: avatarURL,
            },
            (response, e) => {
              setLoading(() => false);
              if (!e) {
                const _user = {
                  ...ContextState?.userData,
                  avatar: avatarURL,
                };
                updateUserData(_user);
                underDevelopment(response.message);
                props.navigation.goBack();
              } else {
                underDevelopment(response);
                console.log('PATCH_UPDATE_PROFILE (error) => ', response);
              }
            },
          );
        } else {
          setLoading(() => false);
          console.log('res (error) ===> ', res);
        }
      },
    );
  }
  function checkEditable() {
    console.log(
      'just checking',
      typeof ContextState?.userData?.referredBy !== 'string'
        ? true
        : ContextState?.userData?.referredBy?.length === 0
        ? true
        : false,
    );
    return typeof ContextState?.userData?.referredBy !== 'string'
      ? true
      : ContextState?.userData?.referredBy?.length === 0
      ? true
      : false;
  }

  function _renderGenderPickerLayout() {
    return (
      <>
        <Spacer space={wp(1.5)} />
        <PickerContainer>
          <RNPickerSelect
            value={gender}
            doneText={Strings.done}
            onValueChange={value => setGender(value)}
            items={[
              {label: Strings.male, value: 'M'},
              {label: Strings.female, value: 'F'},
              {label: Strings.other, value: 'O'},
            ]}
            placeholder={
              {
                // label: 'Gender',
                // value: 'Gender',
                // color: colors.TRIPLET_PLACEHOLDER,
              }
            }
            style={{
              inputAndroid: styles.androidPickerStyle,
              placeholder: {
                color: colors.TRIPLET_PLACEHOLDER,
              },
              ...globalStyles.hideIconsRNPicker,
            }}
            textInputProps={{
              placeholderTextColor: colors.TRIPLET_PLACEHOLDER,
              style: styles.pickerStyle,
            }}
            Icon={() => null}
          />
          <ChevronWrapper style={styles.dropArrowStyle}>
            <Icons.ChevronDownIcon color={colors.DARK_GRAY} size={wp(4)} />
          </ChevronWrapper>
        </PickerContainer>
      </>
    );
  }

  return (
    <GlobalFlex>
      <BackHeader
        isRightText
        is_center_text
        rightText={Strings.save}
        title={Strings.account_details}
        onNextPress={() => updateAccountDetails()}
        nextTextStyle={{
          fontFamily: fonts.MEDIUM,
          color: colors.PRIMARY_COLOR,
        }}
        onBackPress={() => props.navigation.goBack()}
      />
      <Spacer space={wp(1.5)} />
      <View
        style={{height: 2, backgroundColor: '#d9dbdf', width: wp('100%')}}
      />
      <ScrollView>
        <Spacer space={wp(1.5)} />
        <ProfilePictureComponent
          withBorder
          resizeMode={'cover'}
          source={ContextState?.userData?.avatar}
          onPressed={() => setShowImagePicker(prevState => !prevState)}
        />
        <LabelText>{Strings.display_name}</LabelText>
        <Input
          value={displayName}
          onChange={setDisplayName}
          // returnKeyType={'done'}
          placeholder={Strings.display_name}
          // editable={isPhoneEditable}
          keyboardType={'email-address'}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
        <LabelText>{Strings.user_Id}</LabelText>
        <Input
          value={username}
          editable={false}
          onChange={setUsername}
          placeholder={Strings.username}
          keyboardType={'email-address'}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
        <LabelText>{Strings.first_name}</LabelText>
        <Input
          value={firstName}
          onChange={setFirstName}
          keyboardType={'default'}
          placeholder={Strings.first_name}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />
        <LabelText>{Strings.last_name}</LabelText>
        <Input
          value={lastName}
          onChange={setLastName}
          keyboardType={'default'}
          placeholder={Strings.last_name}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
        />

        <LabelText>{Strings.sponsor}</LabelText>

        <Input
          value={sponsor}
          onChange={setSponsor}
          returnKeyType={'done'}
          keyboardType={'default'}
          placeholder={Strings.referral_code}
          style={{paddingBottom: wp(2)}}
          placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          editable={checkEditable()}
          onSubmitEditing={event => updateAccountDetails()}
        />
        <LabelText>{Strings.date_of_birth}</LabelText>
        <Pressable onPress={() => setOpenDob(true)}>
          <Input
            value={dateOfBirth}
            is_clickable={true}
            placeholder={Strings.date_of_birth}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
            style={{flex: 1, paddingBottom: wp(2)}}
            mainstyle={{flexDirection: 'row', width: wp(88)}}
          />
          <View
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: 'rgba(255,255,255,0)',
            }}
          />
        </Pressable>
        <LabelText>{Strings.gender}</LabelText>
        {_renderGenderPickerLayout()}
      </ScrollView>
      {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
      <DatePicker
        modal
        open={openDob}
        date={refLastDob.current}
        title={Strings.select_date}
        confirmText={Strings.confirm}
        cancelText={Strings.Cancel}
        mode={'date'}
        onConfirm={date => {
          setOpenDob(false);
          setDateOfBirth(moment(date).format('MM.DD.YYYY'));
          refDob.current = moment(date).toISOString();
          refLastDob.current = date;
        }}
        onCancel={() => setOpenDob(false)}
      />
      <ActionMenu
        onHide={() => setShowImagePicker(() => false)}
        onDismiss={() => setShowImagePicker(() => false)}
        visible={isImagePickerVisible}
        title={Strings.choose_image}
        menuItems={[
          {
            title:
              // STRINGS.GROUP_CHANNEL_SETTINGS.DIALOG_CHANGE_IMAGE_MENU_CAMERA, // Take photo
              Strings.take_photo, // Take photo
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
            title:
              // STRINGS.GROUP_CHANNEL_SETTINGS
              //   .DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY, // Choose photo
              Strings.choose_photo, // Choose photo
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
      <Loading visible={isLoading} />
    </GlobalFlex>
  );
};
