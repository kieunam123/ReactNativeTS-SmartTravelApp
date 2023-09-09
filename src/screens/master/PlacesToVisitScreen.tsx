import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { FlatListCommon, SafeView } from './../../components/commons'
import { Container, Header } from './../../components/sections'
import { Colors } from './../../configs'
import { scaleFactor } from './../../helpers/UtilitiesHelper'
import { ISights } from './../../apis/types.service'
import { PlacesCard } from './../../containers/master'
import { useSelector } from 'react-redux'
import { RootState } from './../../redux/reducers'
import { WebView } from 'react-native-webview';
import Loading2 from '~/containers/Loading2'

const PlacesToVisitScreen = ({ route }) => {
	const { userloclat, userloclong } = route.params ?? 0;
	const { TopSights } = useSelector((state: RootState) => state.master);
	const [isWebView, setIsWebView] = useState<boolean>(false);
	const [webUrl, setWebUrl] = useState<string>('');
	const js = `document.getElementsByTagName('body')[0].style.height = '${
		Dimensions.get('window').height
	  }px';`;
	return (
		<SafeView>
			<Header title='Places To Visit' noShadow disableThreeDot isMenu={false} />
			{!isWebView && <View style={styles.container}>
				<View style={styles.cardContainer}>
					<FlatListCommon
						isShowVertical={false}
						data={TopSights.sights ?? []}
						renderItem={({ item }: { item: ISights }) => (
							<PlacesCard
								title={item.title ?? ''}
								description={item.description ?? ''}
								thumbnail={item.thumbnail ?? 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg'}
								rating={item.rating ?? 0}
								reviews={item.reviews ?? 0}
								link={item.link ?? ''}
								onPress={() => {
									setWebUrl(`https://www.google.com/maps/search/${item.title}/@${userloclat},${userloclong},17z/data=!3m1!4b1?hl=vi-VN`)
									setIsWebView(true)
								}}
							/>
						)}
					/>
				</View>
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

export default PlacesToVisitScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardContainer: {
		backgroundColor: Colors.WHITE,
		flex: 1,
		padding: scaleFactor(5),
	}
})