import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/lib/config';
import { hapticSelection, hapticSuccess } from '@/lib/haptics';
import { useAuthStore } from '@/stores/authStore';

export function AuthModal() {
  const insets = useSafeAreaInsets();
  const visible = useAuthStore((s) => s.authVisible);
  const tab = useAuthStore((s) => s.authTab);
  const pending = useAuthStore((s) => s.pending);
  const closeAuth = useAuthStore((s) => s.closeAuth);
  const setAuthTab = useAuthStore((s) => s.setAuthTab);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setError(null);
  }, [visible, tab]);

  async function onSubmit() {
    setError(null);
    if (!email.trim() || password.length < 8) {
      setError('Geçerli e-posta ve en az 8 karakter şifre gerekli');
      return;
    }
    void hapticSelection();
    const err =
      tab === 'register'
        ? await signUp(email, password, name)
        : await signIn(email, password);
    if (err) {
      setError(err);
      return;
    }
    void hapticSuccess();
    setPassword('');
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeAuth}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/60"
      >
        <Pressable className="flex-1" onPress={closeAuth} />
        <View
          className="max-h-[92%] rounded-t-3xl border border-zinc-800 bg-zinc-950"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="items-center pt-3">
            <View className="h-1 w-10 rounded-full bg-zinc-600" />
          </View>

          <View className="border-b border-zinc-800 px-5 py-4">
            <Text className="text-lg font-semibold text-zinc-50">
              Bullsye Hesabı
            </Text>
            <Text className="mt-1 text-xs text-zinc-500">
              İzleme listesi, alarm ve portföy hesabınızda güvende
            </Text>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20, gap: 14 }}
          >
            <View className="flex-row rounded-lg border border-zinc-800 bg-zinc-900 p-1">
              {(
                [
                  ['login', 'Giriş Yap'],
                  ['register', 'Kayıt Ol'],
                ] as const
              ).map(([id, label]) => {
                const active = tab === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => {
                      void hapticSelection();
                      setAuthTab(id);
                      setError(null);
                    }}
                    className={`flex-1 items-center rounded-md py-2 ${
                      active ? 'bg-emerald-500/20' : ''
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        active ? 'text-emerald-300' : 'text-zinc-400'
                      }`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => {
                void Linking.openURL(`${API_BASE_URL}/`);
              }}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 py-3"
            >
              <Ionicons name="logo-google" size={16} color="#fafafa" />
              <Text className="text-sm font-semibold text-zinc-100">
                Google ile devam (web)
              </Text>
            </Pressable>

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-zinc-800" />
              <Text className="text-[10px] uppercase tracking-widest text-zinc-600">
                veya e-posta
              </Text>
              <View className="h-px flex-1 bg-zinc-800" />
            </View>

            {tab === 'register' ? (
              <Field
                label="Ad"
                value={name}
                onChangeText={setName}
                placeholder="Adınız"
                autoComplete="name"
              />
            ) : null}

            <Field
              label="E-Posta adresi"
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@mail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <View>
              <Text className="mb-1 text-xs text-zinc-400">Şifre</Text>
              <View className="flex-row items-center rounded-lg border border-zinc-700 bg-zinc-900 px-3">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="En az 8 karakter"
                  placeholderTextColor="#52525b"
                  secureTextEntry={!showPassword}
                  autoComplete={tab === 'login' ? 'password' : 'new-password'}
                  className="flex-1 py-2.5 text-sm text-zinc-100"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#71717a"
                  />
                </Pressable>
              </View>
            </View>

            {error ? (
              <View className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2">
                <Text className="text-xs text-rose-300">{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={() => void onSubmit()}
              disabled={pending}
              className="items-center rounded-xl bg-emerald-500 py-3 active:opacity-80 disabled:opacity-60"
            >
              {pending ? (
                <ActivityIndicator color="#09090b" />
              ) : (
                <Text className="text-sm font-bold text-zinc-950">
                  {tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                </Text>
              )}
            </Pressable>

            <Text className="text-center text-[10px] leading-5 text-zinc-600">
              Devam ederek Kullanım Koşulları, Gizlilik ve KVKK metinlerini kabul
              etmiş olursunuz.
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  ...props
}: {
  label: string;
} & TextInputProps) {
  return (
    <View>
      <Text className="mb-1 text-xs text-zinc-400">{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#52525b"
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100"
      />
    </View>
  );
}
