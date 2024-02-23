import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import Login from './LoginPage';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import { css } from '../objects/commonCSS';
import RegisterScreen2 from './RegisterPage2';
import { RefNoData } from '../objects/objects';
import RNFetchBlob from 'rn-fetch-blob';

const DashboardScreen = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState("aaa");
    const [fetchedData, setFetchedData] = useState<RefNoData[]>([]);
    const [dataProcess, setDataProcess] = useState(false);

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
        setFetchedData([]);
        var userCode = await AsyncStorage.getItem('MobileUserCode');
        setUserName(userCode ?? "");

        try {
            await RNFetchBlob.config({
                trusty: true
            })
            .fetch('GET', URLAccess.getRefNoFunction+userCode,{
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
                        <View style={{flex: 1,flexGrow: 1, alignSelf:"center"}}>
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
            {Platform.OS === "android" ? (
                <View style={[css.mainView]}>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>Dashboard</Text>
                    </View>
                    <View style={[css.listThing,{marginRight:30}]}>
                        <Ionicons name="log-out-outline" size={40} color="white" onPress={()=>navigation.navigate(Login as never)} style={{marginBottom:5,marginLeft:5}} />
                    </View>
                </View>
            ) : (
                <View style={[css.mainView]}>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>Dashboard</Text>
                    </View>
                    <View style={[css.listThing,{marginRight:30}]}>
                        <Ionicons name="log-out-outline" size={40} color="white" onPress={()=>navigation.navigate(Login as never)} style={{marginBottom:5,marginLeft:5}} />
                    </View>
                </View>
            )}

            {dataProcess == true ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={{height:Dimensions.get("screen").height/100*77}}>
                    <View style={[css.container]}>
                        <View style={styles.absoluteContainer}></View>

                        <View style={styles.profileCard}>
                            <View style={[css.row,{padding: 10}]}>
                                <View>
                                    <QRCode value={userName ?? "aaa"} />
                                </View>
                                <View style={[styles.profileText,]}>
                                    <Text style={css.textHeader}>Name: {userName}</Text>
                                    {/* <Text style={css.textHeader}>Company: BBB</Text> */}
                                </View>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={[css.subContainer,css.row]}>
                            <Text style={[css.textTitle,{flex:1,alignContent:"flex-start",marginLeft:10}]}>Registered Record:</Text>
                            <TouchableOpacity style={[css.circle,{backgroundColor:"#666699",width:50,height:40,marginRight:10}]} 
                            onPress={() => {navigation.navigate(RegisterScreen2 as never)}}>
                                <Text style={[{fontSize:30,color:"#FFFFFF", alignSelf:"center" }]}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={fetchedData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.logID}
                        // horizontal  -- change slide from top>bottom to left>right
                    />
                </View>
            )}
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    absoluteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#666699',
        width: Dimensions.get("screen").width,
        height: 100,
    },
    profileCard: {
        flexGrow: 1,
        padding: 20,
        width: "90%",
        backgroundColor: '#E6E8EA',
        borderRadius: 20,
    },
    profileText: {
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        padding: 15,
        flex: 1, 
        flexGrow: 1,
    },
});

export default DashboardScreen;
