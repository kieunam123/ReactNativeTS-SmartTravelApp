import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeView } from '~/components/commons'
import { Header } from '~/components/sections'
import { Input, Button } from 'react-native-elements'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import ScreenType from '~/navigations/screen.constant'
import {
    signInWithEmailAndPassword,
    auth,
} from '~/configs/firebase'

const LoginScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigation();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const signIn = () => {
		signInWithEmailAndPassword(auth,email, password)
			.catch((error) => {
				var errorMessage = `(${error.message.split('auth/')[1]}`;
				Alert.alert('Error',errorMessage)
			});
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(function (user) {
			if (user) {
				navigate.navigate(ScreenType.Main.Menu)
			} else {
				// No user is signed in.
			}
		});
		return unsubscribe;
	}, [])

	return (
		<SafeView>
			<Header noShadow isMenu={false} title="Login" disableThreeDot />
			<View style={styles.container}>
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
					onChangeText={text => setPassword(text)}
					secureTextEntry
				/>
				<Button title="LOGIN" style={styles.button} onPress={signIn} />
				<Button title="REGISTER" style={styles.button} onPress={() => navigate.navigate(ScreenType.Main.Register)} />
			</View>
		</SafeView>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 10
	},
	button: {
		width: 200,
		marginTop: 10
	}
})
