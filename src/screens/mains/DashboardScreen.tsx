import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from './../../redux/reducers';
import { Button, Icon, SafeView, TextCustom } from './../../components/commons';
import { Header, Row } from './../../components/sections';
import Color from './../../configs/colors';
import { Colors, fonts, Sizes } from './../../configs';
import MasterActions from './../../redux/master/master.actions';
import { GOOGLE_API_KEY } from './../../configs/strings';
import { scaleFactor } from './../../helpers/UtilitiesHelper';
import icons from './../../assets/icons';
import ScreenType from './../../navigations/screen.constant';
import { auth } from '~/configs/firebase';
import { Avatar } from 'react-native-elements'

const DashboardScreen = () => {
	const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
	const dispatch = useDispatch();
	const navigate = useNavigation();

	return (
		<SafeView>
			<Header noShadow title="Dashboard Screen" isMenu disableThreeDot currentScreenOff onBackPress={() => { }} />
			<View style={styles.container}>
				<View style={[styles.headerContainer, { flex: 0.7 }]}>
					<Avatar
						rounded
						source={{
							uri: auth?.currentUser?.photoURL ?? 'https://www.trackergps.com/canvas/images/icons/avatar.jpg'
						}}
						size={90}
					/>
					<TextCustom style={styles.text}>Welcome</TextCustom>
					<Text style={[styles.text, { fontSize: 25, fontWeight: 'bold' }]}>{auth?.currentUser?.displayName}</Text>
				</View>
				<View style={[styles.headerContainer, { borderTopWidth: scaleFactor(20), borderColor: Color.ORIGIN }]}>
					<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={(() => navigate.navigate(ScreenType.Master.SmartTravel))}>
						<Image source={icons.rocket} style={styles.image} />
						<View style={{ paddingHorizontal: scaleFactor(20), width: scaleFactor(200) }}>
							<TextCustom bold style={{ fontSize: 23, color: Color.ORIGIN }}>Smart Travel</TextCustom>
							<Text>Find your location with text, voice or photo.</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: scaleFactor(50) }} onPress={() => navigate.navigate(ScreenType.Chat.Chatbot)}>
						<Image source={icons.chat} style={styles.image} />
						<View style={{ paddingHorizontal: scaleFactor(20), width: scaleFactor(200) }}>
							<TextCustom bold style={{ fontSize: 23, color: Color.ORIGIN }}>Chat With Bot</TextCustom>
							<Text>Chat with AI chatbot & solve your problem.</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => Alert.alert('Liên hệ hỗ trợ','Chọn nền tảng hỗ trợ',
					[
						{text: 'Zalo', onPress: () => Linking.openURL(`https://zalo.me/0842548001`)}
					])}>
						<Image source={icons.support} style={styles.image} />
						<View style={{ paddingHorizontal: scaleFactor(20), width: scaleFactor(200) }}>
							<TextCustom bold style={{ fontSize: scaleFactor(23), color: Color.ORIGIN }}>Contact Us</TextCustom>
							<Text>Need help? Feel free to contact us.</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</SafeView>
	)
}

export default DashboardScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: scaleFactor(50),
		backgroundColor: Color.WHITE
	},

	headerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	text: {
		color: Colors.GRAY,
		fontSize: scaleFactor(25),
		paddingTop: scaleFactor(10),
		opacity: 0.7,
		alignSelf: 'center'
	},

	inputTitle: {
		color: Color.ORIGIN,
		fontSize: scaleFactor(15),
	},
	inputContent: {
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.BORDER_DARK,
		padding: 0,
		flexDirection: 'row',
		// alignItems: 'center',
		justifyContent: 'space-between',
	},
	inputForm: {
		paddingVertical: scaleFactor(10),
		// paddingHorizontal: 10,
		marginBottom: scaleFactor(-10),
		margin: 0,
		fontFamily: fonts.RobotoRegular,
		fontSize: Sizes.Content,
		color: Colors.GRAY,
		flex: 1,
	},
	image: {
		width: scaleFactor(60),
		height: scaleFactor(60),

	},

});