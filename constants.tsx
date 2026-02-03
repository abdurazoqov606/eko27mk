
import { EcoTip, EcoArticle, QuizQuestion, TreeAction, ForumEvent } from './types';

export const ECO_TIPS: EcoTip[] = [
  { id: '1', title: 'Suvni tejang', description: 'Tishingizni yuvayotganda kranni yoping. Bu har safar 6 litrgacha suvni tejaydi.', category: 'water', icon: '💧' },
  { id: '2', title: 'Plastikdan voz keching', description: 'Haridlar uchun matoli sumkadan foydalaning. Bir dona plastik paket 500 yil davomida parchalanadi.', category: 'waste', icon: '🛍️' },
  { id: '3', title: 'Energiyani tejash', description: 'Xonadan chiqayotganda chiroqni o‘chiring va LED lampalardan foydalaning.', category: 'energy', icon: '💡' }
];

export const ECO_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Atmosferadagi eng ko'p gaz qaysi?",
    options: ["Kislorod", "Azot", "Karbonat angidrid", "Argon"],
    correctAnswer: 1,
    explanation: "Azot atmosfera hajmining taxminan 78% qismini tashkil qiladi.",
    level: 'medium'
  }
];

export const ECO_ARTICLES: EcoArticle[] = [
  {
    id: 'art1',
    title: "Tayloqda yangi 'Eko-Bog' tashkil etildi",
    excerpt: "27-maktab o'quvchilari tashabbusi bilan 500 tup mevali daraxt ekildi.",
    content: "Loyiha doirasida tuman hokimiyati bilan hamkorlikda yangi sug'orish tizimi o'rnatildi. Ushbu bog' kelajakda maktab o'quvchilari uchun ham dam olish maskani, ham amaliy mashg'ulotlar markazi bo'lib xizmat qiladi.",
    date: "2024-12-01",
    category: "Yangiliklar",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000"
  },
  {
    id: 'art2',
    title: "Yilning eng yaxshi eko-loyihasi",
    excerpt: "Maktabimiz o'quvchisi 'Yashil Dunyo' tanlovida g'olib bo'ldi.",
    content: "Tanlovda quyosh energiyasidan foydalanish bo'yicha innovatsion g'oya taqdim etildi. Hakamlar hay'ati loyihaning arzonligi va samaradorligini yuqori baholadilar.",
    date: "2024-11-25",
    category: "Tanlovlar",
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1000"
  }
];

export const TREE_ACTIONS: TreeAction[] = [
  { id: '1', title: "Bahorgi daraxt ekish", date: "2025-03-21", volunteers: 300, status: 'planning' },
  { id: '2', title: "Suv havzalarini tozalash", date: "2025-04-15", volunteers: 150, status: 'planning' },
  { id: '3', title: "Eko-Velomarafon", date: "2025-05-10", volunteers: 200, status: 'planning' }
];

export const FORUM_EVENTS: ForumEvent[] = [
  {
    id: 'f1',
    title: "Yashil Kelajak Forumi 2026",
    description: "Tayloq tumanining barcha maktablari ishtirok etadigan katta ekologik forum.",
    date: "2026-06-15",
    prizes: [
      { rank: "1-o'rin", prize: "Noutbuk (MacBook Air)", description: "Eng yaxshi ekologik innovatsiya uchun.", icon: "💻" },
      { rank: "2-o'rin", prize: "Planshet (Samsung Galaxy Tab)", description: "Eng faol eko-volontyor o'quvchi uchun.", icon: "📱" },
      { rank: "3-o'rin", prize: "Smart soat (Apple Watch)", description: "Eng yaxshi eko-poster muallifi uchun.", icon: "⌚" }
    ]
  }
];
