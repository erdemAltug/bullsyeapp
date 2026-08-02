import type { LearnArticle } from '@/types';

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    id: '1',
    slug: 'temel-analiz-101',
    title: 'Temel Analiz 101: F/K ve PD/DD',
    excerpt:
      'Hisse değerlemesinde en çok kullanılan çarpanları sade dille öğrenin.',
    category: 'Finansal Okuryazarlık',
    readMinutes: 6,
    publishedAt: '2026-07-12',
    content: `# Temel Analiz 101

F/K (Fiyat/Kazanç) oranı, şirketin piyasa fiyatının hisse başına kârına bölünmesidir.

## Dikkat edilmesi gerekenler
- Sektör ortalaması ile kıyaslayın
- Tek seferlik kâr/zararları ayıklayın
- Büyüme şirketlerinde F/K genelde daha yüksektir

PD/DD (Piyasa Değeri / Defter Değeri) bilanço gücü hakkında fikir verir.`,
  },
  {
    id: '2',
    slug: 'rsi-nedir',
    title: 'RSI Nedir? Aşırı Alım / Satım',
    excerpt:
      'Teknik analizde RSI ile momentum okuma ve yanlış sinyallerden kaçınma.',
    category: 'Teknik Analiz',
    readMinutes: 5,
    publishedAt: '2026-07-20',
    content: `# RSI Nedir?

RSI (Relative Strength Index) 0–100 arasında momentum ölçer.

## Klasik eşikler
- **70+** aşırı alım bölgesi
- **30-** aşırı satım bölgesi

Bullsye sinyallerinde RSI, SMA kesişimleri ile birlikte kullanılır.`,
  },
  {
    id: '3',
    slug: 'portfoy-cesitlendirme',
    title: 'Portföy Çeşitlendirme Kuralları',
    excerpt:
      'BİST, döviz, altın ve kripto dengesi için pratik çerçeve.',
    category: 'Portföy',
    readMinutes: 7,
    publishedAt: '2026-07-28',
    content: `# Portföy Çeşitlendirme

Tek hisseye yoğunlaşmak riski artırır.

## Basit çerçeve
1. En az 2–3 varlık sınıfı
2. Tek pozisyon ağırlığına üst sınır
3. Likidite tamponu (nakit / kısa vadeli)

Portföy Analizi ekranından sağlık skorunuzu takip edin.`,
  },
  {
    id: '4',
    slug: 'ekonomi-takvimi',
    title: 'Ekonomi Takvimini Okumak',
    excerpt:
      'PMI, faiz ve enflasyon açıklamalarında volatilite yönetimi.',
    category: 'Makro',
    readMinutes: 4,
    publishedAt: '2026-08-01',
    content: `# Ekonomi Takvimi

Yüksek etkili olaylar (faiz, PMI, enflasyon) kısa vadeli fiyatı sarsabilir.

Alarm kurun, pozisyon büyüklüğünü küçültün, stop mesafenizi gözden geçirin.`,
  },
];

export function getArticle(slug: string) {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}
