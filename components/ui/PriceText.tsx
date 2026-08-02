import { Text } from 'react-native';
import { formatPrice } from '@/lib/format';

type Props = {
  value: number;
  currency?: string;
  digits?: number;
  className?: string;
};

export function PriceText({
  value,
  currency = 'TRY',
  digits = 2,
  className = 'text-base text-zinc-100',
}: Props) {
  return (
    <Text className={`font-mono ${className}`}>
      {formatPrice(value, currency, digits)}
    </Text>
  );
}
