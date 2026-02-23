// Sidebar.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';



const Sidebar: React.FC<any> = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);


  return (
    <DrawerContentScrollView style={[styles.sidebar,{ paddingTop: 0 }, darkMode && styles.sidebarDark]}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.headerText}>Menu</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Icon name="close" size={24} color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/assets_myimg.jpg')}
          style={styles.profilePic}
        />
        <Text style={styles.profileName}>Deep Raj</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sidebarNav}>
        <DrawerItem
          label="Orders"
          onPress={() => navigation.navigate('Orders')}
          icon={() => <Icon name="shopping-bag" size={24} color={darkMode ? 'grey' : 'black'} />}
        />
        <DrawerItem
          label="Wishlist"
          onPress={() => navigation.navigate('Wishlist')}
          icon={() => <Icon name="favorite" size={24} color={darkMode ? 'grey' : 'black'} />}
        />
        <DrawerItem
          label="Cart"
          onPress={() => navigation.navigate('Cart')}
          icon={() => <Icon name="shopping-cart" size={24} color={darkMode ? 'grey' : 'black'} />}
        />
        <DrawerItem
          label="Settings"
          onPress={() => {}}
          icon={() => <Icon name="settings" size={24} color={darkMode ? 'grey' : 'black'} />}
        />
      </View>

      <View style={styles.themeToggle}>
        <Icon name="wb-sunny" size={20} color={darkMode ? 'grey' : 'black'} />
        <Switch
          value={darkMode}
          onValueChange={() => setDarkMode(!darkMode)}
          trackColor={{ false: '#ccc', true: '#2196F3' }}
          thumbColor={'#fff'}
        />
        <Icon name="nights-stay" size={20} color={darkMode ? 'grey' : 'black'} />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#f5f4ee',
    flex: 1,
  },
  sidebarDark: {
    backgroundColor: '#111',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  sidebarNav: {
    padding: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default Sidebar;