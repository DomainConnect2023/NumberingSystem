import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ImagesAssets } from '../objects/images';
import { css } from '../objects/commonCSS';
import RegisterScreen2 from './RegisterPage2';
import { RegisterUserData } from '../objects/objects';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginPage';
import RNFetchBlob from 'rn-fetch-blob';

const RegisterScreen = () => {
    const navigation = useNavigation();

    const inputPass = React.createRef<TextInput>();
    const inputRetypePass = React.createRef<TextInput>();
    
    const [username, setUserName] = useState('');
    const [viewName, setViewName] = useState(false);

    const [password, setPassword] = useState('');
    const [retypePass, setRetypePass] = useState('');
    const [viewPass, setViewPass] = useState(false);
    const [viewRetypePass, setViewRetypePass] = useState(false);

    const [IMEI, setIMEI] = useState('');

    const registerUserAPI = async() => {
        if(password!="" && password==retypePass && username!="" && username.length<=5){

            // const formData = new FormData();
            
            // const jsonData: RegisterUserData = {
            //     "Code": username as string,
            //     "Password": password as string,
            //     "IMEI": IMEI as string,
            // };

            // for (const key in jsonData) {
            //     formData.append(key, jsonData[key]);
            // }
            
            // await axios.post(URLAccess.registerUserFunction, jsonData).then(async response => {
            await RNFetchBlob.config({
                trusty: true
            })
            .fetch('POST', URLAccess.registerUserFunction,{
                    "Content-Type": "application/json",  
                }, JSON.stringify({
                    "Code": username as string,
                    "Password": password as string,
                    "IMEI": IMEI as string,
                }),
            ).then((response) => {
                if(response.json().isSuccess==true){
                    // AsyncStorage.setItem('MobileUserCode', username);
                    // navigation.navigate(RegisterScreen2 as never);
                    navigation.navigate(LoginScreen as never);
                    Snackbar.show({
                        text: "Register successfully.",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }else{
                    Snackbar.show({
                        text: response.json().message,
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            }).catch(error => {
                Snackbar.show({
                    text: error.message,
                    duration: Snackbar.LENGTH_SHORT,
                });
            });
        }else{
            Snackbar.show({
                text: "Please follow all the requirements.",
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
            <View style={css.mainView}>
                <Ionicons name="arrow-back-circle-outline" size={34} color="#FFF" onPress={()=>navigation.goBack()} style={{marginBottom:5,marginLeft:20}} />
                <View style={css.HeaderView}>
                    <Text style={css.PageName}>Register</Text>
                </View>
            </View>
            <View style={css.container}>
                <Image
                source={ImagesAssets.registerImage}
                style={{width: 200, height: 200}}
                />

                {/* User Detail */}
                <View style={css.row}>
                    <Text style={css.inputText}>User Name: <Text style={{color:"red"}}>*</Text></Text>
                    {(viewName==true && (username=="" || username.length>5)) ? (
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606",marginBottom:0}]}
                        placeholder="Maximun Character is 5"
                        value={username}
                        onChangeText={setUserName}
                        onSubmitEditing={() => inputPass.current?.focus()}
                        placeholderTextColor="#11182744"
                    />
                    ) : (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                        placeholder="Maximun Character is 5"
                        value={username}
                        onChangeText={setUserName}
                        onPressIn={()=>{setViewName(true)}}
                        onSubmitEditing={() => inputPass.current?.focus()}
                        placeholderTextColor="#11182744"
                    />
                    ) }
                </View>

                {(viewName==true && username=="") ? (
                        <View style={[css.row,{marginBottom:10,}]}>
                            <Text style={css.inputText}></Text>
                            <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Can't be empty!</Text>
                        </View>
                    
                ):(
                    username.length>5 ? (
                        <View style={[css.row,{marginBottom:10,}]}>
                            <Text style={css.inputText}></Text>
                            <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Maximum character is 5!</Text>
                        </View>
                    ) : (
                        <></>
                    )
                )}
                {/* End User Detail */}

                {/* Password & Retype Password Detail */}
                <View style={[css.row,{marginBottom: 10,}]}>
                    <Text style={css.inputText}>Password: <Text style={{color:"red"}}>*</Text></Text>
                    {(password=="" && viewPass==true) ? (
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606"}]}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        ref={inputPass}
                        onChangeText={setPassword}
                        onSubmitEditing={() => inputRetypePass.current?.focus()}
                        placeholderTextColor="#11182744"
                    />
                    ) : (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744"}]}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        ref={inputPass}
                        onChangeText={setPassword}
                        onSubmitEditing={() => inputRetypePass.current?.focus()}
                        onPressIn={()=>{setViewPass(true)}}
                        placeholderTextColor="#11182744"
                    />
                    ) }
                </View>
                <View style={css.row}>
                    <Text style={css.inputText}>Retype Password: <Text style={{color:"red"}}>*</Text></Text>
                    {(password!=retypePass && viewRetypePass==true) ?(
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606"}]}
                        placeholder="Retype Password"
                        secureTextEntry
                        value={retypePass}
                        ref={inputRetypePass}
                        onChangeText={setRetypePass}
                        onSubmitEditing={() => setViewRetypePass(true)}
                        placeholderTextColor="#11182744"
                    /> 
                    ): (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                        placeholder="Retype Password"
                        secureTextEntry
                        value={retypePass}
                        ref={inputRetypePass}
                        onChangeText={setRetypePass}
                        onPressIn={()=>{setViewRetypePass(true)}}
                        onSubmitEditing={() => setViewRetypePass(true)}
                        placeholderTextColor="#11182744"
                    />    
                    ) }
                </View>

                {(password=="" && viewPass==true) ? (
                    <View style={[css.row,{marginBottom:10,marginTop:-10}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Password can't be empty!</Text>
                    </View>
                ): (password!=retypePass && viewRetypePass==true) ? (
                    <View style={[css.row,{marginBottom:10,}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Password is not match!</Text>
                    </View>
                ): (<></>)}
                {/* End Password & Retype Password */}

                <Pressable style={css.button} onPress={()=>{registerUserAPI()}}>
                    <Text style={css.text}>Next</Text>
                </Pressable>
            </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    );
};

export default RegisterScreen;
