import React, {useContext, useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import {Spacer} from '../../../../res/spacer';
// style themes and components
import {
  GlobalFlex,
  MainTitle,
  SubContainer,
} from '../../../../res/globalStyles';
import {BackHeader} from '../../../../components/BackHeader';
import {GET_DATA, POST} from '../../../../api_helper/ApiServices';
import {styles, Text, BorderContainer} from './style';
import {AuthContext} from '../../../../context/Auth.context';
import {colors} from '../../../../res/colors';
// Third Party library
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSendbirdChat} from '@sendbird/uikit-react-native/src';
import {
  LoadingSpinner,
  Palette,
  useToast,
} from '@sendbird/uikit-react-native-foundation';
import {Image} from '@sendbird/uikit-react-native-foundation';
import {useAppNavigation} from '../../../../hooks/useAppNavigation';
import deviceInfoModule from 'react-native-device-info';
import {POST_ORDER, PRODUCT} from '../../../../api_helper/Api';
import AutoHeightImage from 'react-native-auto-height-image';
import {images} from '../../../../res/images';
import AsyncStorage from '@react-native-community/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {Button} from '../../../../components/Button';
import {fonts} from '../../../../res/fonts';
import {underDevelopment} from '../../../../uikit-app';
import Strings from "../../../../string_key/Strings";

const PAGE_LIMIT = 10;
export default ProductList = props => {
  const {state: ContextState, logout} = useContext(AuthContext);
  const {navigation, params} = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const [productData, setProductdata] = useState([]);
  const isFocused = useIsFocused();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isFocused) {
      getProductList(page);
    }
  }, [isFocused]);

  const getProductList = async page_data => {
    const uniqueID = await deviceInfoModule.getUniqueId();
    let queryParam = `?categoryId=${params.item?.category_id}&page=${page_data}&limit=${PAGE_LIMIT}`;
    GET_DATA(
      PRODUCT + queryParam,
      true,
      ContextState?.userData?.token,
      uniqueID,
      data => {
        console.log('product data');
        console.log(data);
        if (data?.products.length > 0) {
          if (page_data === 1) {
            setProductdata(data?.products);
          } else {
            setProductdata([...productData, ...data?.products]);
          }
        }
      },
    );
  };

  const onCheckVendor = async () => {
    const company_id = await AsyncStorage.getItem('company_id');
    if (company_id == 'null' || company_id == undefined || company_id == null) {
      Alert.alert(
        'Buzzmi',
        "Seems like you don't have vendor account access. Do you want to initiate singup process?",
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              navigation.navigate('VendorSignup');
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      navigation.navigate('AddProducts', {
        onRefresh: () => {
          getProductList(1);
        },
      });
    }
  };

  const loadMoreData = () => {
    setPage(page + 1);
    getProductList(page + 1);
  };

  const handleGetDeal = async product => {
    const productId = parseInt(product?.product_id, 10);

    // console.log(
    //   'ContextState?.userDate?.token ===> ',
    //   ContextState?.userData?.token,
    // );

    setLoading(() => true);
    POST(
      POST_ORDER,
      true,
      ContextState?.userData?.token,
      '',
      {
        product_id: productId,
      },
      (res, e) => {
        setLoading(() => false);
        if (!e) {
          props.navigation.navigate('StripePaymentScreen', {
            siteLink: res?.payment_link,
            orderId: res?.order?.order_id,
            productId: productId,
            isMembershipFlow: false,
          });
        } else {
          underDevelopment(res);
          console.log('PATCH_UPDATE_PROFILE (error) 1===> ', res);
        }
      },
    );
  };

  return (
    <GlobalFlex>
      <>
        <BackHeader
          textColor={{color: colors.DARK_GRAY}}
          // onNextPress={() => onCreatePost()}
          isRightText={false}
          onBackPress={() => {
            props.navigation.goBack();
          }}
          is_center_text
          title={`Buzzmi ${Strings.store}`}
        />
        <Spacer space={hp(1)} />
        <View style={styles.borderView} />
      </>
      <SubContainer style={[{width: wp(100)}]}>
        <Spacer space={hp(0.6)} />
        {productData.length > 0 ? (
          <FlatList
            ListHeaderComponent={() => (
              <View style={{paddingVertical: wp(4)}}>
                <MainTitle
                  style={[
                    {fontSize: wp(5), textAlign: 'left', marginLeft: wp(5)},
                  ]}>
                  {Strings.all_offers}
                </MainTitle>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            data={productData}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.2}
            keyExtractor={item => `${item.product_id}`}
            renderItem={({item}) => (
              <>
                <Spacer space={hp(0.2)} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    paddingVertical: wp(2),
                    justifyContent: 'space-between',
                  }}>
                  <Image
                    source={images.doggy}
                    style={styles.postInnerWrapper}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      width: wp(70),
                      paddingVertical: wp(2),
                      justifyContent: 'space-between',
                    }}>
                    <View style={styles.item}>
                      <Text style={styles.postTitle}>{item?.product}</Text>
                      <Text
                        style={[
                          styles.postTitle,
                          {
                            fontFamily: fonts.MEDIUM,
                            fontSize: wp(3),
                            color: colors.PRIMARY_COLOR,
                          },
                        ]}>
                        {`10% ${Strings.cash_back}`}
                      </Text>
                    </View>

                    <Button
                      btnstyle={{
                        width: wp(24),
                        // height: hp(4),
                        paddingVertical: wp(1),
                      }}
                      txtstyle={{fontSize: wp(3)}}
                      buttonText={`${Strings.get_deal}`}
                      buttonPress={() => handleGetDeal(item)}
                    />
                  </View>
                </View>
                <Spacer space={hp(0.2)} />

                <BorderContainer />
              </>
            )}
          />
        ) : (
          <View style={{flex: 1, JustifyContent: 'center'}}>
            <Text>{Strings.no_product_found}</Text>
          </View>
        )}
      </SubContainer>
      <TouchableOpacity
        style={styles.float_wrapper}
        onPress={() => {
          onCheckVendor();
        }}>
        <Image source={images.add_full} style={styles.float_add_ic} />
      </TouchableOpacity>
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
    </GlobalFlex>
  );
};
