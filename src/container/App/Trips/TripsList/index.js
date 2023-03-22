// noinspection ES6CheckImport

import React, {useContext, useRef, useState} from 'react';
import {View, FlatList, Text} from 'react-native';
import {SearchComponent} from '../../../../uikit-app/GroupChannelTabs/GroupChannelListScreen';
import {TripsContext} from '../../../../context/TripsContext';
import {AuthContext} from '../../../../context/Auth.context';
import ActionSheet from '../../../../components/ActionSheet';
import {AppHeader} from '../../../../components/AppHeader';
import {MainContainer, LabelText, styles} from './style';
import TripItem from './components/TripItemComponent';
import Loading from '../../../../components/Loading';
import Strings from '../../../../string_key/Strings';

const TripsList = props => {
  const actionRef = useRef(null);
  const refQueryText = useRef('');
  const refCurrentPage = useRef(1);
  const refSearchQueryTimeout = useRef(null);

  const {state: TripsState, getTravelPackages} = useContext(TripsContext);
  const {state: AuthState} = useContext(AuthContext);
  const {userData} = AuthState;

  const [isLoading, setLoading] = useState(false);
  const [isListEnded, setListEnded] = useState(false);

  const getDataWithSearchQuery = (query, pageNo: number = 1) => {
    refQueryText.current = query;
    if (refSearchQueryTimeout?.current !== null) {
      clearTimeout(refSearchQueryTimeout.current);
      refSearchQueryTimeout.current = null;
    }
    refSearchQueryTimeout.current = setTimeout(() => {
      getTravelPackages(
        userData,
        setLoading,
        query,
        `${pageNo}`,
        () => {
          setListEnded(() => false);
        },
        () => {
          setListEnded(() => true);
        },
      );
    }, 800);
  };

  function _renderHeaderComponent() {
    return (
      <>
        <AppHeader
          pendingNotifications={true}
          onNotification={() =>
            props.navigation.navigate('ProfileNav', {screen: 'Notifications'})
          }
          action_open={() => actionRef?.current.open()}
          userData={userData}
        />
        <View style={styles.searchWrapper}>
          <SearchComponent
            onQuery={_text => {
              refCurrentPage.current = 1;
              getDataWithSearchQuery(_text);
            }}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <MainContainer>
        <ActionSheet
          navigation={props.navigation}
          refRBSheet={actionRef}
          onClose={() => actionRef?.current.close()}
        />
        {_renderHeaderComponent()}

        <View style={{flex: 1}}>
          <FlatList
            data={TripsState?.travelPackages}
            onEndReached={() => {
              if (isListEnded || TripsState?.travelPackages.length < 1) {
                return;
              }
              refCurrentPage.current = refCurrentPage.current + 1;
              getDataWithSearchQuery(
                refQueryText.current,
                refCurrentPage.current,
              );
            }}
            onEndReachedThreshold={0.7}
            ListHeaderComponent={
              <LabelText style={styles.shadow}>
                Upcoming Quest Dream Trip Details
              </LabelText>
            }
            ListEmptyComponent={() => (
              <>
                {isLoading ? null : (
                  <Text style={styles.emptyTextStyle}>
                    {Strings.no_travel_packages_available}
                  </Text>
                )}
              </>
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <TripItem item={item} />}
          />
          <Loading visible={isLoading} />
        </View>
      </MainContainer>
    </>
  );
};

export default TripsList;
