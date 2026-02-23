import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { RootNavigationProp } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Navbar: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navbar, { paddingTop: insets.top }]}>  
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Icon name="menu" size={35} color="black" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput 
          placeholder="Search..." 
          style={styles.searchInput}
          placeholderTextColor="#666"
          allowFontScaling={false}
          underlineColorAndroid="transparent"
        />
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
          <Icon name="favorite" size={35} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-cart" size={35} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 2,
    height: 60,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  searchInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    color: '#333',
  },
  icons: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
});

export default Navbar;
