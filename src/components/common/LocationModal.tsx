import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useBooking } from '../../context/BookingContext';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
}

const COIMBATORE_AREAS = [
  'Coimbatore (All Areas)',
  'Gandhipuram',
  'RS Puram',
  'Peelamedu',
  'Saibaba Colony',
  'Race Course',
  'Saravanampatti',
  'Singanallur',
  'Vadavalli',
  'Ramanathapuram',
];

export const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
}) => {
  const { currentLocation, setCurrentLocation } = useBooking();

  const handleSelectArea = (area: string) => {
    setCurrentLocation(area.replace(' (All Areas)', ''));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.contentCard}>
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Ionicons name="location" size={20} color={COLORS.primary} />
                  <Text style={styles.headerTitle}>Select Your Location</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtext}>
                Choose your neighborhood in Coimbatore to view nearby providers
              </Text>

              <ScrollView
                style={styles.areaList}
                showsVerticalScrollIndicator={false}
              >
                {COIMBATORE_AREAS.map((area) => {
                  const cleanName = area.replace(' (All Areas)', '');
                  const isSelected =
                    currentLocation === cleanName ||
                    (currentLocation === 'Coimbatore' && area.includes('All Areas'));

                  return (
                    <TouchableOpacity
                      key={area}
                      style={[
                        styles.areaItem,
                        isSelected && styles.selectedAreaItem,
                      ]}
                      onPress={() => handleSelectArea(area)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.areaNameRow}>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={isSelected ? COLORS.primary : COLORS.textMuted}
                        />
                        <Text
                          style={[
                            styles.areaName,
                            isSelected && styles.selectedAreaName,
                          ]}
                        >
                          {area}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.activeTag}>
                          <Text style={styles.activeTagText}>Active</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  contentCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '75%',
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  subtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  areaList: {
    marginVertical: SPACING.xs,
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
  selectedAreaItem: {
    backgroundColor: COLORS.primaryLight,
  },
  areaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  areaName: {
    fontSize: FONT_SIZES.sm + 1,
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedAreaName: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  activeTagText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs - 2,
    fontWeight: '700',
  },
});
