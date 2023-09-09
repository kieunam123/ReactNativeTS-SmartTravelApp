import { Alert, Dimensions, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Button, DateRowWithoutFormik, ModalCommon, NotFound, SafeView, TextCustom } from './../../components/commons'
import { Column, Container, Header, Row } from './../../components/sections'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './../../redux/reducers';
import { convertStringToNumber, getDistanceFromUserToFarm, scaleFactor } from './../../helpers/UtilitiesHelper';
import { Colors, fonts, Sizes } from './../../configs';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Loading2 from './../../containers/Loading2';
import MasterActions from './../../redux/master/master.actions';
import ScreenType from './../../navigations/screen.constant';
import { convertStringDateToDdMmYyyy, convertStringToDate, convertTimeStringToDate, getCurrentDateToStringDDMMYYY, getCurrentTimeToString } from '~/helpers/DatetimeHelpers';
import { auth } from '~/configs/firebase';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ILocationDetail {
  query: string;
  lang: string;
  loclat: number;
  loclong: number;
  userloclat: number;
  userloclong: number;
}

const LocationDetail = ({ query, lang, loclat, loclong, userloclat, userloclong }: ILocationDetail) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { Information, InformationButtons, GoogleResult } = useSelector((state: RootState) => state.master);
  const [isSatelliteMode, setIsSatelliteMode] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [departFrom, setDepartFrom] = useState<string>('Can Tho');
  const [TravelDays, setTravelDays] = useState<string>('7');
  const [DateBegin, setDateBegin] = useState<string>(`${getCurrentDateToStringDDMMYYY()}`);
  const [TimeBegin, setTimeBegin] = useState<string>(`${getCurrentTimeToString()}`);
  const [Transport, setTransports] = useState<string>('bus');
  const ref = useRef<MapView>(null);

  const handleGetLocationInfo = useCallback(() => {
    dispatch(MasterActions.getGoogleResult(query, lang));
  }, [dispatch]);

  // effects
  const onMapReadyHandler = useCallback(() => {
    if (Platform.OS === 'ios') {
      ref?.current?.fitToElements({
        animated: false, edgePadding: {
          top: 150,
          right: 50,
          bottom: 50,
          left: 50,
        }
      });
    } else {
      ref?.current?.fitToCoordinates([{ latitude: loclat, longitude: loclong }], {
        animated: false,
        edgePadding: {
          top: 150,
          right: 50,
          bottom: 50,
          left: 50,
        },
      });
    }
  }, [ref]);

  function getDistance(loclat: number, loclong: number, userloclat: number, userloclong: number): number {
    if (loclat !== 0 && loclong !== 0) {
      const distance_in_km = convertStringToNumber(getDistanceFromUserToFarm(
        userloclat,
        userloclong,
        loclat,
        loclong
      ).toFixed(1));
      return distance_in_km;
    } else {
      return -1;
    };
  };

  useEffect(() => {
    handleGetLocationInfo();
  }, [handleGetLocationInfo]);

  return (
    <>
      <View style={styles.container}>
        {Information.title !== 'No information found!' && <TouchableOpacity
          style={styles.InfoContainer}
          onPress={() => navigation.navigate(ScreenType.Master.LocationInfo)} >
          <View style={styles.InfoImgContainer}>
            <Image
              resizeMode='cover'
              source={{
                uri:
                  Information.header_images !== undefined ? Information.header_images[0].image : (GoogleResult.inline_images !== undefined ? GoogleResult.inline_images[1].original : 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg')
              }}
              style={styles.image}
            />
            <Image
              resizeMode='cover'
              source={{
                uri:
                  Information.local_map !== undefined ? Information.local_map.image : (GoogleResult.inline_images !== undefined ? GoogleResult.inline_images[1].original : 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg')
              }}
              style={styles.image}
            />
          </View>
          <TextCustom bold style={styles.locationTitle}>{Information.title ?? ''}</TextCustom>
          <TextCustom style={{ paddingHorizontal: scaleFactor(10) }}>{Information.type ?? (GoogleResult.search_parameters !== undefined ? GoogleResult.search_parameters?.q : '')}</TextCustom>
          <Row style={{ paddingVertical: 10 }}>
            <Column style={{ justifyContent: 'center' }}>
              <Button
                isSmall
                isBold
                title={`VIEW DETAIL`}
                radius={10}
                color={Colors.ORIGIN}
                bgColor={Colors.WHITE}
                outline
                onPress={() => navigation.navigate(ScreenType.Master.LocationInfo, {userloclat: userloclat, userloclong: userloclong})}
              />
            </Column>
          </Row>
        </TouchableOpacity>}

        {(loclat !== 0 && loclong !== 0) && <View style={styles.MapContainer}>
          <View style={styles.DistanceContainer}>
            <TouchableOpacity style={styles.DistanceButton} onPress={() => setIsSatelliteMode(!isSatelliteMode)}>
              <TextCustom bold style={{ fontSize: scaleFactor(25), color: '#fff' }}>{getDistance(loclat, loclong, userloclat, userloclong)}</TextCustom>
              <TextCustom style={{ color: '#fff' }}>KM</TextCustom>
            </TouchableOpacity>
          </View>
          <View style={[styles.ScheduleContainer, { flex: Information.title !== 'No information found!' ? 1 : 0, top: Information.title !== 'No information found!' ? 0 : scaleFactor(550) }]}>
            <Row>
              <Column style={{ justifyContent: 'center', paddingHorizontal: scaleFactor(15) }}>
                <Button
                  isBold
                  title={`Schedule Travel Plan  >`}
                  radius={10}
                  color={Colors.ORIGIN}
                  bgColor={Colors.WHITE}
                  outline={false}
                  onPress={() => Information.title !== 'No information found!' ? setIsOpenModal(true) : alert('No Information found!')}
                />
              </Column>
            </Row>
          </View>
          <MapView
            style={styles.map}
            ref={ref}
            onMapReady={onMapReadyHandler}
            mapType={isSatelliteMode ? 'satellite' : 'standard'}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: loclat,
              longitude: loclong,
              latitudeDelta: 0.005,
              longitudeDelta: 0.0005,
            }}>
            <Marker
              coordinate={{ latitude: userloclat, longitude: userloclong }}
              title={'Your location'}
              description={`${auth?.currentUser?.displayName}`}
              pinColor="blue"
            />
            <Marker
              coordinate={{ latitude: loclat, longitude: loclong }}
              title={'Travel location'}
              description={`${Information.title ?? (GoogleResult.search_parameters !== undefined ? GoogleResult.search_parameters?.q : '')}`}
              pinColor="red"
            />
          </MapView>
        </View>}
        {loclat === 0 && <View style={styles.MapContainer}>
          <View style={styles.map}>
            <Image
              resizeMode='contain'
              source={{
                uri:
                  Information.local_map !== undefined ? Information.local_map.image : (GoogleResult.inline_images !== undefined ? GoogleResult.inline_images[1].original : 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg')
              }}
              style={{
                flex: 1,
                paddingHorizontal: scaleFactor(20),
              }}
            />
          </View>
          <View style={[styles.ScheduleContainer, { flex: Information.title !== 'No information found!' ? 1 : 0, top: Information.title !== 'No information found!' ? 0 : scaleFactor(550) }]}>
            <Row>
              <Column style={{ justifyContent: 'center', paddingHorizontal: scaleFactor(15) }}>
                <Button
                  isBold
                  title={`Schedule Travel Plan  >`}
                  radius={10}
                  color={Colors.ORIGIN}
                  bgColor={Colors.WHITE}
                  outline={false}
                  onPress={() => Information.title !== 'No information found!' ? setIsOpenModal(true) : alert('No Information found!')}
                />
              </Column>
            </Row>
          </View>
        </View>}
        {(Information.title === 'No information found!' && loclat === 0) && <NotFound />}
      </View>
      <ModalCommon isVisible={isOpenModal} title={`${Information.title}`} onClose={() => setIsOpenModal(false)} buttonTitle={`Start`}
        onPress={() => {
          navigation.navigate(ScreenType.Chat.Chatbot,
            {
              TravelTo: Information.title !== 'No information found!' ? Information.title : '',
              DepartFrom: departFrom,
              TravelDays: TravelDays,
              DateBegin: DateBegin,
              TimeBegin: TimeBegin,
              Transport: Transport,
            })
          setIsOpenModal(false)
        }}>
        <View style={{ height: SCREEN_HEIGHT * 40 / 100 }}>
          <Container isIncludeScrollView={true}>
            <View style={{ flex: 1, marginHorizontal: scaleFactor(10), justifyContent: 'center' }}>
              <View style={{ paddingVertical: scaleFactor(10) }}>
                <TextCustom style={styles.inputTitle}>
                  Depart from
                </TextCustom>
                <View style={styles.inputContent}>
                  <TextInput
                    style={styles.inputForm}
                    placeholder='Please type city name. Default : Can Tho city'
                    onChangeText={(str) => setDepartFrom(str)}
                  />
                </View>
              </View>
              <View style={{ paddingVertical: scaleFactor(10) }}>
                <TextCustom style={styles.inputTitle}>
                  Travel days
                </TextCustom>
                <View style={styles.inputContent}>
                  <TextInput
                    keyboardType='numeric'
                    style={styles.inputForm}
                    placeholder='Number of days to travel. Default : 7 '
                    onChangeText={(str) => setTravelDays(str)}
                  />
                </View>
              </View>
              <Row>
                <DateRowWithoutFormik
                  type="date"
                  label={`Date begin`}
                  date={convertStringToDate(convertStringDateToDdMmYyyy(DateBegin, 'date'))}
                  onDateChange={(date) => setDateBegin(date)}
                />
              </Row>
              <Row>
                <DateRowWithoutFormik
                  type="time"
                  label={`Time begin`}
                  date={convertTimeStringToDate(TimeBegin)}
                  onDateChange={(time) => setTimeBegin(time)}
                />
              </Row>
              <View style={{ paddingVertical: scaleFactor(10), paddingBottom: 150 }}>
                <TextCustom style={styles.inputTitle}>
                  Transportation
                </TextCustom>
                <View style={styles.inputContent}>
                  <TextInput
                    style={styles.inputForm}
                    placeholder='Your vehicle. Default: bus'
                    onChangeText={(str) => setTransports(str)}
                  />
                </View>
              </View>
            </View>
          </Container>
        </View>
      </ModalCommon>
    </>
  )
}

export default LocationDetail

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
  MapContainer: {
    flex: 1,
    padding: scaleFactor(5),
  },
  locationTitle: {
    fontSize: scaleFactor(25),
    padding: scaleFactor(10)
  },
  map: {
    zIndex: -1,
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
  },
  DistanceContainer: {
    alignItems: 'flex-start',
    top: scaleFactor(5),
    left: scaleFactor(5),
    zIndex: 1,
    justifyContent: 'flex-start'
  },
  DistanceButton: {
    width: scaleFactor(70),
    height: scaleFactor(70),
    bottom: 0,
    borderRadius: 15,
    backgroundColor: '#FF2851',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ScheduleContainer: {
    zIndex: 1,
    justifyContent: 'flex-end',
    // top: scaleFactor(270)
  },
  inputTitle: {
    color: Colors.ORIGIN,
    fontSize: scaleFactor(15),
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
  inputContent: {
    borderWidth: 0.5,
    borderBottomColor: Colors.BORDER_DARK,
    padding: scaleFactor(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})