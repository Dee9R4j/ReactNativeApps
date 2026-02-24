import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu } from 'react-native-paper';
import { r_h, r_w } from '@/utils/responsive';

interface SortMenuProps {
	sortMode: string;
	onSortChange: (mode: string) => void;
}

export default function SortMenu({ sortMode, onSortChange }: SortMenuProps) {
	const [sortVisible, setSortVisible] = useState(false);

	const handleSortChange = (mode: string) => {
		onSortChange(mode);
		setSortVisible(false);
	};

	return (
		<Menu
			visible={sortVisible}
			anchor={
				<SortSelector
					openSort={() => setSortVisible(true)}
					sortMode={sortMode}
				/>
			}
			onDismiss={() => setSortVisible(false)}
			contentStyle={{ backgroundColor: '#090013' }}
		>
			<Menu.Item
				onPress={() => handleSortChange('date')}
				title="Sort by Date"
				titleStyle={{ color: 'white' }}
			/>
			<Menu.Item
				onPress={() => handleSortChange('title')}
				title="Sort by A-Z"
				titleStyle={{ color: 'white' }}
			/>
			<Menu.Item
				onPress={() => handleSortChange('reverse')}
				title="Sort by Z-A"
				titleStyle={{ color: 'white' }}
			/>
		</Menu>
	);
}

const SortSelector = ({
	openSort,
	sortMode,
}: {
	openSort: () => void;
	sortMode: string;
}) => {
	return (
		<View
			onTouchEnd={openSort}
			style={{
				height: r_h(37),
				marginRight: r_w(20),
				padding: 10,
				backgroundColor: 'transparent',
				borderRadius: 5,
				borderColor: '#C5C5C5',
				borderWidth: 1,
			}}
		>
			<View
				style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
			>
				<Ionicons name="funnel" size={20} color="white" />
			</View>
		</View>
	);
};
