import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { hapticSelection } from '@/lib/haptics';

export type SortKey = 'price' | 'change' | 'volume';

type Props = {
  visible: boolean;
  sortKey: SortKey;
  onClose: () => void;
  onSelect: (key: SortKey) => void;
};

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'change', label: '% Değişim' },
  { key: 'price', label: 'Fiyat' },
  { key: 'volume', label: 'Hacim' },
];

export function SortModal({ visible, sortKey, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <View className="rounded-t-3xl border border-zinc-800 bg-zinc-900 px-4 pb-10 pt-4">
          <Text className="mb-3 text-center text-sm font-semibold text-zinc-200">
            Sıralama
          </Text>
          <FlatList
            data={OPTIONS}
            keyExtractor={(o) => o.key}
            renderItem={({ item }) => {
              const active = item.key === sortKey;
              return (
                <Pressable
                  onPress={() => {
                    void hapticSelection();
                    onSelect(item.key);
                    onClose();
                  }}
                  className={`mb-2 rounded-xl border px-4 py-3 ${
                    active
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  <Text
                    className={`text-sm ${active ? 'font-semibold text-emerald-400' : 'text-zinc-200'}`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
}
