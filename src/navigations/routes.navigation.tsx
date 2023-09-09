import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import DrawerNavigation from './drawers/drawer.navigation';
import { isMountedRef, navigationRef } from './navigation.services';
import ScreenType from './screen.constant';
import { RootState } from '../redux/reducers';

import {
	StartScreen,
	DashboardScreen,
	LoginScreen,
	RegisterScreen,
} from '../screens/mains';
import { FindWithImageScreen, FindWithLibraryScreen, FindWithTextScreen, FindWithVoiceScreen, ImageResultScreen, LocationInfoScreen, PlacesToVisitScreen, SmartTravelScreen } from './../screens/master';
import { ChatScreen } from '~/screens/chat';

const Stack = createStackNavigator();

const RoutesNavigatorContainer = (): any => {
	React.useEffect(() => {
		isMountedRef!.current = true;
		return () => (isMountedRef.current = false);
	}, []);

	return (
		<SafeAreaProvider>
			<NavigationContainer ref={navigationRef}>
				<Stack.Navigator
					initialRouteName={ScreenType.Main.Start}
					screenOptions={{
						headerShown: false
					}}>
					<Stack.Screen name={ScreenType.Main.Start} component={StartScreen} />
					<Stack.Screen
						name={ScreenType.Main.Menu}
						component={DrawerNavigation}
						options={{ gestureEnabled: true }}
					/>
					<Stack.Screen
						name={ScreenType.Master.SmartTravel} component={SmartTravelScreen} />
					<Stack.Screen
						name={ScreenType.Master.TextScreen} component={FindWithTextScreen} />
					<Stack.Screen
						name={ScreenType.Master.LocationInfo} component={LocationInfoScreen} />
					<Stack.Screen
						name={ScreenType.Master.PlacesToVistit} component={PlacesToVisitScreen} />
					<Stack.Screen
						name={ScreenType.Master.ImageScreen} component={FindWithImageScreen} />
					<Stack.Screen
						name={ScreenType.Master.ImageResultScreen} component={ImageResultScreen} />
					<Stack.Screen
						name={ScreenType.Master.VoiceScreen} component={FindWithVoiceScreen} />
					<Stack.Screen
						name={ScreenType.Master.LibraryScreen} component={FindWithLibraryScreen} />
					<Stack.Screen
						name={ScreenType.Chat.Chatbot} component={ChatScreen} />
					<Stack.Screen
						name={ScreenType.Main.Login} component={LoginScreen} />
					<Stack.Screen
						name={ScreenType.Main.Register} component={RegisterScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

export default RoutesNavigatorContainer;