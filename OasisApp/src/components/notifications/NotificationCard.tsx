import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NotificationItem } from '@/state/base/notificationSlice';
import { r_t } from '@/utils/responsive';
import { date } from 'drizzle-orm/mysql-core';

interface NotificationCardProps {
  item: NotificationItem;
  onPress: () => void;
  formatTime: (dateString: string) => string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onPress,
  formatTime,
}) => {
  return (
    <TouchableOpacity onPress={onPress} >
      <ImageBackground
              source={require("@assets/images/clouds.png")}
              style={styles.notificationCard}
              imageStyle={{ opacity: 0.2 }}
              
            >

      <View >
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>
            {item.title}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.notificationMessage}>
            {item.message}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.notificationTime}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    marginHorizontal: 22,
    marginTop: 12,
    padding: 12,
    overflow: 'hidden',
    borderColor: '#ffffff',
    borderWidth: 1,
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'column',
  },
  dateContainer: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  messageContainer: {
    marginTop: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  notificationTitle: {
    fontSize: r_t(16),
    fontFamily: 'Proza Libre',
    color: '#f0f0f0',
  },
  notificationTime: {
    fontSize: r_t(12),
    color: '#FFFFFF',
    marginTop: 2,
    fontFamily: 'Quattrocento Sans',
  },
  notificationMessage: {
    fontSize: r_t(14),
    color: '#E8E7E7',
    marginTop: 4,
    fontFamily: 'Quattrocento Sans',
  },
});

export default NotificationCard;