import { StyleSheet, Text, View, Image, Dimensions, Pressable, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeView, TagButton } from '~/components/commons'
import { Column, Header, Row } from '~/components/sections'
import { Input, Button } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/redux/reducers'
import { useNavigation } from '@react-navigation/native'
import MasterActions from '~/redux/master/master.actions'
import { scaleFactor } from '~/helpers/UtilitiesHelper'
import { Colors } from '~/configs'
import {
	createUserWithEmailAndPassword,
	auth,
	updateProfile,
} from '~/configs/firebase'
import ScreenType from '~/navigations/screen.constant'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RegisterScreen = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const { ImgurResult } = useSelector((state: RootState) => state.master);
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [imageUrl, setImageUrl] = useState<string>('');
	// const [selectedImage, setSelectedImage] = useState<any>('');

	const register = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				updateProfile(user, {
					displayName: name,
					photoURL: imageUrl !== '' ? ImgurResult.data.link : "https://www.trackergps.com/canvas/images/icons/avatar.jpg"
				}).catch(function (error) {
					var errorMessage = `(${error.message.split('auth/')[1]}`;
					Alert.alert('Error', errorMessage)
				});
				// ...
				Alert.alert('Successfully Register!', '', [{ text: 'Login', onPress: () => navigation.navigate(ScreenType.Main.Menu) }])
			})
			.catch((error) => {
				var errorMessage = `(${error.message.split('auth/')[1]}`;
				Alert.alert('Error', errorMessage)
			});
	}

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('Vui lòng cấp quyền truy cập thư viện!!');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			base64: true,
		});

		if (!result.canceled) {
			// setSelectedImage({ base64: result.assets[0].base64 ?? '' });
			dispatch(MasterActions.getImgUrl({ image: result.assets[0].base64 ?? '' }))
			setImageUrl(`${result.assets[0].base64}`)
		}
	};

	return (
		<SafeView>
			<Header noShadow isMenu={false} title="Register" disableThreeDot />
			<View style={styles.container}>
				<Input
					placeholder='Enter your name'
					label='Name'
					leftIcon={{ type: 'material', name: 'badge' }}
					value={name}
					onChangeText={text => setName(text)}
				/>
				<Input
					placeholder='Enter your email'
					label='Email'
					leftIcon={{ type: 'material', name: 'email' }}
					value={email}
					onChangeText={text => setEmail(text)}
				/>
				<Input
					placeholder='Enter your password'
					label='Password'
					leftIcon={{ type: 'material', name: 'lock' }}
					value={password} onChangeText={text => setPassword(text)}
					secureTextEntry
				/>
				<Input
					placeholder='Pick your image'
					label='Profile Picture'
					leftIcon={{ type: 'material', name: 'face' }}
					value={imageUrl !== '' ? ImgurResult.data.link : undefined}
					disabled
					onPressIn={pickImage}
				/>
				<View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: scaleFactor(10) }}>
					{imageUrl === '' && <View style={styles.profileImgContainer}>
						<TagButton text='Choose...' onPress={pickImage} />
					</View>}

					{imageUrl !== '' && <Pressable style={styles.profileImgContainer} onPress={pickImage}>
						<Image
							resizeMode='contain'
							style={{ width: 150, height: 150, alignSelf: 'center' }}
							source={{
								uri: ImgurResult.data !== undefined ? ImgurResult.data.link : ("data:image/jpg;base64," + imageUrl),
							}} />
					</Pressable>}
				</View>

				<Button
					title="REGISTER" style={styles.button} onPress={register}
				/>
			</View>
		</SafeView>
	)
}

export default RegisterScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 10
	},
	button: {
		width: 200,
		marginTop: 10
	},
	profileImgContainer: {
		// flex: 1,
		width: scaleFactor(150),
		height: scaleFactor(150),
		borderWidth: 1,
		borderColor: Colors.GRAY_LIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	}
})