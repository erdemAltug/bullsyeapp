import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type Props = {
  /** 0–100 bullish breadth */
  bullishPct: number;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function MarketWidthMeter({ bullishPct }: Props) {
  const pct = Math.min(100, Math.max(0, bullishPct));
  const size = 220;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = 78;
  const end = (pct / 100) * 180;

  return (
    <View className="mx-4 items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-5">
      <Text className="mb-2 self-start text-sm font-semibold text-zinc-100">
        Piyasa Genişliği
      </Text>
      <Text className="mb-3 self-start text-xs text-zinc-500">
        Yükselen / toplam oran — market breadth
      </Text>
      <Svg width={size} height={130} viewBox={`0 0 ${size} 140`}>
        <Path
          d={describeArc(cx, cy, r, 0, 180)}
          stroke="#27272a"
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={describeArc(cx, cy, r, 0, end)}
          stroke="#34d399"
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={cx} cy={cy} r={4} fill="#34d399" />
      </Svg>
      <Text className="-mt-8 font-mono text-3xl font-bold text-emerald-400">
        %{pct.toFixed(0)}
      </Text>
      <Text className="mt-1 text-xs font-medium text-zinc-400">Yükseliş oranı</Text>
    </View>
  );
}

export function computeBreadth(items: { changePercent: number }[]): number {
  if (!items.length) return 0;
  const up = items.filter((i) => i.changePercent >= 0).length;
  return (up / items.length) * 100;
}
