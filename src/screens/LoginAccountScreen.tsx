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
import { useLanguage } from '../context/LanguageContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { openWhatsAppEnquiry, callBaramatiShowroom } from '../lib/supabaseService';

export const LoginAccountScreen: React.FC = () => {
  const { user, updateUserProfile, enquiries, setActiveTab } = useApp();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();

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
    Alert.alert(
      language === 'mr' ? 'माहिती जतन केली' : 'Profile Saved',
      language === 'mr'
        ? 'तुमचा शेतकरी प्रोफाईल तपशील यशस्वीरीत्या अपडेट करण्यात आला.'
        : 'Your dairy farmer profile details have been updated.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('accountTitle')}</Text>
        <Text style={styles.headerSubtitle}>
          {language === 'mr'
            ? 'गोठ्याची माहिती व कोटेशन व्यवस्थापन'
            : 'Manage your farm details & machinery quotations'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Brand Hero Card */}
        <View style={styles.brandHeroCard}>
          <Image
            source={require('../../assets/je-logo.png')}
            style={styles.heroLogoImage}
            resizeMode="contain"
          />
          <View style={styles.brandHeroInfo}>
            <Text style={styles.brandHeroTitle}>
              {language === 'mr' ? 'जगदंब एंटरप्रायझेस' : 'Jagdamb Enterprises'}
            </Text>
            <Text style={styles.brandHeroSubtitle}>
              {language === 'mr'
                ? 'अधिकृत शेतकरी पोर्टल • बारामती, महाराष्ट्र'
                : 'Registered Farmer Portal • Baramati, Maharashtra'}
            </Text>
          </View>
        </View>

        {/* Language Preference Selector */}
        <View style={styles.languageCard}>
          <View style={styles.languageHeader}>
            <Ionicons name="language" size={20} color={COLORS.primary} />
            <Text style={styles.languageTitle}>
              {language === 'mr' ? 'अ‍ॅप भाषा निवडा / Language' : 'App Language / भाषा निवडा'}
            </Text>
          </View>
          <View style={styles.langButtonRow}>
            <TouchableOpacity
              style={[
                styles.langOptionBtn,
                language === 'en' && styles.langOptionBtnActive,
              ]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langOptionText,
                  language === 'en' && styles.langOptionTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langOptionBtn,
                language === 'mr' && styles.langOptionBtnActive,
              ]}
              onPress={() => setLanguage('mr')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langOptionText,
                  language === 'mr' && styles.langOptionTextActive,
                ]}
              >
                मराठी (Marathi)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backend / Supabase Status Banner */}
        <View style={styles.backendBadge}>
          <Ionicons
            name={supabaseReady ? 'cloud-done' : 'cloud-offline-outline'}
            size={18}
            color={supabaseReady ? COLORS.accent : COLORS.primary}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.backendBadgeTitle}>
              {supabaseReady ? t('supabaseConnected') : t('supabaseLocalMode')}
            </Text>
            <Text style={styles.backendBadgeDesc}>
              {supabaseReady
                ? language === 'mr'
                  ? 'सुपाबेस क्लाउड डेटाबेसवर कोटेशन व कॅटलॉग जोडलेले आहे.'
                  : 'Supabase cloud database is connected for quotes and catalog.'
                : language === 'mr'
                ? 'डेटा स्थानिकरित्या सुरक्षित साठवला जात आहे. सुपाबेस क्लाउड बॅकएंडसाठी सज्ज.'
                : 'Running in offline-first mode with AsyncStorage. Ready for Supabase sync.'}
            </Text>
          </View>
        </View>

        {/* Profile Card */}
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
                <Text style={styles.farmBadgeText}>{user.farmName}</Text>
              </View>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editSection}>
              <Text style={styles.editHeaderTitle}>{t('editProfile')}</Text>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>{t('farmerName')}</Text>
                <TextInput
                  style={styles.editInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Farmer Name"
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>{t('contactNumber')}</Text>
                <TextInput
                  style={styles.editInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>{t('farmName')}</Text>
                <TextInput
                  style={styles.editInput}
                  value={farmName}
                  onChangeText={setFarmName}
                  placeholder="e.g. Shinde Dairy Farm"
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>{t('herdSize')}</Text>
                <TextInput
                  style={styles.editInput}
                  value={herdSize}
                  onChangeText={setHerdSize}
                  placeholder="e.g. 18 Cows / 6 Buffaloes"
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editLabel}>{t('address')}</Text>
                <TextInput
                  style={styles.editInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Shed Village / Location"
                />
              </View>

              <View style={styles.editBtnRow}>
                <TouchableOpacity
                  style={styles.cancelEditBtn}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelEditText}>{t('clearSearch')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveEditBtn}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveEditText}>{t('saveProfile')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Ionicons name="home-outline" size={18} color={COLORS.textMuted} />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>{t('farmName')}</Text>
                  <Text style={styles.infoVal}>{user.farmName || 'Not configured'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="paw-outline" size={18} color={COLORS.textMuted} />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>{t('herdSize')}</Text>
                  <Text style={styles.infoVal}>{user.herdSize || 'Not specified'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color={COLORS.textMuted} />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>{t('address')}</Text>
                  <Text style={styles.infoVal}>{user.location}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setIsEditing(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                <Text style={styles.editBtnText}>{t('editProfile')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Direct Helpline Actions */}
        <View style={styles.helplineCard}>
          <Text style={styles.helplineHeaderTitle}>{t('contactBaramati')}</Text>
          <Text style={styles.helplineSubtitle}>{t('showroomAddress')}</Text>

          <View style={styles.helplineButtonRow}>
            <TouchableOpacity
              style={styles.waHelplineBtn}
              onPress={() => openWhatsAppEnquiry()}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.waHelplineBtnText}>{t('whatsappEnquiry')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callHelplineBtn}
              onPress={callBaramatiShowroom}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={16} color={COLORS.primary} />
              <Text style={styles.callHelplineBtnText}>{t('callShowroom')}</Text>
            </TouchableOpacity>
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
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  brandHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  heroLogoImage: {
    width: 44,
    height: 44,
  },
  brandHeroInfo: {
    flex: 1,
  },
  brandHeroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  brandHeroSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  languageCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  languageTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  langButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  langOptionBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  langOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  langOptionTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  backendBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
    marginBottom: SPACING.md,
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
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  avatarLogo: {
    width: 36,
    height: 36,
  },
  nameCol: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
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
    gap: 4,
    marginTop: 4,
  },
  farmBadgeText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  infoList: {
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  editSection: {
    gap: SPACING.sm,
  },
  editHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  editField: {
    marginBottom: 4,
  },
  editLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  editInput: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 40,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  editBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.sm,
  },
  cancelEditBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
  },
  cancelEditText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  saveEditBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveEditText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 13,
  },
  helplineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  helplineHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  helplineSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  helplineButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  waHelplineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  waHelplineBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  callHelplineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  callHelplineBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
