// @ts-ignore
import React, {createContext, useState} from 'react';
import {
  COMMUNITY_POST_LIST_REEL,
  COMMUNITY_REEL_BY_ID,
  COMMUNITY_USER_POST_LIST_REEL,
  COMUNITY_POST_BY_ID,
  POST_VOTE,
} from '../api_helper/Api';
import {DELETE_DATA, GET_DATA, POST_DATA} from '../api_helper/ApiServices';
import AsyncStorage from '@react-native-community/async-storage';
import deviceInfoModule from 'react-native-device-info';

export const ReelContext = createContext(null);
export const ReelProvider = props => {
  const [userReelData, setUserReelData] = useState([]);
  const [globalReelData, setGlobalReelData] = useState([]);

  const [fetchingCommunityReels, setfetchingCommunityReels] = useState(false);

  // const [globalReelData, setGlobalReelData] = useState([]);
  // User Reel Data
  const actionGetUserReels = async () => {
    const user:any = await AsyncStorage.getItem('userDetails');
    const uniqueID = await deviceInfoModule.getUniqueId();
    GET_DATA(
      COMMUNITY_USER_POST_LIST_REEL + '?page=1&limit=100',
      true,
      JSON.parse(user).token,
      uniqueID,
      (data: any) => {

        if (data?.length > 0) {
          var videoArray = [];
          var arr = [];
          var v_data = new Promise((resolve, reject) => {
            videoArray = data?.filter(function (el: any) {
              return el.videos.length > 0;
            });
            resolve();
          });
          v_data.then(() => {
            var assign_data = new Promise((resolve, reject) => {
              let i = 0;
              videoArray.forEach((arrayItem, index) => {
                arrayItem.videos[0].src.length > 0 &&
                  ((i = i + 1),
                  arr.push(
                    Object.assign({
                      content: arrayItem.content,
                      _id: i,
                      postItem: arrayItem,
                      counts: arrayItem.counts,
                      comments: arrayItem.comments,
                      uri: {uri: arrayItem.videos[0].src[0].url},
                    }),
                  ));
              });
              resolve(arr);
            });
            assign_data.then((arrdata: any) => {
              setTimeout(() => {
              setUserReelData(arrdata);
              },1000)
            });
          });
        }
      },);
  };

  // User Reel List
  const actionGetReelList = async () => {
    setfetchingCommunityReels(true);

    const user = await AsyncStorage.getItem('userDetails');
    const uniqueID = await deviceInfoModule.getUniqueId();
    GET_DATA(
      COMMUNITY_POST_LIST_REEL + '?page=1&limit=100',
      true,
      JSON.parse(user).token,
      uniqueID,
      data => {
        if (data?.length > 0) {
          var videoArray = [];
          var arr = [];
          var v_data = new Promise((resolve, reject) => {
            videoArray = data?.filter(function (el) {
              return el.post.videos.length > 0;
            });
            resolve();
          });
          v_data.then(() => {
            var assign_data = new Promise((resolve, reject) => {
              let i = 0;
              videoArray.forEach((arrayItem, index) => {
                arrayItem.post.videos[0].src.length > 0 &&
                  ((i = i + 1),
                  arr.push(
                    Object.assign({
                      content: arrayItem.post.content,
                      _id: i,
                      postItem: arrayItem.post,
                      counts: arrayItem.post.counts,
                      comments: arrayItem.post.comments,
                      uri: {uri: arrayItem.post.videos[0].src[0].url},
                    }),
                  ));
              });
              resolve(arr);
            });
            assign_data.then((arrdata: any) => {
              setGlobalReelData(arrdata);
              // setGlobalReelData([]);
              setfetchingCommunityReels(false);
            });
          });
        }
      },
    );
  };

  const actionAppendReelList = async (newData: any) => {
    setUserReelData(userReelData => [newData, ...userReelData]);
    setGlobalReelData(globalReelData => [newData, ...globalReelData]);
  };

  const actionPostLike = async (post_id: any, callback: any) => {
    const user = await AsyncStorage.getItem('userDetails');
    let postData = {postId: post_id};
    POST_DATA(
      POST_VOTE(post_id),
      JSON.parse(user).token,
      postData,
      (data: any, flag: any) => {
        callback(data, flag);
      },
    );
  };

  const actionPostDisLike = async (post_id: any, callback: any) => {
    const user = await AsyncStorage.getItem('userDetails');
    let postData = {postId: post_id};
    DELETE_DATA(
      POST_VOTE(post_id),
      JSON.parse(user).token,
      (data: any, flag: any) => {
        callback(data, flag);
      },
    );
  };

  const actionDeletePost = async (
    user_token: any,
    post_id: any,
    callback: any,
  ) => {
    let postData = {postId: post_id};
    DELETE_DATA(
      COMUNITY_POST_BY_ID(post_id),
      user_token,
      (data: any, flag: any) => {
        callback(data, flag);
      },
    );
  };

  const actionReelDelete = async (
    user_token: any,
    reel_id: any,
    callback: any,
  ) => {
    DELETE_DATA(
      COMMUNITY_REEL_BY_ID(reel_id),
      user_token,
      (data: any, flag: any) => {
        callback(data, flag);
      },
    );
  };

  const actionClearData = () => {
    setGlobalReelData([]);
    setUserReelData([]);
  };

  return (
    <ReelContext.Provider
      value={{
        state: {
          userReelData,
          fetchingCommunityReels,
          globalReelData,
        },
        actionGetUserReels,
        actionAppendReelList,
        actionGetReelList,
        actionPostLike,
        actionPostDisLike,
        actionDeletePost,
        actionReelDelete,
        actionClearData,
      }}>
      {props.children}
    </ReelContext.Provider>
  );
};
