import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from './../../configs';
import { FlatListCommon, Icon, TextCustom } from './../../components/commons';
import { scaleFactor } from './../../helpers/UtilitiesHelper';

export interface IProps {
	title: string;
	link?: string;
	description: string;
	thumbnail: string;
	rating: number;
	reviews: number;
	onPress: () => void;
}

const PlacesCard = ({
	thumbnail,
	title,
	rating,
	reviews,
	onPress,
	description,
	link
}: IProps) => {

	const starcomponent = (rating: number): JSX.Element => {
		const stars: any = [];
		if (rating < 1){
			for (let i = 1; i <= 5; i++) {
				stars.push(
					<Icon
						key={i}
						type='MaterialIcons'
						name='star-border'
						color={Colors.Yellow}
					/>
				)
			}
		} else if (rating >= 1) {
		for (let i = 1; i < rating; i++) {
			stars.push(
				<Icon
					key={i}
					type='MaterialIcons'
					name='star'
					color={Colors.Yellow}
				/>
			)
		}}
		if ((rating > 1 && rating < 2) || (rating > 2 && rating < 3) || (rating > 3 && rating < 4)) {
			return (
				<View style={{ flexDirection: 'row', }}>
					{stars}
					<Icon
						type='MaterialIcons'
						name='star-half'
						color={Colors.Yellow}
					/>
					<Icon
						type='MaterialIcons'
						name='star-border'
						color={Colors.Yellow}
					/>
				</View>
			)
		} else if (rating > 4 && rating < 5) {
			return (
				<View style={{ flexDirection: 'row', }}>
					{stars}
					<Icon
						type='MaterialIcons'
						name='star-half'
						color={Colors.Yellow}
					/>
				</View>
			)
		} else return (
			<View style={{ flexDirection: 'row', flex: 1 }}>
				{stars}
			</View>
		)
	}

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.itemContainer}>
				<View style={styles.imgContainer}>
					<Image
						resizeMode='contain'
						source={{
							uri: thumbnail
						}}
						style={styles.image}
					/>
				</View>
				<View style={styles.bodyContainer}>
					<View style={styles.itemHeader}>
						<TextCustom bold style={{ color: Colors.ORIGIN, paddingVertical: 10 }}>{title}</TextCustom>
					</View>
					<View style={styles.itemBody}>
						<TextCustom>{rating}</TextCustom>
						{starcomponent(rating)}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default PlacesCard

const styles = StyleSheet.create({
	itemContainer: {
		backgroundColor: Colors.WHITE,
		marginTop: 10,
		marginHorizontal: 10,
		paddingLeft: 5,
		paddingVertical: 10,
		borderRadius: 5,
		borderWidth: 0.3,
		borderColor: Colors.GRAY_LIGHT
	},
	imgContainer: {

	},
	bodyContainer: {
		paddingHorizontal: 10
	},
	image: {
		flex: 1,
		height: scaleFactor(250),
		width: scaleFactor(330),
		marginHorizontal: scaleFactor(5)
	},
	itemHeader: {
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderBottomColor: '#f1f1f1',
		paddingBottom: 5,
		marginBottom: 5,
	},
	itemBody: {
		flexDirection: 'row',
		marginVertical: 3,
		paddingVertical: 3,
		alignItems: 'center'
	},

})