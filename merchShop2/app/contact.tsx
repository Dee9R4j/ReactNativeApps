//app/contact.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <Text style={styles.title}>Get In Touch</Text>
      <Text style={styles.paragraph}>
        Have questions, feedback, or need support? We'd love to hear from you! Reach out to us through any of the channels below.
      </Text>
      
      <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('mailto:support@merchshop.example.com')}>
        <Icon name="email" size={26} color="#3498db" style={styles.contactIcon} />
        <View>
            <Text style={styles.contactLabel}>Email Us</Text>
            <Text style={styles.contactText}>support@merchshop.example.com</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('tel:+1234567890')}>
        <Icon name="phone" size={26} color="#2ecc71" style={styles.contactIcon} />
        <View>
            <Text style={styles.contactLabel}>Call Us</Text>
            <Text style={styles.contactText}>+1 (234) 567-890</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('https://twitter.com/merchshop_example')}>
        <Icon name="chat-bubble-outline" size={26} color="#1da1f2" style={styles.contactIcon} />
        <View>
            <Text style={styles.contactLabel}>Social Media</Text>
            <Text style={styles.contactText}>@merchshop_example (Twitter)</Text>
        </View>
      </TouchableOpacity>
       <Text style={styles.footerText}>
        We typically respond within 24-48 business hours.
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 25,
    textAlign: 'center',
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  contactIcon: {
    marginRight: 20,
  },
  contactLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  contactText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#888',
  }
});