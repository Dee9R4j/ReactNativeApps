import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, FlatList } from "react-native";
import { useNavigation } from "expo-router";
import { getStatusBarHeight } from "@/utils/safeArea";
import contacts, {ContactCardProps} from "@/utils/contacts";
import ContactCard from "@/components/ContactCard";
import { FlashList } from "@shopify/flash-list";
import ScreenHeader from "@/components/ScreenHeader";

export default function aboutUs() {
  const navigation = useNavigation();

  const renderContact = ({ item }: { item: ContactCardProps }) => (
      <ContactCard {...item} />
    );
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="CONTACT US" />

      <FlatList
        data={contacts}
        renderItem={renderContact}
        contentContainerStyle={styles.contactContainer}
        keyExtractor={(item) => item.name}
        numColumns={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
    justifyContent:"center",
    paddingTop: getStatusBarHeight(),
  },
  contactContainer:{
    alignSelf:"center",


  }

});