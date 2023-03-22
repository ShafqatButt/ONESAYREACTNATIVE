// @ts-ignore
import React, {useState, useEffect, useContext} from 'react';
import {
  createGroupChannelListFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native/src';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {Routes} from '../../libs/navigation';
import {images} from '../../res/images';
import styles, {
  Icon,
  Button,
  TabItem,
  TabTitle,
  ClearIcon,
  SearchIcon,
  ClearButton,
  SearchInput,
  TabContainer,
  SearchBarContainer,
} from './styles';
import Strings from '../../string_key/Strings';
import {AuthContext} from '../../context/Auth.context';
// import {GroupChannel, PublicGroupChannelListQuery} from 'sendbird';
// import {CONST_TABS, CONST_TYPES} from '../index';
// import {useGroupChannelListWithQuery} from '@sendbird/uikit-chat-hooks/src/channel/useGroupChannelList/useGroupChannelListWithQuery';
// import {CustomQuery} from '@sendbird/uikit-chat-hooks';
// import {useEventEmitter} from '../../hooks/useEventEmitter';

export const TabBarComponent = props => {
  const {state: AuthState} = useContext(AuthContext);
  const CONST_ES_TABS = {
    ALL: 'All',
    GROUP: 'Group',
    CHANNEL: 'Channel',
  };
  const CONST_TABS = {
    ALL: Strings.all,
    GROUP: Strings.group,
    CHANNEL: Strings.channel,
  };
  const {onSelected} = props;
  const [selectedTab, setSelectTab] = useState(0);
  const [renderKey, setRenderKey] = useState(4213);

  useEffect(() => {
    setRenderKey(prev => ++prev);
  }, [AuthState.selectedLang]);

  return (
    <TabContainer key={renderKey}>
      {Object.values(CONST_TABS).map((title, index) => (
        <TabItem
          isSelected={selectedTab === index}
          onPress={() =>
            setSelectTab(() => {
              const title = Object.values(CONST_ES_TABS)[index];
              onSelected(title);
              return index;
            })
          }>
          <TabTitle isSelected={selectedTab === index}>{title}</TabTitle>
        </TabItem>
      ))}
    </TabContainer>
  );
};

export const SearchComponent = props => {
  const {onQuery} = props;
  const [query, setQuery] = useState('');

  useEffect(() => onQuery(query), [query]);

  return (
    <SearchBarContainer>
      <SearchIcon style={styles.searchIconStyle} source={images.search_ic} />
      <SearchInput
        value={query}
        placeholder={Strings.search}
        placeholderTextColor={'#7b7d83'}
        onChangeText={val => setQuery(() => val)}
      />
      <ClearButton
        disabled={query.length <= 0}
        isActive={query.length > 0}
        onPress={() => setQuery(() => '')}>
        <ClearIcon source={images.iconDecline_3x} />
      </ClearButton>
    </SearchBarContainer>
  );
};

const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelListScreen = () => {
  const {navigation} = useAppNavigation<Routes.GroupChannelList>();
  const [searchQuery, setSearchQuery] = useState('');
  const {sdk} = useSendbirdChat();

  const myAppUserQueryCreator = () => {
    const defaultOptions = {
      includeEmpty: true,
      limit: 20,
      order: sdk.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE,
    };
    const collectionBuilder = sdk.GroupChannel.createGroupChannelCollection();
    const groupChannelFilter = new sdk.GroupChannelFilter();
    groupChannelFilter.includeEmpty = defaultOptions.includeEmpty;

    return collectionBuilder
      .setFilter(groupChannelFilter)
      .setLimit(defaultOptions.limit)
      .setOrder(defaultOptions.order)
      .build();
  };

  // const myAppUserQueryCreator = () => {
  //   const query = sdk.GroupChannel.createMyGroupChannelListQuery();
  //   query.includeEmpty = true
  //   return query;
  // };

  return (
    <>
      <GroupChannelListFragment
        searchQuery={searchQuery}
        collectionCreator={myAppUserQueryCreator}
        renderTabBar={() => (
          <>
            {/*<TabBarComponent
              onSelected={tab => console.log('Selected Tab => ', tab)}
            />*/}
            <SearchComponent
              onQuery={_text => {
                // const obj: PublicGroupChannelListQuery = {
                //   // includeEmpty: true,
                //   channelNameContainsFilter: text,
                // };
                //
                // const query: PublicGroupChannelListQuery =
                //   sdk.GroupChannel.createPublicGroupChannelListQuery(obj);
                //
                // query.next().then((channels: GroupChannel[]) => {
                //   if (channels.length > 0) {
                //     console.log('channels => ', JSON.stringify(channels[0].name));
                //   }
                // });
                setSearchQuery(() => _text?.toLowerCase());
              }}
            />
          </>
        )}
        // queryCreator={sdk.GroupChannel.createPublicGroupChannelListQuery({
        //   channelNameContainsFilter: 'First',
        // })}
        // @ts-ignore
        onPressCreateChannel={_channelType => navigation.navigate('Contacts')}
        onPressChannel={channel => {
          // @ts-ignore
          navigation.navigate('chat', {
            screen: Routes.GroupChannel,
            params: {
              serializedChannel: channel.serialize(),
            },
          });
        }}
      />
      {/*@ts-ignore*/}
      <Button onPress={() => navigation.navigate(Routes.NewChats)}>
        <Icon source={images.new_chat} />
      </Button>
    </>
  );
};

export default GroupChannelListScreen;
