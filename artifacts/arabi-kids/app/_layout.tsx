import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { I18nManager, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Keep UI layout LTR while Arabic text still renders RTL via writingDirection
I18nManager.allowRTL(false);

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppProvider } from '@/context/AppContext';
import { checkArabicTTSAvailable } from '@/utils/soundEffects';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="home" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="test" />
      <Stack.Screen name="trophies" />
      <Stack.Screen name="parent" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const [showTTSWarning, setShowTTSWarning] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Check Arabic TTS availability once on startup
    checkArabicTTSAvailable().then((available) => {
      if (!available) setShowTTSWarning(true);
    });
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
                <Modal
                  visible={showTTSWarning}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowTTSWarning(false)}
                >
                  <View style={ttsStyles.overlay}>
                    <View style={ttsStyles.card}>
                      <Text style={ttsStyles.emoji}>🔊</Text>
                      <Text style={ttsStyles.title}>Enable Arabic Audio</Text>
                      <Text style={ttsStyles.body}>
                        To hear Arabic word pronunciations, install the Arabic voice pack on your device:
                        {'\n\n'}
                        <Text style={ttsStyles.bold}>Settings → General Management → Language & Input → Text-to-Speech → Google TTS → Install language data → Arabic</Text>
                      </Text>
                      <Pressable style={ttsStyles.btn} onPress={() => setShowTTSWarning(false)}>
                        <Text style={ttsStyles.btnText}>Got it</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const ttsStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center', maxWidth: 340 },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, color: '#555', lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  bold: { fontWeight: '700', color: '#333' },
  btn: { backgroundColor: '#FF6B35', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 32 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
