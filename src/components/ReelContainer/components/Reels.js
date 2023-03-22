import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, RefreshControl} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {IS_IPHONE_X} from '../../../constants';

import ReelCard from './ReelCard';
const ScreenHeight = Dimensions.get('window').height;

function Reels({
  videos,
  backgroundColor = 'black',
  headerTitle,
  headerIconName,
  headerIconColor,
  headerIconSize,
  headerIcon,
  headerComponent,
  onHeaderIconPress,
  optionsComponent,
  pauseOnOptionsShow,
  onSharePress,
  onCommentPress,
  onLikePress,
  onDislikePress,
  onFinishPlaying,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor,
  timeElapsedColor,
  totalTimeColor,
  headerHeight,
  my_reels,
  isSearch,
  onRefresh,
  refreshing,
  isHome,
}) {
  const FlatlistRef = useRef(null);
  const [ViewableItem, SetViewableItem] = useState('');
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 70});
  const applyProps = {
    backgroundColor: backgroundColor,
    headerTitle: headerTitle,
    headerIconName: headerIconName,
    headerIconColor: headerIconColor,
    headerIconSize: headerIconSize,
    headerIcon: headerIcon,
    headerComponent: headerComponent,
    onHeaderIconPress: onHeaderIconPress,
    optionsComponent: optionsComponent,
    pauseOnOptionsShow: pauseOnOptionsShow,
    onSharePress: onSharePress,
    onCommentPress: onCommentPress,
    onLikePress: onLikePress,
    onDislikePress: onDislikePress,
    onFinishPlaying: onFinishPlaying,
    minimumTrackTintColor: minimumTrackTintColor,
    maximumTrackTintColor: maximumTrackTintColor,
    thumbTintColor: thumbTintColor,
    timeElapsedColor: timeElapsedColor,
    totalTimeColor: totalTimeColor,
    headerHeight: headerHeight,
    my_reels: my_reels,
    isSearch: isSearch,
    onRefresh: onRefresh,
    refreshing: refreshing,
    isHome: isHome,
  };

  // Viewable configuration
  const onViewRef = useRef(viewableItems => {
    if (viewableItems?.viewableItems?.length > 0) {
      SetViewableItem(viewableItems.viewableItems[0].item._id || 0);
    }
  });

  return (
    <FlatList
      ref={FlatlistRef}
      data={videos}
      keyExtractor={item => item._id.toString()}
      renderItem={({item, index}) => (
        <ReelCard
          {...item}
          index={index}
          ViewableItem={ViewableItem}
          onFinishPlaying={index => {
            if (index !== videos.length - 1) {
              FlatlistRef.current.scrollToIndex({
                index: index + 1,
              });
            }
          }}
          {...applyProps}
        />
      )}
      getItemLayout={(_data, index) => ({
        length: ScreenHeight - ((IS_IPHONE_X ? wp(23) : wp(16)) + headerHeight),
        offset:
          (ScreenHeight - ((IS_IPHONE_X ? wp(23) : wp(16)) + headerHeight)) *
          index,
        index,
      })}
      pagingEnabled
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={
            // () => {
            onRefresh
            // }
          }
        />
      }
      decelerationRate={0.9}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={viewConfigRef.current}
      extraData={videos}
    />
  );
}

export default Reels;
