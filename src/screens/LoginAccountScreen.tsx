import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const LoginAccountScreen: React.FC = () => {
  const { user, updateUserProfile, enquiries, setActiveTab } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [farmName, setFarmName] = useState(user.farmName || '');
  const [herdSize, setHerdSize] = useState(user.herdSize || '');
  const [location, setLocation] = useState(user.location);

  const supabaseReady = isSupabaseConfigured();

  const handleSaveProfile = () => {
    updateUserProfile({
      fullName,
      phoneNumber,
      farmName,
      herdSize,
      location,
    });
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your dairy farmer profile details have been updated.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farmer Account & Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your farm details & machinery quotations
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Official Brand Portal Card */}
        <View style={styles.brandHeroCard}>
          <Image
            source={require('../../assets/je-logo.png')}
            style={styles.heroLogoImage}
            resizeMode="contain"
          />
          <View style={styles.brandHeroInfo}>
            <Text style={styles.brandHeroTitle}>Jagdamb Enterprises</Text>
            <Text style={styles.brandHeroSubtitle}>
              Registered Farmer Portal • Baramati, Maharashtra
            </Text>
          </View>
        </View>

        {/* Backend / Supabase Status Banner */}
        <View style={styles.backendBadge}>
          <Ionicons
            name={supabaseReady ? 'cloud-done' : 'construct-outline'}
            size={18}
            color={supabaseReady ? COLORS.accent : COLORS.primary}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.backendBadgeTitle}>
              {supabaseReady
                ? 'Supabase Cloud Connected'
                : 'Phase 1: Local Profile Session'}
            </Text>
            <Text style={styles.backendBadgeDesc}>
              {supabaseReady
                ? 'Authentication and cloud database sync are enabled.'
                : 'Supabase client is prepared for Phase 2 cloud sync. Currently running with local state.'}
            </Text>
          </View>
        </View>

        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Image
                source={require('../../assets/je-logo.png')}
                style={styles.avatarLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.nameCol}>
              <Text style={styles.userName}>{user.fullName}</Text>
              <Text style={styles.userPhone}>{user.phoneNumber}</Text>
              <View style={styles.farmBadge}>
                <Ionicons name="leaf" size={12} color={COLORS.accent} />
                <Text style={styles.farmBadgeText}>{user.farmName || 'Dairy Farm'}</Text>
              </View>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Dairy Farm Name</Text>
                <TextInput
                  style={styles.input}
                  value={farmName}
                  onChangeText={setFarmName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Herd Size (Cattle Count)</Text>
                <TextInput
                  style={styles.input}
                  value={herdSize}
                  onChangeText={setHerdSize}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location / Shed Address</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.saveBtn]}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveBtnText}>Save Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cattle Herd Size:</Text>
                <Text style={styles.detailValue}>{user.herdSize}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{user.location}</Text>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                <Text style={styles.editBtnText}>Edit Farm Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setActiveTab('quote')}
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="document-text" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickTitle}>New Quote Request</Text>
            <Text style={styles.quickDesc}>{enquiries.length} enquiry active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setActiveTab('wishlist')}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: COLORS.accentLight }]}>
              <Ionicons name="heart" size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.quickTitle}>Saved Equipment</Text>
            <Text style={styles.quickDesc}>View saved items</Text>
          </TouchableOpacity>
        </View>

        {/* Store Support Card */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Jagdamb Enterprises Store Baramati</Text>
          <Text style={styles.supportDesc}>
            Visit our physical showroom for live milking machine demonstrations, vacuum pump testing, and genuine spare parts fitment.
          </Text>
          <View style={styles.supportRow}>
            <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
            <Text style={styles.supportAddress}>
              Shop 2, Jamdar Nagar, Near PDCC Bank, Kasba, Baramati - 413102
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  backendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  backendBadgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  backendBadgeDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameCol: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  farmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  farmBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  detailsSection: {
    paddingTop: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceSecondary,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  editSection: {
    paddingTop: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    height: 42,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.md,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  quickDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  supportCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  supportDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  supportAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
