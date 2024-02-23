import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import Login from '../screens/LoginPage';
import Register from './RegisterPage';


const Welcome = () => {
    const navigation = useNavigation();
    return (
        <MainContainer>

            <StatusBar animated={true} backgroundColor="#ffffff" barStyle={'dark-content'} />

            {/* Image and Welcome Word */}
            <View style={styles.WelcomeView}>
                <Image source={require('../assets/logo.png')} style={{ height: "40%", width: "80%", resizeMode: 'contain', alignSelf: "center" }} />
                <Text style={styles.fonth1}>
                    Welcome to Domain Connect
                </Text>
                <Text style={styles.fonth3}>
                    Your Reliable I.T.Partner Since 1988.
                </Text>

                <Text style={[styles.fonth1, {fontSize:24, marginTop:20, color:"black"}]}>
                    Numbering System
                </Text>
            </View>
            {/* End Image and Welcome Word */}

            <View style={{ flex: 1 }}>
                {/* Button Navigation */}
                <TouchableOpacity style={[styles.Button,{marginTop:25}]} onPress={() => { navigation.navigate(Login as never) }}>
                    <Text style={styles.fonth2}>
                        Sign In
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Button} onPress={() => { navigation.navigate(Register as never) }}>
                    <Text style={styles.fonth2}>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>
            {/* End Button Navigation */}




        </MainContainer>

    )
}

export default Welcome;