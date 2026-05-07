import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles, getColors } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { version } = require('../../package.json');

export default function AboutScreen() {
  const { theme } = React.useContext(ThemeContext);
  const styles = getStyles(theme);
  const colors = getColors(theme);
  
  const [privacyOpen, setPrivacyOpen] = React.useState(false);

  function openMail(){
    const email = 'bishalbijaynaikdob2004@gmail.com';
    Linking.openURL(`mailto:${email}?subject=TrackMyRead App Feedback`).catch(() => {});
  }

  function openGitHub(){
    const url = 'https://github.com/bishalnaik13/TrackMyRead';
    Linking.openURL(url).catch(() => {});
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[
        styles.screen, { padding: 16 }]}>
          <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 120, height: 120, borderRadius: 12 }}
          resizeMode="contain"
        />
      </View>


      {/* App Information */}
      <Text style={{ color: colors.text, fontSize: 22, textAlign: 'center', marginBottom: 6 }}>
        TrackMyRead
      </Text>
      <Text style={{ color: colors.text, textAlign: 'center', marginBottom: 12 }}>
        Version {version}
      </Text>
      <Text style={{ color: colors.text, textAlign: 'center', margin: 25 }}>
        TrackMyRead is a simple, offline-first app to help you track your reading list, manage your library, and save your favorite books.
      </Text>

      {/* Credits and Acknowledgements */}
      <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginBottom: 12 }}>
          <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>Credits & Acknowledgements</Text>

          <Text style={{ color: colors.text, marginBottom: 6 }}>
            Made with <Text style={{ color: colors.accent }}>❤️</Text> by Bishal Naik.
          </Text>

          <Text style={{ color: colors.text, marginBottom: 6 }}>
            Why: This app was built as a personal project to learn React Native and Expo. The code was deconstructed
            and studied with the help of AI.
          </Text>

          <Text style={{ color: colors.text, marginBottom: 6 }}>
            Technology: React Native • Expo • React Navigation • AsyncStorage
          </Text>

          <Text style={{ color: colors.text, marginBottom: 6 }}>
            Icons: Ionicons
          </Text>
        </View>

        {/* Feedback & Contact */}
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginBottom: 12 }}>
          <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>Feedback & Contact</Text>

          <TouchableOpacity
            onPress={openMail}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
            accessibilityLabel="Send email to developer"
            accessibilityRole="link"
          >
            <Ionicons name="mail-outline" size={20} color={colors.accent} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text }}>Send an Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openGitHub}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
            accessibilityLabel="View source code on GitHub"
            accessibilityRole="link"
          >
            <Ionicons name="logo-github" size={20} color={colors.accent} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text }}>View the code on GitHub</Text>
          </TouchableOpacity>
        </View>

        {/* Legal / Privacy */}
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }}>
          <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>Legal</Text>

          <TouchableOpacity
            onPress={() => setPrivacyOpen(true)}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
            accessibilityLabel="View privacy policy"
            accessibilityRole="button"
          >
            <Ionicons name="document-text-outline" size={20} color={colors.accent} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text }}>Privacy Policy</Text>
          </TouchableOpacity>

          <Text style={{ color: colors.text, marginTop: 12 }}>
            This app stores all data locally on your device. No data is collected or shared with third parties.
          </Text>
        </View>
      </ScrollView>

      {/* Privacy Modal */}
      <Modal visible={privacyOpen} animationType="slide" onRequestClose={() => setPrivacyOpen(false)}>
        <SafeAreaView style={[styles.screen, { padding: 16 }]}>
          <ScrollView>
            <Text style={{ fontSize: 18, color: colors.text, marginBottom: 12 }}>Privacy Policy</Text>
            <Text style={{ color: colors.text, marginBottom: 12 }}>
              This app stores all data locally on your device. No personal data is transmitted or shared with any
              third parties. Local storage (AsyncStorage) is used for persistence. Use at your own discretion.
            </Text>

            <TouchableOpacity
              onPress={() => setPrivacyOpen(false)}
              style={{
                marginTop: 20,
                paddingVertical: 12,
                backgroundColor: colors.primary,
                borderRadius: 8,
                alignItems: 'center',
              }}
              accessibilityLabel="Close privacy policy"
              accessibilityRole="button"
            >
              <Text style={{ color: colors.buttonText }}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}