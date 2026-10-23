import React from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductDetailsScreen } from '../../screens/ProductDetailsScreen';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/theme';

export default function ProductDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById } = useApp();
  const product = id ? getProductById(id) : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ProductDetailsScreen product={product} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
});
