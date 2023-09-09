import React, { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../navigation.style';
import { Container, Row } from '../../components/sections';
import { Accordion, Icon, SafeView, TextCustom } from '../../components/commons';
import DrawerHeader from './drawer.header';
import { RootState } from '../../redux/reducers';
import ScreenType from '../screen.constant';
import { navigate } from '../../navigations/navigation.services';
import { Colors } from '../../configs';
import GlobalActions from '../../redux/global/global.actions';
import { FROM_DATE, TO_DATE } from './../../configs/initializeVariable';
import { auth } from '~/configs/firebase';

const AppDrawer = (): JSX.Element => {
	const dispatch = useDispatch();
	const {
		userParams: { deptId, email, userId, regionId },
	} = useSelector((state: RootState) => state.global);

	const gotoFeature = (
		screenType: string,
		drawerId?: number,
		drawerTitle?: string,
	): void => {
		const nav = screenType;
		dispatch(
			GlobalActions.setCurrentDrawer(
				nav,
				drawerId ?? -1,
				drawerTitle ?? '',
				false,
			),
		);
		navigate(nav);
	};

	const signOut = () => {
		auth.signOut().then(() => {
			// Sign-out successful.
			gotoFeature(ScreenType.Main.Start)
		}).catch((error) => {
			// An error happened.
		});
	}

	return (
		<SafeView
			disableStatusBar={false}
			style={styles.drawerBody}>
			<DrawerHeader />
			<View style={styles.drawerBody}>
				<ScrollView style={{ flex: 1 }}>
					<Container isIncludeScrollView={false}>

						<Accordion
							headerStyle={stylesLocal.headerStyle}
							style={stylesLocal.accordionContainer}
							title={'Language'}
							isOpen
							showIcon={false}>
							<Pressable
								style={styles.rowDrawer}
								onPress={() => gotoFeature(ScreenType.Main.Dashboard)}>
								<Row>
									<Icon
										name="stars"
										type="MaterialIcons"
										style={styles.drawerItemIcon}
									/>
									<TextCustom style={styles.drawerItemText}>Vietnamese</TextCustom>
								</Row>
							</Pressable>
							<Pressable
								style={styles.rowDrawer}
								onPress={() => gotoFeature(ScreenType.Main.Dashboard)}>
								<Row>
									<Icon
										name="language"
										type="FontAwesome"
										style={styles.drawerItemIcon}
									/>
									<TextCustom style={styles.drawerItemText}>English</TextCustom>
								</Row>
							</Pressable>
						</Accordion>
						<Accordion
							headerStyle={stylesLocal.headerStyle}
							style={stylesLocal.accordionContainer}
							title={'Dark Mode'}
							isOpen
							showIcon={false}>
							<Pressable
								style={styles.rowDrawer}
								onPress={() => gotoFeature(ScreenType.Main.Dashboard)}>
								<Row>
									<Icon
										name="nightlight-round"
										type='MaterialIcons'
										style={styles.drawerItemIcon}
									/>
									<TextCustom style={styles.drawerItemText}>On</TextCustom>
								</Row>
							</Pressable>
							<Pressable
								style={styles.rowDrawer}
								onPress={() => gotoFeature(ScreenType.Main.Dashboard)}>
								<Row>
									<Icon
										name="light-up"
										type='Entypo'
										style={styles.drawerItemIcon}
									/>
									<TextCustom style={styles.drawerItemText}>Off</TextCustom>
								</Row>
							</Pressable>
						</Accordion>
						<Accordion
							headerStyle={stylesLocal.headerStyle}
							style={stylesLocal.accordionContainer}
							title={'Other Setting'}
							isOpen
							showIcon={false}>
							<Pressable
								style={styles.rowDrawer}
								onPress={() => { }}>
								<Row>
									<Icon
										name="verified-user"
										type='MaterialIcons'
										style={styles.drawerItemIcon}
									/>
									<TextCustom style={styles.drawerItemText}>{'Version Log'}</TextCustom>
								</Row>
							</Pressable>
							<Pressable
								style={styles.rowDrawer}
								onPress={() => gotoFeature(ScreenType.Main.Dashboard)}>
								<Row>
									<Icon
										name="info-circle"
										type="FontAwesome"
										style={styles.drawerItemIcon}
									/>
									<TextCustom style={styles.drawerItemText}>About Us</TextCustom>
								</Row>
							</Pressable>
							<Pressable
								style={styles.rowDrawer}
								onPress={signOut}>
								<Row>
									<Icon
										name="log-out"
										type="Entypo"
										style={styles.drawerItemIcon}
									/>
									<TextCustom style={styles.drawerItemText}>{'Log Out'}</TextCustom>
								</Row>
							</Pressable>
						</Accordion>
					</Container>
				</ScrollView>
			</View>
		</SafeView>
	)
}

export default AppDrawer;

const stylesLocal = StyleSheet.create({
	accordionContainer: {
		// backgroundColor: Colors.WHITE,
		marginHorizontal: -5,
		marginVertical: 0,
		marginBottom: 5,
		// borderWidth: 0.5,
		// borderColor: Colors.BORDER_TWO,
		backgroundColor: Colors.TRANSPARENT,
	},
	headerStyle: {
		// backgroundColor: Colors.BG_SECOND,
	},
});