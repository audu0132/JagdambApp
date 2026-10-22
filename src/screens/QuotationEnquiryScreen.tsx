import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';

export const QuotationEnquiryScreen: React.FC = () => {
  const {
    quotationTargetProduct,
    setQuotationTargetProduct,
    submitEnquiry,
    enquiries,
    user,
    setActiveTab,
  } = useApp();

  const [farmerName, setFarmerName] = useState(user.fullName || '');
  const [contactNumber, setContactNumber] = useState(user.phoneNumber || '');
  const [villageOrCity, setVillageOrCity] = useState(user.location || '');
  const [herdSize, setHerdSize] = useState(user.herdSize || '');
  const [selectedProductTitle, setSelectedProductTitle] = useState(
    quotationTargetProduct ? quotationTargetProduct.name : 'Bulk Milk Cooler / Custom Parlour'
  );
  const [requirements, setRequirements] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleSubmit = () => {
    if (!farmerName.trim()) {
      Alert.alert('Required Field', 'Please enter your Name or Enterprise name.');
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 8) {
      Alert.alert('Required Field', 'Please enter a valid mobile contact number.');
      return;
    }
    if (!villageOrCity.trim()) {
      Alert.alert('Required Field', 'Please enter your Village, Taluka or District.');
      return;
    }

    submitEnquiry({
      farmerName: farmerName.trim(),
      contactNumber: contactNumber.trim(),
      villageOrCity: villageOrCity.trim(),
      state: 'Maharashtra',
      herdSize: herdSize.trim(),
      interestedProduct: selectedProductTitle,
      productId: quotationTargetProduct?.id,
      additionalRequirements: requirements.trim(),
    });

    setIsSubmittedSuccess(true);
  };

  const handleResetForNew = () => {
    setQuotationTargetProduct(null);
    setRequirements('');
    setIsSubmittedSuccess(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quotation Enquiry</Text>
        <Text style={styles.headerSubtitle}>
          Get official quotes & installation consultation for dairy machinery
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Store Context Box */}
        <View style={styles.storeCard}>
          <Ionicons name="storefront" size={24} color={COLORS.primary} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>Jagdamb Enterprises — Baramati</Text>
            <Text style={styles.storeAddress}>
              Shop 2, Jamdar Nagar, Near PDCC Bank, Kasba, Baramati - 413102
            </Text>
            <Text style={styles.storeDirectPhone}>Direct Quotation Desk: +91 98220 XXXXX</Text>
          </View>
        </View>

        {isSubmittedSuccess ? (
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={48} color={COLORS.accent} />
            </View>
            <Text style={styles.successTitle}>Enquiry Successfully Received!</Text>
            <Text style={styles.successMessage}>
              Thank you, {farmerName}. Your equipment quotation request for "{selectedProductTitle}" has been logged. Our Baramati engineering desk will contact you with sizing recommendations and pricing.
            </Text>

            <TouchableOpacity style={styles.actionBtn} onPress={handleResetForNew}>
              <Text style={styles.actionBtnText}>Submit Another Enquiry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.catalogBtn]}
              onPress={() => setActiveTab('home')}
            >
              <Text style={styles.catalogBtnText}>Return to Catalog</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Dairy Farmer & Equipment Details</Text>

            {/* Target Product Badge if prefilled */}
            {quotationTargetProduct && (
              <View style={styles.targetProductBadge}>
                <Ionicons name="pricetag" size={16} color={COLORS.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.targetProductLabel}>Selected Equipment:</Text>
                  <Text style={styles.targetProductName}>{quotationTargetProduct.name}</Text>
                  <Text style={styles.targetProductMeta}>
                    {quotationTargetProduct.brand} • Model {quotationTargetProduct.modelNumber}
                  </Text>
                </View>
              </View>
            )}

            {/* Farmer Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Farmer / Enterprise Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Ramesh Patil / Patil Dairy Farm"
                placeholderTextColor={COLORS.textMuted}
                value={farmerName}
                onChangeText={setFarmerName}
              />
            </View>

            {/* Contact Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                WhatsApp / Mobile Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98XXXXXXXX"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={contactNumber}
                onChangeText={setContactNumber}
              />
            </View>

            {/* Village / Taluka */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Village / Taluka / District <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kasba, Baramati, Pune"
                placeholderTextColor={COLORS.textMuted}
                value={villageOrCity}
                onChangeText={setVillageOrCity}
              />
            </View>

            {/* Herd Size */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Herd Size (Cows / Buffaloes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 15 Cows, 5 Buffaloes"
                placeholderTextColor={COLORS.textMuted}
                value={herdSize}
                onChangeText={setHerdSize}
              />
            </View>

            {/* Equipment Selection if not prefilled */}
            {!quotationTargetProduct && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Equipment of Interest</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Bulk Milk Cooler 1000L or Milking Parlour"
                  placeholderTextColor={COLORS.textMuted}
                  value={selectedProductTitle}
                  onChangeText={setSelectedProductTitle}
                />
              </View>
            )}

            {/* Additional Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specific Requirements / Shed Layout</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your power supply (single/3-phase), daily milk volume, or installation timeline..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={4}
                value={requirements}
                onChangeText={setRequirements}
              />
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={20} color={COLORS.textInverse} />
              <Text style={styles.submitBtnText}>Submit Quotation Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Previous Enquiries History */}
        {enquiries.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Your Submitted Enquiries ({enquiries.length})</Text>
            {enquiries.map((enq) => (
              <View key={enq.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyId}>{enq.id}</Text>
                  <View style={styles.historyStatusPill}>
                    <Text style={styles.historyStatusText}>Under Review</Text>
                  </View>
                </View>
                <Text style={styles.historyProduct}>{enq.interestedProduct}</Text>
                <Text style={styles.historyLocation}>📍 {enq.villageOrCity}</Text>
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
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  storeAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  storeDirectPhone: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
    marginTop: 3,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  formSectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  targetProductBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  targetProductLabel: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  targetProductName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  targetProductMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  required: {
    color: COLORS.danger,
  },
  input: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    height: 46,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 90,
    paddingTop: SPACING.sm,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  submitBtnText: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  successIconCircle: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  successMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionBtnText: {
    color: COLORS.textInverse,
    fontWeight: '700',
    fontSize: 14,
  },
  catalogBtn: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  catalogBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  historySection: {
    marginTop: SPACING.xl,
  },
  historyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyId: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  historyStatusPill: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  historyStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.warning,
  },
  historyProduct: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  historyLocation: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
