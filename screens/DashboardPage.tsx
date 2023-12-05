import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Dimensions, ListRenderItem } from 'react-native';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import Login from './LoginPage';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import { css } from '../objects/commonCSS';
import RegisterScreen2 from './RegisterPage2';
import ViewImageScreen from './ViewImageScreen';
import { RefNoData } from '../objects/objects';
import { ImagesAssets } from '../objects/images';
import RNFetchBlob from 'rn-fetch-blob';
// import viewImage from './viewImage';


const DashboardScreen = () => {
    const navigation = useNavigation();
    const [fetchedData, setFetchedData] = useState<RefNoData[]>([]); // fetch data from server
    const [dataProcess, setDataProcess] = useState(false); // check when loading data
    let checkCount=0;

    useEffect(()=> {
        (async()=> {
            setFetchedData([]);
            setDataProcess(true);
            await fetchRefNoApi();
        })();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            setFetchedData([]);
            setDataProcess(true);
            fetchRefNoApi();
        }, [])
      );

    const fetchRefNoApi = async() => {
        var userCode = await AsyncStorage.getItem('MobileUserCode');
        try {
            // await axios.get("http://192.168.1.123:43210/App/GetUserRefNoCollection?userCode="+userCode)
            // .then(async response => {
            await RNFetchBlob.config({
                trusty: true
            })
            .fetch('GET', "http://192.168.1.123:43210/App/GetUserRefNoCollection?userCode="+userCode,{
                    "Content-Type": "application/json",  
                },
            ).then((response) => {
                setFetchedData(response.json().map((item: { companyName: string; refNo: any; }) => ({
                    key: item.refNo,
                    companyName: item.companyName,
                    refNo: item.refNo,
                })));
                setDataProcess(false);
            })
            .catch(error => {
                Snackbar.show({
                    text: error.message,
                    duration: Snackbar.LENGTH_SHORT,
                });
            });    
        }catch (error: any) {
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_SHORT,
            });
        } finally {
            setDataProcess(false);
        }   
    };

    const renderItem = ({ item }: { item: RefNoData }) => {
        return (
            <TouchableOpacity onPress={() => viewFullImage(item.refNo)}>
                <View style={css.listItem}>
                    <View style={[css.cardBody,{flexDirection: 'row',paddingHorizontal: 0,}]}>
                        <View style={{padding:10}}>
                            <QRCode
                                size={50}
                                value={item.refNo}
                            />
                        </View>
                        <View style={{flex: 1,flexGrow: 1}}>
                            <Text style={[css.textHeader,{verticalAlign:"middle"}]}>Ref No: {item.refNo}</Text>
                            <Text style={[css.textDescription,{verticalAlign:"middle"}]}>Company Name: {item.companyName ?? "No Company"}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    function viewFullImage(refNo:string){
        if(refNo==null){
            Snackbar.show({
                text: "No QR Code in this log.",
                duration: Snackbar.LENGTH_SHORT,
            });
        }else{
            AsyncStorage.setItem('refno', refNo);
            navigation.navigate("ViewImageScreen" as never);
        }
    }

    return (
        <MainContainer>
            <View style={css.mainView}>
                <View style={css.HeaderView}>
                    <Text style={css.PageName}>Dashboard</Text>
                </View>
                <View style={[css.listThing,{marginRight:30}]}>
                    <Ionicons name="log-out-outline" size={40} color="white" onPress={()=>navigation.navigate(Login as never)} style={{marginBottom:5,marginLeft:5}} />
                </View>
            </View>
            <View style={[css.subContainer,css.row]}>
                <Text style={[css.textTitle,{flex:6,fontSize:18}]}>List of Registered Driver:</Text>
                <TouchableOpacity style={[css.circle,{flex:1,backgroundColor:"#033B6B",height:45,}]} 
                onPress={() => {navigation.navigate(RegisterScreen2 as never)}}>
                    <Text style={[{textAlign:"center",fontSize:30,color:"#FFFFFF"}]}>+</Text>
                </TouchableOpacity>
            </View>
            {dataProcess== true ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                fetchedData.length==0 ? (
                    <View style={{alignItems: 'center',justifyContent: 'center'}}>
                        <Image
                            source={ImagesAssets.noData}
                            style={{width: Dimensions.get("window").width/100*80, height: 200}}
                        />
                        <Text style={{fontSize:16,margin:30}}>No Register Driver Yet</Text>
                    </View>
                ) : (
                    <FlatList
                        data={fetchedData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.RefNo}
                    />
                )
            )}
        </MainContainer>
    );
};

export default DashboardScreen;
