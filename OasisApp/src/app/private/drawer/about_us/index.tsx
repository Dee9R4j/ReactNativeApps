import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground
} from "react-native";
import { useRouter } from "expo-router";
import * as Application from "expo-application";
import { getStatusBarHeight } from "@/utils/safeArea";
import licensesData from "../../../../../licenses.json";
import ScreenHeader from "@/components/ScreenHeader";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useConditionalBackGuard } from "@/hooks/useConditionalBackGuard";
import { useFastStore } from "@/state/fast/fast";


const { width, height } = Dimensions.get("window");
const Divider = () => <View style={styles.divider} />;

interface License {
  libraryName: string;
  version: string;
  _license: string;
  _description?: string;
  homepage?: string;
}

export default function AboutUsScreen() {
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const prefStore = useFastStore(state => state.signedStoreIn);

  useConditionalBackGuard(prefStore, "private/home/events" as any);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLicenses(licensesData);
      } catch (error: any) {
        console.error("Error fetching OSS licenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@assets/images/common-bg-png.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScreenHeader title="About" />

      <View style={styles.fixedContent}>
        <Text style={styles.appName}>OASIS 2025</Text>
        <Divider />
        <Text style={styles.versionText}>
          VERSION: {Application.nativeApplicationVersion}
        </Text>
        <Divider />
        <TouchableOpacity
          onPress={() =>
            router.push("/private/drawer/about_us/privacy-policy" as any)
          }
          style={styles.linkContainer}
        >
          <Text style={styles.linkTitle}>PRIVACY POLICY ↗</Text>
          <Text style={styles.linkUrl}>
            https://dvm-bitspilani.github.io/apogeeApp-25-blogs/privacypolicy.html
          </Text>
        </TouchableOpacity>
        <Divider />
        <Text style={styles.sectionTitle}>OSS LICENSES</Text>
        <Text style={styles.licenseCount}>
          {licenses.length} Open Source Libraries
        </Text>
      </View>

      <View style={styles.scrollableContainer}>
        <ScrollView
          style={styles.licenseScrollView}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.licenseScrollContent}
        >
          {loading ? (
            <LoadingIndicator title="Loading Licenses..." />
          ) : (
            licenses.map((lib, index) => (
              <View key={index}>
                <View style={styles.licenseItem}>
                  <Text style={styles.licenseName}>
                    {index + 1}. {lib.libraryName}
                  </Text>
                  <Text style={styles.licenseVersion}>v{lib.version}</Text>
                  <Text style={styles.licenseText}>{lib._license}</Text>
                  {lib._description && (
                    <Text style={styles.licenseDescription}>
                      {lib._description}
                    </Text>
                  )}
                </View>
                {index < licenses.length - 1 && <Divider />}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by DVM</Text>
        <Text style={styles.footerSubText}>DVM • BITS Pilani</Text>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: getStatusBarHeight(),
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  fixedContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollableContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  licenseScrollView: {
    flex: 1,
  },
  licenseScrollContent: {
    paddingBottom: 10,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 28,
    textAlign: "center",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 20,
  },
  versionText: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "monospace",
  },
  linkContainer: {
    alignItems: "center",
  },
  linkTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  linkUrl: {
    color: "#FFFFFF",
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "monospace",
  },
  licenseCount: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  licenseItem: {
    paddingVertical: 8,
  },
  licenseName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  licenseVersion: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 2,
    fontFamily: "monospace",
  },
  licenseText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  licenseDescription: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
    lineHeight: 16,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
  },
  footerSubText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "300",
  },
});
