import React, { useState } from 'react';
import { View, Text, TextInput as TextInputs, Image, TouchableOpacity, Dimensions } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import { styles } from '../objects/commonCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import { ProgressBar, TextInput } from 'react-native-paper';

const RegisterScreen2 = () => {
    const navigation = useNavigation();

    const [stage, setstage] = useState(1);

    const inputDriver = React.createRef<TextInputs>();
    const inputIC = React.createRef<TextInputs>();
    const inputCompany = React.createRef<TextInputs>();
    
    const [username, setUserName] = useState('');
    const [personIC, setPersonIC] = useState('');
    const [verhicleNo, setVehicleNo] = useState('');
    const [companyName, setCompanyName] = useState('');

    const registerDriverAPI = async() => { 
        var MobileUserCode = await AsyncStorage.getItem('MobileUserCode');
        
        if(verhicleNo!="" && username!="" && personIC.length==12){

            const ICType = personIC.substring(0,6)+"-"+personIC.substring(6,8)+"-"+personIC.substring(8,12);
            
            await RNFetchBlob.config({
                trusty: true
            })
            .fetch('POST', URLAccess.registerDriverFunction,{
                    "Content-Type": "application/json",  
                }, JSON.stringify({
                    "Lorry": verhicleNo.toUpperCase() as string,
                    "Driver": username as string,
                    "IC": ICType as string,
                    "CompanyName": companyName as string,
                    "MobileUserCode": MobileUserCode as string,
                }),
            ).then((response) => {
                if(response.json().isSuccess==true){
                    navigation.navigate("TabNavigation" as never);
                    Snackbar.show({
                        text: "Register Driver successfully.",
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

                <View style={{flex:1,}}>
                    <View style={{ justifyContent: "flex-end", width: "90%", alignSelf: "center", marginTop: 30 }}>
                        <Text style={styles.fontLogin}>QR Pass Registration</Text>
                        {stage == 1 && <Text style={styles.fontsmall}>Enter Your Lorry Information to register</Text>}
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
                                label="Lorry Number" 
                                value={verhicleNo}
                                onChangeText={setVehicleNo}
                                onSubmitEditing={() => inputDriver.current?.focus()} />
                        </View>
                        <View style={styles.InputRange}>
                            <TextInput
                                style={styles.Textinput}
                                mode="outlined"
                                label="Driver Name" 
                                value={username}
                                onChangeText={setUserName}
                                ref={inputDriver}
                                onSubmitEditing={() => inputIC.current?.focus()} />
                        </View>
                        <View style={styles.InputRange}>
                            <TextInput
                                style={styles.Textinput}
                                mode="outlined"
                                label="Driver IC" 
                                value={personIC}
                                onChangeText={setPersonIC}
                                ref={inputIC}
                                onSubmitEditing={() => inputCompany.current?.focus()} />
                        </View>
                        <View style={styles.InputRange}>
                            <TextInput
                                style={styles.Textinput}
                                mode="outlined"
                                label="Company Name" 
                                value={companyName}
                                onChangeText={setCompanyName}
                                ref={inputCompany} />
                        </View>
                        <TouchableOpacity style={styles.ButtonLogin} onPress={() => { 
                            if(verhicleNo!="" && username!="" && personIC.length==12){
                                setstage(2); 
                            }else{
                                Snackbar.show({
                                    text: "Please follow all the requirements.",
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

                    <View style={{backgroundColor: "#D9D9D9", width: "85%",height:"50%", alignSelf: "center",margin:10,borderRadius:5 }}>
                        <Text style={{margin:15,fontWeight:"bold",fontSize:12}}>Confirm your Credential</Text>
                        
                        <View style={{flexDirection:"row"}}>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,flex:1}}>Lorry Number </Text>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12}}>:</Text>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,paddingLeft:10,flex:1}}>{verhicleNo.toUpperCase()}</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,flex:1}}>Driver Name </Text>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12}}>:</Text>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,paddingLeft:10,flex:1}}>{username}</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,flex:1}}>Driver IC</Text>  
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12}}>:</Text>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,paddingLeft:10,flex:1}}>{personIC.substring(0,6)+"-"+personIC.substring(6,8)+"-"+personIC.substring(8,12)}</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,flex:1}}>Company Name</Text>  
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12}}>:</Text>
                            <Text style={{margin:20,fontWeight:"bold",fontSize:12,paddingLeft:10,flex:1}}>{companyName}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.ButtonLogin,{marginTop:5}]} onPress={() => { registerDriverAPI() }}>
                        <Text style={styles.fonth2}>
                            Register
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ButtonLogin,{marginTop:5}]} onPress={() => { setstage(1); }}>
                        <Text style={styles.fonth2}>
                            Back
                        </Text>
                    </TouchableOpacity>
                    </>}
                </View>

                {/* Footer */}
                <View style={{ justifyContent: "flex-end" }}>
                    <View style={styles.blackline} />
                        <Text style={styles.fonth2}>@Copyright by Domain Connect</Text>
                </View>

                {/* End Footer */}
            </View>
        </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default RegisterScreen2;
