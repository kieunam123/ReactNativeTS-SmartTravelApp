import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from './../../configs/colors';
import { TextCustom } from './../../components/commons';
import { scaleFactor } from './../../helpers/UtilitiesHelper';
import { Container } from './../../components/sections';

export interface IProps {
    title?: string;
    thumbnail?: string;
    link?: string;
    source?: string;
    source_icon?: string;
    onPress?: () => void;
}

const ImageResultList = ({
    title,
    thumbnail,
    link,
    source,
    source_icon,
    onPress
}: IProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <View style={styles.itemThumbnail}>
                    <Image
                        resizeMode='cover'
                        source={{ uri: thumbnail ?? '' }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.itemBody}>
                    <TextCustom bold>{title ?? ''}</TextCustom>
                    <TextCustom isSmall style={{ color: Color.ORIGIN }}>{source ?? ''}</TextCustom>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ImageResultList

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: Color.WHITE,
        marginTop: 10,
        // marginHorizontal: 10,
        // paddingLeft: 5,
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: Color.GRAY_LIGHT,
        flexDirection: 'row',
    },
    itemHeader: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f1f1',
        paddingBottom: 5,
        marginBottom: 5,
    },
    itemBody: {
        marginHorizontal: scaleFactor(10),
        flex: 1
    },
    itemRow: {
        flexDirection: 'row',
        marginVertical: 3,
        paddingVertical: 3,
        alignItems: 'center'
    },
    itemThumbnail: {

    },
    image: {
        flex: 1,
        height: scaleFactor(150),
        width: scaleFactor(150),
        marginHorizontal: scaleFactor(5)
    },
})