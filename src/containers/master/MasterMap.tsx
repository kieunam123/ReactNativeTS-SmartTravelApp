import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Color from './../../configs/colors';
import { Colors, fonts, Sizes } from './../../configs';
import MapView, { Marker } from 'react-native-maps';
import { GOOGLE_API_KEY } from './../../configs/strings';


export interface IProps {
    latitude: number;
	longitude: number;
}

const MasterMap = ({latitude, longitude}: IProps):JSX.Element  => {
	const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
	const dispatch = useDispatch();
	const navigate = useNavigation();

    const location = {
        latitude: latitude,
        longitude: longitude,
    }

	const googleApiUrl = `https://maps.googleapis.com/maps/api/streetview?size=${SCREEN_WIDTH}x${SCREEN_HEIGHT}&location=${location.latitude},${location.longitude}&heading=151.78&pitch=-0.76&key=${GOOGLE_API_KEY}`;

    return (
        <>
            <MapView style={styles.map} initialRegion={{ ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
                <Marker coordinate={location} />
            </MapView>
            {/* <Image source={{ uri: googleApiUrl }} style={styles.streetView} /> */}
        </>
    )
}

export default MasterMap

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: Colors.WHITE,
	},
	inputTitle:{
	  color: Color.ORIGIN,
	  fontSize: 15,
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
	  paddingVertical: 10,
	  // paddingHorizontal: 10,
	  marginBottom: -10,
	  margin: 0,
	  fontFamily: fonts.RobotoRegular,
	  fontSize: Sizes.Content,
	  color: Colors.GRAY,
	  flex: 1,
	},
	map: {
        zIndex:-1,
        overflow: 'hidden',
		...StyleSheet.absoluteFillObject,
	  },
	  streetView: {
        zIndex:-1,
        overflow: 'hidden',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '50%',
	  },
  });