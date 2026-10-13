/**
 * Entry route — sends the user to the demo login or the doctor dashboard
 * depending on the restored session.
 */

import { Redirect } from 'expo-router';

import { useAuth } from '@/auth/AuthProvider';
import { LoadingState } from '@/components/States';
import { View } from 'react-native';

export default function Index() {
  const { status, session } = useAuth();

  if (status === 'restoring') {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <LoadingState title="Starting NeuroAI…" description="Restoring your saved session." />
      </View>
    );
  }

  return <Redirect href={session ? '/dashboard' : '/login'} />;
}
