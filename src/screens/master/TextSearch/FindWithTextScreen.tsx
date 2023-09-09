import { Alert, Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Button, FlatListCommon, ModalCommon, SafeView, TextCustom } from '../../../components/commons'
import { Column, Container, Header, Row } from '../../../components/sections'
import Color from '../../../configs/colors'
import { Colors, fonts, Sizes } from '../../../configs'
import { TextInput } from 'react-native-gesture-handler'
import { convertStringToNumber, scaleFactor } from '../../../helpers/UtilitiesHelper'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import MasterActions from '../../../redux/master/master.actions'
import { RootState } from '../../../redux/reducers'
import { ICityLatLong } from '../../../apis/types.service'
import { LocationDetail, ResultList } from '../../../containers/master'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import * as Locations from 'expo-location';
import GetUserLocation, { ICoords } from '../../../helpers/GetUserLocation';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import Loading2 from '../../../containers/Loading2'


const FindWithTextScreen = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {searchedLocation} = route.params ?? '';
  const ref = useRef<MapView>(null);
  const { cityLatLong } = useSelector((state: RootState) => state.master);
  const [value, setValue] = useState<string>('');
  const [location, setLocation] = useState<string>();
  const [lang, setLang] = useState<string>('us');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(true);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [loadingGps, setLoadingGps] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<ICoords>({
    latitude: 0,
    longitude: 0,
  });
  const [query, setQuery] = useState<string>('');
  const [locationLatLong, setLocationLatLong] = useState<ICoords>({
    latitude: 0,
    longitude: 0
  });

  const searchCity = useCallback(() => {
    dispatch(MasterActions.getCityLatLong(location ?? searchedLocation));
  }, [location, dispatch]);

  const [isSearchGoogle, setIsSearchGoogle] = useState<boolean>(false);

  const handleSearchGoogle = useCallback((query: string, lang: string, loclat: number, loclong: number) => {
    setQuery(query);
    setLang(lang);
    setLocationLatLong({
      latitude: loclat,
      longitude: loclong
    });
    setIsSearchGoogle(true);
  }, [query,lang, locationLatLong, isSearchGoogle])

  const { checkUserLocation } = GetUserLocation();

  const getCurrentLocation = async () => {
    setLoadingGps(true);
    let { status } = await Locations.requestForegroundPermissionsAsync();
    const rsLocation = await checkUserLocation();
    if (status !== "granted") {
      Alert.alert('Please allow app to access your location!', "", [{ text: 'ok', style: 'cancel' }])
    } else {
      try {
        if (rsLocation.mocked) {
          Alert.alert('Asking Permission', 'please try again.', [
            {
              text: 'ok', onPress: () => {
                navigation.goBack();
                setLoadingGps(false);
              }
            },
          ]);
        } else {
          setLoadingGps(false);
          setIsOpenModal(true)
        };
      } catch (err) {
        console.log(err);
        setLoadingGps(false);
        setIsOpenModal(true)
      };
    };
  };

  useEffect(() => {
    getCurrentLocation();
    searchedLocation !== undefined ? (setIsSearch(true),searchCity()) : (location !== undefined ? setIsSearch(true) : setIsSearch(false))
  }, [searchedLocation,isSearch]);

  return (
    <SafeView>
      <Header noShadow title={isSearchGoogle ? "Location Detail" : "Find with Text"} isMenu={false} currentScreenOff onBackPress={() => !isSearchGoogle ? ( searchedLocation !== undefined ? navigation.goBack() : (setLocation(undefined), setIsSearch(false))) : setIsSearchGoogle(false)} disableThreeDot />
      <Loading2 isVisible={loadingGps} text={lang === 'vi' ? 'Đang kiểm tra vị trí..' : 'Checking your location...'} />
      {!isSearchGoogle && <View style={styles.container2}>
        <MapView
          ref={ref}
          style={styles.map}
          mapType={'standard'}
          provider={PROVIDER_DEFAULT}
          showsUserLocation={true}
          onUserLocationChange={(e) => {
            setUserLocation({
              latitude: e.nativeEvent.coordinate!.latitude,
              longitude: e.nativeEvent.coordinate!.longitude,
            });
          }}
        >
        </MapView>
      </View>}
      {(!isSearch && !isSearchGoogle && !loadingGps) && <View style={styles.container}>
        <ModalCommon isVisible={isOpenModal} title={isSearchGoogle ? 'Location Detail' : 'Input With Text'} onClose={() => { navigation.goBack(), setIsOpenModal(false) }} buttonTitle='Search' onPress={() => { searchCity(), setIsSearch(true) }}>
          <View style={{ height: scaleFactor(170) }}>
            <Container isIncludeScrollView={true}>
              <View style={{ flex: 1, marginHorizontal: scaleFactor(10), justifyContent: 'center' }}>
                <TextCustom style={styles.inputTitle}>
                  Search location
                </TextCustom>
                <View style={styles.inputContent}>
                  <TextInput
                    style={styles.inputForm}
                    placeholder='Please type city name'
                    onChangeText={(str) => setValue(str)}
                    onEndEditing={() => setLocation(value)}
                  />
                </View>
              </View>
            </Container>
          </View>
        </ModalCommon>
      </View>}
      {(isSearch && !isSearchGoogle) && <View style={styles.resultContainer}>
        <View style={{ padding: scaleFactor(30), }}>
          <TextCustom style={styles.inputTitle}>
            Result for
          </TextCustom>
          <View style={styles.resultContent}>
            <TextInput
              editable={false}
              style={styles.inputForm}
              value={location ?? searchedLocation}
            />
          </View>
        </View>
        <View style={{ flex: 1, marginHorizontal: 5 }}>
          <FlatListCommon
            isShowVertical={false}
            data={cityLatLong}
            renderItem={({ item }: { item: ICityLatLong }) => (
              <ResultList
                display_name={item.display_name ?? ''}
                type={item.type ?? ''}
                Class={item.class ?? ''}
                lat={convertStringToNumber(item.lat)}
                lon={convertStringToNumber(item.lon)}
                userlat={userLocation.latitude}
                userlong={userLocation.longitude}
                onPress={() => {
                  handleSearchGoogle(
                    ((item.type.includes("city") || item.type.includes("administrative") && item.display_name.includes("việt nam")) ? (item.display_name.includes("hồ chí minh") ? item.display_name : (location ?? searchedLocation)) : item.display_name),
                     lang,
                     convertStringToNumber(item.lat),
                     convertStringToNumber(item.lon)
                     )
                }}
              />
            )}
          />
        </View>
        <Row style={{ paddingTop: scaleFactor(10), }}>
          <Column style={{ justifyContent: 'center' }}>
            <Button
              isBold
              title={`Keep Looking For Location "${location ?? searchedLocation}"  >`}
              radius={10}
              color={Colors.ORIGIN}
              bgColor={Color.WHITE}
              outline={false}
              onPress={() => {
                handleSearchGoogle(location ?? searchedLocation, lang, 0, 0)
              }}
            />
          </Column>
        </Row>
        <Pressable style={styles.searchAgain} onPress={() => { searchedLocation !== undefined ? navigation.goBack() : (setLocation(undefined),setIsSearch(false)) }}>
          <TextCustom style={{ fontSize: 15, textDecorationLine: 'underline' }}>
            Not your expected result? Search again
          </TextCustom>
        </Pressable>
      </View>}

      {isSearchGoogle && <LocationDetail
        query={query}
        lang={lang}
        loclat={locationLatLong.latitude}
        loclong={locationLatLong.longitude}
        userloclat={userLocation.latitude}
        userloclong={userLocation.longitude}
      />}
    </SafeView>
  )
}

export default FindWithTextScreen

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleFactor(25),
    height: SCREEN_HEIGHT,
  },
  inputTitle: {
    color: Color.ORIGIN,
    fontSize: scaleFactor(15),
  },
  inputContent: {
    borderWidth: 0.5,
    borderBottomColor: Colors.BORDER_DARK,
    padding: scaleFactor(10),
    flexDirection: 'row',
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
  resultContent: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.BORDER_DARK,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchAgain: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingBottom: scaleFactor(20),
  },
  container2: {
    flex: 1,
    overflow: 'hidden',
    position: 'absolute',
  },
  map: {
    width: `100%`,
    height: '100%',
  },
})