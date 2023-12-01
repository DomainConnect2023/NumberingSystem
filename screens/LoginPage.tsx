import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Linking, Modal, Platform, Pressable, TouchableOpacity } from 'react-native';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from './RegisterPage';
import { ImagesAssets } from '../objects/images';
import TabNavigation from './TabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setCredentials } from '../components/keychainService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import https from 'https';
import { Buffer } from 'buffer';
import DashboardScreen from './DashboardPage';

type UserData = {
    Code: string;
    Password: string;
    [key: string]: string;
};

const LoginScreen = () => {
    const navigation = useNavigation();
        
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const inputRef = React.createRef<TextInput>();

    const loginAPI = async() => {
        const formData = new FormData();
        
        const jsonData: UserData = {
            "Code": username as string,
            "Password": password as string,
        };

        for (const key in jsonData) {
            formData.append(key, jsonData[key]);
        }

        await axios.post(URLAccess.loginFunction, jsonData).then(async response => {
            if(response.data.isSuccess==true){
                AsyncStorage.setItem('refNo', response.data.refNo);
                setUserName("");
                setPassword("");
                navigation.navigate(DashboardScreen as never);
            }else{
                console.log(response.data.message);
                Snackbar.show({
                    text: response.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
            
        }).catch(error => {
            console.log(error);
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
    };

  return (
    <MainContainer>
        <KeyboardAvoidWrapper>
            <View style={styles.container}>
                <Image
                source={ImagesAssets.logoImage}
                style={{width: 250, height: 250, margin:50}}
                />
                <View style={styles.subcontainer}>
                    <View style={styles.Icon}>
                        <Ionicons name={"person" ?? ""} size={40} color={"#EC5800"} />
                    </View>
                    <TextInput
                        style={styles.Input}
                        onSubmitEditing={() => inputRef.current?.focus()}
                        placeholder="User Name"
                        value={username}
                        onChangeText={setUserName}
                    />
                    
                </View>
                <View style={styles.subcontainer}>
                    <View style={styles.Icon}>
                        <Ionicons  name={"key-sharp" ?? ""} size={40} color={"#EC5800"} />
                    </View>
                    <TextInput
                        style={styles.Input}
                        ref={inputRef}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <TouchableOpacity style={{width:"85%"}} onPress={() => {navigation.navigate(RegisterScreen as never)}}>
                    <View>
                        <Text style={styles.registerFont}>Register</Text>
                    </View>
                </TouchableOpacity>
                <Pressable style={styles.button} onPress={()=>loginAPI()}>
                    <Text style={styles.bttnText}>Login</Text>
                </Pressable>
            </View>
            
        </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subcontainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    Input: {
        width: '70%',
        height: 70,
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        color: "#000",
    },
    Icon: {
        width:"15%",
        padding:5,
        alignItems:"flex-end",
        marginBottom: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginRight: 5,
        marginLeft: 5,
    },
    bttnText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    textInput: { 
        width: "80%", 
        borderRadius: 5, 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderColor: "rgba(0, 0, 0, 0.2)", 
        borderWidth: 1, 
    }, 
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        width: "70%",
        height: 70,
        marginBottom: 10,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    registerFont: {
        color: "blue",
    },
});

export default LoginScreen;
