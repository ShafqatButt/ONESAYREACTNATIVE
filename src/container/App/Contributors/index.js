import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {CONTRIBUTORS} from '../../../api_helper/Api';
import deviceInfoModule from 'react-native-device-info';
import {GET_DATA} from '../../../api_helper/ApiServices';
import {AuthContext} from '../../../context/Auth.context';
// import { ActionMenu, LoadingSpinner } from '@sendbird/uikit-react-native-foundation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {GlobalFlex} from '../../../res/globalStyles';
import {BackHeader} from '../../../components/BackHeader';
import {colors} from '../../../res/colors';
import {Spacer} from '../../../res/spacer';
import styles from '../Home/Components/BasicInfoComponent/styles';
import {SubContainer} from '../../../res/globalStyles';
import {FlatList} from 'react-native-gesture-handler';
import {MainTitle} from '../../../res/globalStyles';
import {fonts} from '../../../res/fonts';
import AutoHeightImage from 'react-native-auto-height-image';
import {images} from '../../../res/images';
import {LoadingSpinner} from '@sendbird/uikit-react-native-foundation';
import Palette from '../../../styles/palette';
import {BorderContainer} from '../Chat_call/ReportMemberDetails/style';
import moment from 'moment';
import Strings from '../../../string_key/Strings';

export default Contributors = props => {
  const [isLoading, setIsLoading] = useState(false);
  const {state: authContextState} = useContext(AuthContext);
  const {userData} = authContextState;
  const [flexOneWidth, setFlexOneWidth] = useState(0);
  const [activitiesList, setActivityList] = useState({activitiesLogs: []});
  const [errorText, setErrorText] = useState('');

  console.log('States Data==>>', activitiesList);
  const getActivityList = async () => {
    setIsLoading(true);
    const uniqueID = await deviceInfoModule.getUniqueId();
    GET_DATA(CONTRIBUTORS, true, userData.token, uniqueID, data => {
      console.log('data===>>', data);
      if (data?.status && (data?.status == 401 || data?.status == 400)) {
        console.log('Error: ' + data);
        setIsLoading(false);
      } else {
        setActivityList(data);
        setIsLoading(false);

        if (data.activitiesLogs.length > 0) {
          setErrorText('');
        } else {
          setErrorText(Strings.contributor_not_found);
        }
        // setErrorText("fee")

        //console.log('New dara data===>',activitiesList)

        //    if(activitiesList.length > 0) {
        //     console.log("we have activities logs", activitiesList.length)
        //      setActivityList(data.activitiesLogs)

        //     // console.log ("activities logs",activitiesList.length)
        //    }else {
        //     console.log("we have no activities logs")

        //     setActivityList(data.activitiesLogs)
        //    }
      }
    });
  };
  useEffect(() => {
    getActivityList();
  }, []);

  //   return (
  //     <>
  //     <View>

  //         { isLoading ?
  //           (<LoadingSpinner
  //           style={{
  //             position: 'absolute',
  //             justifyContent: 'center',
  //             alignSelf: 'center',
  //             width: wp(100),
  //             height: hp(90),
  //           }}
  //           size={40}
  //           color={Palette.primary300}
  //         />)
  //         :
  //         (

  //        <FlatList
  //        showsVerticalScrollIndicator={false}
  //        data={activitiesList}
  //                 renderItem={({item}) => {
  //                     console.log("Items",item)
  //                     return(

  //                         <TouchableOpacity
  //                         onPress={() => {
  //                           navigation.navigate('ProductList', {item});
  //                         }}
  //                         style={[styles.post]}
  //                         onLayout={event => {
  //                           var {width} = event.nativeEvent.layout;
  //                           setFlexOneWidth(width);
  //                         }}>
  //                         <AutoHeightImage
  //                           source={images.doggy}
  //                           width={flexOneWidth - 2}
  //                           maxHeight={hp(15)}
  //                           style={styles.postInnerWrapper}
  //                         />
  //                         <View style={styles.item}>
  //                           <Text style={styles.postTitle}>{item.category}</Text>
  //                         </View>
  //                       </TouchableOpacity>

  //                     )

  //                     }
  //         }

  //        />

  //         )

  //     }

  //     </View>
  //     </>
  //   )

  return (
    <GlobalFlex>
      <>
        <BackHeader
          textColor={{color: colors.DARK_GRAY}}
          onNextPress={() => {
            onCreatePost();
          }}
          isRightText={false}
          showBack={true}
          onBackPress={() => {
            props.navigation.goBack();
          }}
          is_center_text
          title={Strings.contributors}
          headerStyle={{marginTop: wp(5)}}
        />
        <Spacer space={hp(1)} />
        <View style={styles.borderView} />
        {activitiesList.contributionScore ? (
          <View style={{alignItems: 'center'}}>
            <Text style={{fontFamily: fonts.MEDIUM}}>
              {Strings.contributionscore + ' : '}
              <Text style={{fontFamily: fonts.BOLD, color: colors.DARK_RED}}>
                {activitiesList.contributionScore}
              </Text>
            </Text>
          </View>
        ) : (
          <Text style={{alignSelf: 'center', fontFamily: fonts.MEDIUM}}>
            {''}{' '}
          </Text>
        )}
      </>

      <SubContainer>
        {activitiesList.activitiesLogs.length > 0 ? (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={activitiesList.activitiesLogs}
              renderItem={({item}) => (
                <>
                  <Spacer space={hp(0.6)} />
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: wp(2),
                      paddingHorizontal: wp(4),
                      marginTop: wp(2),
                    }}>
                    <View style={{width: wp(90)}}>
                      <Text style={styles.postTitle}>
                        {Strings.activity + ' : '}{' '}
                        <Text
                          style={{
                            fontFamily: fonts.BOLD,
                            color: colors.DARK_RED,
                            textTransform: 'capitalize',
                          }}>
                          {item?.activity}
                        </Text>
                      </Text>
                      <Text style={styles.postTitle}>
                        {Strings.gained_score + ' : '}{' '}
                        <Text style={{fontFamily: fonts.REGULAR}}>
                          {item?.gained_score}
                        </Text>
                      </Text>
                      <Text style={styles.postTitle}>
                        {Strings.date_created + ' : '}{' '}
                        <Text style={{fontFamily: fonts.REGULAR}}>
                          {moment(item?.date_created).format('DD-MMM-YYYY')}
                        </Text>{' '}
                      </Text>
                    </View>
                  </View>
                  <Spacer space={hp(0.2)} />
                  <BorderContainer />
                </>
              )}
            />
            <Spacer space={hp(2)} />
          </>
        ) : (
          <View style={{flex: 1, JustifyContent: 'center', marginTop: wp(50)}}>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: fonts.BOLD,
                fontSize: 20,
              }}>
              {errorText}
            </Text>
          </View>
        )}
      </SubContainer>
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
  );
};
