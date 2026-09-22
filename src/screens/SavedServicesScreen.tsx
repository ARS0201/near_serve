import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/common/EmptyState';
import { Header } from '../components/common/Header';
import { ProviderCard } from '../components/common/ProviderCard';
import { COLORS, SPACING } from '../constants/theme';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';
import type { Provider } from '../types/index';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SavedServicesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { providers, savedProviderIds } = useBooking();

  const savedProviders = providers.filter((p) => savedProviderIds.includes(p.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Saved Services"
        subtitle={`${savedProviders.length} bookmarked providers`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={savedProviders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Provider }) => (
          <ProviderCard
            provider={item}
            onPress={() =>
              navigation.navigate('ServiceDetails', { providerId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No saved services yet"
            subtitle="Tap the heart icon on any service provider to save them for easy access later."
            actionText="Explore Services"
            onAction={() => navigation.navigate('Discover')}
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
});
