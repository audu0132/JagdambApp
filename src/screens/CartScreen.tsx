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
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { QuantityControl } from '../components/QuantityControl';
import { EmptyState } from '../components/EmptyState';

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
  } = useApp();

  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  const cartCount = getCartCount();
  const { subtotal, gst, delivery, total, savings } = getCartTotal();

  const handleClearCart = () => {
    Alert.alert(
      'Clear Shopping Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleProceedCheckout = () => {
    setCheckoutModalVisible(true);
  };

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <EmptyState
          icon="cart-outline"
          title="Your Cart is Empty"
          subtitle="Explore our dairy equipment, milking machines, and genuine replacement spare parts."
          actionLabel="Explore Dairy Catalog"
          onAction={() => setActiveTab('home')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>
            {cartCount} item{cartCount === 1 ? '' : 's'} selected
          </Text>
        </View>

        <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Item Cards */}
        <View style={styles.itemList}>
          {cart.map((item) => {
            const unitPrice = item.product.price || 0;
            const itemTotal = unitPrice * item.quantity;

            return (
              <View key={item.product.id} style={styles.cartCard}>
                <TouchableOpacity
                  onPress={() => setSelectedProduct(item.product)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <View style={styles.productDetails}>
                  <View style={styles.productTopRow}>
                    <Text style={styles.brandText}>{item.product.brand}</Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.product.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel={`Remove ${item.product.name} from cart`}
                    >
                      <Ionicons name="close" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => setSelectedProduct(item.product)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.product.name}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.unitPrice}>
                    {item.product.price
                      ? `₹${item.product.price.toLocaleString('en-IN')} each`
                      : 'Quotation item'}
                  </Text>

                  <View style={styles.cardBottomRow}>
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrement={() =>
                        updateCartQuantity(item.product.id, item.quantity + 1)
                      }
                      onDecrement={() =>
                        updateCartQuantity(item.product.id, item.quantity - 1)
                      }
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

        {/* Free Delivery Bar */}
        <View style={styles.deliveryNotice}>
          <Ionicons
            name={delivery === 0 ? 'checkmark-circle' : 'cube-outline'}
            size={18}
            color={delivery === 0 ? COLORS.accent : COLORS.primary}
          />
          <Text style={styles.deliveryNoticeText}>
            {delivery === 0
              ? 'Congratulations! You qualify for Free Warehouse Delivery!'
              : 'Add ₹' + (5000 - subtotal).toLocaleString('en-IN') + ' more for Free Delivery'}
          </Text>
        </View>

        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cartCount} items)</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (18% Equipment Tax)</Text>
            <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Delivery</Text>
            <Text style={[styles.summaryValue, delivery === 0 && styles.freeDeliveryText]}>
              {delivery === 0 ? 'FREE' : `₹${delivery.toLocaleString('en-IN')}`}
            </Text>
          </View>

          {savings > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.savingsLabel}>Total Discount Savings</Text>
              <Text style={styles.savingsValue}>- ₹{savings.toLocaleString('en-IN')}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalAmount}>₹{total.toLocaleString('en-IN')}</Text>
          </View>

          <Text style={styles.vatNote}>
            Final invoice will include Jagdamb Enterprises GSTIN registration and tax credits.
          </Text>
        </View>

        {/* Store Pickup / Contact Note */}
        <View style={styles.storeLocationBox}>
          <Ionicons name="storefront-outline" size={20} color={COLORS.primaryDark} />
          <View style={styles.storeLocationText}>
            <Text style={styles.storeTitle}>Direct Store Pickup Option</Text>
            <Text style={styles.storeDesc}>
              Shop 2, Jamdar Nagar, Near PDCC Bank, Kasba, Baramati, Maharashtra - 413102
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Checkout Action */}
      <View style={styles.checkoutBar}>
        <View style={styles.checkoutTotalCol}>
          <Text style={styles.checkoutTotalLabel}>Total Amount</Text>
          <Text style={styles.checkoutTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleProceedCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Order</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.textInverse} />
        </TouchableOpacity>
      </View>

      {/* Phase 1 Checkout Modal */}
      <Modal
        visible={checkoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="bag-check" size={28} color={COLORS.primary} />
              </View>
              <TouchableOpacity
                onPress={() => setCheckoutModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Order Confirmation (Phase 1)</Text>
            <Text style={styles.modalSubtitle}>
              You have {cartCount} item(s) ready for ordering from Jagdamb Enterprises Baramati.
            </Text>

            <View style={styles.modalOrderDetails}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Total Value:</Text>
                <Text style={styles.modalValue}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Payment Mode:</Text>
                <Text style={styles.modalValue}>Direct UPI / Store Payment</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Pickup/Delivery:</Text>
                <Text style={styles.modalValue}>Baramati Hub / Dispatch</Text>
              </View>
            </View>

            <View style={styles.modalNoteBox}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.modalNoteText}>
                As per Phase 1 development rules, payment gateway integration will follow in Phase 2. Your cart state is fully preserved locally.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => {
                setCheckoutModalVisible(false);
                Alert.alert(
                  'Order Inquiry Recorded',
                  'Thank you! Your quotation request has been noted. Our Baramati support desk will assist you with equipment dispatch.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.modalDoneText}>Submit Equipment Request</Text>
            </TouchableOpacity>
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
    borderBottomColor: COLORS.border,
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.dangerLight,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  itemList: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSecondary,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginVertical: 2,
    lineHeight: 18,
  },
  unitPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cardBottomRow: {
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
  },
  deliveryNoticeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  totalLabel: {
    fontSize: 16,
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
  },
  storeLocationText: {
    flex: 1,
  },
  storeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  storeDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  checkoutTotalCol: {
    flexDirection: 'column',
  },
  checkoutTotalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  checkoutTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  checkoutBtnText: {
    color: COLORS.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    padding: SPACING.xs,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  modalOrderDetails: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  modalValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  modalNoteText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  modalDoneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneText: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});
