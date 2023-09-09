import { Alert, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '~/redux/reducers';
import { Button, Icon, SafeView, TextCustom } from '~/components/commons';
import { Column, Header, Row } from '~/components/sections';
import { scaleFactor } from '~/helpers/UtilitiesHelper';
import icons from '~/assets/icons';
import { Colors, Sizes, fonts } from '~/configs';
import MasterActions from '~/redux/master/master.actions';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// import { Audio } from 'expo-av';
import { TextInput } from 'react-native-gesture-handler';
import ScreenType from '~/navigations/screen.constant';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

// #region for real devices , uncomment below codes for testing

const FindWithVoiceScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [started, setStarted] = useState<boolean>(false);
    const [voiceText, setVoiceText] = useState<string[]>(['']);

    useEffect(() => {
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResultsHandler;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, []);

    const onSpeechError = (error) => {
        Alert.alert('Error', `Cannot recognize your voice,\n please try again\nError: ${error}`);
        console.error(error);
    };

    const startTranscription = async () => {
        await Voice.start('vi-VN');
        setStarted(true);
    };

    const stopTranscription = async () => {
        await Voice.stop();
        setStarted(false);
    };

    const onSpeechResultsHandler = (result) => {
        setVoiceText(result.value);
    };

    return (
        <SafeView>
            <Header noShadow title='Find With Voice' isMenu={false} currentScreenOff onBackPress={() => { navigation.goBack() }} disableThreeDot />
            <View style={styles.container}>
                <View style={styles.imgContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => { !started ? startTranscription() : stopTranscription() }}>
                            {started && <>
                                <Image
                                    source={icons.rec}
                                    style={{ width: scaleFactor(150), height: scaleFactor(150), alignSelf: 'center' }}
                                />
                                <Text style={styles.text}>Recording</Text>
                            </>}
                            {!started && <>
                                <Image
                                    source={icons.mic}
                                    style={{ width: scaleFactor(150), height: scaleFactor(150), opacity: 0.2, alignSelf: 'center' }}
                                />
                                <Text style={styles.text}>Touch To Start</Text>
                            </>}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ padding: scaleFactor(30), }}>
                    <TextCustom style={styles.inputTitle}>
                        Result
                    </TextCustom>
                    <View style={styles.resultContent}>
                        {voiceText.map((result, index) => <Text style={styles.inputForm} key={index}>{result}</Text>)}
                    </View>
                </View>
                {!started && <Row isSmall>
                    <Column style={{ justifyContent: 'center' }}>
                        <Button
                            isBold
                            title={'Search This Location'}
                            radius={10}
                            color={Colors.ORIGIN}
                            bgColor={Colors.WHITE}
                            outline={false}
                            onPress={() => voiceText[0] !== '' ? navigation.navigate(ScreenType.Master.TextScreen, { searchedLocation: voiceText[0] }) : Alert.alert('No input found!', 'Please input your voice')}
                        />
                    </Column>
                </Row>}
                {(!started && voiceText[0] !== '') && <Row isSmall>
                    <Column style={{ justifyContent: 'center' }}>
                        <Button
                            isBold
                            title={`Clear Result`}
                            radius={10}
                            color={Colors.DANGER}
                            bgColor={Colors.WHITE}
                            outline={false}
                            onPress={() => setVoiceText([''])}
                        />
                    </Column>
                </Row>}
            </View>
        </SafeView>
    )
}
// #endregion

//#region For tesing, uncomment below codes for real devices

// const FindWithVoiceScreen = () => {
//     return (
//         <SafeView>
//             <Header title={'Coming Soon'} isMenu disableThreeDot noShadow />
//             <View style={styles.container}>
//                 <Text style={styles.text}>chức năng đang được bảo trì</Text>
//             </View>
//         </SafeView>
//     )
// }
//#endregion

export default FindWithVoiceScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleFactor(25),
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH
    },
    imgContainer: {
        flex: 0.7,
        flexDirection: 'row',
        // paddingVertical: scal0.eFactor(180),
        // paddingHorizontal:scaleFactor(50),
        padding: 5,
        marginBottom: scaleFactor(25)
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#CFC8CB',
    },
    inputTitle: {
        color: Colors.ORIGIN,
        fontSize: scaleFactor(15),
    },
    resultContent: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.BORDER_DARK,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // flex:1,

    },
    inputForm: {
        paddingVertical: scaleFactor(10),
        // paddingHorizontal: 10,
        marginBottom: scaleFactor(-10),
        margin: 0,
        fontFamily: fonts.RobotoRegular,
        fontSize: Sizes.Content,
        color: Colors.GRAY,
        // flex: 1,
    },
    text: {
        color: Colors.GRAY,
        fontSize: 25,
        marginTop: 10,
        opacity: 0.5,
        alignSelf: 'center'
    },
})