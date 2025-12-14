import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  user_short: string;
  text: string;
  image?: string;
  created_at: string;
}

export default function Community() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/messages?limit=50');
      setMessages(response.data.messages || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Gabim', 'Kërkohet leje për të aksesuar galeriën.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const imageSizeKB = (base64Image.length * 3) / 4 / 1024;
        
        if (imageSizeKB > 800) {
          Alert.alert('Gabim', 'Fotografia është shumë e madhe. Zgjedh një foto më të vogël (maks 800KB).');
          return;
        }
        
        setSelectedImage(base64Image);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Gabim', 'Ndodhi një problem gjatë zgjedhjes së fotos.');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedImage) {
      Alert.alert('Gabim', 'Shkruaj një mesazh ose zgjedh një foto.');
      return;
    }

    if (inputText.length > 500) {
      Alert.alert('Gabim', 'Mesazhi është shumë i gjatë. Maksimumi 500 karaktere.');
      return;
    }

    setSending(true);
    try {
      const payload: any = {
        text: inputText.trim()
      };

      if (selectedImage) {
        payload.image = selectedImage;
      }

      await api.post('/chat/message', payload);
      
      // Clear input
      setInputText('');
      setSelectedImage(null);
      
      // Fetch new messages
      await fetchMessages();
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Gabim',
        error.response?.data?.detail || 'Ndodhi një problem. Provo përsëri.'
      );
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Tani';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('sq-AL', { month: 'short', day: 'numeric' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chat Komuniteti</Text>
          <Text style={styles.subtitle}>
            Bashkohu me komunitetin WinWin! Ndaj strategjitë dhe këshilla.
          </Text>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {loading && messages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Duke ngarkuar mesazhet...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>Nuk ka mesazhe ende</Text>
              <Text style={styles.emptySubtext}>Bëhu i pari që shkruan!</Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageCard,
                  message.user_short === user?.email?.substring(0, 2) && styles.myMessageCard
                ]}
              >
                <View style={styles.messageHeader}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {message.user_short.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.messageHeaderInfo}>
                    <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                      {message.user_short}***@winwin.com
                    </Text>
                    <Text style={styles.messageTime}>{formatTime(message.created_at)}</Text>
                  </View>
                </View>
                {message.text && (
                  <Text style={styles.messageText}>{message.text}</Text>
                )}
                {message.image && (
                  <Image
                    source={{ uri: message.image }}
                    style={styles.messageImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={pickImage}
            disabled={sending}
          >
            <Ionicons name="image" size={24} color={sending ? '#666' : '#4CAF50'} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Shkruaj mesazh për komunitetin..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!sending}
          />

          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={sending || (!inputText.trim() && !selectedImage)}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Character Counter */}
        {inputText.length > 400 && (
          <Text style={styles.charCounter}>
            {inputText.length}/500
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#999',
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  messageCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  myMessageCard: {
    backgroundColor: '#1a2a1a',
    borderLeftColor: '#FFD700',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageHeaderInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageTime: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  imagePreview: {
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  imageButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#4CAF50',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  charCounter: {
    position: 'absolute',
    bottom: 68,
    right: 20,
    color: '#999',
    fontSize: 12,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
