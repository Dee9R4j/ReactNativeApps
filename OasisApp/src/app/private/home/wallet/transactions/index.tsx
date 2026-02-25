import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { sBarHeight } from "../../../../../utils/safeArea";
import { Ionicons } from "@expo/vector-icons";
import { getWalletTransactions } from "@/api/wallet.api";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";

async function getTransactionHistory() {
  try {
    const result = await getWalletTransactions();
    return { success: true, data: result.data };
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.message || "Failed to fetch transactions",
    };
  }
}

export default function TransactionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [txns, setTxns] = useState<any[]>([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getTransactionHistory();
      setLoading(false);
      if (result.success) {
        setTxns(
          Array.isArray(result.data) ? result.data : result.data?.txns || []
        );
      } else {
        showSnackbar({ message: result.errorMessage || "Failed to fetch transactions.", type: "error" })

        setTxns([]);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.overlay, { paddingTop: sBarHeight + 16 }]}>
      {" "}
      {/* dark mode, top padding */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/private/home/wallet")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Transaction History</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1976d2"
          style={{ marginTop: 32 }}
        />
      ) : txns.length === 0 ? (
        <Text
          style={{ color: "#aaa", marginVertical: 32, textAlign: "center" }}
        >
          No transactions found.
        </Text>
      ) : (
        <ScrollView
          style={{ width: "100%", paddingHorizontal: 8 }}
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {txns.map((txn, idx) => (
            <View
              key={idx}
              style={{
                borderBottomWidth: idx === txns.length - 1 ? 0 : 1,
                borderColor: "#333",
                paddingVertical: 16,
                paddingHorizontal: 8,
                marginBottom: 2,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginBottom: 2,
                }}
              >
                ₹{txn.price} {txn.name ? `(${txn.name})` : ""}
              </Text>
              <Text style={{ color: "#aaa", fontSize: 13 }}>
                {txn.time ? new Date(txn.time).toLocaleString() : ""}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#181818", // dark mode
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#222",
    backgroundColor: "#222",
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: 24,
    letterSpacing: 1,
  },
});
