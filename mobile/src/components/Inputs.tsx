/**
 * Form inputs — text field and search field with focus rings that match the
 * app input styling (recessed fill, subtle border, lavender focus glow).
 */

import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, ...rest }: TextFieldProps) {
  const { colors } = useTokens();
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? colors.danger : focused ? colors.accent : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="small" style={[styles.label, { color: colors.text }]}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.inputShell,
          {
            backgroundColor: colors.surfaceSunken,
            borderColor,
            shadowColor: colors.accent,
          },
          focused && styles.inputFocused,
        ]}
      >
        <TextInput
          {...rest}
          onFocus={(event) => {
            setFocused(true);
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            rest.onBlur?.(event);
          }}
          placeholderTextColor={colors.textFaint}
          style={[styles.input, { color: colors.text }]}
        />
      </View>
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" tone="faint">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search…' }: SearchInputProps) {
  const { colors } = useTokens();
  const [focused, setFocused] = React.useState(false);

  return (
    <View
      style={[
        styles.searchShell,
        {
          backgroundColor: colors.surface,
          borderColor: focused ? colors.accent : colors.border,
          shadowColor: colors.accent,
        },
        focused && styles.inputFocused,
      ]}
    >
      <Ionicons name="search" size={17} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.searchInput, { color: colors.text }]}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} accessibilityLabel="Clear search" hitSlop={8}>
          <Ionicons name="close-circle" size={17} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontWeight: '700' },
  inputShell: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  input: {
    minHeight: 48,
    fontSize: 15,
    paddingVertical: spacing.sm,
  },
  searchShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: spacing.sm,
  },
});
