import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '@/hooks/useResponsive';

const FEEDBACK_KEY = '@arabi_kids_feedback';

export function FeedbackModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { isTablet, contentMaxWidth } = useResponsive();

  const reset = () => { setRating(0); setHovered(0); setText(''); setSubmitted(false); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (rating === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const entry = { rating, text: text.trim(), date: new Date().toISOString() };
    try {
      const existing = await AsyncStorage.getItem(FEEDBACK_KEY);
      const arr = existing ? JSON.parse(existing) : [];
      arr.push(entry);
      await AsyncStorage.setItem(FEEDBACK_KEY, JSON.stringify(arr));
    } catch (_) {}
    setSubmitted(true);
    setTimeout(handleClose, 2200);
  };

  const displayRating = hovered || rating;

  const sheetStyle = isTablet
    ? [fb.sheet, { borderRadius: 32, width: Math.min(contentMaxWidth, 540), alignSelf: 'center' as const, marginBottom: 0 }]
    : fb.sheet;

  return (
    <Modal visible={visible} transparent animationType={isTablet ? 'fade' : 'slide'} onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={[fb.overlay, isTablet && { justifyContent: 'center' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={fb.backdrop} activeOpacity={1} onPress={handleClose} />

        <View style={sheetStyle}>
          <TouchableOpacity onPress={handleClose} style={fb.closeBtn}>
            <MaterialCommunityIcons name="close" size={22} color="#8A7E74" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={fb.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {submitted ? (
              <View style={fb.thanksBox}>
                <MaterialCommunityIcons name="heart" size={56} color="#FF4D9E" />
                <Text style={fb.thanksTitle}>Thank you! 🎉</Text>
                <Text style={fb.thanksSub}>Your feedback helps us improve Arabi for kids everywhere.</Text>
              </View>
            ) : (
              <>
                <MaterialCommunityIcons name="message-text-outline" size={36} color="#FF6B35" style={{ marginBottom: 6 }} />
                <Text style={fb.title}>Share Feedback</Text>
                <Text style={fb.sub}>How are you enjoying Arabi?</Text>

                <View style={fb.starsRow}>
                  {[1,2,3,4,5].map(star => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => { setRating(star); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                      onPressIn={() => setHovered(star)}
                      onPressOut={() => setHovered(0)}
                      activeOpacity={0.7}
                      style={fb.starBtn}
                    >
                      <MaterialCommunityIcons
                        name={star <= displayRating ? 'star' : 'star-outline'}
                        size={40}
                        color={star <= displayRating ? '#FFD700' : '#D0C8BE'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[fb.ratingLabel, { opacity: rating > 0 ? 1 : 0 }]}>
                  {['', 'Poor 😕', 'Fair 🙂', 'Good 😊', 'Great 😄', 'Amazing! 🌟'][rating] ?? ''}
                </Text>

                <TextInput
                  style={fb.textBox}
                  placeholder="Any thoughts, ideas or suggestions? (optional)"
                  placeholderTextColor="#BBB0A4"
                  multiline
                  numberOfLines={4}
                  value={text}
                  onChangeText={setText}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={[fb.submitBtn, rating === 0 && fb.submitDisabled]}
                  onPress={handleSubmit}
                  disabled={rating === 0}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name="send" size={18} color="#FFF" />
                  <Text style={fb.submitLabel}>Send Feedback</Text>
                </TouchableOpacity>

                {rating === 0 && (
                  <Text style={fb.ratingHint}>Please select a star rating to continue</Text>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const fb = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 28, paddingHorizontal: 28, paddingBottom: Platform.OS === 'ios' ? 8 : 28, maxHeight: '90%' },
  scrollContent: { alignItems: 'center', paddingBottom: 32 },
  closeBtn: { position: 'absolute', top: 18, right: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: '#1A1A2E', marginBottom: 4 },
  sub: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#8A7E74', marginBottom: 20, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  starBtn: { padding: 4 },
  ratingLabel: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#FF6B35', marginBottom: 16, height: 24 },
  textBox: { width: '100%', minHeight: 100, backgroundColor: '#FFF8F0', borderRadius: 16, borderWidth: 1.5, borderColor: '#F0E8DC', padding: 14, fontFamily: 'Nunito_400Regular', fontSize: 15, color: '#1A1A2E', marginBottom: 18, marginTop: 4 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FF6B35', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 32, width: '100%' },
  submitDisabled: { backgroundColor: '#F0E8DC' },
  submitLabel: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#FFF' },
  ratingHint: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: '#BBAA99', marginTop: 10 },
  thanksBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  thanksTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: '#1A1A2E' },
  thanksSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#8A7E74', textAlign: 'center', lineHeight: 22 },
});
