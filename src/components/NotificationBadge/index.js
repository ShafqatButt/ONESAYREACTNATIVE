
import React from 'react';
import {View,Text} from 'react-native';
import { styles } from './style';

    
export const NotificationBadge = ({text}) => {
  
    
return(
<View style = { text < 100 ? styles.container : styles.containerPlus }>
{text <= 99 ? <Text style={ styles.text}>{text}</Text> : <Text style={ styles.textPlus}>99+</Text>  } 
</View>

    );
};
