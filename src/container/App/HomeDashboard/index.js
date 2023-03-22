import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  TouchableOpacity,
  Alert,
  Image,
  View,
  ScrollView,
  FlatList,
  ImageBackground,
  RefreshControl,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {colors} from '../../../res/colors';
import {fonts} from '../../../res/fonts';
import {images} from '../../../res/images';
import {Spacer} from '../../../res/spacer';
import {
  MainContainer,
  Text,
  styles,
  SearchBarContainer,
  SearchIcon,
  SearchInput,
  ClearButton,
  ClearIcon,
} from './style';
import {
  GlobalBorder,
  GlobalFlex,
  GlobalHeader,
} from '../../../res/globalStyles';
import {newsData} from '../../../res/data';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDirectNavigation} from '../../../navigations/useDirectNavigation';
import deviceInfoModule from 'react-native-device-info';
import {COMMUNITY_POST, COMMUNITY_POST_SEARCH,PATCH_USER} from '../../../api_helper/Api';
import {GET_DATA,PATCH} from '../../../api_helper/ApiServices';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import ImageSlider from 'react-native-image-slider';
import {SliderBox} from 'react-native-image-slider-box';
import {
  ActionMenu,
  LoadingSpinner,
} from '@sendbird/uikit-react-native-foundation';

import {BorderContainer} from './CreatePost/style';
import {ReelContext} from '../../../context/ReelContext';
import Reels from '../../../components/ReelContainer/components/Reels';
import {AuthContext} from '../../../context/Auth.context';
import Palette from '../../../styles/palette';
import Strings from '../../../string_key/Strings';
import TokenManager from '../../../libs/TokenManager';
import { updateContact } from 'react-native-contacts';



