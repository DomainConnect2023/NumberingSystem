import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Pressable, TextInput } from 'react-native';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { css } from '../objects/commonCSS';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import RNFetchBlob from 'rn-fetch-blob';


const ViewImageScreen  = () => {
    const navigation = useNavigation();
    const [editProfile, setEditProfile] = useState(false);
    
    const [qrText, setQRText] = React.useState<any>("");

    const [username, setUserName] = useState('');
    const [showusername, setShowUserName] = useState('');

    const [personIC, setPersonIC] = useState('');
    const [showpersonIC, setShowPersonIC] = useState('');

    const [verhicleNo, setVehicleNo] = useState('');
    const [showverhicleNo, setShowVehicleNo] = useState('');

    const [companyName, setCompanyName] = useState('');
    const [showcompanyName, setShowCompanyName] = useState('');

    useEffect(()=> {
        (async()=> {
            var getQRText=await AsyncStorage.getItem('refno');
            setQRText(getQRText);
            await refNoAPI();
        })();
    }, []);

    const refNoAPI = async() => { 
        var refNo = await AsyncStorage.getItem('refno');

        // await axios.get(URLAccess.getDriverFunction+refNo).then(response => {
        await RNFetchBlob.config({
            trusty: true
        })
        .fetch('GET', URLAccess.getDriverFunction+refNo,{
                "Content-Type": "application/json",  
            },
        ).then((response) => {
            setVehicleNo(response.json().lorry);
            setUserName(response.json().driver);
            setCompanyName(response.json().companyName);
            setPersonIC(response.json().ic);

            setShowVehicleNo(response.json().lorry);
            setShowUserName(response.json().driver);
            setShowCompanyName(response.json().companyName);
            setShowPersonIC(response.json().ic);
        })
        .catch(error => {
            Snackbar.show({
                text: error,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
    };

    const editRefNo =async () => {
        var refNo = await AsyncStorage.getItem('refno');
        let ICType: any = "";

        if(personIC.length==12){
            ICType = personIC.substring(0,6)+"-"+personIC.substring(6,8)+"-"+personIC.substring(8,12);
        }else if(personIC.length==14){
            ICType = personIC;
        }

        // await axios.post(URLAccess.editDriverFunction, 
        // { 
        //     "RefNo": refNo as String, 
        //     "Lorry": verhicleNo as String, 
        //     "IC": ICType as String, 
        //     "Driver": username as String, 
        //     "CompanyName": companyName as String, 
        // })
        // .then(response => {
        await RNFetchBlob.config({
            trusty: true
        })
        .fetch('POST', URLAccess.editDriverFunction,{
                "Content-Type": "application/json",  
            }, JSON.stringify({
                "RefNo": refNo as String, 
                "Lorry": verhicleNo as String, 
                "IC": ICType as String, 
                "Driver": username as String, 
                "CompanyName": companyName as String, 
            }),
        ).then((response) => {
            if(response.json().isSuccess==true){
                setShowVehicleNo(verhicleNo);
                setShowUserName(username);
                setShowCompanyName(companyName);
                setShowPersonIC(ICType);

                Snackbar.show({
                    text: "Edit Successfully.",
                    duration: Snackbar.LENGTH_SHORT,
                });
            }else{
                Snackbar.show({
                    text: response.json().message,
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        })
        .catch(error => {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        });

        setEditProfile(false);
    }

    return (
    <MainContainer>
        <View style={css.mainView}>
            <Ionicons name="arrow-back-circle-outline" size={34} color="white" 
            onPress={async ()=>{[await AsyncStorage.removeItem('refno'),navigation.goBack()]}} 
            style={{marginBottom:5,marginLeft:20}} />
            <View style={css.HeaderView}>
                <Text style={css.PageName}>{qrText}</Text>
            </View>
        </View>
        <KeyboardAvoidWrapper>
            <View>
                {qrText=="" ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
                ) : (
                editProfile==true ? (
                    <View style={css.container}>
                        <View style={styles.QRContainer}>
                            <QRCode
                                size={200}
                                value={qrText}
                            />
                            <Text style={styles.textRef}>Ref No: {qrText}</Text>
                        </View>
                        <View style={css.row}>
                            <Text style={css.inputText}>Lorry Number: <Text style={{color:"red"}}>*</Text></Text>
                            {verhicleNo=="" ? (
                            <TextInput
                                style={[css.input,{borderColor:"#FF0606"}]}
                                placeholder="Lorry Number"
                                value={verhicleNo}
                                onChangeText={setVehicleNo}
                                placeholderTextColor="#11182744"
                            />
                            ) : (
                            <TextInput
                                style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                                placeholder="Lorry Number"
                                value={verhicleNo}
                                onChangeText={setVehicleNo}
                                placeholderTextColor="#11182744"
                            />
                            )}
                        </View>
                        {(verhicleNo=="") && (
                            <View style={[css.row,{marginBottom:10,}]}>
                                <Text style={css.inputText}></Text>
                                <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Can't be empty!</Text>
                            </View>
                        )}

                        <View style={css.row}>
                            <Text style={css.inputText}>Driver Name: <Text style={{color:"red"}}>*</Text></Text>
                            {username=="" ? (
                            <TextInput
                                style={[css.input,{borderColor:"#FF0606"}]}
                                placeholder="Driver Name"
                                value={username}
                                onChangeText={setUserName}
                                placeholderTextColor="#11182744"
                            />
                            ) : (
                            <TextInput
                                style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                                placeholder="Driver Name"
                                value={username}
                                onChangeText={setUserName}
                                placeholderTextColor="#11182744"
                            />
                            )}
                        </View>
                        {(username=="") && (
                            <View style={[css.row,{marginBottom:10,}]}>
                                <Text style={css.inputText}></Text>
                                <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Can't be empty!</Text>
                            </View>
                        )}

                        <View style={css.row}>
                            <Text style={css.inputText}>Driver IC: <Text style={{color:"red"}}>*</Text></Text>
                            {(personIC=="" || personIC.length!=12 && personIC.length!=14) ? (
                            <TextInput
                                style={[css.input,{borderColor:"#FF0606"}]}
                                placeholder="IC Number"
                                keyboardType = 'number-pad'
                                value={personIC}
                                onChangeText={setPersonIC}
                                placeholderTextColor="#11182744"
                            />
                            ) : (
                            <TextInput
                                style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                                placeholder="IC Number"
                                keyboardType = 'number-pad'
                                value={personIC}
                                onChangeText={setPersonIC}
                                placeholderTextColor="#11182744"
                            />
                            )}
                        </View>
                        {(personIC=="") ? (
                            <View style={[css.row,{marginBottom:10,}]}>
                                <Text style={css.inputText}></Text>
                                <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Can't be empty!</Text>
                            </View>
                        ):(
                            (personIC.length!=12 && personIC.length!=14) ? (
                                <View style={[css.row,{marginBottom:10,}]}>
                                    <Text style={css.inputText}></Text>
                                    <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>IC format is invalid.</Text>
                                </View>
                            ) : (
                                <></>
                            )
                        )}

                        <View style={css.row}>
                            <Text style={css.inputText}>Company Name:</Text>
                            <TextInput
                                style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                                placeholder="Company Name"
                                value={companyName}
                                onChangeText={setCompanyName}
                                placeholderTextColor="#11182744"
                            />
                        </View>

                        <View style={css.row}>    
                            <Pressable style={styles.buttonSave} 
                                onPress={()=>{editRefNo()}}>
                                <Text style={[css.text,{backgroundColor: '#A0D6B4',}]}>Save</Text>
                            </Pressable>
                            <Pressable style={styles.buttonCancel} 
                                onPress={()=>{[refNoAPI(),setEditProfile(false)]}}>
                                <Text style={[css.text,{backgroundColor: 'gray',}]}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View style={css.container}>
                        <View style={styles.QRContainer}>
                            <QRCode
                                size={200}
                                value={qrText}
                            />
                            <Text style={styles.textRef}>Ref No: {qrText}</Text>
                        </View>
                        <View style={css.row}>
                            <Text style={css.Title}>Lorry Number: <Text style={{color:"red"}}>*</Text></Text>
                            <Text style={css.subTitle}>{showverhicleNo}</Text>
                        </View>

                        <View style={css.row}>
                            <Text style={css.Title}>Driver Name: <Text style={{color:"red"}}>*</Text></Text>
                            <Text style={css.subTitle}>{showusername}</Text>
                        </View>

                        <View style={css.row}>
                            <Text style={css.Title}>Driver IC: <Text style={{color:"red"}}>*</Text></Text>
                            <Text style={css.subTitle}>{showpersonIC}</Text>
                        </View>

                        <View style={css.row}>
                            <Text style={css.Title}>Company Name:</Text>
                            <Text style={css.subTitle}>{showcompanyName}</Text>
                        </View>

                        <Pressable style={styles.buttonEdit} onPress={()=>{setEditProfile(true)}}>
                            <Text style={css.text}>Edit</Text>
                        </Pressable>
                    </View>
                )
                )}
            </View>
        </KeyboardAvoidWrapper>
    </MainContainer>
    );
};

const styles = StyleSheet.create({
    QRContainer: {
        margin:10
    },
    textRef: {
        textAlign:"center", 
        fontSize:18,
        marginTop:15
    },
    buttonSave: {
        backgroundColor: '#A0D6B4',
        margin:10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        marginTop: 10
    },
    buttonCancel: {
        backgroundColor: 'gray',
        margin:10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        marginTop: 10
    },
    buttonEdit: {
        backgroundColor: 'black',
        margin:10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        marginTop: 10
    },
});

export default ViewImageScreen ;
