import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { Toast } from './src/components/Toast';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductDetailsScreen } from './src/screens/ProductDetailsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { WishlistScreen } from './src/screens/WishlistScreen';
import { COLORS } from './src/constants/theme';

const MainNavigator: React.FC = () => {
  const { activeTab, selectedProduct } = useApp();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* When inspecting a product details, we show the dedicated product detail view */}
      {selectedProduct ? (
        <ProductDetailsScreen />
      ) : (
        <View style={styles.mainContainer}>
          <Header />
          <View style={styles.contentArea}>
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'search' && <HomeScreen />}
            {activeTab === 'wishlist' && <WishlistScreen />}
            {activeTab === 'cart' && <CartScreen />}
          </View>
          <BottomTabBar />
        </View>
      )}

      {/* Global Toast for Cart & Wishlist actions */}
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
