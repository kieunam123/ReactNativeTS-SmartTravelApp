import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeView } from '~/components/commons'
import icons from '~/assets/icons';
import { GiftedChat } from 'react-native-gifted-chat';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MasterActions from '~/redux/master/master.actions';
import { RootState } from '~/redux/reducers';
import { Header } from '~/components/sections';

export interface IMessage {
	_id: number;
	text: string;
	createdAt: Date;
	user: IUser;
	isBegin?: boolean;
}

export interface IUser {
	_id: number;
	name: string;
	avatar: any
}

const ChatScreen = ({ route }) => {
	const { TravelTo, DepartFrom, TravelDays, DateBegin, TimeBegin, Transport } = route.params ?? ''
	const { ChatGPTResponse } = useSelector((state: RootState) => state.master);
	const dispatch = useDispatch();
	const navigate = useNavigation();
	const [messages, setMessages] = useState<IMessage[]>([]);

	useEffect(() => {
		TravelTo !== undefined ? ScheduleTravelPlan() : firstMessage();
	}, []);

	const ScheduleTravelPlan = () => {
		const text_en = `Schedule a detail travel plan by ${Transport} to ${TravelTo} from home place at ${DepartFrom}, begin from ${DateBegin} at ${TimeBegin}. Travel plan will be in ${TravelDays} days`
		addNewMessage(text_en)
		dispatch(MasterActions.sendMessagesToChatGPT(text_en, 4050))
	}

	const firstMessage = () => {
		setMessages([
			{
				_id: 1,
				text: 'Hello, what can I help you?',
				createdAt: new Date(),
				isBegin: true,
				user: {
					_id: 2,
					name: 'Chatbot',
					avatar: icons.chatgpt,
				},
			},
		]);
	};

	const onSend = useCallback((messages: IMessage[]) => {
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, messages),
		);
		const value = messages[0].text;
		if(value.includes(("translate above to vietnamese")) || value.includes(('Dịch đoạn trên sang tiếng việt '))){
			dispatch(MasterActions.sendMessagesToChatGPT(`Translate ${ChatGPTResponse[0].text} to VietNamese`, 4050))
		}
		dispatch(MasterActions.sendMessagesToChatGPT(value, 4050))
	}, [dispatch]);

	useEffect(() => {
		if (messages[0] !== undefined) {
			if (ChatGPTResponse[0] !== undefined && messages[0].isBegin !== true) {
				const value = ChatGPTResponse[0].text
				addNewMessage(value)
			}
		}

	}, [ChatGPTResponse]);

	const addNewMessage = (data: string) => {
		const value: IMessage[] = [{
			_id: Math.random(),
			text: data,
			createdAt: new Date(),
			isBegin: false,
			user: {
				_id: 2,
				name: 'Chatbot',
				avatar: icons.chatgpt,
			},
		}];
		setMessages(previousMessages => GiftedChat.append(previousMessages, value));
	};

	return (
		<SafeView>
			<Header noShadow title={TravelTo !== undefined ? `Travel Plan To ${TravelTo}` : "Chat With AI"} isMenu={false} disableThreeDot />
			<View style={styles.container}>
				<GiftedChat
					messages={messages}
					onSend={messages => onSend(messages)}
					user={{
						_id: 1,
					}}
				/>
			</View>
		</SafeView>
	)
}

export default ChatScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})