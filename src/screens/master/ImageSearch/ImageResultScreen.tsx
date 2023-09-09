import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Accordion, Button, FlatListCommon, SafeView, TextCustom } from '../../../components/commons'
import { Column, Container, Header, Row } from '../../../components/sections'
import { Colors } from '../../../configs'
import { scaleFactor } from '../../../helpers/UtilitiesHelper'
import { ImageResultList } from '../../../containers/master'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers'
import { IImageInfoList, IVisualMatches } from '../../../apis/types.service'
import { useNavigation } from '@react-navigation/native'
import ScreenType from '../../../navigations/screen.constant'
import Loading2 from '~/containers/Loading2'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { WebView } from 'react-native-webview';

const ImageResultScreen = () => {
	const { GoogleImgResult } = useSelector((state: RootState) => state.master);
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [isLargePic, setIsLargePic] = useState<boolean>(false);
	const [itemImgUrl, setItemImgUrl] = useState<string>('')
	const [isWebView, setIsWebView] = useState<boolean>(false);
	const [webUrl, setWebUrl] = useState<string>('');
	const js = `document.getElementsByTagName('body')[0].style.height = '${Dimensions.get('window').height
		}px';`;
	return (
		<SafeView>
			<Header noShadow title='Image Search Result' isMenu={false} disableThreeDot />
			{!isWebView && <View style={styles.container}>
				<View style={styles.InfoContainer}>
					<View style={styles.InfoImgContainer}>
						<FlatListCommon
							lockVertical={true}
							horizontal={true}
							data={GoogleImgResult.knowledge_graph !== undefined ? (GoogleImgResult.knowledge_graph[0].images ?? []) : []}
							renderItem={({ item }: { item: IImageInfoList }) => (
								<>
									<Pressable onPress={() => {
										setItemImgUrl(item.link ?? '')
										setIsLargePic(true)
									}}>
										<Image
											resizeMode='contain'
											source={{
												uri: item.link ?? ''
											}}
											style={styles.image}
										/>
									</Pressable>
									<Image
											resizeMode='contain'
											source={{
												uri: item.link ?? ''
											}}
											style={[styles.image,{overflow:'hidden'}]}
										/>
								</>
							)}
						/>
					</View>
					<View style={styles.locationTitle}>
						<TextCustom bold style={{ fontSize: scaleFactor(20) }}>{GoogleImgResult.knowledge_graph !== undefined ? GoogleImgResult.knowledge_graph[0].title : ''}</TextCustom>
						<TextCustom>{GoogleImgResult.knowledge_graph !== undefined ? GoogleImgResult.knowledge_graph[0].subtitle : ''}</TextCustom>
					</View>
					{GoogleImgResult.knowledge_graph !== undefined && <Row>
						<Column style={{ justifyContent: 'center' }}>
							<Button
								isSmall
								isBold
								title={`Search This Location`}
								radius={10}
								color={Colors.ORIGIN}
								bgColor={Colors.WHITE}
								outline
								onPress={() => navigation.navigate(ScreenType.Master.TextScreen, { searchedLocation: GoogleImgResult.knowledge_graph![0].title })}
							/>
						</Column>
					</Row>}
				</View>
				<View style={{ flex: 1 }}>
					<Accordion title='Related Result' isOpen style={styles.Information} showIcon={false}>
						{/* <Container isIncludeScrollView> */}
						<FlatListCommon
							isShowVertical={false}
							data={GoogleImgResult.visual_matches ?? []}
							renderItem={({ item }: { item: IVisualMatches }) => (
								<ImageResultList
									title={item.title}
									thumbnail={item.thumbnail}
									link={item.link}
									source={item.source}
									onPress={() => {
										setWebUrl(item.link)
										setIsWebView(true)
									}}
								/>
							)}
						/>
						{/* </Container> */}
					</Accordion>
				</View>
				<Modal visible={isLargePic} onRequestClose={() => setIsLargePic(!isLargePic)} transparent>
					<TouchableOpacity onPress={() => setIsLargePic(!isLargePic)} style={styles.backdrop}>
						<Image source={{ uri: itemImgUrl }} style={[styles.largeImage, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]} resizeMode="contain" />
					</TouchableOpacity>
				</Modal>
			</View>}
			{isWebView && <WebView
				style={styles.container}
				// source={{ uri: 'https://docs.google.com/presentation/d/1C9YiYvoqxOmNGcyHh1OlKniC2UYVaVa8/edit?usp=share_link&ouid=106465180300815770534&rtpof=true&sd=true' }}
				source={{ uri: webUrl }}
				javaScriptEnabled
				domStorageEnabled
				decelerationRate="normal"
				javaScriptEnabledAndroid
				onShouldStartLoadWithRequest={(e) => {
					return true;
				}}
				startInLoadingState
				injectedJavaScript={js}
				automaticallyAdjustContentInsets={false}
				originWhitelist={['*']}
				renderLoading={() => (
					<View
						style={{
							position: 'absolute',
							alignSelf: 'center',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Loading2 isVisible={true} text={'Vui lòng đợi giây lát'} />
					</View>
				)}
			/>}
		</SafeView>
	)
}

export default ImageResultScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: SCREEN_HEIGHT,
		width: SCREEN_WIDTH
	},
	InfoContainer: {
		backgroundColor: Colors.WHITE,
		padding: scaleFactor(5),
	},
	InfoImgContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	image: {
		flex: 1,
		height: scaleFactor(250),
		width: scaleFactor(300),
		marginHorizontal: scaleFactor(5)
	},
	locationTitle: {
		padding: scaleFactor(10)
	},
	Information: {
		flex: 1,
		paddingHorizontal: scaleFactor(10),
		paddingVertical: scaleFactor(10)
	},
	largeImage: {
		flex: 1,
	},
	backdrop: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
	},
})