import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/common/CustomButton';
import { CustomInput } from '../components/common/CustomInput';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, updateUser, logout } = useAuth();
  const { bookings, savedProviderIds, notifications } = useBooking();

  // Edit Profile Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [isSaving, setIsSaving] = useState(false);

  // Info Modals (Help, Terms, Privacy)
  const [infoModalTitle, setInfoModalTitle] = useState<string | null>(null);
  const [infoModalContent, setInfoModalContent] = useState<string | null>(null);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const handleOpenEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setLocation(user?.location || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });
      setEditModalVisible(false);
      Alert.alert('Profile Updated', 'Your profile details have been updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out of NearServe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={COLORS.white} />
              </View>
            )}
            <TouchableOpacity
              style={styles.editAvatarPill}
              onPress={handleOpenEdit}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'Amirtha Varshini'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'demo@nearserve.com'}</Text>

          <View style={styles.userMetaRow}>
            <View style={styles.metaPill}>
              <Ionicons name="call-outline" size={13} color={COLORS.primary} />
              <Text style={styles.metaPillText}>{user?.phone || '+91 98765 43210'}</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="location-outline" size={13} color={COLORS.primary} />
              <Text style={styles.metaPillText}>
                {user?.location || 'Coimbatore, Tamil Nadu'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={handleOpenEdit}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color={COLORS.primary} />
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Banner */}
        <View style={styles.statsCard}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('MyBookings')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('SavedServices')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{savedProviderIds.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Menu List */}
        <View style={styles.menuSection}>
          {/* My Bookings */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyBookings')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuTitle}>My Bookings</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Saved / Favorite Services */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('SavedServices')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: COLORS.dangerLight }]}>
              <Ionicons name="heart-outline" size={20} color={COLORS.danger} />
            </View>
            <Text style={styles.menuTitle}>Saved Services</Text>
            <View style={styles.menuBadgeRow}>
              <Text style={styles.menuBadgeText}>{savedProviderIds.length}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: COLORS.warningLight }]}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.menuTitle}>Notifications</Text>
            {unreadNotifs > 0 && (
              <View style={styles.unreadChip}>
                <Text style={styles.unreadChipText}>{unreadNotifs} New</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setInfoModalTitle('Help & Support');
              setInfoModalContent(
                'NearServe Support Center\n\n• Email: support@nearserve.com\n• Helpline: +91 1800 233 4455 (Mon-Sat, 9am - 8pm)\n• Instant Chat: Available in-app\n\nFor any booking disputes or emergency service inquiries, our support team is available 24/7.'
              );
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="help-circle-outline" size={20} color="#0284C7" />
            </View>
            <Text style={styles.menuTitle}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setInfoModalTitle('Terms & Conditions');
              setInfoModalContent(
                'NearServe Terms of Service\n\n1. Acceptance of Terms: By booking on NearServe, you agree to our standard service guidelines.\n2. Verified Providers: All service partners are independently verified for skills and background.\n3. Cancellation Policy: Free cancellation up to 2 hours before scheduled slot.\n4. Payments: Payments can be settled directly upon completion of service.'
              );
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: COLORS.background }]}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.menuTitle}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setInfoModalTitle('Privacy Policy');
              setInfoModalContent(
                'NearServe Privacy Policy\n\nYour privacy is paramount. We do not sell your personal information. Location and contact data are strictly used to coordinate doorstep services with authorized providers.'
              );
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: COLORS.background }]}>
              <Ionicons name="shield-outline" size={20} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.menuTitle}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footerVersion}>NearServe v1.0.0 • Made with ❤️ in Coimbatore</Text>
      </ScrollView>

      {/* Edit Profile Modal (Phase 10) */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeading}>Edit Profile</Text>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                    <Ionicons name="close" size={22} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                  <CustomInput
                    label="Full Name"
                    leftIcon="person-outline"
                    value={name}
                    onChangeText={setName}
                  />

                  <CustomInput
                    label="Email Address"
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />

                  <CustomInput
                    label="Phone Number"
                    leftIcon="call-outline"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />

                  <CustomInput
                    label="Location"
                    leftIcon="location-outline"
                    value={location}
                    onChangeText={setLocation}
                  />

                  <CustomButton
                    title="Save Changes"
                    loading={isSaving}
                    onPress={handleSaveProfile}
                    style={styles.saveBtn}
                  />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Info Modal (Help / Terms / Privacy) */}
      <Modal
        visible={!!infoModalTitle}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalTitle(null)}
      >
        <TouchableWithoutFeedback onPress={() => setInfoModalTitle(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.infoModalCard}>
                <Text style={styles.infoModalTitle}>{infoModalTitle}</Text>
                <ScrollView style={styles.infoModalScroll}>
                  <Text style={styles.infoModalText}>{infoModalContent}</Text>
                </ScrollView>
                <CustomButton
                  title="Close"
                  size="sm"
                  onPress={() => setInfoModalTitle(null)}
                  style={styles.infoModalBtn}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  profileHeaderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.borderLight,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarPill: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: FONT_SIZES.xs + 1,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaPillText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: '500',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginTop: SPACING.lg,
    gap: 6,
  },
  editProfileBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.xs + 1,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.subtle,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.borderLight,
  },
  menuSection: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: FONT_SIZES.sm + 1,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  unreadChip: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
  },
  unreadChipText: {
    color: COLORS.danger,
    fontSize: 10,
    fontWeight: '800',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  footerVersion: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    padding: SPACING.xl,
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalHeading: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalForm: {
    marginVertical: SPACING.xs,
  },
  saveBtn: {
    marginTop: SPACING.md,
  },
  infoModalCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 360,
    maxHeight: '75%',
    padding: SPACING.xl,
    ...SHADOWS.large,
  },
  infoModalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoModalScroll: {
    marginBottom: SPACING.lg,
  },
  infoModalText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  infoModalBtn: {
    width: '100%',
  },
});
