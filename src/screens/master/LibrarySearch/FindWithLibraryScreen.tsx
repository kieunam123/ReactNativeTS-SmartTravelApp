import { StyleSheet, Text, View, Dimensions, Pressable, Image } from 'react-native'
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MasterActions from '~/redux/master/master.actions';
import { Button, SafeView } from '~/components/commons';
import { Column, Header, Row } from '~/components/sections';
import { scaleFactor } from '~/helpers/UtilitiesHelper';
import { RootState } from '~/redux/reducers';
import icons from '~/assets/icons';
import { Colors } from '~/configs';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FindWithLibraryScreen = () => {
  const dispatch = useDispatch();
	const navigation = useNavigation();
  const { ImgurResult } = useSelector((state: RootState) => state.master);
  const [selectedImage, setSelectedImage] = useState<any>('');

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
      setSelectedImage({ base64: result.assets[0].base64 ?? '' });
			dispatch(MasterActions.getImgUrl({ image: result.assets[0].base64 ?? '' }))
    }
  };

  return (
		<SafeView>
			<Header noShadow title='Find With Image From Library' isMenu={false} currentScreenOff onBackPress={() => { navigation.goBack() }} disableThreeDot />
			<View style={styles.container}>
				<View style={styles.imgContainer}>
					<View style={styles.buttonContainer}>
						<Pressable onPress={pickImage}>
							{selectedImage !== '' && <Image
								resizeMode='cover'
								style={{ width: SCREEN_WIDTH * 90 / 100, height: SCREEN_HEIGHT * 50 / 100, alignSelf: 'center' }}
								source={{
									uri: ImgurResult.data !== undefined ? ImgurResult.data.link : ("data:image/jpg;base64," + selectedImage.base64),
								}} />
							}
							{selectedImage === '' && <Image
								source={icons.library}
								style={{ width: scaleFactor(150), height: scaleFactor(150), opacity: 0.2, alignSelf: 'center' }}

							/>}
						</Pressable>
					</View>
				</View>
				{selectedImage !== '' && <Row isSmall>
					<Column style={{ justifyContent: 'center' }}>
						<Button
							isBold
							title={`Select Other Image`}
							radius={10}
							color={Colors.DANGER}
							bgColor={Colors.WHITE}
							outline={false}
							onPress={pickImage}
						/>
					</Column>
				</Row>}
				<Row isSmall>
					<Column style={{ justifyContent: 'center' }}>
						<Button
							isBold
							title={selectedImage !== '' ? `Search With Image` : `Pick Image From Library`}
							radius={10}
							color={Colors.ORIGIN}
							bgColor={Colors.WHITE}
							outline={false}
							onPress={() => selectedImage !== '' ? (ImgurResult.data !== undefined ? dispatch(MasterActions.getGoogleImgResult(ImgurResult.data.link, 'us')) : {}) : pickImage()}
						/>
					</Column>
				</Row>
			</View>
		</SafeView>
  )
}

export default FindWithLibraryScreen

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