const PAGE_LIMIT = 25;
export default HomeDashboard = props => {
  const isFocused = useIsFocused();
  const [userAction, setUserAction] = useState(false);
  const [globalAction, setGlobalAction] = useState(false);

  const [index, setIndex] = useState(0);
  const {navigation} = useDirectNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [is_search, setIsSearch] = useState(false);

  const [page, setPage] = useState(1);
  const [HeaderHeight, setHeaderHeight] = useState(0);

  const [v_post, setPost] = useState(null);

  

  const {
    state: ContextState,
    actionDeletePost,
    actionPostLike,
    actionPostDisLike,
  } = useContext(ReelContext);
  const {userReelData} = ContextState;

  const {state: authContextState} = useContext(AuthContext);

  const {userData} = authContextState;
  console.log('userData==>>',userData);
  
  const [profileImage, setProfileImage] = useState(
    userData?.avatar || images.avatar,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postData, setPostData] = useState([]);
  const [postDataSearch, setPostDataSearch] = useState([]);
  const [query, setQuery] = useState('');

  const [datamap, setDataMap] = useState([
    {
      id: 0,
      images: images.bg_gray,
      description: 'Me',
    },
    {
      id: 1,
      images: images.story,
      description: 'Films',
    },
    {
      id: 2,
      images: images.story,
      description: 'Films2',
    },
    {
      id: 3,
      images: images.story,
      description: 'Films3',
    },
    {
      id: 4,
      images: images.story,
      description: 'Films4',
    },
    {
      id: 5,
      images: images.story,
      description: 'Films5',
    },
  ]);

  // useEffect(() => {
    
  //   usePushTokenRegistration();
  //   // console.log('usePushTokenRegistration in useEffect==>>');
  // }, []);

  const getPostList = async page_data => {
    setIsLoading(true);
    const uniqueID = await deviceInfoModule.getUniqueId();
    
    GET_DATA(
      COMMUNITY_POST + `?page=${page_data}&limit=${PAGE_LIMIT}`,
      true,
      userData.token,
      uniqueID,
      data => {
        setIsLoading(false);
        if (data?.status && (data?.status == 401 || data?.status == 400)) {
          setPostData([]);
          console.log('errpror,da', data);
          setIsLoading(false);
        } else {
          console.log('succesed home dash', data);
          if (data.length > 0) {
            if (page_data === 1) {
              setPostData(data);
            } else {
              setPostData([...postData, ...data]);
            }
          }
        }
      },
    );
  };
   const getUpdagteUser = async (fcmToken) => {
    console.log('getUpdagteUser',userData)
    const uniqueID = await deviceInfoModule.getUniqueId();
    const fcm = fcmToken;
    const userId = userData.userId;
    let params = {
     fcmToken : fcm
    }
   
PATCH(
    PATCH_USER(userId),
    userData?.token,
      uniqueID,
      params, (res,e) => {
        console.log('res from user token ==>.',res);
        if(e){
          console.log('res==>>',res);
        }else{
          console.log('Patch update FCM token');
        }
      },
    );

   };

   useEffect(() => {
    console.log('calling api for user');


    setTimeout(() => {
      console.log('calling data for user');
      const fetchData = async () => {
        const data = await registerToken();
      }
      // call the function
      fetchData()
        // make sure to catch any error
        .catch(console.error);
    }, 10000);


  }, [userData?.fcmToken]);


   const registerToken = async () => {
    const token = await TokenManager.get();
    console.log(token);
    if (token) {
      switch (token.type) {
        case 'apns':
        case 'fcm': {
          console.log("Token unregistered", token.value)
          getUpdagteUser(token.value);
          break;
        }
        case 'voip': {break;}
      }
    }
  };

   
  const getUserSearchPost = (query, page_data) => {
    setTimeout(async () => {
      const uniqueID = await deviceInfoModule.getUniqueId();
      GET_DATA(
        COMMUNITY_POST_SEARCH +
          `?page=${page_data}&limit=${PAGE_LIMIT}&query=${query}&type=post`,
        true,
        userData.token,
        uniqueID,
        data => {
          if (data.length > 0) {
            setPostDataSearch(data);
          } else {
            setPostDataSearch([]);
          }
        },
      );
    }, 1000);
  };

  const postLike = async post_id => {
    setIsLoading(true);
    actionPostLike(post_id, (data, flag) => {
      setIsLoading(false);
      if (flag == false) {
        getPostList(page);
        getUserSearchPost(query, 1);
      }
    });
  };

  const postDisLike = async post_id => {
    setIsLoading(true);
    actionPostDisLike(post_id, (data, flag) => {
      setIsLoading(false);
      if (flag == false) {
        getPostList(page);
        getUserSearchPost(query, 1);
      }
    });
  };

  const onDeletePost = async () => {
    Alert.alert(Strings.delete_post, Strings.are_you_sure_delete_this_post, [
      {
        text: Strings.yes,
        onPress: () => {
          actionDeletePost(userData?.token, v_post._id, (data, flag) => {
            if (flag == false) {
              getPostList(page);
            }
          });
        },
      },
      {
        text: Strings.no,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    console.log("callinf new data")
    setIsRefreshing(true);
    wait(2000).then(() => setIsRefreshing(false), getPostList(1));
  }, []);

  // useEffect(() => {
  //   if (isFocused) {
  //     getPostList(1);
  //   }
  // }, [isFocused]);

  useEffect(() => {
    console.log('calling apis of the home');
    getPostList(1);
  }, [userData?.token]);
  //#region  News Route
  const Item = ({item}) => (
    <>
      <View style={{...styles.flex_wrapper, width: wp(92)}}>
        <View style={styles.flex_start}>
          <Text
            style={{
              color: colors.TRIPLET_PLACEHOLDER,
              fontSize: wp(3.5),
              fontFamily: fonts.REGULAR,
            }}>
            {Strings.trending}
          </Text>
          <Text style={{fontSize: wp(3.8), fontFamily: fonts.MEDIUM}}>
            {item?.trending}
          </Text>
          <Text
            style={{
              color: colors.TRIPLET_PLACEHOLDER,
              fontSize: wp(3.5),
              fontFamily: fonts.REGULAR,
            }}>
            {item?.tweets + ' ' + Strings.tweets}
          </Text>
        </View>
        <TouchableOpacity style={{alignSelf: 'flex-start', marginTop: wp(2)}}>
          <Image source={images.more_ic} style={{...styles.medium_card_ic}} />
        </TouchableOpacity>
      </View>
      <GlobalBorder />
    </>
  );

  const renderItem = ({item}) => <Item item={item} />;

  const loadMoreData = () => {
    setPage(page + 1);
    getPostList(page + 1);
  };

  const NewsRouts = () => (
    <MainContainer style={{marginTop: -5}}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <ImageBackground
          source={images.bg_search_page}
          style={{height: hp(23), width: wp(100)}}
          resizeMode={'contain'}>
          <View style={{height: hp(23)}}>
            <Text
              style={{
                color: colors.WHITE,
                bottom: wp(12),
                left: wp(2),
                position: 'absolute',
                fontFamily: fonts.REGULAR,
                fontSize: wp(3.8),
              }}>
              Entertainment LIVE
            </Text>
            <Text
              style={{
                color: colors.WHITE,
                bottom: wp(5),
                left: wp(2),
                position: 'absolute',
              }}>
              Last news
            </Text>
          </View>
        </ImageBackground>
        <Spacer space={hp(1)} />
        <View style={{marginHorizontal: wp(4), marginBottom: wp(2)}}>
          <Text style={{fontSize: wp(5), textAlign: 'left'}}>
            {'Useful topics for you'}
          </Text>
        </View>
        <FlatList
          data={newsData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </MainContainer>
  );
  //#endregion

  //#region tranding route
  const FirstRoute = () => (
    <MainContainer>
      <ActionMenu
        onHide={() => {
          setUserAction(false);
        }}
        onDismiss={() => {
          setUserAction(false);
        }}
        visible={userAction}
        title={Strings.tap_options}
        menuItems= { (v_post?.user?._id !== userData?.tribeUserId) ? [
         
          {
            title: Strings.report,
            onPress: async () => {

              console.log("My log data",v_post);
            
              props.navigation.navigate('Report', {isFromPost : true,postId:v_post?._id});
            },
          },
        ]
        :

        [
          {
            title: Strings.edit,
            onPress: async () => {
              navigation.navigate('EditPost', {post_data: v_post});
            },
          },
          {
            title: Strings.delete,
            onPress: async () => {
              onDeletePost();
            },
          },
       
        ]
      
      
      
      }
      />

      <ActionMenu
        onHide={() => {
          setGlobalAction(false);
        }}
        onDismiss={() => {
          setGlobalAction(false);
        }}
        visible={globalAction}
        title={Strings.tap_options}
        menuItems={[
          {
            title: Strings.view,
            onPress: async () => {},
          },
        ]}
      />

      {is_search == false ? (
        postData.length > 0 ? (
          <FlatList
            data={postData}
            bounces={true}
            extraData={postData}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onEndReached={loadMoreData}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  onRefresh();
                }}
              />
            }
            onEndReachedThreshold={0.2}
            ListHeaderComponent={() => (
              <>
                <Spacer space={hp(0.5)} />
              </>
            )}
            // ListHeaderComponent={() =>
            //     <>
            //         <Spacer space={hp(1)} />
            //         <View style={{ flexDirection: "row" }}>
            //             <FlatList
            //                 horizontal
            //                 data={datamap}
            //                 bounces={false}
            //                 showsHorizontalScrollIndicator={false}
            //                 renderItem={({ item }) => <ListItem item={item} />}
            //                 keyExtractor={(item, index) => index}
            //             />
            //         </View>
            //         <Spacer space={hp(2)} />
            //     </>
            // }
            renderItem={({item}) => {
              return (
                <>
                  <>
                    <View style={{...styles.flex_wrapper, width: wp(92)}}>
                      <View style={{flexDirection: 'row'}}>
                        {item?.post.user && (
                          <Image
                            source={{uri: item?.post.user.profile.picture}}
                            resizeMode="cover"
                            style={styles.card_profile}
                          />
                        )}

                        <View style={{alignSelf: 'center'}}>
                          <Text
                            style={{
                              textAlign: 'left',
                              fontFamily: fonts.MEDIUM,
                              fontSize: wp(4),
                            }}
                            numberOfLines={1}>
                            {item?.post?.user
                              ? item?.post.user.profile.username
                              : ''}
                          </Text>
                          <Text
                            style={{
                              textAlign: 'left',
                              marginTop: wp(1),
                              fontFamily: fonts.REGULAR,
                              color: colors.TRIPLET_PLACEHOLDER,
                              fontSize: wp(3.5),
                            }}>
                            {moment(item?.publishedAt).format(
                              'ddd, Do MMM YYYY, h:mm a',
                            )}
                          </Text>
                        </View>
                      </View>

                      {/* {item?.post.user._id !== userData?.tribeUserId && ( */}
                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          {/* <TouchableOpacity>
                                                    <Image source={images.plus_round} style={{ ...styles.medium_card_ic, marginRight: wp(4) }} />
                                                </TouchableOpacity> */}
                          <TouchableOpacity
                            onPress={() => {
                              setPost(item?.post);
                              setUserAction(!userAction);
                            }}>
                            <Image
                              source={images.more_ic}
                              style={{...styles.medium_card_ic}}
                            />
                          </TouchableOpacity>
                        </View>
                      {/* )} */}
                    </View>
                    <Spacer space={hp(1)} />
                    <Text
                      style={{
                        textAlign: 'left',
                        marginLeft: wp(4),
                        fontFamily: fonts.REGULAR,
                        fontSize: wp(4),
                      }}>
                      {item?.post.summary.replace(/<\/?[^>]+(>|$)/g, '')}
                    </Text>
                    <Spacer space={hp(1)} />
                    {item.post.images.length > 0 && (
                      <ImageSlider
                        style={{backgroundColor: 'transparent'}}
                        images={item.post.images}
                        customSlide={({index, item, style, width}) => (
                          <Image
                            source={{
                              uri: item.src
                                ? item.src
                                : `https://app-us-east-1.t-cdn.net/637e7659c38ca4d56de49d13/posts/${item.code}/${item.meta.name}`,
                            }}
                            style={styles.card_image}></Image>
                        )}
                      />
                    )}
                  </>
                  <Spacer space={hp(0.3)} />
                  <View
                    style={{
                      ...styles.flex_wrapper,
                      width: wp(92),
                      paddingVertical: wp(2),
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        item?.post.upvotes.filter(
                          o => o.id === userData?.tribeUserId,
                        ).length > 0
                          ? postDisLike(item?.post.id)
                          : postLike(item?.post.id);
                      }}>
                      <Image
                        source={
                          item?.post.upvotes.filter(
                            o => o.id === userData?.tribeUserId,
                          ).length > 0
                            ? images.balance_ic
                            : images.share_money_ic
                        }
                        style={{width: wp(8), height: wp(8)}}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        {
                          fontSize: wp(3.2),
                          marginLeft: wp(0.5),
                          color: colors.PRIMARY_COLOR,
                          fontFamily: fonts.REGULAR,
                          alignSelf: 'center',
                        },
                      ]}>
                      {item.post.upvotes?.length}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        props.navigation.navigate('PostComment', {
                          item: item?.post,
                        });
                      }}
                      style={{alignSelf: 'center', marginLeft: wp(1)}}>
                      <Image
                        source={images.message_ic}
                        resizeMode={'contain'}
                        style={{
                          width: wp(5),
                          height: wp(5),
                          alignSelf: 'center',
                        }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        {
                          fontSize: wp(3.2),
                          marginLeft: wp(1.5),
                          color: colors.PRIMARY_COLOR,
                          fontFamily: fonts.REGULAR,
                          alignSelf: 'center',
                        },
                      ]}>
                      {item.post.counts?.comments}
                    </Text>
                  </View>
                  <Spacer space={hp(0.5)} />
                  <BorderContainer />
                  <Spacer space={hp(0.8)} />
                </>
              );
            }}
            keyExtractor={(item, index) => index}
          />
        ) : (
          isLoading == false && (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text>{'No post found'}</Text>
            </View>
          )
        )
      ) : postDataSearch.length > 0 ? (
        <FlatList
          data={postDataSearch}
          bounces={false}
          extraData={postDataSearch}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              <Spacer space={hp(0.5)} />
            </>
          )}
          // ListHeaderComponent={() =>
          //     <>
          //         <Spacer space={hp(1)} />
          //         <View style={{ flexDirection: "row" }}>
          //             <FlatList
          //                 horizontal
          //                 data={datamap}
          //                 bounces={false}
          //                 showsHorizontalScrollIndicator={false}
          //                 renderItem={({ item }) => <ListItem item={item} />}
          //                 keyExtractor={(item, index) => index}
          //             />
          //         </View>
          //         <Spacer space={hp(2)} />
          //     </>
          // }
          renderItem={({item}) => {
            return (
              <>
                <>
                  <View style={{...styles.flex_wrapper, width: wp(92)}}>
                    <View style={{flexDirection: 'row'}}>
                      {item?.user && (
                        <Image
                          source={{uri: item?.user.profile.picture}}
                          style={styles.card_profile}
                        />
                      )}

                      <View style={{alignSelf: 'center'}}>
                        <Text
                          style={{
                            textAlign: 'left',
                            fontFamily: fonts.MEDIUM,
                            fontSize: wp(4),
                          }}
                          numberOfLines={1}>
                          {item?.user ? item?.user.profile.username : ''}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'left',
                            marginTop: wp(1),
                            fontFamily: fonts.REGULAR,
                            color: colors.TRIPLET_PLACEHOLDER,
                            fontSize: wp(3.5),
                          }}>
                          {moment(item?.publishedAt).format(
                            'ddd, Do MMM YYYY, h:mm a',
                          )}
                        </Text>
                      </View>
                    </View>

                    {item?.user._id == userData?.tribeUserId && (
                      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                        {/* <TouchableOpacity>
                                                    <Image source={images.plus_round} style={{ ...styles.medium_card_ic, marginRight: wp(4) }} />
                                                </TouchableOpacity> */}

                        <TouchableOpacity
                          onPress={() => {
                            setPost(item);
                            setUserAction(!userAction);
                          }}>
                          <Image
                            source={images.more_ic}
                            style={{...styles.medium_card_ic}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <Spacer space={hp(1)} />
                  <Text
                    style={{
                      textAlign: 'left',
                      marginLeft: wp(4),
                      fontFamily: fonts.REGULAR,
                      fontSize: wp(4),
                    }}>
                    {item?.summary.replace(/<\/?[^>]+(>|$)/g, '')}
                  </Text>
                  <Spacer space={hp(1)} />
                  {item.images.length > 0 && (
                    <ImageSlider
                      style={{backgroundColor: 'transparent'}}
                      images={item.images}
                      customSlide={({index, item, style, width}) => (
                        <Image
                          source={{
                            uri: item.src
                              ? item.src
                              : `https://app-us-east-1.t-cdn.net/637e7659c38ca4d56de49d13/posts/${item.code}/${item.meta.name}`,
                          }}
                          style={styles.card_image}></Image>
                      )}
                    />
                  )}
                </>
                <Spacer space={hp(0.3)} />
                <View
                  style={{
                    ...styles.flex_wrapper,
                    width: wp(92),
                    paddingVertical: wp(2),
                    justifyContent: 'flex-start',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log(item?.upvotes);
                      item?.upvotes.filter(o => o.id === userData?.tribeUserId)
                        .length > 0
                        ? postDisLike(item?.id)
                        : postLike(item?.id);
                    }}>
                    <Image
                      source={
                        item?.upvotes.filter(
                          o => o.id === userData?.tribeUserId,
                        ).length > 0
                          ? images.balance_ic
                          : images.share_money_ic
                      }
                      style={{width: wp(8), height: wp(8)}}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      {
                        fontSize: wp(3.2),
                        marginLeft: wp(1),
                        color: colors.PRIMARY_COLOR,
                        fontFamily: fonts.REGULAR,
                        alignSelf: 'center',
                      },
                    ]}>
                    {item.upvotes?.length}
                  </Text>

                  {/* <TouchableOpacity activeOpacity={0.7} onPress={() => { postDisLike(item?.id) }}>
                                            <Image source={images.balance_ic} style={{ width: wp(8), height: wp(8) }} />
                                        </TouchableOpacity>
                                        <Text style={[{ fontSize: wp(3.2), marginLeft: wp(1), color: colors.PRIMARY_COLOR, fontFamily: fonts.REGULAR, alignSelf: 'center' }]}>{item.downvotes?.length}</Text> */}

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      props.navigation.navigate('PostComment', {item: item});
                    }}
                    style={{alignSelf: 'center', marginLeft: wp(1)}}>
                    <Image
                      source={images.message_ic}
                      resizeMode={'contain'}
                      style={{width: wp(5), height: wp(5), alignSelf: 'center'}}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      {
                        fontSize: wp(3.2),
                        marginLeft: wp(1.5),
                        color: colors.PRIMARY_COLOR,
                        fontFamily: fonts.REGULAR,
                        alignSelf: 'center',
                      },
                    ]}>
                    {item.counts?.comments}
                  </Text>
                </View>
                <Spacer space={hp(0.5)} />
                <BorderContainer />
                <Spacer space={hp(0.8)} />
              </>
            );
          }}
          keyExtractor={(item, index) => index}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text>{'No search found'}</Text>
        </View>
      )}
    </MainContainer>
  );

  const ListItem = ({item}) => {
    return (
      <TouchableOpacity style={{paddingHorizontal: wp(3)}}>
        {item.id == 0 && (
          <Image source={images.plus_small} style={styles.add_new} />
        )}
        <Image source={item.images} style={{width: wp(16), height: wp(16)}} />
        <Text
          style={{
            fontSize: wp(3.5),
            marginTop: wp(2),
            fontFamily: fonts.REGULAR,
          }}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView style={{backgroundColor: 'white'}} />
      {props.route.params.isHome ? (
        <View style={{height: hp(4.5), backgroundColor: 'white'}} />
      ) : (
        <GlobalHeader
          onLayout={event => {
            var {height} = event.nativeEvent.layout;
            setHeaderHeight(height);
          }}>
          <View style={styles.HeaderWrapper}>
            {!is_search && (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{marginLeft: wp(5)}}>
                  <Image
                    source={
                      userData?.avatar ? {uri: userData?.avatar} : images.avatar
                    }
                    style={styles.menu_avatar}
                  />
                </TouchableOpacity>

                <View style={styles.header_title}>
                  <Text>Discover</Text>
                </View>
                <View style={styles.header_flex_wrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      setPostDataSearch([]),
                        setTimeout(() => {
                          setIsSearch(!is_search);
                        }, 100);
                    }}
                    activeOpacity={0.7}
                    style={{alignSelf: 'center'}}>
                    <Image
                      style={styles.header_icon_ic}
                      resizeMode={'contain'}
                      source={images.search_blue}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{alignSelf: 'center'}}>
                    <Image
                      style={styles.header_icon_ic}
                      resizeMode={'contain'}
                      source={images.notication_blue}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {is_search && (
              <View
                style={{
                  marginHorizontal: wp(5),
                  flexDirection: 'row',
                }}>
                <SearchBarContainer>
                  <View style={{width: wp(10), alignSelf: 'center'}}>
                    <SearchIcon
                      style={styles.searchIconStyle}
                      source={images.search_ic}
                    />
                  </View>
                  <SearchInput
                    autoFocus={true}
                    value={query}
                    placeholder={'Search'}
                    placeholderTextColor={'#7b7d83'}
                    onChangeText={val => {
                      setQuery(() => val),
                        val.length > 0 && getUserSearchPost(val, 1);
                    }}
                  />
                  <ClearButton
                    disabled={query.length <= 0}
                    isActive={query.length > 0}
                    onPress={() => {
                      setQuery(() => ''), setIsSearch(!is_search);
                    }}>
                    <ClearIcon source={images.iconDecline_3x} />
                  </ClearButton>
                </SearchBarContainer>

                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    setQuery(() => ''), setIsSearch(!is_search);
                  }}>
                  <Text
                    style={{
                      fontSize: wp(3.8),
                      fontFamily: fonts.REGULAR,
                      marginHorizontal: 0,
                    }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Spacer space={hp(0.8)} />
          <View
            style={{
              ...styles.flex_wrapper,
              borderBottomWidth: wp(1),
              borderBottomColor: colors.PAINT_BORDER,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIndex(0);
              }}
              style={{
                ...styles.tab_wrapper,
                borderBottomColor:
                  index == 0 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
                borderBottomWidth: index == 0 ? wp(0.5) : 0,
              }}>
              <Text
                style={[
                  {
                    fontSize: wp(3.8),
                    color: index == 0 ? colors.PRIMARY_COLOR : colors.BLACK,
                  },
                ]}>
                For You
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIndex(1);
              }}
              style={{
                ...styles.tab_wrapper,
                borderBottomColor:
                  index == 1 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
                borderBottomWidth: index == 1 ? wp(0.5) : 0,
              }}>
              <Text
                style={[
                  {
                    fontSize: wp(3.8),
                    color: index == 1 ? colors.PRIMARY_COLOR : colors.BLACK,
                  },
                ]}>
                Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIndex(2);
              }}
              style={{
                ...styles.tab_wrapper,
                borderBottomColor:
                  index == 2 ? colors.PRIMARY_COLOR : colors.PAINT_BORDER,
                borderBottomWidth: index == 2 ? wp(0.5) : 0,
              }}>
              <Text
                style={[
                  {
                    fontSize: wp(3.8),
                    color: index == 2 ? colors.PRIMARY_COLOR : colors.BLACK,
                  },
                ]}>
                News
              </Text>
            </TouchableOpacity>
          </View>
        </GlobalHeader>
      )}

      <GlobalFlex>
        {FirstRoute()}
        {/* {index == 0 ? (
          FirstRoute()
        ) : index == 1 ? (
          userReelData.length > 0 ? (
            <Reels
              videos={userReelData}
              headerHeight={HeaderHeight}
              my_reels={true}
              isSearch={false}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={[{textAlign: 'center'}]}>No Reels Found</Text>
            </View>
          )
        ) : (
          FirstRoute()
        )} */}

        {/*{index != 1 && (
          <TouchableOpacity
            style={styles.float_wrapper}
            onPress={() => {
              navigation.navigate('CreatePost');
            }}>
            <Image source={images.add_full} style={styles.float_add_ic} />
          </TouchableOpacity>
        )}*/}

        {postData.length < 1 && isLoading && !isRefreshing && (
          <LoadingSpinner
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              width: wp(100),
              height: hp(65),
            }}
            size={60}
            color={Palette.primary300}
          />
        )}
      </GlobalFlex>
    </>
  );
};
