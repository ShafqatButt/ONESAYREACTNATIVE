import { useQuery } from 'react-query';
// API Services anf third party call
import { GET } from '../api_helper/ApiServices';
import { SERVICES } from '../api_helper/Api';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';

const fetchList = async () => {
    const userData = await AsyncStorage.getItem('userDetails');
    const uniqueID = await DeviceInfo.getUniqueId();
    const { data } = await GET(SERVICES, JSON.parse(userData).token, uniqueID)
    return data
};

const serviceList = () => useQuery('services', fetchList);
export default serviceList;