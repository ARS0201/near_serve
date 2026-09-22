import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/common/CustomButton';
import { CustomInput } from '../components/common/CustomInput';
import { Header } from '../components/common/Header';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!location.trim()) {
      newErrors.location = 'Location / Area is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    setGeneralError(null);
    if (!validate()) return;

    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        password,
      });

      Alert.alert(
        'Account Created! 🎉',
        'Welcome to NearServe. You can now login with your new account credentials.',
        [
          {
            text: 'Proceed to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err: any) {
      setGeneralError(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        onBack={() => navigation.navigate('Login')}
        title="Create Account"
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subtitle intro */}
          <View style={styles.introSection}>
            <Text style={styles.heading}>Join NearServe 👋</Text>
            <Text style={styles.subheading}>
              Connect with top-rated local professionals in seconds
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {generalError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            ) : null}

            {/* Full Name */}
            <CustomInput
              label="Full Name *"
              placeholder="e.g. Alex Johnson"
              leftIcon="person-outline"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              error={errors.name}
            />

            {/* Email Address */}
            <CustomInput
              label="Email Address *"
              placeholder="e.g. alex@example.com"
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
            />

            {/* Phone Number */}
            <CustomInput
              label="Phone Number *"
              placeholder="e.g. (555) 123-4567"
              leftIcon="call-outline"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              error={errors.phone}
            />

            {/* Location */}
            <CustomInput
              label="Your Location / Neighborhood *"
              placeholder="e.g. Downtown Sector 4, Metro"
              leftIcon="location-outline"
              value={location}
              onChangeText={(t) => {
                setLocation(t);
                if (errors.location) setErrors({ ...errors, location: undefined });
              }}
              error={errors.location}
            />

            {/* Password */}
            <CustomInput
              label="Password *"
              placeholder="At least 6 characters"
              leftIcon="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
            />

            {/* Confirm Password */}
            <CustomInput
              label="Confirm Password *"
              placeholder="Re-enter your password"
              leftIcon="shield-checkmark-outline"
              isPassword
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <CustomButton
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  introSection: {
    marginBottom: SPACING.lg,
  },
  heading: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  subheading: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    gap: SPACING.xs + 2,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    flex: 1,
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
});
