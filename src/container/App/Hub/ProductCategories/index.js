import React, { useContext, useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Spacer } from '../../../../res/spacer';
// style themes and components
import {
  GlobalFlex,
  MainTitle,
  SubContainer,
} from '../../../../res/globalStyles';
import { BackHeader } from '../../../../components/BackHeader';
import { DELETE_DATA, DELETE_USER_ACCOUNT, GET_DATA } from '../../../../api_helper/ApiServices';
import { styles, Text } from './style';
import { AuthContext } from '../../../../context/Auth.context';
import { colors } from '../../../../res/colors';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ActionMenu, useToast } from '@sendbird/uikit-react-native-foundation';
import { Image } from '@sendbird/uikit-react-native-foundation';
import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import deviceInfoModule from 'react-native-device-info';
import { CATEGORY, CATEGORY_ID } from '../../../../api_helper/Api';
import AutoHeightImage from 'react-native-auto-height-image';
import { images } from '../../../../res/images';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Strings from "../../../../string_key/Strings";

const PAGE_LIMIT = 10;
export default ProductCategories = props => {
  const [flexOneWidth, setFlexOneWidth] = useState(0);
  const { state: ContextState, logout } = useContext(AuthContext);
  const { userData } = ContextState;
  const { navigation, params } = useAppNavigation();
  const [categoryData, setCategoryData] = useState([]);
  const isFocused = useIsFocused();
  const [userAction, setUserAction] = useState(false);
  const [e_category_id, setECategoryID] = useState(null);
  const [e_category_title, setECategoryTitle] = useState(null);
  const [e_category_image, setECategoryImage] = useState(null);
  const [catItem, setCatItem] = useState(null);

  const [page, setPage] = useState(1);
  const [total_page, setTotalPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (isFocused) {
      getCategoryList(page);
    }else{
      setPage(1)
    }
  }, [isFocused]);

  const getCategoryList = async (page_data) => {
    setRefreshing(true)

    console.log(page_data)
    const uniqueID = await deviceInfoModule.getUniqueId();
    GET_DATA(CATEGORY + `?page=${page_data}&limit=${PAGE_LIMIT}`, true, userData.token, uniqueID, data => {
      setRefreshing(false)
      if(page_data === 1){
        // setCatItem(data.params.total_items);
        setCategoryData(data?.categories);
      } 
      else {
        setCategoryData([...categoryData,...data?.categories])
      }

    });
  };

  onCheckVendor = async () => {
    const company_id = await AsyncStorage.getItem('company_id');
    if (company_id == 'null' || company_id == undefined || company_id == null) {
      Alert.alert(
        'Buzzmi',
        Strings.warn_no_vendor_account,
        [
          {
            text: Strings.no,
            style: 'cancel',
          },
          {
            text: Strings.yes,
            onPress: () => {
              navigation.navigate('VendorSignup');
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      navigation.navigate('AddCategory', { is_edit: false });
    }
  };

  const loadMoreData = () => {
    // if (total_page >= page) {
    //   setPage(page + 1)
    //   getCategoryList(page + 1)
    // }


    if(categoryData.length >= page * PAGE_LIMIT && 
      categoryData.length <= (page+1) * PAGE_LIMIT){
        console.log('Passing category data pagination',page,page+1);
        setPage(page + 1)
        getCategoryList(page + 1)
      }else{
        console.log('Conditions is false')
        
      }

  }


  const onDeleteCategory = async () => {
    Alert.alert(
      Strings.delete_category,
      Strings.warn_delete_category,
      [
        {
          text: Strings.yes,
          onPress: () => {
            DELETE_USER_ACCOUNT(CATEGORY_ID(e_category_id), { "categoryId": e_category_id }, userData.token, (data) => {
              if (data) {
                setPage(1)
                getCategoryList(page)
              }
            })
          },
        },
        {
          text: Strings.no,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );

  }


  const renderFooter = () => {
    if (refreshing) {
      return <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />;
    } else {
      return null;
    }
  };


  const showAlertMessageonLongPress = () =>{
    Alert.alert(
      'Buzzmi',
      Strings.error_only_edit_your_products,
      [
        {
          text: Strings.done,
          style: Strings.Cancel,
        },
      ],
      { cancelable: false },
    );

  };

  return (
    <GlobalFlex>
      <>
        <BackHeader
          textColor={{ color: colors.DARK_GRAY }}
          // onNextPress={() => onCreatePost()}
          isRightText={false}
          showBack={params?.is_parent == false ? true : false}
          onBackPress={() => {
            props.navigation.goBack();
          }}
          is_center_text
          title={Strings.categories}
        />
        <Spacer space={hp(1)} />
        <View style={styles.borderView} />
      </>

      <ActionMenu
        onHide={() => { setUserAction(false) }}
        onDismiss={() => { setUserAction(false) }}
        visible={userAction}
        title={Strings.tap_options}
        menuItems={[
          {
            title: Strings.edit,
            onPress: async () => {
              navigation.navigate('AddCategory', {
                is_edit: true,
                category_id: e_category_id,
                category: e_category_title,
                category_image: e_category_image,
                onClearLength: () => {
                  setCategoryData([])
                },
              });
            },
          },
          {
            title: Strings.delete,
            onPress: async () => {
              onDeleteCategory()
            },
          },
        ]}
      />

      <SubContainer>
        <Spacer space={hp(0.6)} />
        <FlatList
          ListHeaderComponent={() => (
            <View style={{ paddingVertical: wp(4) }}>
              <MainTitle style={[{ fontSize: wp(5), textAlign: 'left' }]}>
                {Strings.all_categories}
              </MainTitle>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          data={categoryData}
          numColumns={2}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.2}
          keyExtractor={(item, index) => index}
          ListFooterComponent={renderFooter}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProductList', { item });
              }}
              onLongPress={() => {
                if (item?.company_id == userData?.vendorId) {
                  setUserAction(!userAction)
                  setECategoryID(item?.category_id)
                  setECategoryTitle(item?.category)
                  setECategoryImage(item?.main_pair)
                }else{
                showAlertMessageonLongPress()
                }
              }}
              delayLongPress={500}
              style={[styles.post]}
              onLayout={event => {
                var { width } = event.nativeEvent.layout;
                setFlexOneWidth(width);
              }}>
              <AutoHeightImage
                resizeMode={"cover"}
                source={item?.main_pair == '' ? images.categories : { uri: item?.main_pair }}
                width={flexOneWidth - 2}
                maxHeight={hp(15)}
                style={styles.postInnerWrapper}
              />
              <View style={styles.item}>
                <Text style={styles.postTitle}>{item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SubContainer>
      <TouchableOpacity
        style={styles.float_wrapper}
        onPress={() => {
          onCheckVendor();
        }}>
        <Image source={images.add_full} style={styles.float_add_ic} />
      </TouchableOpacity>
    </GlobalFlex>
  );
};
