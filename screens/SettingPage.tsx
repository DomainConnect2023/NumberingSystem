import React, { useEffect, useState } from 'react';
import { View, Text, Platform, Image, Dimensions, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import { css } from '../objects/commonCSS';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import { ImagesAssets } from '../objects/images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import Login from './LoginPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = ({ navigation }: any) => {

    const [userName, setUserName] = useState("aaa");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);

    useEffect(() => {
        (async () => {
            var userCode = await AsyncStorage.getItem('MobileUserCode');
            setUserName(userCode ?? "");
        })();
    }, []);

    const onToggleSwitch = () => {
        setIsDarkMode(!isDarkMode);
    };

    const onToggleLanguage = () => {
        setShowLanguage(!showLanguage);
    };

    const changeLanguage = (language: string) => {
        console.log(language);
        setShowLanguage(false)
        
    };

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#666699" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView]}>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>Setting</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView, { marginTop: 0 }]}>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>Setting</Text>
                    </View>
                </View>
            )}

            <KeyboardAvoidWrapper>
                <View style={[css.row, { width: Dimensions.get("screen").width, padding: 10, justifyContent: 'center', alignItems: "center" }]}>
                    <View style={{ width: "30%", alignItems: "center", padding: 10 }}>
                        <Image
                            source={ImagesAssets.logoImage}
                            style={{ width: 80, height: 80, backgroundColor: "#666699", borderRadius: 50 }}
                        />
                    </View>
                    <View style={{ width: "50%", padding: 10 }}>
                        <Text style={css.textHeader}>UserName: {userName}</Text>
                        <Text style={css.textHeader}>Company Name: --</Text>
                    </View>
                    <View style={{ width: "20%", padding: 10, alignItems: "center" }}>
                        <AntDesign name={"right" ?? ""} size={20} color={"black"} />
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={styles.preferenceContainer}>
                        <View>
                            <Text style={[css.textHeader, { fontSize: 20, color: '#FFF', }]}>Preference</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={() => onToggleLanguage()}>
                    <View style={[css.row, { width: Dimensions.get("screen").width, padding: 10, justifyContent: 'center', alignItems: "center" }]}>
                        <View style={{ width: "20%", alignItems: "center", padding: 10 }}>
                            <Ionicons name={"earth" ?? ""} size={40} color={"black"} />
                        </View>
                        <View style={{ width: "60%", padding: 10, flexDirection: "row" }}>
                            <Text style={[css.textHeader, { flex: 1, }]}>Language</Text>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={{ color: "gray" }}>Language</Text>
                            </View>
                        </View>
                        <View style={{ width: "20%", padding: 10, alignItems: "center" }}>
                            <AntDesign name={showLanguage ? 'down' : 'right'} size={20} color={"black"} />
                        </View>
                    </View>
                </TouchableOpacity>

                <Collapsible collapsed={!showLanguage}>
                    <View style={[styles.container]}>
                        <TouchableOpacity onPress={() => changeLanguage('en')}>
                            <View style={{ padding: 20, margin: 5, borderRadius: 10, alignSelf: 'center', backgroundColor: 'lightgray', width: Dimensions.get("screen").width / 100 * 80, borderWidth: 1 }}>
                                <Text>English</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage('zh')}>
                            <View style={{ padding: 20, margin: 5, borderRadius: 10, alignSelf: 'center', backgroundColor: 'lightgray', width: Dimensions.get("screen").width / 100 * 80, borderWidth: 1 }}>
                                <Text>中文</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage('my')}>
                            <View style={{ padding: 20, margin: 5, borderRadius: 10, alignSelf: 'center', backgroundColor: 'lightgray', width: Dimensions.get("screen").width / 100 * 80, borderWidth: 1 }}>
                                <Text>Malay</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Collapsible>

                <View style={[css.row, { width: Dimensions.get("screen").width, padding: 10, justifyContent: 'center', alignItems: "center" }]}>
                    <View style={{ width: "20%", alignItems: "center", padding: 10 }}>
                        <Ionicons name={"moon" ?? ""} size={40} color={"black"} />
                    </View>
                    <View style={{ width: "60%", padding: 10 }}>
                        <Text style={css.textHeader}>Dark-Mode</Text>
                    </View>
                    <View style={{ width: "20%", padding: 10, alignItems: "center" }}>
                        <Switch style={styles.switch} value={isDarkMode} onValueChange={onToggleSwitch} />
                    </View>
                </View>

                <TouchableOpacity onPress={()=>navigation.navigate(Login as never)}>
                    <View style={[css.row, {width: Dimensions.get("screen").width, padding:10,justifyContent: 'center',alignItems:"center"}]}>
                        <View style={{ width:"20%", alignItems:"center", padding:10}}>
                            <Ionicons name={"log-out-outline" ?? ""} size={40} color={"black"} />
                        </View>
                        <View style={{width:"80%", padding:10}}>
                            <Text style={css.textHeader}>Log Out</Text>
                        </View>
                    </View>
                </TouchableOpacity>

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
    preferenceContainer: {
        width: Dimensions.get('screen').width / 100 * 90,
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    },
});

export default SettingScreen;
