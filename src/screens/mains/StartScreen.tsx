import { Dimensions, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Colors } from '../../configs'
import imgs from '../../assets/imgs'
import { scaleFactor } from '../../helpers/UtilitiesHelper'
import { useNavigation } from '@react-navigation/core'
import ScreenType from '../../navigations/screen.constant'
import { useDispatch } from 'react-redux'
import { TextCustom } from '../../components/commons'
import MasterActions from '../../redux/master/master.actions'

const StartScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigation();
	const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
	return (
		<View style={styles.container}>
			<>
				<Image
					resizeMode="cover"
					source={imgs.bg1}
					style={{ width: SCREEN_WIDTH, flex: .4, opacity:.2 }}
				/>
				<View style={{ paddingBottom: 350, flex: 1, position: 'absolute', height: '100%', width: '100%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
					<Image
						source={imgs.CTU}
						resizeMode="cover"
						style={{ width: scaleFactor(170), height: scaleFactor(170) }}
					/>
					<Text style={{ color: Colors.GRAY, fontSize: scaleFactor(10), fontWeight: '600', padding: 5 }}>
						Can Tho University
					</Text>
				</View>

				<View style={styles.title}>
					<TextCustom isSmall style={styles.titleText}>SMART TRAVEL</TextCustom>
				</View>
				
			</>
			<ImageBackground
				resizeMode="cover"
				source={imgs.bg}
				style={{ width: SCREEN_WIDTH, flex: .4, overflow: 'hidden', zIndex: -1, opacity: .2, }}
			/>

			<View style={styles.logo}>
				<View style={styles.body}>
					<TouchableOpacity style={[styles.buttons,{paddingHorizontal: scaleFactor(150),}]} onPress={() => { navigate.navigate(ScreenType.Main.Login); }}>
						<Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default StartScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.WHITE,
	},

	logo: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		margin: 'auto',
		marginVertical: scaleFactor(85)
		// flex:5
	},

	body: {
		justifyContent: 'center',
		alignSelf: 'center',
		position: 'absolute',
		// bottom:200,

	},
	buttons: {
		borderRadius:15,
		backgroundColor: '#3ba1c5',
		minHeight: scaleFactor(7),
		padding: scaleFactor(22),
		justifyContent: 'center',
		shadowOffset: { width: 2, height: 5 },
		shadowOpacity: 0.1,
		shadowColor: '#000',
		borderWidth: 2,
		borderColor: '#FFFFFF',
		alignSelf: 'center',

	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: scaleFactor(15)
	},

	title: {
		position: 'absolute',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		margin: 'auto',

	},

	titleText: {
		fontSize: scaleFactor(55),
		textShadowOffset: { width: 0.5, height: 0.5 },
		shadowOpacity: 0.1,
		shadowColor: '#000',
		textShadowColor: '#fffff',
		textShadowRadius: 4,
		color: Colors.GRAY,
		fontFamily: "Lovera",
	}
});