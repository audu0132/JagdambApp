import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder, autoFocus = false }) => {
  const { searchQuery, setSearchQuery, filteredProducts } = useApp();
  const { t } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);

  const effectivePlaceholder = placeholder || t('searchPlaceholder');

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? COLORS.primary : COLORS.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={effectivePlaceholder}
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode="never"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel="Search dairy equipment"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Clear search text"
          >
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            {t('resultsCount', { count: filteredProducts.length })}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    height: 46,
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
    backgroundColor: COLORS.surface,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  statusRow: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
