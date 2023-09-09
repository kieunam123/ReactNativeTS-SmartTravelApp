import { Alert, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, SafeView } from '../../../components/commons'
import { Column, Header, Row } from '../../../components/sections'
import { isIos, scaleFactor } from '../../../helpers/UtilitiesHelper'
import icons from '../../../assets/icons'
import { Colors } from '../../../configs'
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux'
import MasterActions from '../../../redux/master/master.actions'
import { RootState } from '../../../redux/reducers'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FindWithImageScreen = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [image, setimage] = useState<any>("");
	const { ImgurResult } = useSelector((state: RootState) => state.master);

	const camera = async () => {
		const grantedCamera = await ImagePicker.getCameraPermissionsAsync();
		const granted = await ImagePicker.requestCameraPermissionsAsync();
		if (grantedCamera.status !== "granted" && granted.status !== 'granted') {
			Alert.alert('Please allow app to access your Camera!', '', [{ text: 'OK', style: 'cancel' }])
		} else {
			takePicture();
		}
	};

	const takePicture = async () => {
		let options = {
			quality: isIos() ? 0.01 : 0.3,
			base64: true,
			exif: false,
		};
		let result = await ImagePicker.launchCameraAsync(options);
		if (!result.canceled) {
			// const uri_fixed = Platform.OS === 'ios' ? result.assets[0].uri.replace('file://', '') : result.assets[0].uri;
			setimage({ base64: result.assets[0].base64 ?? '' });
			dispatch(MasterActions.getImgUrl({ image: result.assets[0].base64 ?? '' }))
		};
	};
	return (
		<SafeView>
			<Header noShadow title='Find With Image' isMenu={false} currentScreenOff onBackPress={() => { navigation.goBack() }} disableThreeDot />
			<View style={styles.container}>
				<View style={styles.imgContainer}>
					<View style={styles.buttonContainer}>
						<Pressable onPress={() => { camera() }}>
							{image !== '' && <Image
								resizeMode='cover'
								style={{ width: SCREEN_WIDTH * 90 / 100, height: SCREEN_HEIGHT * 50 / 100, alignSelf: 'center' }}
								source={{
									uri: ImgurResult.data !== undefined ? ImgurResult.data.link : ("data:image/jpg;base64," + image.base64),
								}} />
							}
							{image === '' && <Image
								source={icons.camera}
								style={{ width: scaleFactor(150), height: scaleFactor(150), opacity: 0.2, alignSelf: 'center' }}

							/>}
						</Pressable>
					</View>
				</View>
				{image !== '' && <Row isSmall>
					<Column style={{ justifyContent: 'center' }}>
						<Button
							isBold
							title={`Take Picture Again`}
							radius={10}
							color={Colors.DANGER}
							bgColor={Colors.WHITE}
							outline={false}
							onPress={() => camera()}
						/>
					</Column>
				</Row>}
				<Row isSmall>
					<Column style={{ justifyContent: 'center' }}>
						<Button
							isBold
							title={image !== '' ? `Search With Image` : `Take Picture`}
							radius={10}
							color={Colors.ORIGIN}
							bgColor={Colors.WHITE}
							outline={false}
							onPress={() => image !== '' ? (ImgurResult.data !== undefined ? dispatch(MasterActions.getGoogleImgResult(ImgurResult.data.link, 'us')) : {}) : camera()}
						/>
					</Column>
				</Row>
			</View>
		</SafeView>
	)
}

export default FindWithImageScreen

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
})