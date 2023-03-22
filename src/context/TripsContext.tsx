// @ts-ignore
import React, {createContext, useState} from 'react';
import {
  GET_TRAVEL_PACKAGES,
  GET_TRAVEL_PACKAGE_DETAILS,
} from '../api_helper/Api';
import {GET_DATA} from '../api_helper/ApiServices';

export const TripsContext = createContext(null);
export const TripsProvider = props => {
  const [travelPackages, setTravelPackages] = useState([]);
  const getTravelPackages = async (
    user,
    setLoading,
    query: string = '',
    page: string = '1',
    onMoreAvailable,
    onEndReached,
  ) => {
    setLoading(true);
    GET_DATA(
      GET_TRAVEL_PACKAGES(query, page),
      true,
      user?.token,
      '',
      (data: any) => {
        console.log('data ===> ', data);
        if (parseInt(page) > 1) {
          if (data.length < 1) {
            if (onEndReached) {
              onEndReached();
            }
          } else {
            onMoreAvailable();
            setTravelPackages(prevData => {
              const updatedData = [...prevData, ...data];
              console.log('Combined data => ', updatedData);
              return updatedData;
            });
          }
        } else {
          onMoreAvailable();
          setTravelPackages(() => data);
        }
        setLoading(false);
      },
    );
  };
  const getTravelPackageDetails = async (
    user,
    package_id,
    callback,
  ) => {
    const API_URL: string = GET_TRAVEL_PACKAGE_DETAILS(package_id);
    GET_DATA(API_URL, true, user?.token, '', (data: any) => {
      if (callback) {
        callback(data);
      }
    });
  };

  return (
    <TripsContext.Provider
      value={{
        state: {
          travelPackages,
        },
        getTravelPackages,
        getTravelPackageDetails,
      }}>
      {props.children}
    </TripsContext.Provider>
  );
};
