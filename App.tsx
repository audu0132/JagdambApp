import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { Toast } from './src/components/Toast';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { ProductDetailsScreen } from './src/screens/ProductDetailsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { WishlistScreen } from './src/screens/WishlistScreen';
import { LoginAccountScreen } from './src/screens/LoginAccountScreen';
import { QuotationEnquiryScreen } from './src/screens/QuotationEnquiryScreen';
import { COLORS } from './src/constants/theme';

const MainNavigator: React.FC = () => {
  const { activeTab, selectedProduct } = useApp();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* Screen 3: Product details view if an item is selected */}
      {selectedProduct ? (
        <ProductDetailsScreen />
      ) : (
        <View style={styles.mainContainer}>
          <Header />
          <View style={styles.contentArea}>
            {/* Screen 1: Home Screen */}
            {activeTab === 'home' && <HomeScreen />}
            
            {/* Screen 2: Categories Screen */}
            {activeTab === 'categories' && <CategoriesScreen />}

            {/* Screen 7: Quotation Enquiry Form */}
            {activeTab === 'quote' && <QuotationEnquiryScreen />}

            {/* Screen 5: Wishlist Screen */}
            {activeTab === 'wishlist' && <WishlistScreen />}

            {/* Screen 4: Shopping Cart */}
            {activeTab === 'cart' && <CartScreen />}

            {/* Screen 6: Login and Account Screen */}
            {activeTab === 'account' && <LoginAccountScreen />}
          </View>
          <BottomTabBar />
        </View>
      )}

      {/* Floating Action Feedback Banner */}
      <Toast />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentArea: {
    flex: 1,
  },
});
