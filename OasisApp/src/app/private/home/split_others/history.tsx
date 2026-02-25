import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "@utils/safeArea";
import { getAllSplits } from "@api/split.api";
import SplitHeader from "@components/food/SplitHeader";

async function fetchSplits() {
  try {
    const result = await getAllSplits();
    return { success: true, data: result.data };
  } catch (err: any) {
    return {
      success: false,
      errorMessage: err?.message || "Failed to fetch splits",
    };
  }
}

export default function SplitHistory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [splits, setSplits] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await fetchSplits();
      if (!mounted) return;
      setLoading(false);
      if (res.success) setSplits(Array.isArray(res.data) ? res.data : []);
      else setSplits([]);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: getStatusBarHeight() }]}
    >
      <SplitHeader
        title="SPLIT"
        onBackPress={() => router.replace("/private/home/food/split")}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#56A8E8"
          style={{ marginTop: 24 }}
        />
      ) : splits.length === 0 ? (
        <Text style={styles.empty}>No splits found.</Text>
      ) : (
        <FlatList
          data={splits}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.user?.pfp_url }}
                style={styles.avatar}
              />
              <View style={styles.cardContent}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.name}>
                    {item.user?.name ?? "Unknown"}
                  </Text>
                  <Text style={styles.amount}>₹{item.current_amount}</Text>
                </View>
                <Text style={styles.meta}>
                  {new Date(item.date).toLocaleString()}
                </Text>
                <Text style={styles.idText}>ID: {item.id}</Text>
                <View style={styles.badgesRow}>
                  <Text
                    style={[
                      styles.badge,
                      item.is_owner ? styles.ownerBadge : styles.memberBadge,
                    ]}
                  >
                    {item.is_owner ? "You created" : "Member"}
                  </Text>
                  <Text
                    style={[
                      styles.badge,
                      item.is_completed
                        ? styles.completedBadge
                        : styles.openBadge,
                    ]}
                  >
                    {item.is_completed ? "Completed" : "Not completed"}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    // paddingVertical: 14,
    backgroundColor: "transparent",
  },
  backBtn: { width: 56 },
  backText: { color: "#fff" },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  empty: { color: "#aaa", marginTop: 24, textAlign: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "#1f1f1f",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#333",
  },
  cardContent: { flex: 1 },
  name: { color: "#fff", fontSize: 16, fontWeight: "600" },
  amount: { color: "#fff", fontSize: 16, fontWeight: "700" },
  meta: { color: "#aaa", marginTop: 6 },
  idText: { color: "#aaa", marginTop: 4, fontSize: 12 },
  badgesRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    color: "#fff",
    fontSize: 12,
    overflow: "hidden",
  },
  ownerBadge: { backgroundColor: "#2563eb" },
  memberBadge: { backgroundColor: "#374151" },
  completedBadge: { backgroundColor: "#16a34a" },
  openBadge: { backgroundColor: "#f59e0b" },
});
