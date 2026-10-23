import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { QuantityControl } from '../components/QuantityControl';
import { EmptyState } from '../components/EmptyState';
import { openWhatsAppEnquiry } from '../lib/supabaseService';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    setSelectedProduct,
    setActiveTab,
    user,
  } = useApp();
  const { language, t } = useLanguage();

  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  const cartCount = getCartCount();
  const { subtotal, gst, delivery, total, savings } = getCartTotal();

  const handleClearCart = () => {
    Alert.alert(
      language === 'mr' ? 'कार्ट रिकामी करा' : 'Clear Shopping Cart',
      language === 'mr'
        ? 'तुम्हाला खात्री आहे का की सर्व साहित्य कार्टमधून काढायचे आहे?'
        : 'Are you sure you want to remove all items from your cart?',
      [
        { text: language === 'mr' ? 'रद्द करा' : 'Cancel', style: 'cancel' },
        {
          text: language === 'mr' ? 'काढून टाका' : 'Clear All',
          style: 'destructive',
          onPress: clearCart,
        },
      ]
    );
  };

  const handleWhatsAppOrder = () => {
    let orderMsg = `*Jagdamb Enterprises — Machinery Order & Quote Request*\n`;
    orderMsg += `Farmer Name: ${user.fullName || 'Farmer'}\n`;
    orderMsg += `Mobile: ${user.phoneNumber}\n`;
    orderMsg += `Address: ${user.location}\n\n`;
    orderMsg += `*Itemized Order:*\n`;

    cart.forEach((item, index) => {
      orderMsg += `${index + 1}. ${item.product.name} (Qty: ${item.quantity}) - ₹${(
        (item.product.price || 0) * item.quantity
      ).toLocaleString('en-IN')}\n`;
    });

    orderMsg += `\n*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`;
    orderMsg += `\n*GST (18%):* ₹${gst.toLocaleString('en-IN')}`;
    orderMsg += `\n*Delivery:* ${delivery === 0 ? 'FREE' : `₹${delivery}`}`;
    orderMsg += `\n*Estimated Total:* ₹${total.toLocaleString('en-IN')}`;
    orderMsg += `\n\nPlease confirm availability and dispatch schedule from Baramati.`;

    openWhatsAppEnquiry(undefined, undefined, orderMsg);
    setCheckoutModalVisible(false);
  };

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('myCart')}</Text>
        </View>
        <EmptyState
          icon="cart-outline"
          title={t('emptyCartTitle')}
          subtitle={t('emptyCartMsg')}
          actionLabel={t('tabHome')}
          onAction={() => {
            setActiveTab('home');
            try { router.push('/(tabs)'); } catch (e) {}
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('myCart')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('cartItems', { count: cartCount })}
          </Text>
        </View>

        <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={styles.clearBtnText}>{t('clearSearch')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Item Cards */}
        <View style={styles.itemList}>
          {cart.map((item) => {
            const unitPrice = item.product.price || 0;
            const itemTotal = unitPrice * item.quantity;
            const itemName =
              language === 'mr' && item.product.marathiName
                ? item.product.marathiName
                : item.product.name;

            return (
              <View key={item.product.id} style={styles.cartCard}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedProduct(item.product);
                    try {
                      router.push({
                        pathname: '/product/[id]',
                        params: { id: item.product.id },
                      });
                    } catch (e) {}
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <View style={styles.itemInfo}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.brandText}>{item.product.brand}</Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.product.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Remove item"
                    >
                      <Ionicons name="close" size={18} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {itemName}
                  </Text>

                  <Text style={styles.unitPrice}>
                    ₹{unitPrice.toLocaleString('en-IN')}{' '}
                    <Text style={styles.perUnitText}>
                      / {language === 'mr' ? 'नग' : 'unit'}
                    </Text>
                  </Text>

                  <View style={styles.quantityRow}>
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrement={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      onDecrement={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      size="small"
                    />

                    <Text style={styles.itemTotalPrice}>
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Free Delivery Notice */}
        <View style={styles.deliveryNotice}>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
          <Text style={styles.deliveryNoticeText}>
            {subtotal >= 5000
              ? language === 'mr'
                ? 'अभिनंदन! ₹५,००० वरील ऑर्डरसाठी मोफत डिलिव्हरी लागू झाली.'
                : 'Free delivery applied! Your order exceeds ₹5,000 threshold.'
              : language === 'mr'
              ? `आणखी ₹${(5000 - subtotal).toLocaleString('en-IN')} ची खरेदी करा व मोफत डिलिव्हरी मिळवा.`
              : `Add ₹${(5000 - subtotal).toLocaleString('en-IN')} more to unlock FREE delivery.`}
          </Text>
        </View>

        {/* Order Cost Breakdown */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{t('orderSummary')}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('gst')}</Text>
            <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('deliveryFee')}</Text>
            <Text
              style={[
                styles.summaryValue,
                delivery === 0 && styles.freeDeliveryText,
              ]}
            >
              {delivery === 0 ? t('freeDelivery') : `₹${delivery}`}
            </Text>
          </View>

          {savings > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.savingsLabel}>{t('totalSavings')}</Text>
              <Text style={styles.savingsValue}>
                -₹{savings.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('totalAmount')}</Text>
            <Text style={styles.totalAmount}>₹{total.toLocaleString('en-IN')}</Text>
          </View>

          <Text style={styles.vatNote}>
            {language === 'mr'
              ? '*१८% जीएसटी कृषी यंत्रसामग्री अधिकृत बिल समाविष्ट.'
              : '*Standard 18% GST invoice provided for agricultural bank subsidy claims.'}
          </Text>
        </View>

        {/* Store Pickup Notice */}
        <View style={styles.storeLocationBox}>
          <Ionicons name="storefront-outline" size={20} color={COLORS.primary} />
          <View style={styles.storeLocationText}>
            <Text style={styles.storeLocationTitle}>
              {language === 'mr' ? 'थेट शोरूम भेट व खरेदी' : 'Showroom Pickup Available'}
            </Text>
            <Text style={styles.storeLocationSubtitle}>{t('pickupNotice')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarTotal}>
          <Text style={styles.bottomBarTotalLabel}>
            {language === 'mr' ? 'एकूण रक्कम:' : 'Total Amount:'}
          </Text>
          <Text style={styles.bottomBarTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => setCheckoutModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={18} color={COLORS.surface} />
          <Text style={styles.checkoutBtnText}>{t('proceedToQuote')}</Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Preview & WhatsApp Modal */}
      <Modal
        visible={checkoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {language === 'mr' ? 'अधिकृत कोटेशन व ऑर्डर' : 'Formal Machinery Quotation'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {language === 'mr'
                    ? 'जगदंब एंटरप्रायझेस बारामती अधिकृत बिल'
                    : 'Jagdamb Enterprises Baramati'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCheckoutModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  {language === 'mr' ? 'शेतकरी / ग्राहक तपशील' : 'Farmer Contact Details'}
                </Text>
                <Text style={styles.farmerDetailText}>Name: {user.fullName}</Text>
                <Text style={styles.farmerDetailText}>Phone: {user.phoneNumber}</Text>
                <Text style={styles.farmerDetailText}>Address: {user.location}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  {language === 'mr' ? 'निवडलेली उपकरणे' : 'Equipment Ordered'}
                </Text>
                {cart.map((item, idx) => (
                  <View key={item.product.id} style={styles.modalItemRow}>
                    <Text style={styles.modalItemName} numberOfLines={1}>
                      {idx + 1}. {item.product.name}
                    </Text>
                    <Text style={styles.modalItemQty}>x{item.quantity}</Text>
                    <Text style={styles.modalItemPrice}>
                      ₹{((item.product.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalTotalCard}>
                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalLabel}>
                    {language === 'mr' ? 'एकूण देय रक्कम:' : 'Total Payable:'}
                  </Text>
                  <Text style={styles.modalTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.sendWhatsAppBtn}
                onPress={handleWhatsAppOrder}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                <Text style={styles.sendWhatsAppBtnText}>
                  {language === 'mr'
                    ? 'व्हॉट्सॲपवर कोटेशन पाठवा'
                    : 'Send to Baramati Showroom on WhatsApp'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FEE2E2',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  itemList: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: SPACING.md,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSecondary,
  },
  itemInfo: {
    flex: 1,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginVertical: 2,
  },
  unitPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  perUnitText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  deliveryNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  deliveryNoticeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  freeDeliveryText: {
    color: COLORS.accent,
    fontWeight: '800',
  },
  savingsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },
  savingsValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  vatNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  storeLocationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surfaceSecondary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  storeLocationText: {
    flex: 1,
  },
  storeLocationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  storeLocationSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomBarTotal: {
    flexDirection: 'column',
  },
  bottomBarTotalLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  bottomBarTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.md,
  },
  checkoutBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: SPACING.sm,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: SPACING.xs,
  },
  modalBody: {
    paddingBottom: SPACING.xl,
  },
  modalSection: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  farmerDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  modalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  modalItemName: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  modalItemQty: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: 8,
  },
  modalItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalTotalCard: {
    backgroundColor: '#EFF6FF',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  modalTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  sendWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  sendWhatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
