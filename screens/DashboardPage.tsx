import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Dimensions } from 'react-native';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import Login from './LoginPage';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import { css } from '../objects/commonCSS';
// import viewImage from './viewImage';


const DashboardScreen = () => {
    const navigation = useNavigation();
    const [refNo, setRefNo] = React.useState<string | null>("Unknown");
    var setQRText: string;

    useEffect(()=> {
        (async()=> {
            AsyncStorage.getItem('refNo').then( (value) => setRefNo(value), );
            // await fetchUserDetailApi();
        })();
    }, [])

    // logout
    const logout = () => {
        navigation.navigate(Login as never);
    }

    //   function viewFullImage(qrText:string){
    //     if(qrText==null){
    //         Snackbar.show({
    //             text: "No QR Code in this log.",
    //             duration: Snackbar.LENGTH_SHORT,
    //         });
    //     }else{
    //         AsyncStorage.setItem('qrText', qrText);
    //         navigation.navigate(viewImage as never);
    //     }
    //   }

    // get user detail from server
    // const fetchUserDetailApi = async() => {
    //     var getuserID = await AsyncStorage.getItem('userID');
        
    //     axios.post(URLAccess.userFunction, {"readDetail":"1", "userID":getuserID})
    //     .then(response => {
    //         if(response.data.status=="1"){
    //             setUserName(response.data.data[0].userName);
    //             setProcessGetData(false);
    //         }else{
    //             Snackbar.show({
    //                 text: 'Something is wrong. Can not get the data from server!',
    //                 duration: Snackbar.LENGTH_SHORT,
    //             });
    //         }
    //     })
    //     .catch(error => {
    //         Snackbar.show({
    //             text: error,
    //             duration: Snackbar.LENGTH_SHORT,
    //         });
    //     });
    // };

    return (
        <MainContainer>
            <View style={css.mainView}>
                <View style={css.HeaderView}>
                    <Text style={css.PageName}>Dashboard</Text>
                </View>
                <View style={[css.listThing,{marginRight:30}]}>
                    <Ionicons name="log-out-outline" size={40} color="white" onPress={()=>logout()} style={{marginBottom:5,marginLeft:5}} />
                </View>
            </View>
            <View>
                <View style={css.container}>
                    <QRCode value={refNo !== null ? refNo : undefined} />
                    <Text style={[css.textTitle,{fontSize:14}]}><Text style={{fontWeight:"normal"}}>Ref No:</Text> {refNo ?? "null"}</Text>
                </View>
            </View>
        </MainContainer>
    );
};

export default DashboardScreen;
