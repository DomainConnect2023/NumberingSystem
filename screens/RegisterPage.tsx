import React, { useState } from 'react';
import { View, Text, Pressable, Image, Dimensions, TouchableOpacity, TextInput as TextInputs } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ImagesAssets } from '../objects/images';
import { css, styles } from '../objects/commonCSS';
import RegisterScreen2 from './RegisterPage2';
import { RegisterUserData } from '../objects/objects';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginPage';
import RNFetchBlob from 'rn-fetch-blob';
import { ProgressBar } from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons'
import { TextInput } from 'react-native-paper';

const RegisterScreen = () => {
    const navigation = useNavigation();

    const [stage, setstage] = useState(1);
    const [ishide, setishide] = useState(true);
    const [retypeishide, setretypeishide] = useState(true);

    const inputPass = React.createRef<TextInputs>();
    const inputRetypePass = React.createRef<TextInputs>();
    
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [retypePass, setRetypePass] = useState('');

    const [IMEI, setIMEI] = useState('');

    const registerUserAPI = async() => {
        if(password!="" && password==retypePass && username!="" && username.length<=5){
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
                {/* Header */}
                <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                    <View style={{ flex: 0.15, flexDirection: "row" }}>
                        <Image source={require('../assets/logo.png')} style={{ flex: 2, height: Dimensions.get("screen").height / 100 * 10, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
                        <Text style={styles.Header}>DOMAIN CONNECT</Text>
                    </View>


                    {/*End Header */}

                    <View style={{flex:1, maxHeight:Dimensions.get("screen").height / 100 * 90}}>
                        <View style={{ justifyContent: "flex-end", width: "90%", alignSelf: "center", marginTop: 30 }}>
                            <Text style={styles.fontLogin}>Sign Up</Text>
                            {stage == 1 && <Text style={styles.fontsmall}>Enter Your Credential to Sign Up</Text>}
                            {stage == 2 && <Text style={styles.fontsmall}>Double Check</Text>}
                        </View>
                        {/* Stage 1 information */}

                        {stage == 1 &&
                            <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                                <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                                <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            </View>
                            <View style={styles.InputRange}>
                                <TextInput
                                    style={styles.Textinput}
                                    mode="outlined"
                                    label="User Name" 
                                    value={username}
                                    onChangeText={setUserName}
                                    onSubmitEditing={() => inputPass.current?.focus()} />
                            </View>
                            <View style={styles.InputRange}>
                                <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                    onPress={() => {
                                        if (ishide == (true)) {
                                            setishide(false);
                                        } else {
                                            setishide(true);
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
                                    label="Password" 
                                    value={password}
                                    onChangeText={setPassword}
                                    ref={inputPass}
                                    onSubmitEditing={() => inputRetypePass.current?.focus()} />
                            </View>
                            <View style={styles.InputRange}>
                                <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                    onPress={() => {
                                        if (retypeishide == (true)) {
                                            setretypeishide(false);
                                        } else {
                                            setretypeishide(true);
                                        }
                                    }}>
                                    {retypeishide == true ?
                                        (
                                            <Octicons name="eye" size={40} style={{}} />
                                        ) : (
                                            <Octicons name="eye-closed" size={40} style={{}} />
                                        )}

                                </TouchableOpacity>
                                <TextInput
                                    style={styles.Textinput}
                                    secureTextEntry={retypeishide}
                                    mode="outlined"
                                    label="Retype Password" 
                                    value={retypePass}
                                    onChangeText={setRetypePass}
                                    ref={inputRetypePass} />
                            </View>
                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { 
                                if(password==retypePass && username!=""){
                                    setstage(2); 
                                }else{
                                    Snackbar.show({
                                        text: "Please follow all the requirements and check the password again.",
                                        duration: Snackbar.LENGTH_SHORT,
                                    });
                                }
                            }}>
                                <Text style={styles.fonth2}>
                                    Next
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ButtonLogin,{marginTop:5}]} onPress={() => { navigation.goBack() }}>
                            <Text style={styles.fonth2}>
                                Back
                            </Text>
                        </TouchableOpacity></>}
                        {/*End Stage 1*/}

                        {/* Stage 2 */}
                        {stage == 2 && <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                        </View>

                        <View style={{backgroundColor: "#D9D9D9", width: "80%",height:"40%", alignSelf: "center",margin:10,borderRadius:5 }}>
                            <Text style={{margin:15,fontWeight:"bold",fontSize:12}}>Confirm your Credential</Text>
                            
                            <View style={{flexDirection:"row"}}>
                                <Text style={{margin:20,fontWeight:"bold",fontSize:12,flex:1}}>User Name </Text>
                                <Text style={{margin:20,fontWeight:"bold",fontSize:12}}>:</Text>
                                <Text style={{margin:20,fontWeight:"bold",fontSize:12,paddingLeft:10,flex:1}}>{username}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.ButtonLogin} onPress={() => { navigation.navigate(LoginScreen as never); }}>
                            <Text style={styles.fonth2}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setstage(1), setPassword(""), setRetypePass(""); }}>
                            <Text style={styles.fonth2}>
                                Back
                            </Text>
                        </TouchableOpacity>
                        </>}

                        {/* End Stage 3 */}


                    </View>

                    {/* Footer */}
                    <View style={{ justifyContent: "flex-end",marginBottom:15 }}>
                        <View style={styles.blackline} />
                        <TouchableOpacity onPress={() => { navigation.navigate(LoginScreen as never) }}>
                            <Text style={styles.fonth2}>Already Have an Account? Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* End Footer */}
                </View>
            </KeyboardAvoidWrapper>
            {/* <KeyboardAvoidWrapper>
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

                <Pressable style={css.button} onPress={()=>{registerUserAPI()}}>
                    <Text style={{color:"white", fontWeight:"bold", fontSize:18}}>Done</Text>
                </Pressable>
            </View>
            </KeyboardAvoidWrapper> */}
        </MainContainer>
    );
};

export default RegisterScreen;
