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
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { openWhatsAppEnquiry } from '../lib/supabaseService';

export const QuotationEnquiryScreen: React.FC = () => {
  const {
    quotationTargetProduct,
    setQuotationTargetProduct,
    submitEnquiry,
    enquiries,
    user,
    setActiveTab,
  } = useApp();
  const { language, t } = useLanguage();

  const [farmerName, setFarmerName] = useState(user.fullName || '');
  const [contactNumber, setContactNumber] = useState(user.phoneNumber || '');
  const [villageOrCity, setVillageOrCity] = useState(user.location || '');
  const [herdSize, setHerdSize] = useState(user.herdSize || '');
  const [requirements, setRequirements] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedProductTitle = quotationTargetProduct
    ? quotationTargetProduct.name
    : 'Bulk Milk Cooler / Custom Parlour';

  const handleSubmit = async () => {
    if (!farmerName.trim()) {
      Alert.alert(
        language === 'mr' ? 'नाव आवश्यक' : 'Required Field',
        language === 'mr' ? 'कृपया शेतकरी अथवा संस्थेचे नाव प्रविष्ट करा.' : 'Please enter your Name or Enterprise name.'
      );
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 8) {
      Alert.alert(
        language === 'mr' ? 'मोबाईल नंबर आवश्यक' : 'Required Field',
        language === 'mr' ? 'कृपया योग्य मोबाईल अथवा व्हॉट्सॲप नंबर प्रविष्ट करा.' : 'Please enter a valid mobile contact number.'
      );
      return;
    }
    if (!villageOrCity.trim()) {
      Alert.alert(
        language === 'mr' ? 'पत्ता आवश्यक' : 'Required Field',
        language === 'mr' ? 'कृपया गाव, तालुका अथवा जिल्हा प्रविष्ट करा.' : 'Please enter your Village, Taluka or District.'
      );
      return;
    }

    setIsSubmitting(true);
    await submitEnquiry({
      farmerName: farmerName.trim(),
      contactNumber: contactNumber.trim(),
      villageOrCity: villageOrCity.trim(),
      state: 'Maharashtra',
      herdSize: herdSize.trim(),
      interestedProduct: selectedProductTitle,
      productId: quotationTargetProduct?.id,
      additionalRequirements: requirements.trim(),
    });
    setIsSubmitting(false);
    setIsSubmittedSuccess(true);
  };

  const handleSendToWhatsApp = () => {
    let msg = `*Quotation Enquiry — Jagdamb Enterprises Baramati*\n`;
    msg += `Farmer: ${farmerName.trim()}\n`;
    msg += `Mobile: ${contactNumber.trim()}\n`;
    msg += `Village/District: ${villageOrCity.trim()}\n`;
    msg += `Herd Size: ${herdSize.trim() || 'Not specified'}\n`;
    msg += `Interested In: ${selectedProductTitle}\n`;
    if (requirements.trim()) {
      msg += `Requirements: ${requirements.trim()}\n`;
    }
    msg += `\nPlease provide formal quotation, installation details, and subsidy support info.`;

    openWhatsAppEnquiry(selectedProductTitle, undefined, msg);
  };

  const handleResetForNew = () => {
    setQuotationTargetProduct(null);
    setRequirements('');
    setIsSubmittedSuccess(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('quotationTitle')}</Text>
        <Text style={styles.headerSubtitle}>{t('quotationSubtitle')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Store Context Box */}
        <View style={styles.storeCard}>
          <Image
            source={require('../../assets/je-logo.png')}
            style={styles.storeLogo}
            resizeMode="contain"
          />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>
              {language === 'mr' ? 'जगदंब एंटरप्रायझेस — बारामती' : 'Jagdamb Enterprises — Baramati'}
            </Text>
            <Text style={styles.storeAddress}>{t('showroomAddress')}</Text>
            <Text style={styles.storeDirectPhone}>
              {language === 'mr' ? 'थेट संपर्क डेस्क:' : 'Quotation Desk:'} +91 98220 12345
            </Text>
          </View>
        </View>

        {isSubmittedSuccess ? (
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={48} color={COLORS.accent} />
            </View>

            <Text style={styles.successTitle}>
              {language === 'mr' ? 'कोटेशन मागणी नोंदवली गेली!' : 'Quotation Request Registered!'}
            </Text>
            <Text style={styles.successMessage}>{t('quoteSubmitted')}</Text>

            {/* Quick Action: Send on WhatsApp for instant confirmation */}
            <TouchableOpacity
              style={styles.waConfirmBtn}
              onPress={handleSendToWhatsApp}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.waConfirmBtnText}>
                {language === 'mr' ? 'व्हॉट्सॲपवर त्वरित पाठवा' : 'Send on WhatsApp for Instant Quote'}
              </Text>
            </TouchableOpacity>

            <View style={styles.successDetailsBox}>
              <Text style={styles.successDetailText}>
                <Text style={styles.detailBold}>Farmer:</Text> {farmerName}
              </Text>
              <Text style={styles.successDetailText}>
                <Text style={styles.detailBold}>Contact:</Text> {contactNumber}
              </Text>
              <Text style={styles.successDetailText}>
                <Text style={styles.detailBold}>Equipment:</Text> {selectedProductTitle}
              </Text>
            </View>

            <View style={styles.successButtonsRow}>
              <TouchableOpacity
                style={styles.newQuoteBtn}
                onPress={handleResetForNew}
                activeOpacity={0.8}
              >
                <Text style={styles.newQuoteBtnText}>
                  {language === 'mr' ? 'नवीन मागणी करा' : 'Submit Another Request'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.catalogReturnBtn}
                onPress={() => {
                  setActiveTab('home');
                  try { router.push('/(tabs)'); } catch (e) {}
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.catalogReturnBtnText}>
                  {language === 'mr' ? 'कॅटलॉग पहा' : 'Return to Catalog'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formCardTitle}>
              {language === 'mr' ? 'कोटेशन फॉर्म भरा' : 'Quotation Request Form'}
            </Text>

            {/* Target Product Badge if selected from details/card */}
            {quotationTargetProduct && (
              <View style={styles.targetBadge}>
                <Ionicons name="pricetag" size={16} color={COLORS.primary} />
                <View style={styles.targetInfo}>
                  <Text style={styles.targetLabel}>
                    {language === 'mr' ? 'निवडलेले उपकरण:' : 'Selected Equipment:'}
                  </Text>
                  <Text style={styles.targetTitle}>{quotationTargetProduct.name}</Text>
                </View>
              </View>
            )}

            {/* Farmer Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('farmerName')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={farmerName}
                onChangeText={setFarmerName}
                placeholder={language === 'mr' ? 'उदा. दत्तात्रय शिंदे' : 'e.g. Dattatray Shinde'}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* WhatsApp / Mobile */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('contactNumber')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={contactNumber}
                onChangeText={setContactNumber}
                placeholder="+91 98220 XXXXX"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
              />
            </View>

            {/* Location */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('villageCity')} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={villageOrCity}
                onChangeText={setVillageOrCity}
                placeholder={language === 'mr' ? 'उदा. कसबा, बारामती, पुणे' : 'e.g. Kasba, Baramati, Dist. Pune'}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* Herd Size */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('herdSize')}</Text>
              <TextInput
                style={styles.input}
                value={herdSize}
                onChangeText={setHerdSize}
                placeholder={t('herdPlaceholder')}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* Additional Requirements */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('requirements')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={requirements}
                onChangeText={setRequirements}
                placeholder={t('requirementsPlaceholder')}
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Ionicons name="paper-plane" size={18} color={COLORS.surface} />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? t('submitting') : t('submitQuote')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.directWhatsAppBtn}
              onPress={handleSendToWhatsApp}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#15803D" />
              <Text style={styles.directWhatsAppBtnText}>
                {language === 'mr'
                  ? 'किंवा थेट व्हॉट्सॲपवर माहिती विचारा'
                  : 'Or Ask Instantly on WhatsApp'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Enquiries History */}
        {enquiries.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historySectionTitle}>{t('recentQuotes')}</Text>
            {enquiries.slice(0, 5).map((enq) => (
              <View key={enq.id} style={styles.historyCard}>
                <View style={styles.historyCardHeader}>
                  <Text style={styles.historyProduct}>
                    {enq.interestedProduct || 'Dairy Machinery'}
                  </Text>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyBadgeText}>
                      {language === 'mr' ? 'नोंदवले' : 'Pending Review'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historyFarmer}>
                  {enq.farmerName} • {enq.villageOrCity}
                </Text>
                <Text style={styles.historyDate}>
                  {new Date(enq.submittedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
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
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  storeLogo: {
    width: 44,
    height: 44,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  storeAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  storeDirectPhone: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formCardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: SPACING.md,
    gap: 8,
  },
  targetInfo: {
    flex: 1,
  },
  targetLabel: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  targetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  required: {
    color: COLORS.danger,
  },
  input: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 80,
    paddingVertical: SPACING.sm,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    gap: 8,
    marginTop: SPACING.sm,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  directWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    gap: 8,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  directWhatsAppBtnText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '700',
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },
  successIconCircle: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  waConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    gap: 8,
    marginBottom: SPACING.lg,
  },
  waConfirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  successDetailsBox: {
    width: '100%',
    backgroundColor: COLORS.surfaceSecondary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  successDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailBold: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  successButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  newQuoteBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  newQuoteBtnText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  catalogReturnBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  catalogReturnBtnText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  historySection: {
    marginTop: SPACING.md,
  },
  historySectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.sm,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyProduct: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  historyBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  historyFarmer: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
