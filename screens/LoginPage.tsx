import React, { useEffect, useState } from 'react';
import { Dimensions, Image, TouchableOpacity } from 'react-native';
import { View, Text, TextInput as TextInputs } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from './RegisterPage';
import TabNavigation from './TabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import RNFetchBlob from 'rn-fetch-blob';
import { styles } from '../objects/commonCSS';
import { TextInput } from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const LoginScreen = () => {
    const navigation = useNavigation();
    const [ishide, setishide] = useState(true);
        
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const inputRef = React.createRef<TextInputs>();

    useEffect(()=> {
        (async()=> {
            if (__DEV__) {
                setUserName("aaaa");
                setPassword("Aaaa");
            }
        })();
    }, [])

    const loginAPI = async() => {
        await RNFetchBlob.config({
            trusty: true
        })
        .fetch('POST', URLAccess.loginFunction,{
                "Content-Type": "application/json",  
            }, JSON.stringify({
                "Code": username as string,
                "Password": password as string,
            }),
        ).then(async (response) => {
            if(response.json().isSuccess==true){
                AsyncStorage.setItem('MobileUserCode', username);
                setUserName("");
                setPassword("");
                navigation.navigate(TabNavigation as never);
            }else{
                console.log(response.json().message);
                Snackbar.show({
                    text: response.json().message,
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
            {/* Header */}
            <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                <View style={{ flex: 0.3, flexDirection: "row" }}>
                    <Image source={require('../assets/logo.png')} style={{ flex: 2, height: Dimensions.get("screen").height / 100 * 15, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
                    <Text style={styles.Header}>DOMAIN CONNECT</Text>
                </View>

                {/*End Header */}
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: "flex-end", width: "90%", alignSelf: "center", marginTop: 30 }}>
                        <Text style={styles.fontLogin}>Login</Text>
                        <Text style={styles.fontsmall}>Enter Your Credential to Log in</Text>
                    </View>
                    {/* Login Information */}
                    <View style={styles.InputRange}>
                        <TextInput
                            style={styles.Textinput}
                            mode="outlined"
                            label="username"
                            value={username}
                            onChangeText={setUserName}
                            onSubmitEditing={() => inputRef.current?.focus()}
                        />
                    </View>
                    <View style={styles.InputRange}>
                        <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                            onPress={() => {
                                if (ishide == (true)) {
                                    setishide(false)
                                } else {
                                    setishide(true)
                                }
                            }}>
                            {ishide == true ?
                                (
                                    <Octicons name="eye" size={40} style={{}} />
                                ) : (
                                    <Octicons name="eye-closed" size={40} style={{}} />
                                )}

                        </TouchableOpacity>
                        <TextInput
                            style={styles.Textinput}
                            secureTextEntry={ishide}
                            mode="outlined"
                            label="password"
                            value={password}
                            onChangeText={setPassword}
                            ref={inputRef}
                        />

                    </View>
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={{ textAlign: "right", width: "95%", fontWeight: "bold", fontSize: 14, }}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ButtonLogin} onPress={() => {loginAPI()}}>
                        <Text style={styles.fonth2}>
                            Log In
                        </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 14, }}>Or Login With</Text>
                        <View style={{ flexDirection:"row"}}>
                            <View>
                                <TouchableOpacity onPress={() => {}}>
                                    <MaterialIcons name="fingerprint" size={65} style={{ marginTop: 20, padding: 20 }} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {}}>
                                    <MaterialIcons name="tag-faces" size={65} style={{ marginTop: 20, padding: 20 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {/* End Login Information */}

                {/* Footer */}
                <View style={{ justifyContent: "flex-end",marginBottom:15 }}>
                    <View style={styles.blackline} />
                    <TouchableOpacity onPress={() => { navigation.navigate(RegisterScreen as never) }}>
                        <Text style={styles.fonth2}>Don't have an Account? Sign Up</Text>
                    </TouchableOpacity>
                </View>

                {/* End Footer */}
            </View>
        </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default LoginScreen;
