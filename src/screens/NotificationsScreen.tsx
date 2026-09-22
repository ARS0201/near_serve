import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/common/EmptyState';
import { Header } from '../components/common/Header';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';
import type { AppNotification } from '../types/index';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { notifications, markNotificationAsRead } = useBooking();

  const getNotifIcon = (type?: AppNotification['type']) => {
    switch (type) {
      case 'booking_confirmed':
        return { name: 'checkmark-circle', color: COLORS.success, bg: COLORS.successLight };
      case 'provider_assigned':
        return { name: 'person', color: COLORS.primary, bg: COLORS.primaryLight };
      case 'service_reminder':
        return { name: 'alarm', color: COLORS.warning, bg: COLORS.warningLight };
      case 'booking_completed':
        return { name: 'shield-checkmark', color: '#0284C7', bg: '#E0F2FE' };
      case 'booking_cancelled':
        return { name: 'close-circle', color: COLORS.danger, bg: COLORS.dangerLight };
      default:
        return { name: 'notifications', color: COLORS.primary, bg: COLORS.primaryLight };
    }
  };

  const handleNotificationPress = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    navigation.navigate('MyBookings');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Notifications"
        subtitle="Updates on your service requests"
        showBack
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: AppNotification }) => {
          const iconConfig = getNotifIcon(item.type);

          return (
            <TouchableOpacity
              style={[
                styles.notifCard,
                !item.isRead && styles.unreadNotifCard,
              ]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrapper, { backgroundColor: iconConfig.bg }]}>
                <Ionicons
                  name={iconConfig.name as any}
                  size={22}
                  color={iconConfig.color}
                />
              </View>

              <View style={styles.textContent}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
                    {item.title}
                  </Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.timeAgo}>{item.timeAgo}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="No notifications yet"
            subtitle="When your booking status changes or a technician is assigned, you'll receive updates here."
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  unreadNotifCard: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: FONT_SIZES.sm + 1,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  unreadTitle: {
    color: COLORS.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  message: {
    fontSize: FONT_SIZES.xs + 1,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  timeAgo: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
});
