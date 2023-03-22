import React, { useContext, useState, useEffect } from 'react';
import {
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { Spacer } from '../../../../res/spacer';
// style themes and components
import {
    GlobalFlex,
    SubContainer,
} from '../../../../res/globalStyles';
import { BackHeader } from '../../../../components/BackHeader';
import { GET_DATA, POST } from '../../../../api_helper/ApiServices';
import { styles, Text, BorderContainer } from './style';
import { AuthContext } from '../../../../context/Auth.context';
import { colors } from '../../../../res/colors';
// Third Party library
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { LoadingSpinner, Palette } from '@sendbird/uikit-react-native-foundation';
import { Image } from '@sendbird/uikit-react-native-foundation';
import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import deviceInfoModule from 'react-native-device-info';
import { ORDER, USER_ORDER } from '../../../../api_helper/Api';
import { images } from '../../../../res/images';
import { useIsFocused } from '@react-navigation/native';
import { fonts } from '../../../../res/fonts';
import moment from 'moment';

const PAGE_LIMIT = 10;
export default MyOrder = props => {
    const { state: ContextState, logout } = useContext(AuthContext);
    const { userData } = ContextState;
    const { navigation, params } = useAppNavigation();
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderdata] = useState([]);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (isFocused) {
            getOrderList(page);
        }
    }, [isFocused]);

    const getOrderList = async page_data => {
        setLoading(true)
        const uniqueID = await deviceInfoModule.getUniqueId();
        let queryParam = `?page=${page_data}&limit=${PAGE_LIMIT}`;
        GET_DATA(USER_ORDER + queryParam, true, userData.token, uniqueID, data => {
            setLoading(false)
            if (data?.length > 0) {
                if (page_data === 1) {
                    setOrderdata(data);
                    console.log(JSON.stringify(data))
                } else {
                    setOrderdata([...orderData, ...data]);
                }
            }
        });
    };

    const loadMoreData = () => {
        setPage(page + 1);
        getOrderList(page + 1);
    };


    return (
        <GlobalFlex>
            <>
                <BackHeader
                    textColor={{ color: colors.DARK_GRAY }}
                    onBackPress={() => {
                        props.navigation.goBack();
                    }}
                    is_center_text
                    title={'My Orders'}
                />
                <Spacer space={hp(1)} />
                <View style={styles.borderView} />
            </>
            <SubContainer style={[{ width: wp(100) }]}>
                <Spacer space={hp(0.6)} />
                {orderData.length > 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={orderData}
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.2}
                        keyExtractor={item => `${item.order_id}`}
                        renderItem={({ item }) => (
                            <>
                                <Spacer space={hp(0.2)} />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        paddingVertical: wp(2),
                                        paddingHorizontal: wp(4)
                                    }}>


                                    <View style={{ width: wp(90) }}>
                                        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}><Text style={styles.postTitle}>{"OrderID : "} <Text style={{ fontFamily: fonts.REGULAR }}>{item?.order_id}</Text></Text>
                                            <Text style={[styles.postTitle, { fontSize: wp(3.2) }]}>{"OrderDate : "} <Text style={{ fontFamily: fonts.REGULAR }}>{moment(item?.timestamp * 1000).format('L')}</Text></Text>
                                        </View>

                                        <Text style={styles.postTitle}>{"Product Name: "}
                                            {
                                                Object.entries(item?.products).map(([key, val]) => {
                                                    return (<Text style={{ fontFamily: fonts.REGULAR }}>{val?.product}</Text>)
                                                })
                                            }
                                        </Text>
                                        <Text style={styles.postTitle}>{"Phone : "} <Text style={{ fontFamily: fonts.REGULAR }}>{item?.phone}</Text></Text>
                                        <Text style={styles.postTitle}>{"Amount : "} <Text style={{ fontFamily: fonts.REGULAR }}>{item?.subtotal}</Text></Text>
                                    </View>
                                </View>
                                <Spacer space={hp(0.2)} />
                                <BorderContainer />
                            </>
                        )}
                    />

                    :
                    <View style={{ flex: 1, JustifyContent: 'center' }}>
                        <Text>{"No Order Found"}</Text>
                    </View>
                }
            </SubContainer>

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
