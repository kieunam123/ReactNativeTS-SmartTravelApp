import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Accordion, Button, FlatListCommon, SafeView, TextCustom } from './../../components/commons'
import { Column, Container, Header, Row } from './../../components/sections'
import { useSelector } from 'react-redux'
import { RootState } from './../../redux/reducers'
import { Colors } from './../../configs'
import { scaleFactor } from './../../helpers/UtilitiesHelper'
import { ILocationImage } from './../../apis/types.service'
import { useNavigation } from '@react-navigation/native'
import ScreenType from './../../navigations/screen.constant'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LocationInfoScreen = ({route}) => {
   const {userloclat, userloclong} = route.params ?? 0;
   const navigation = useNavigation();
   const { Information, InformationButtons, GoogleResult } = useSelector((state: RootState) => state.master);
   const [isLargePic, setIsLargePic] = useState<boolean>(false);
   const [itemImgUrl, setItemImgUrl] = useState<string>('')
   return (
      <SafeView>
         <Header title='Location Detail Info' noShadow disableThreeDot isMenu={false} />
         <Container isIncludeScrollView>
            <View style={styles.container}>
               <View style={styles.InfoContainer}>
                  <View style={styles.InfoImgContainer}>
                     <FlatListCommon
                        lockVertical={true}
                        horizontal={true}
                        data={GoogleResult.inline_images !== undefined ? GoogleResult.inline_images : []}
                        renderItem={({ item }: { item: ILocationImage }) => (
                           <Pressable onPress={()=>{
                              setItemImgUrl(item.original)
                              setIsLargePic(true)
                              }}>
                              <Image
                                 resizeMode='cover'
                                 source={{
                                    uri: item.original
                                 }}
                                 style={styles.image}
                              />
                           </Pressable>
                        )}
                     />
                  </View>
                  <TextCustom bold style={styles.locationTitle}>{Information.title ?? ''}</TextCustom>
                  <TextCustom style={{ paddingHorizontal: scaleFactor(10) }}>{Information.type ?? (GoogleResult.search_parameters !== undefined ? GoogleResult.search_parameters?.q : '')}</TextCustom>
               </View>

               <View style={styles.MapContainer}>
                  <Accordion title='Information' isOpen style={styles.textContainer} showIcon={false}>
                     <TextCustom>{Information.description}</TextCustom>
                     <View style={{ flexDirection: 'row' }}>
                        <TextCustom bold>Population: </TextCustom>
                        <TextCustom>{Information.population ?? ''}</TextCustom>
                     </View>
                     <View style={{ flexDirection: 'row' }}>
                        <TextCustom bold>Area Code: </TextCustom>
                        <TextCustom>{Information.area_code ?? ''}</TextCustom>
                     </View>
                     <View style={{ flexDirection: 'row' }}>
                        <TextCustom bold>Postal code: </TextCustom>
                        <TextCustom>{Information.postal_code ?? ''}</TextCustom>
                     </View>
                     <View style={{ flexDirection: 'row' }}>
                        <TextCustom bold>Region: </TextCustom>
                        <TextCustom>{Information.region ?? ''}</TextCustom>
                     </View>
                     <View style={{ flexDirection: 'row' }}>
                        <TextCustom bold>Founded: </TextCustom>
                        <TextCustom>{Information.founded ?? ''}</TextCustom>
                     </View>
                  </Accordion>
                  <Accordion title='History' isOpen={false} style={styles.textContainer} showIcon={false}>
                     <View>
                        <TextCustom bold>{Information.buttons !== undefined ? Information.buttons[0].snippet_highlighted_words : ''}</TextCustom>
                        {(Information.buttons !== undefined && Information.buttons[0] !== undefined) && <TextCustom>{Information.buttons[0].snippet !== undefined ? Information.buttons[0].snippet.replace(Information.buttons[0].snippet_highlighted_words !== undefined ? Information.buttons[0].snippet_highlighted_words[0] : '', '') : ''}</TextCustom>}
                     </View>
                  </Accordion>
                  <Accordion title='Rainy season' isOpen={false} style={styles.textContainer} showIcon={false}>
                     <View>
                        {(Information.buttons !== undefined && Information.buttons[1] !== undefined) && <TextCustom>{Information.buttons[1].snippet !== undefined ? Information.buttons[1].snippet : ''}</TextCustom>}
                     </View>
                  </Accordion>
                  <Accordion title='Topography' isOpen={false} style={styles.textContainer} showIcon={false} >
                     <View>
                        {(Information.buttons !== undefined && Information.buttons[2] !== undefined) && <TextCustom>{Information.buttons[2].snippet !== undefined ? Information.buttons[2].snippet : ''}</TextCustom>}
                     </View>
                  </Accordion>
               </View>
            </View>
            <Modal visible={isLargePic} onRequestClose={() => setIsLargePic(!isLargePic)} transparent>
               <TouchableOpacity onPress={() => setIsLargePic(!isLargePic)} style={styles.backdrop}>
                  <Image source={{ uri: itemImgUrl }} style={[styles.largeImage, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]} resizeMode="contain" />
               </TouchableOpacity>
            </Modal>
         </Container>
         <Row>
            <Column style={{ justifyContent: 'center' }}>
               <Button
                  isBold
                  title={`Places to Visit >`}
                  radius={10}
                  color={Colors.ORIGIN}
                  bgColor={Colors.WHITE}
                  outline={false}
                  onPress={() => {
                     navigation.navigate(ScreenType.Master.PlacesToVistit, {userloclat: userloclat, userloclong:userloclong});
                  }}
               />
            </Column>
         </Row>
      </SafeView>
   )
}

export default LocationInfoScreen

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   InfoContainer: {
      backgroundColor: Colors.WHITE,
      flex: 0.7,
      padding: scaleFactor(5),
   },
   InfoImgContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   image: {
      flex: 1,
      height: scaleFactor(150),
      width: scaleFactor(150),
      marginHorizontal: scaleFactor(5)
   },
   locationTitle: {
      fontSize: scaleFactor(25),
      padding: scaleFactor(10)
   },
   MapContainer: {
      flex: 1,
   },
   textContainer: {
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