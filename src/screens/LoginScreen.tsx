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
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { emailOrPhone?: string; password?: string } = {};
    const input = emailOrPhone.trim();

    if (!input) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else if (
      input.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
    ) {
      newErrors.emailOrPhone = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setGeneralError(null);
    if (!validate()) return;

    try {
      await login(emailOrPhone.trim(), password);
      // Navigation is handled via navigation.replace('Home') or state
      navigation.replace('Home');
    } catch (err: any) {
      setGeneralError(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmailOrPhone('demo@nearserve.com');
    setPassword('password123');
    setErrors({});
    setGeneralError(null);

    try {
      await login('demo@nearserve.com', 'password123');
      navigation.replace('Home');
    } catch (err: any) {
      setGeneralError(err?.message || 'Demo login failed.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'A password reset link has been sent to your registered email address.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Brand Section */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Ionicons name="location" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.appName}>
              Near<Text style={styles.appNameAccent}>Serve</Text>
            </Text>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to book and manage your local services
            </Text>
          </View>

          {/* Form Container Card */}
          <View style={styles.card}>
            {generalError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            ) : null}

            {/* Email / Phone Field */}
            <CustomInput
              label="Email or Phone Number"
              placeholder="e.g. alex@example.com or 9876543210"
              leftIcon="mail-outline"
              value={emailOrPhone}
              onChangeText={(text) => {
                setEmailOrPhone(text);
                if (errors.emailOrPhone) setErrors({ ...errors, emailOrPhone: undefined });
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.emailOrPhone}
            />

            {/* Password Field */}
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              leftIcon="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <CustomButton
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            {/* Quick Demo Login Pill */}
            <TouchableOpacity
              style={styles.demoLoginPill}
              onPress={handleQuickDemoLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="flash" size={16} color={COLORS.secondary} />
              <Text style={styles.demoLoginText}>Quick Demo Login</Text>
            </TouchableOpacity>
          </View>

          {/* Footer - Create Account */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.7}
            >
              <Text style={styles.signupLink}>Create New Account</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  appName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  appNameAccent: {
    color: COLORS.primary,
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.md,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: -SPACING.xs,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
  },
  demoLoginPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: 6,
  },
  demoLoginText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
});
