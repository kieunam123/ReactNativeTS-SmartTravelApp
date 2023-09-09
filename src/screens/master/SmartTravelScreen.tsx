import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeView, TextCustom } from './../../components/commons'
import { Header } from './../../components/sections'
import icons from './../../assets/icons'
import { scaleFactor } from './../../helpers/UtilitiesHelper'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import ScreenType from './../../navigations/screen.constant'
import Color from './../../configs/colors'

const SmartTravelScreen = () => {
	const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
	const dispatch = useDispatch();
	const navigate = useNavigation();
	return (
		<SafeView>
			<Header noShadow title="Smart Travel" isMenu={false} disableThreeDot />
			<View style={styles.container}>
				<TextCustom bold style={{fontSize: 30, position:'absolute', top: scaleFactor(100), color:Color.ORIGIN}}>Select Your Input</TextCustom>
				<View style={{flexDirection:'row', paddingTop: scaleFactor(60), justifyContent: 'space-between', width: SCREEN_WIDTH/1.4 }}>
					<TouchableOpacity style={styles.itemContainer} onPress={()=> navigate.navigate(ScreenType.Master.TextScreen)}>
						<Image source={icons.text} style={styles.image} />
						<TextCustom style={styles.itemTitle}>Find With Text</TextCustom>
					</TouchableOpacity>
					<TouchableOpacity style={styles.itemContainer} onPress={() => navigate.navigate(ScreenType.Master.VoiceScreen)}>
						<Image source={icons.audio} style={styles.image} />
						<TextCustom style={styles.itemTitle}>Input Voice</TextCustom>
					</TouchableOpacity>
				</View>
				<View style={{flexDirection:'row', paddingTop: scaleFactor(60), justifyContent: 'space-between', width: SCREEN_WIDTH/1.4 }}>
					<TouchableOpacity style={styles.itemContainer} onPress={() => navigate.navigate(ScreenType.Master.ImageScreen)}>
						<Image source={icons.photo} style={styles.image} />
						<TextCustom style={styles.itemTitle}>Take Photo</TextCustom>
					</TouchableOpacity>
					<TouchableOpacity style={styles.itemContainer} onPress={() => navigate.navigate(ScreenType.Master.LibraryScreen)}>
						<Image source={icons.image} style={styles.image} />
						<TextCustom style={styles.itemTitle}>Library</TextCustom>
					</TouchableOpacity>
				</View>
			</View>
		</SafeView>
	)
}

export default SmartTravelScreen

const styles = StyleSheet.create({
	container : {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: scaleFactor(100),
		height: scaleFactor(100),
	},
	itemTitle: {
		paddingTop: scaleFactor(20),
		justifyContent: 'center',
		alignSelf: 'center',
		
	},
	itemContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	}
})