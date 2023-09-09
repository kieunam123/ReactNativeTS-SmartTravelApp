import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import styles from '../navigation.style';
import { TextCustom, Icon, Dropdown } from '../../components/commons';
import { Container, Row } from '../../components/sections';
import { Colors, Sizes } from '../../configs';
import { RootState } from '../../redux/reducers';
import { auth } from '~/configs/firebase';
import { Avatar } from 'react-native-elements'

const DrawerHeader = (): JSX.Element => {
	const dispatch = useDispatch();
	const { userParams } = useSelector((state: RootState) => state.global);

	return (
		<View style={styles.drawerHeader}>
			<Container>
				<Row>
					<View style={{ paddingTop: 10 }}>
						<Avatar
							rounded
							source={{
								uri: auth?.currentUser?.photoURL ?? 'https://www.trackergps.com/canvas/images/icons/avatar.jpg'
							}}
							size={60}
						/>
					</View>
					<View style={{ marginLeft: 20, justifyContent: 'center' }}>
						<TextCustom
							style={{
								color: Colors.GRAY,
								fontSize: Sizes.Title,
								marginBottom: 5,
							}}
							bold>
							{auth?.currentUser?.displayName}
						</TextCustom>
						<TextCustom style={{ color: Colors.GRAY, fontSize: Sizes.Note }}>
							{auth?.currentUser?.email}
						</TextCustom>
					</View>
				</Row>
				<View style={{ height: 10 }} />
				{/* <Formik
					enableReinitialize
					initialValues={userParams}
					onSubmit={(value) => {
						handleDeptIdChange(value.regionId ?? 'JCL');
					}}>
					{({ values, handleSubmit }) => (
						<Dropdown
							label="Phòng làm việc"
							data={userOfficeS}
							name="regionId"
							selectedValue={values.regionId}
							onSelect={() => handleSubmit()}
							wrapStyle={{ borderBottomWidth: 0 }}
							modalTitle="Lựa chọn khu vực"
							labelStyle={{ display: 'none' }}
							containerStyle={{
								borderWidth: 0.5,
								borderColor: Colors.BORDER_DARK,
								flex: undefined,
								paddingVertical: 5,
								paddingHorizontal: 15,
								borderRadius: 5,
								backgroundColor: Colors.BG,
							}}
						/>
					)}
				</Formik> */}
			</Container>
		</View>
	)
};

export default DrawerHeader;