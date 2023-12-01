import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Platform, TouchableOpacity } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import { ImagesAssets } from '../objects/images';
import LoginScreen from './LoginPage';
import { css } from '../objects/commonCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterDriverData } from '../objects/objects';

const RegisterScreen2 = () => {
    const navigation = useNavigation();

    const inputDriver = React.createRef<TextInput>();
    const inputIC = React.createRef<TextInput>();
    
    const [username, setUserName] = useState('');
    const [viewName, setViewName] = useState(false);

    const [personIC, setPersonIC] = useState('');
    const [viewPersonIC, setViewPersonIC] = useState(false);

    const [verhicleNo, setVehicleNo] = useState('');
    const [viewVehicleNo, setViewVehicleNo] = useState(false);


    const goBack = () => {
        navigation.goBack();
    }

    const registerDriverAPI = async() => { 
        var MobileUserCode = await AsyncStorage.getItem('MobileUserCode');
        const ICType = personIC.substring(0,6)+"-"+personIC.substring(6,8)+"-"+personIC.substring(8,12)
        
        if(verhicleNo!="" && personIC!="" && username!="" && ICType.length!=12){
            const formData = new FormData();
            
            const jsonData: RegisterDriverData = {
                "Lorry": verhicleNo as string,
                "Driver": username as string,
                "IC": ICType as string,
                "MobileUserCode": MobileUserCode as string,
            };

            for (const key in jsonData) {
                formData.append(key, jsonData[key]);
            }
            
            await axios.post(URLAccess.registerDriverFunction, jsonData).then(async response => {
                if(response.data.isSuccess==true){
                    navigation.navigate(LoginScreen as never);
                    Snackbar.show({
                        text: "Register successfully.",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }else{
                    Snackbar.show({
                        text: response.data.message,
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
            <Ionicons name="arrow-back-circle-outline" size={34} color="white" onPress={()=>goBack()} style={{marginBottom:5,marginLeft:20}} />
        </View>
        <View style={css.container}>
            <Image
            source={ImagesAssets.registerImage}
            style={{width: 200, height: 200}}
            />
            <Text style={{color:"#404040",fontWeight:"bold",fontSize:20}}>Register Driver</Text>

            {/* Car Detail */}
            <View style={css.row}>
                <Text style={css.inputText}>Car Number: <Text style={{color:"red"}}>*</Text></Text>
                {viewVehicleNo==true && verhicleNo=="" ? (
                <TextInput
                    style={[css.input,{borderColor:"#FF0606"}]}
                    placeholder="Lorry Number"
                    value={verhicleNo}
                    onChangeText={setVehicleNo}
                    onSubmitEditing={() => inputDriver.current?.focus()}
                    placeholderTextColor="#11182744"
                />
                ) : (
                <TextInput
                    style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                    placeholder="Lorry Number"
                    value={verhicleNo}
                    onChangeText={setVehicleNo}
                    onPressIn={()=>{setViewVehicleNo(true)}}
                    onSubmitEditing={() => inputDriver.current?.focus()}
                    placeholderTextColor="#11182744"
                />
                ) }
            </View>

            {(viewVehicleNo==true && verhicleNo=="") && (
                <View style={[css.row,{marginBottom:10,}]}>
                    <Text style={css.inputText}></Text>
                    <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Can't be empty!</Text>
                </View>
            )}
            {/* End Car Detail */}

            {/* Driver Detail */}
            <View style={css.row}>
                <Text style={css.inputText}>Driver Name: <Text style={{color:"red"}}>*</Text></Text>
                {viewName==true && username=="" ? (
                <TextInput
                    style={[css.input,{borderColor:"#FF0606"}]}
                    placeholder="Driver Name"
                    value={username}
                    ref={inputDriver}
                    onChangeText={setUserName}
                    onSubmitEditing={() => inputIC.current?.focus()}
                    placeholderTextColor="#11182744"
                />
                ) : (
                <TextInput
                    style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                    placeholder="Driver Name"
                    value={username}
                    ref={inputDriver}
                    onChangeText={setUserName}
                    onPressIn={()=>{setViewName(true)}}
                    onSubmitEditing={() => inputIC.current?.focus()}
                    placeholderTextColor="#11182744"
                />
                ) }
            </View>

            {(viewName==true && username=="") && (
                <View style={[css.row,{marginBottom:10,}]}>
                    <Text style={css.inputText}></Text>
                    <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Can't be empty!</Text>
                </View>
            )}
            {/* End Driver Detail */}

            {/* IC */}
            <View style={css.row}>
                <Text style={css.inputText}>Driver IC: <Text style={{color:"red"}}>*</Text></Text>
                {(viewPersonIC==true && (personIC=="" || personIC.length!=12)) ? (
                <TextInput
                    style={[css.input,{borderColor:"#FF0606"}]}
                    placeholder="IC Number"
                    value={personIC}
                    ref={inputIC}
                    onChangeText={setPersonIC}
                    onSubmitEditing={() => setViewPersonIC(true)}
                    placeholderTextColor="#11182744"
                />
                ) : (
                <TextInput
                    style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                    placeholder="IC Number"
                    value={personIC}
                    ref={inputIC}
                    onChangeText={setPersonIC}
                    onPressIn={()=>{setViewPersonIC(true)}}
                    onSubmitEditing={() => setViewPersonIC(true)}
                    placeholderTextColor="#11182744"
                />
                ) }
            </View>

            {(viewPersonIC==true && personIC=="") ? (
                <View style={[css.row,{marginBottom:10,}]}>
                    <Text style={css.inputText}></Text>
                    <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Can't be empty!</Text>
                </View>
            ):(
                personIC.length!=12 ? (
                    <View style={[css.row,{marginBottom:10,}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>IC format is invalid.</Text>
                    </View>
                ) : (
                    <></>
                )
            )}
            {/* End IC */}
            
            <Pressable style={css.button} onPress={()=>{registerDriverAPI()}}>
                <Text style={css.text}>Complete</Text>
            </Pressable>
        </View>
        </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default RegisterScreen2;
