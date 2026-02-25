import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { getStatusBarHeight } from "@/utils/safeArea";
import DeveloperCard from "@/components/developersCard";
import { DeveloperCardProps, developers } from "@/utils/developers";
import { FlashList } from "@shopify/flash-list";
import ScreenHeader from "@/components/ScreenHeader";


const TABS = [
  { label: 'App', value: 1 },
  { label: 'Back', value: 2 },
  { label: 'Design', value: 3 },
];

export default function DevelopScreen() {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.jumpTo("index"));
  };
 
  const [activeVertical, setActiveVertical] = useState<number>(1);


  const filteredDevelopers = useMemo(() => {
    return developers.filter(dev => dev.vertical === activeVertical);
  }, [activeVertical]);

  const renderDeveloper = ({ item }: { item: DeveloperCardProps }) => (
    <DeveloperCard {...item} />
  );

  return (


    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Developers"  />

      <FlashList
        data={filteredDevelopers}
        renderItem={renderDeveloper}
        keyExtractor={(item) => item.name}
        estimatedItemSize={93}
        contentContainerStyle={styles.listContainer}
      />


      <View style={styles.navBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.value}
            style={[
              styles.navButton,
             
              activeVertical === tab.value && styles.activeNavButton
            ]}
            onPress={() => setActiveVertical(tab.value)}
          >
            <Text style={[
              styles.navText,
              activeVertical === tab.value && styles.activeNavText
            ]}>
          
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#ffffff",
  },

  listContainer: {
    paddingBottom: 80,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeNavButton: {
    backgroundColor: '#FFFFFF',
  },
  navText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  activeNavText: {
    color: '#000000',
  },
});
