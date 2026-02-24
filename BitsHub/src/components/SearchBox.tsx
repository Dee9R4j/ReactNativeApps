import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { r_h, r_w } from '@/utils/responsive';

interface SearchBoxProps {
	search: string;
	onSearchChange: (text: string) => void;
	placeholder?: string;
}

export default function SearchBox({ 
	search, 
	onSearchChange, 
	placeholder = "Search" 
}: SearchBoxProps) {
	return (
		<View style={styles.searchContainer}>
			<Ionicons name="search" size={18} color="gray" />
			<TextInput
				placeholder={placeholder}
				placeholderTextColor="#A0A0A0"
				style={styles.searchInput}
				onChangeText={onSearchChange}
				value={search}
			/>
			{search.length > 0 && (
				<Animated.View
					entering={FadeIn.duration(200)}
					exiting={FadeOut.duration(100)}
				>
					<Ionicons
						name="close"
						size={18}
						color="gray"
						onPress={() => onSearchChange('')}
					/>
				</Animated.View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		backgroundColor: '#090013',
		borderRadius: 8,
		height: r_h(37),
		borderWidth: r_w(1.5),
		borderColor: '#C5C5C5',
		paddingHorizontal: r_w(10),
	},
	searchInput: {
		flex: 1,
		marginLeft: r_w(8),
		paddingVertical: r_h(1.5),
		height: r_h(34),
		color: '#E4E4E4',
		fontFamily: 'Manrope-SemiBold-600',
		fontSize: 14,
		fontWeight: '400',
		alignSelf: 'center',
	},
});
