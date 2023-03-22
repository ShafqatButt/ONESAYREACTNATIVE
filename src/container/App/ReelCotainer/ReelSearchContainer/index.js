import React, { useState, useContext, useRef, useEffect } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { colors } from '../../../../res/colors';
import { Spacer } from '../../../../res/spacer';

import { Text, styles, SearchBarContainer, SearchIcon, SearchInput, ClearButton, ClearIcon } from './style';
import { GlobalFlex, GlobalHeader } from '../../../../res/globalStyles';
import { AuthContext } from '../../../../context/Auth.context';
import Reels from '../../../../components/ReelContainer/components/Reels';
import { COMMUNITY_POST_SEARCH } from '../../../../api_helper/Api';
import { GET_DATA } from '../../../../api_helper/ApiServices';
import { BackHeader } from '../../../../components/BackHeader';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import deviceInfoModule from 'react-native-device-info';
import { LoadingSpinner, Palette } from '@sendbird/uikit-react-native-foundation';
import { useIsFocused } from '@react-navigation/core';

const PAGE_LIMIT = 25;

export default ReelSearchContainer = (props) => {

    const { searchParamData } = props.route.params;
    const [HeaderHeight, setHeaderHeight] = useState(0);
    const [postDataSearch, setPostDataSearch] = useState([])
    const { state: authContextState } = useContext(AuthContext);
    const { userData } = authContextState;
    const [isLoading, setIsLoading] = useState(false)
    const isFocused = useIsFocused();


    const wait = (timeout) => { // Defined the timeout function for testing purpose
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    useEffect(() => {
        if (isFocused) {
            setIsLoading(true);
            wait(2000).then(() =>
                getSearchReels(searchParamData, 1)
            );
        }
    }, [searchParamData, isFocused]);



    const getSearchReels = async (query, page_data) => {
        const uniqueID = await deviceInfoModule.getUniqueId();
        console.log(COMMUNITY_POST_SEARCH + `?page=${page_data}&limit=${PAGE_LIMIT}&query=${query}&type=reel`)
        GET_DATA(COMMUNITY_POST_SEARCH + `?page=${page_data}&limit=${PAGE_LIMIT}&query=${query}&type=reel`, true, userData.token, uniqueID, (data) => {
            var videoArray = [];
            var arr = [];
            console.log(data)

            if (data?.message?.includes("C205")) {
                setIsLoading(false);
            } else {
                var v_data = new Promise((resolve, reject) => {
                    videoArray = data?.filter(function (el) { return el.videos.length > 0 });
                    resolve();
                });
                v_data.then(() => {
                    var assign_data = new Promise((resolve, reject) => {
                        let i = 0;
                        videoArray.forEach((arrayItem, index) => {
                            arrayItem.videos[0].src.length > 0 && (i = i + 1, arr.push(Object.assign({ "content": arrayItem.content, "_id": i, "postItem": arrayItem, "counts": arrayItem.counts, "comments": arrayItem.comments, uri: { uri: arrayItem.videos[0].src[0].url } })))
                        });
                        resolve(arr);
                    })
                    assign_data.then((arrdata) => {
                        setIsLoading(false);
                        setPostDataSearch(arrdata)
                    })
                })
            }

        })
    }


    return (
        <>
            <View style={{ backgroundColor: colors.WHITE }}
                onLayout={(event) => {
                    var { height } = event.nativeEvent.layout;
                    setHeaderHeight(height)
                }}
            >
                <BackHeader
                    textColor={{ color: colors.DARK_GRAY }}
                    isRightText={false}
                    onBackPress={() => { props.navigation.goBack() }}
                    is_center_text
                    title={searchParamData + ''}

                />
                <Spacer space={hp(1)} />
            </View>
            <GlobalFlex>
                {
                    isLoading == false && postDataSearch.length > 0 ?
                        <Reels videos={postDataSearch} headerHeight={HeaderHeight} isSearch={true} />
                        :
                        isLoading == false && <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={[{ textAlign: "center" }]}>No Reels Found</Text>
                        </View>
                }

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
        </>
    )
}
