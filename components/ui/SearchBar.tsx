import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Sembol veya şirket ara…',
}: Props) {
  return (
    <View className="mx-4 mb-3 flex-row items-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5">
      <Ionicons name="search" size={18} color="#71717a" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#52525b"
        className="ml-2 flex-1 text-sm text-zinc-100"
        autoCapitalize="characters"
        autoCorrect={false}
      />
    </View>
  );
}
