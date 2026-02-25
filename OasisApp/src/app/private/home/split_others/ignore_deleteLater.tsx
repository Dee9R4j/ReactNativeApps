import React from "react";
import { View } from "react-native";

export default function IgnoreDeleteLater() {
  return <View />;
}

// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   Pressable,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Button,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { getStatusBarHeight } from "@utils/safeArea";

// // Dummy friend data
// const initialFriends = [
//   { user_id: 2, name: "Bob", status: "pending" },
//   { user_id: 3, name: "Charlie", status: "pending" },
//   { user_id: 4, name: "Diana", status: "pending" },
//   { user_id: 5, name: "Ethan", status: "pending" },
//   { user_id: 6, name: "Alice", status: "pending" },
// ];

// export default function FriendsScreen() {
//   const router = useRouter();
//   const [friends, setFriends] = useState(initialFriends);

//   const handleBackPress = () => {
//     router.back();
//   };

//   const handleDecision = (id: number, decision: "approved" | "rejected") => {
//     setFriends((prev) =>
//       prev.map((f) => (f.user_id === id ? { ...f, status: decision } : f))
//     );
//   };

//   const handleNext = () => {
//     const approvedFriends = friends.filter((f) => f.status === "approved");
//     router.push({
//       pathname: "/private/home/food/split/split-bill",
//       params: { approvedFriends: JSON.stringify(approvedFriends) },
//     });
//   };

//   const renderFriend = ({ item }: { item: (typeof initialFriends)[0] }) => (
//     <View style={styles.friendCard}>
//       <Text style={styles.friendName}>{item.name}</Text>
//       {item.status === "pending" ? (
//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: "green" }]}
//             onPress={() => handleDecision(item.user_id, "approved")}
//           >
//             <Text style={styles.buttonText}>Approve</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: "red" }]}
//             onPress={() => handleDecision(item.user_id, "rejected")}
//           >
//             <Text style={styles.buttonText}>Reject</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <Text
//           style={{
//             color: item.status === "approved" ? "lightgreen" : "tomato",
//           }}
//         >
//           {item.status.toUpperCase()}
//         </Text>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Pressable style={styles.backButton} onPress={handleBackPress}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </Pressable>
//         <Text style={styles.headerTitle}>Select Friends for Split</Text>
//         <View style={styles.backButton} />
//       </View>

//       <View style={styles.mainContainer}>
//         <FlatList
//           data={friends}
//           keyExtractor={(item) => item.user_id.toString()}
//           renderItem={renderFriend}
//           contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
//         />

//         <Button title="Next → Split Bill" onPress={handleNext} />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#1a1a1a",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: getStatusBarHeight(),
//     backgroundColor: "#1a1a1a",
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#ffffff",
//   },
//   mainContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   friendCard: {
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#444",
//     borderRadius: 8,
//     backgroundColor: "#2a2a2a",
//   },
//   friendName: {
//     fontSize: 18,
//     color: "#fff",
//     marginBottom: 10,
//   },
//   actionRow: {
//     flexDirection: "row",
//     gap: 10,
//   },
//   button: {
//     flex: 1,
//     padding: 8,
//     borderRadius: 6,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });
