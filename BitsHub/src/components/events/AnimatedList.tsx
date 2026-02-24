import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { RefreshControl } from 'react-native';

interface proptypes<T> {
	estimatedSize: number;
	data: T[];
	renderItem: (item: T, index: number) => React.ReactElement;
	onRefresh: () => void;
	refreshing: boolean;
}

function AnimatedList<T>(props: proptypes<T>) {
	return (
		<FlashList
			data={props.data}
			refreshControl={
				<RefreshControl
					refreshing={props.refreshing}
					onRefresh={props.onRefresh}
					progressBackgroundColor={'#ffffff'}
				/>
			}
			renderItem={({ item, index }) => props.renderItem(item, index)}
			keyExtractor={(_, index) => index.toString()}
			// @ts-ignore
			estimatedItemSize={props.estimatedSize}
		/>
	);
}

export default AnimatedList;
