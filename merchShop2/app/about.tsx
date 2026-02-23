//app/about.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <Text style={styles.title}>About MerchShop</Text>
      <Text style={styles.paragraph}>
        Welcome to MerchShop! We are your one-stop destination for exclusive and high-quality merchandise from your favorite university clubs, communities, and events.
      </Text>
      <Text style={styles.paragraph}>
        Our mission is to provide a seamless and enjoyable shopping experience, bringing you unique designs and products that help you represent your affiliations with pride. From comfy hoodies and stylish t-shirts to essential accessories, we've got you covered.
      </Text>
      <Text style={styles.paragraph}>
        Founded by students, for students (and alumni!), we understand the importance of community spirit and strive to offer products that resonate with your experiences.
      </Text>
      <Text style={styles.paragraph}>
        Thank you for choosing MerchShop. Wear your pride!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 20,
    color: '#555',
    textAlign: 'justify',
  },
});