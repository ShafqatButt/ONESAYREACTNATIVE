// import { useState, createContext } from "react";
import { GET_DASHBOARD } from "../api_helper/Api";
import { GET_DATA } from "../api_helper/ApiServices";
import deviceInfoModule from "react-native-device-info";
import AsyncStorage from "@react-native-community/async-storage";
import React, { useState, createContext } from 'react';

export const AppHeaderContext = createContext(null);

export const AppHeaderContextProvider = props =>{

    const [notificationCount, setNotificationCount] = useState(0);
    const [walletTotal, setWalletTotal] = useState(0);

    const getNotificationCount_WalletTotal = async () => {
        const uniqueID = await deviceInfoModule.getUniqueId();
        console.log('uniqe id in Notification count', uniqueID);
        console.log('The new token', props.token);
        const user = await AsyncStorage.getItem('userDetails');
        let usrTkn = JSON.parse(user).token
        console.log('USER Token: ' + usrTkn);
        GET_DATA(GET_DASHBOARD, true, usrTkn, uniqueID, data => {
          console.log("Mt data",data);
        let walletCount = data.wallet.map( obj => obj.total);
          console.log('Wallet Data',walletCount.reduce(add,0));
          setWalletTotal(walletCount.reduce(add,0));
          setNotificationCount(data.notificationCount);

        });
    }

    function add(accumulator, a) {
        return accumulator + a;
      }
      

    return(
        <AppHeaderContext.Provider 
        value={{
            state: {
                notificationCount,
                walletTotal,
            },
            getNotificationCount_WalletTotal
        }}>{props.children}</AppHeaderContext.Provider>
    );
}