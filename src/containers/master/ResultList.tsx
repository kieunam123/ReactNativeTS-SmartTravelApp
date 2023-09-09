import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from './../../configs';
import { TextCustom } from './../../components/commons';
import Color from './../../configs/colors';
import { convertStringToNumber, getDistanceFromUserToFarm } from './../../helpers/UtilitiesHelper';

export interface IProps {
	lat?: number;
	lon?: number;
	display_name?: string;
	type?: string;
	Class?: string;
	onPress?: () => void;
	userlat: number;
	userlong: number;
}

const ResultList = ({
	lat,
	lon,
	userlat,
	userlong,
	type,
	display_name,
	Class,
	onPress
}: IProps) => {
	function getDistance (loclat: number, loclong: number, userloclat: number, userloclong: number):number {
		if (loclat !== 0 && loclong !== 0) {
		  const distance_in_km = convertStringToNumber(getDistanceFromUserToFarm(
			userloclat,
			userloclong, 
			loclat, 
			loclong
			).toFixed(1));
		  return distance_in_km;
		} else return -1;
	};

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.itemContainer}>
				<View style={styles.itemHeader}>
					<TextCustom style={{color: Color.ORIGIN}}>{display_name ?? ''}</TextCustom>
				</View>
				<View style={styles.itemBody}>
					<View style={styles.itemRow}>
						<TextCustom bold>Class : </TextCustom>
						<TextCustom>{Class ?? ''}</TextCustom>
					</View>
					<View style={styles.itemRow}>
						<TextCustom bold>Type : </TextCustom>
						<TextCustom>{type ?? ''}</TextCustom>
					</View>
					<View style={styles.itemRow}>
						<TextCustom bold>Distance : </TextCustom>
						<TextCustom>{getDistance(lat ?? 0,lon ?? 0,userlat,userlong)} KM</TextCustom>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default ResultList

const styles = StyleSheet.create({
	itemContainer: {
		backgroundColor: Colors.WHITE,
		marginTop: 10,
		marginHorizontal: 10,
		paddingLeft: 5,
		paddingVertical: 10,
		borderRadius: 5,
		borderWidth: 0.3,
		borderColor: Color.GRAY_LIGHT
	},
	itemHeader: {
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderBottomColor: '#f1f1f1',
		paddingBottom: 5,
		marginBottom: 5,
	},
	itemBody: {
		paddingHorizontal: 10
  },
  itemRow: {
	flexDirection: 'row',
	marginVertical: 3,
	paddingVertical: 3,
	alignItems: 'center'
},
})