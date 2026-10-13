/**
 * Doctor experience — bottom tab navigation.
 *
 * Screens that are pushed onto the stack (patient profile, waveform viewer,
 * analysis, report detail) are declared with `href: null` so they do not
 * appear as tabs.
 */

import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { useTokens } from '@/theme/ThemeProvider';

export default function DoctorLayout() {
  const { status } = useAuth();
  const { colors } = useTokens();

  if (status === 'restoring') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primaryPressed} />
      </View>
    );
  }
  if (status !== 'authenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryPressed,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patients/index"
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="eeg/index"
        options={{
          title: 'EEG',
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports/index"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />

      {/* Stack screens — hidden from the tab bar. */}
      <Tabs.Screen name="patients/[patientId]" options={{ href: null }} />
      <Tabs.Screen name="eeg/viewer/[recordingId]" options={{ href: null }} />
      <Tabs.Screen name="reports/[reportId]" options={{ href: null }} />
      <Tabs.Screen name="analysis" options={{ href: null }} />
    </Tabs>
  );
}
