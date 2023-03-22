// @flow
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from '../../components/Button';
import { colors } from '../../res/colors';

export default (Comp: ReactClass<*>) => {
    return ({ spinner, children, ...props }: Object) => (
        <View style={{ flex: 1 }}>
            <Comp {...props}>
                {children}
            </Comp>
            {spinner &&
                <ActivityIndicator size={'large'} color={colors.PRIMARY_COLOR} />
            }
        </View>
    );
};