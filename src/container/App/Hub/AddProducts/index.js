import React, {useContext, useState, useEffect} from 'react';
import {View, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import globalStyles, {
  GlobalFlex,
  MainTitle,
  SubContainer,
} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {GET_DATA, POST} from '../../../../api_helper/ApiServices';
import {styles, Text} from './style';
import {AuthContext} from '../../../../context/Auth.context';
import {colors} from '../../../../res/colors';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import {PRODUCT} from '../../../../api_helper/Api';
import {Input} from '../../../../components/Input';
import {Button} from '../../../../components/Button';
import {getLanguageValueFromKey} from '../../../../commonAction';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useToast} from '@sendbird/uikit-react-native-foundation';
import {CATEGORY} from '../../../../api_helper/Api';
import AsyncStorage from '@react-native-community/async-storage';
import deviceInfoModule from 'react-native-device-info';
import RNPickerSelect from 'react-native-picker-select';
import {fonts} from '../../../../res/fonts';
import {useIsFocused} from '@react-navigation/native';
import Strings from '../../../../string_key/Strings';

export default AddProducts = props => {
  const {state: ContextState, logout} = useContext(AuthContext);
  const {userData} = ContextState;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categoryData, setCategoryData] = useState([]);

  const [isLoad, setIsLoad] = useState(false);
  const isFocused = useIsFocused();

  const {navigation, params} = useAppNavigation();

  const toast = useToast();

  const onSubmit = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    const company_id = await AsyncStorage.getItem('company_id');
    if (title === '') {
      toast.show('please enter product name');
    } else if (price === '' || category == 0) {
      toast.show('please enter product price');
    } else if (category === '' || category == 0) {
      toast.show('please select category');
    } else {
      setIsLoad(true);

      let postData = {
        product: title,
        categoryId: parseInt(category),
        price: parseFloat(price),
        company_id: parseInt(company_id),
      };
      // console.log(postData)
      POST(PRODUCT, true, userData.token, uniqueID, postData, async data => {
        // console.log(data)
        setIsLoad(false);
        if (data) {
          navigation.goBack();
          params.onRefresh();
        }
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      getCategoryList();
    }
  }, [isFocused]);

  const getCategoryList = async () => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    var categoryArray = [];
    GET_DATA(CATEGORY, true, userData.token, uniqueID, data => {
      data?.categories.map(val => {
        // console.log(data?.categories)
        categoryArray.push({label: val?.category, value: val?.category_id});
      });
      setCategoryData(categoryArray);
    });
  };

  const onChangeText = text => {
    var match_text = text + '';
    const validated = match_text.match(/^(\d*\.{0,1}\d{0,2}$)/);
    if (validated) {
      setPrice(text);
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
          title={Strings.add_product}
        />
        <Spacer space={hp(0.6)} />
        <View style={styles.borderView} />
      </>
      <SubContainer>
        <Spacer space={hp(1)} />
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <Input
            value={title}
            onChange={setTitle}
            placeholder={Strings.product_name}
            style={{paddingBottom: wp(2)}}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />

          <Input
            value={price}
            onChange={onChangeText}
            returnKeyType={'done'}
            placeholder={Strings.product_price}
            keyboardType={'decimal-pad'}
            style={{paddingBottom: wp(2)}}
            placeholderTextColor={colors.TRIPLET_PLACEHOLDER}
          />

          <Spacer space={hp(0.4)} />

          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              doneText={Strings.done}
              onValueChange={value => setCategory(value)}
              items={categoryData}
              placeholder={{
                label: Strings.select_category,
                value: 0,
                color: colors.TRIPLET_PLACEHOLDER,
              }}
              style={{
                inputAndroid: {
                  fontSize: wp(4.5),
                  fontFamily: fonts.REGULAR,
                  // padding: wp(5),
                  paddingLeft: 0,
                  width: wp(90),
                  color: colors.BLACK,
                },
                placeholder: {
                  color: colors.TRIPLET_PLACEHOLDER,
                },
                ...globalStyles.hideIconsRNPicker,
              }}
              textInputProps={{
                placeholderTextColor: colors.TRIPLET_PLACEHOLDER,
                style: styles.pickerInput,
              }}
              Icon={() => null}
            />
          </View>
          <Spacer space={hp(1.5)} />

          <Button
            isLoading={isLoad}
            buttonText={Strings.save}
            buttonPress={() => onSubmit()}
          />
        </ScrollView>
        {Platform.OS === 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
      </SubContainer>
    </GlobalFlex>
  );
};
