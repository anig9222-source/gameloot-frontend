import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

interface ChatMessage {
  from: 'user' | 'ai';
  text: string;
}

export default function Support() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleEmail = () => {
    Linking.openURL('mailto:anig9222@gmail.com?subject=GameLoot Support Request');
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => (prev === id ? null : id));
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { from: 'user', text: userMessage }]);

    try {
      setChatLoading(true);
      const res = await api.post('/support/ai-chat', { message: userMessage });
      const reply = res.data?.reply || 'Faleminderit për pyetjen!';
      setChatMessages(prev => [...prev, { from: 'ai', text: reply }]);
    } catch (e) {
      setChatMessages(prev => [
        ...prev,
        {
          from: 'ai',
          text: 'Nuk po arrij të përgjigjem tani. Provo më vonë ose dërgo email në anig9222@gmail.com.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Ndihma & Suport</Text>
          <Text style={styles.subtitle}>Jemi këtu për të ndihmuar!</Text>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kontakto</Text>

            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={32} color="#4CAF50" />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Email Support</Text>
                <Text style={styles.contactSubtitle}>anig9222@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pyetje të Shpeshta (FAQ)</Text>

            {/* FAQ 1 */}
            <TouchableOpacity
              style={styles.faqCard}
              onPress={() => toggleFaq('faq_tokens')}
            >
              <Ionicons name="help-circle" size={24} color="#4CAF50" />
              <Text style={styles.faqText}>Si funksionon sistemi i token?</Text>
              <Ionicons
                name={expandedFaq === 'faq_tokens' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {expandedFaq === 'faq_tokens' && (
              <View style={styles.faqAnswerBox}>
                <Text style={styles.faqAnswerText}>
                  Çdo herë që luani një lojë, gjeneroni revenue nga ads. 70% e kësaj revenue
                  konvertohet në PW tokens çdo natë në ora 00:00. Tokens mund të përdoren për
                  withdrawal ose për të luajtur më shumë.
                </Text>
              </View>
            )}

            {/* FAQ 2 */}
            <TouchableOpacity
              style={styles.faqCard}
              onPress={() => toggleFaq('faq_withdraw')}
            >
              <Ionicons name="cash" size={24} color="#4CAF50" />
              <Text style={styles.faqText}>Kur mund të bëj withdrawal?</Text>
              <Ionicons
                name={expandedFaq === 'faq_withdraw' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {expandedFaq === 'faq_withdraw' && (
              <View style={styles.faqAnswerBox}>
                <Text style={styles.faqAnswerText}>
                  Mund të kërkoni withdrawal kur token balance juaj arrin minimumin e vendosur.
                  Withdrawal kërkesat aprovohen manualisht nga admin-i dhe processohen brenda
                  24-48 orëve.
                </Text>
              </View>
            )}

            {/* FAQ 3 */}
            <TouchableOpacity
              style={styles.faqCard}
              onPress={() => toggleFaq('faq_referral')}
            >
              <Ionicons name="people" size={24} color="#4CAF50" />
              <Text style={styles.faqText}>Si funksionon referral system?</Text>
              <Ionicons
                name={expandedFaq === 'faq_referral' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {expandedFaq === 'faq_referral' && (
              <View style={styles.faqAnswerBox}>
                <Text style={styles.faqAnswerText}>
                  Çdo përdorues ka një kod referral unik. Kur një shok regjistrohet me kodin
                  tuaj, ju merrni 10% bonus nga të gjitha earnings e tyre. Referral bonus
                  shtohet automatikisht në token balance tuaj.
                </Text>
              </View>
            )}

            {/* FAQ 4 */}
            <TouchableOpacity
              style={styles.faqCard}
              onPress={() => toggleFaq('faq_rate_limit')}
            >
              <Ionicons name="time" size={24} color="#4CAF50" />
              <Text style={styles.faqText}>Pse nuk mund të luaj lojën përsëri menjëherë?</Text>
              <Ionicons
                name={expandedFaq === 'faq_rate_limit' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {expandedFaq === 'faq_rate_limit' && (
              <View style={styles.faqAnswerBox}>
                <Text style={styles.faqAnswerText}>
                  Ka një rate limit për çdo lojë për të parandaluar spam: Spin (30s), Tap (60s),
                  Quiz (5min). Kjo garanton që sistemi mbetet i drejtë për të gjithë përdoruesit.
                </Text>
              </View>
            )}

            {/* FAQ 5 */}
            <TouchableOpacity
              style={styles.faqCard}
              onPress={() => toggleFaq('faq_missions')}
            >
              <Ionicons name="trophy" size={24} color="#4CAF50" />
              <Text style={styles.faqText}>Çfarë janë Daily Missions?</Text>
              <Ionicons
                name={expandedFaq === 'faq_missions' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {expandedFaq === 'faq_missions' && (
              <View style={styles.faqAnswerBox}>
                <Text style={styles.faqAnswerText}>
                  Missions janë detyra ditore që ju japin rewards shtesë: Login ditor (+20 PW),
                  Luaj 3 lojëra (+50 PW), Fto një shok (+100 PW). Missions rivendosen çdo ditë
                  në mesnatë.
                </Text>
              </View>
            )}
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips & Tricks</Text>

            <View style={styles.tipCard}>
              <Ionicons name="bulb" size={24} color="#FFD700" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Maksimizo Earnings</Text>
                <Text style={styles.tipText}>
                  Luaj të gjitha 3 lojërat çdo ditë, përfundo missions, dhe fto shokë për të fituar
                  më shumë!
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Mbaj Llogarinë të Sigurt</Text>
                <Text style={styles.tipText}>
                  Mos e shpërndaj password-in me askënd. Admin asnjëherë nuk kërkon password-in
                  tuaj.
                </Text>
              </View>
            </View>
          </View>

          {/* Live Chat (beta) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Chat (beta)</Text>
            <View style={styles.chatBox}>
              <ScrollView
                style={styles.chatMessages}
                contentContainerStyle={styles.chatMessagesContent}
              >
                {chatMessages.length === 0 ? (
                  <Text style={styles.chatPlaceholder}>
                    Bëj një pyetje rreth tokenëve, withdrawal, referral ose lojërave.
                  </Text>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.chatMessage,
                        msg.from === 'user'
                          ? styles.chatMessageUser
                          : styles.chatMessageAi,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chatMessageText,
                          msg.from === 'user'
                            ? styles.chatMessageTextUser
                            : styles.chatMessageTextAi,
                        ]}
                      >
                        {msg.text}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>

              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Shkruaj mesazhin tënd..."
                  placeholderTextColor="#666"
                  value={chatInput}
                  onChangeText={setChatInput}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.chatSendButton,
                    (chatLoading || !chatInput.trim()) && styles.chatSendButtonDisabled,
                  ]}
                  onPress={handleSendChat}
                  disabled={chatLoading || !chatInput.trim()}
                >
                  <Ionicons
                    name={chatLoading ? 'time' : 'send'}
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.chatHint}>
                Ky chat është në versionin beta dhe përgjigjet janë automatike. Për çështje
                urgjente, dërgo email në anig9222@gmail.com.
              </Text>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>WinWin v1.0.0</Text>
            <Text style={styles.infoSubtext}>© 2024 WinWin. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a3a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
  },
  faqCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  faqText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  faqAnswerBox: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 40,
  },
  faqAnswerText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20,
  },
  chatBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
  },
  chatMessages: {
    maxHeight: 220,
    marginBottom: 8,
  },
  chatMessagesContent: {
    paddingVertical: 4,
  },
  chatPlaceholder: {
    fontSize: 13,
    color: '#777',
  },
  chatMessage: {
    marginBottom: 6,
    maxWidth: '85%',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  chatMessageUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
  },
  chatMessageAi: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  chatMessageText: {
    fontSize: 13,
  },
  chatMessageTextUser: {
    color: '#fff',
  },
  chatMessageTextAi: {
    color: '#fff',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#111',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButtonDisabled: {
    opacity: 0.5,
  },
  chatHint: {
    marginTop: 4,
    fontSize: 12,
    color: '#777',
  },
  tipCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  infoSection: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#666',
  },
});
