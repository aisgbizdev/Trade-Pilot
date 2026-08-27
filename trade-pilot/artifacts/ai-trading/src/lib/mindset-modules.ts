// Trader's Mindset mini-course content.
//
// Static, bundled content (no markdown renderer dependency) — each
// module is rendered as a sequence of paragraphs and optional bullet
// lists. Keep modules short (3-5 min read) so the page works as
// quick reference between trades, not a textbook.

export type MindsetBlock =
  | { type: "p"; en: string; id: string }
  | { type: "h"; en: string; id: string }
  | { type: "list"; en: string[]; id: string[] }
  | { type: "callout"; en: string; id: string };

export interface MindsetModule {
  id: string;
  title_en: string;
  title_id: string;
  summary_en: string;
  summary_id: string;
  read_minutes: number;
  blocks: MindsetBlock[];
}

export const MINDSET_MODULES: MindsetModule[] = [
  {
    id: "fomo",
    title_en: "FOMO — Trading Late on a Move",
    title_id: "FOMO — Telat Masuk Saat Harga Sudah Jalan",
    summary_en: "Why chasing breakouts hurts and how to wait for second chances.",
    summary_id: "Kenapa ngejar breakout sering buntung dan cara nunggu peluang kedua.",
    read_minutes: 3,
    blocks: [
      {
        type: "p",
        en: "FOMO — Fear Of Missing Out — is the urge to enter a trade after the move has already started, because you're afraid the rest of the move will happen without you.",
        id: "FOMO — Fear Of Missing Out — itu dorongan untuk masuk trade setelah harga sudah jalan, karena takut sisa pergerakannya akan terjadi tanpa kamu.",
      },
      {
        type: "p",
        en: "The problem: by the time the move is obvious enough to make you anxious, you're entering near the end of the impulse — exactly where smart money is taking profit.",
        id: "Masalahnya: saat pergerakannya sudah jelas banget sampai bikin kamu cemas, kamu masuk di akhir impulse — persis di titik smart money sedang ambil profit.",
      },
      { type: "h", en: "What to do instead", id: "Yang harus dilakukan" },
      {
        type: "list",
        en: [
          "Accept that you'll miss most moves — that's normal.",
          "Wait for a pullback to a clear level (S/R, EMA, previous structure).",
          "If no pullback comes, let the trade go. There will be another setup.",
          "Write down 'I missed X today, but my plan said wait' — train the habit.",
        ],
        id: [
          "Terima bahwa kamu akan ketinggalan kebanyakan pergerakan — itu wajar.",
          "Tunggu pullback ke level jelas (S/R, EMA, struktur sebelumnya).",
          "Kalau pullback nggak datang, lepas saja. Pasti ada setup lain.",
          "Catat: 'Hari ini gw missed X, tapi planning gw bilang nunggu' — latih kebiasaannya.",
        ],
      },
      {
        type: "callout",
        en: "The market opens every day. A missed trade is not a lost trade — a forced trade is.",
        id: "Pasar buka tiap hari. Trade yang missed bukan trade yang rugi — trade yang dipaksa baru rugi.",
      },
    ],
  },
  {
    id: "revenge",
    title_en: "Revenge Trading — Trying to Win It Back",
    title_id: "Revenge Trading — Maksa Balik Modal",
    summary_en: "The most expensive emotion. Recognize it, then stop.",
    summary_id: "Emosi paling mahal di trading. Kenali, lalu stop.",
    read_minutes: 3,
    blocks: [
      {
        type: "p",
        en: "Revenge trading is opening a new position right after a loss, with the goal of recovering the loss — not because your plan said so.",
        id: "Revenge trading itu buka posisi baru langsung setelah loss, dengan tujuan nutup loss — bukan karena planning kamu bilang begitu.",
      },
      {
        type: "p",
        en: "The size usually goes up. The setup quality usually goes down. The combination is how small losses become account-killing losses.",
        id: "Ukurannya biasanya naik. Kualitas setup biasanya turun. Kombinasi inilah yang bikin loss kecil jadi loss penghabis akun.",
      },
      { type: "h", en: "The rule", id: "Aturannya" },
      {
        type: "list",
        en: [
          "After 2 consecutive losses → 30-minute break, no chart.",
          "After 3 losses in a day → close the platform, day is done.",
          "Never increase position size to 'make it back'.",
          "Tomorrow exists.",
        ],
        id: [
          "Setelah 2 loss berturut-turut → istirahat 30 menit, jauhi chart.",
          "Setelah 3 loss dalam sehari → tutup platform, hari ini selesai.",
          "Jangan pernah naikkan ukuran posisi buat 'nutup balik'.",
          "Besok masih ada.",
        ],
      },
    ],
  },
  {
    id: "loss-aversion",
    title_en: "Loss Aversion — Holding Losers Too Long",
    title_id: "Loss Aversion — Nahan Loss Kelamaan",
    summary_en: "Why a -2% trade feels worse than a +2% trade feels good.",
    summary_id: "Kenapa loss -2% terasa lebih sakit daripada profit +2% terasa enak.",
    read_minutes: 3,
    blocks: [
      {
        type: "p",
        en: "Humans feel the pain of a loss about 2x stronger than the pleasure of an equivalent gain. In trading this shows up as: cutting winners early, holding losers in the hope they 'come back'.",
        id: "Manusia merasakan sakit kerugian sekitar 2x lebih kuat dari nikmatnya keuntungan setara. Di trading ini muncul sebagai: cut winner kepagian, nahan loser dengan harapan 'pasti balik'.",
      },
      {
        type: "p",
        en: "The hope-based hold turns a planned -1R loss into a -3R or -5R disaster. That single trade then needs 3-5 winning trades to recover.",
        id: "Holding berbasis harapan mengubah loss -1R yang sudah direncanakan jadi bencana -3R atau -5R. Trade itu butuh 3-5 trade profit buat balik modal.",
      },
      { type: "h", en: "The fix", id: "Solusinya" },
      {
        type: "list",
        en: [
          "Pre-set the stop-loss before entry. Not after.",
          "Treat the SL as a fact, not an opinion you can change later.",
          "If you keep moving SL further, you don't have a strategy — you have hope.",
          "Smaller positions make it easier to accept the loss.",
        ],
        id: [
          "Set stop-loss SEBELUM masuk. Bukan setelah.",
          "Anggap SL itu fakta, bukan opini yang bisa kamu ubah belakangan.",
          "Kalau kamu terus geser SL menjauh, kamu nggak punya strategi — kamu punya harapan.",
          "Posisi yang lebih kecil bikin loss lebih mudah diterima.",
        ],
      },
    ],
  },
  {
    id: "anchoring",
    title_en: "Anchoring — 'It Was Cheaper Yesterday'",
    title_id: "Anchoring — 'Kemarin Sih Lebih Murah'",
    summary_en: "Why your entry price matters less than you think.",
    summary_id: "Kenapa harga entry kamu nggak sepenting yang kamu kira.",
    read_minutes: 3,
    blocks: [
      {
        type: "p",
        en: "Anchoring is sticking to a reference price — usually your entry, or yesterday's high — and refusing to act when current price says otherwise.",
        id: "Anchoring itu nempel ke harga referensi — biasanya harga entry kamu, atau high kemarin — dan menolak bertindak walau harga sekarang bilang sebaliknya.",
      },
      {
        type: "p",
        en: "The market doesn't know your entry price. It moves based on what's happening now and what traders expect next. Holding because 'I'm only -0.5% down' is anchoring, not analysis.",
        id: "Pasar nggak tau harga entry kamu. Dia bergerak berdasar apa yang terjadi sekarang dan ekspektasi trader berikutnya. Nahan karena 'kan baru -0.5%' itu anchoring, bukan analisis.",
      },
      {
        type: "callout",
        en: "Ask yourself: 'If I had no position right now, would I open this trade?' If no → close it.",
        id: "Tanya ke diri: 'Kalau gw lagi nggak punya posisi, gw bakal buka trade ini sekarang?' Kalau jawabannya nggak → tutup posisi.",
      },
    ],
  },
  {
    id: "risk-mindset",
    title_en: "Risk First — Position Sizing Mindset",
    title_id: "Risk Dulu — Mindset Position Sizing",
    summary_en: "Profit follows discipline. Discipline starts with size.",
    summary_id: "Profit ngikutin disiplin. Disiplin dimulai dari ukuran posisi.",
    read_minutes: 4,
    blocks: [
      {
        type: "p",
        en: "Professional traders think in this order: 1) how much can I lose, 2) what's my entry, 3) what's my target. Beginners reverse it: 1) target, 2) entry, 3) — uh, stop?",
        id: "Trader profesional mikir dalam urutan ini: 1) berapa maksimal lossnya, 2) entry di mana, 3) target di mana. Pemula kebalik: 1) target, 2) entry, 3) — eh, stop?",
      },
      {
        type: "p",
        en: "The 1% rule: never risk more than 1% of your account on a single trade. With 1% risk per trade, you can lose 10 in a row and still have 90% of your capital. With 5% risk, 10 losses = you're at 60%, and need a +67% gain to recover.",
        id: "Aturan 1%: jangan pernah risiko lebih dari 1% akun untuk satu trade. Dengan risk 1%, kamu bisa loss 10 kali beruntun dan masih punya 90% modal. Dengan risk 5%, 10 loss = sisa 60%, butuh +67% gain buat balik modal.",
      },
      { type: "h", en: "Position size formula", id: "Rumus position size" },
      {
        type: "p",
        en: "Position size = (account × risk%) / (entry − stop-loss in price points × point value)",
        id: "Position size = (akun × risk%) / (entry − stop-loss dalam point harga × nilai per point)",
      },
      {
        type: "p",
        en: "If the math gives you a smaller size than your minimum tradeable lot, skip the trade. The stop-loss is too far — wait for a tighter setup.",
        id: "Kalau hitungannya keluar ukuran lebih kecil dari minimum lot yang bisa ditradingkan, skip trade-nya. Stop-lossnya kejauhan — tunggu setup yang lebih ketat.",
      },
    ],
  },
  {
    id: "plan-vs-prediction",
    title_en: "Plan vs Prediction — You Don't Need to Be Right",
    title_id: "Planning vs Prediksi — Kamu Nggak Harus Bener",
    summary_en: "A good trader with a 40% win rate beats a 'guru' with 70%.",
    summary_id: "Trader bagus dengan win rate 40% mengalahkan 'guru' dengan win rate 70%.",
    read_minutes: 3,
    blocks: [
      {
        type: "p",
        en: "Beginners think trading is about predicting where price will go. Pros know it's about managing the trade once it's open — when you're right AND when you're wrong.",
        id: "Pemula kira trading itu soal prediksi harga akan ke mana. Pro tau ini soal manage trade setelah posisi terbuka — saat kamu bener DAN saat kamu salah.",
      },
      {
        type: "p",
        en: "With a 1:3 risk-reward ratio, you only need to be right 30% of the time to break even. With 1:5, only 18%. The edge isn't prediction — it's letting winners run further than losers.",
        id: "Dengan risk-reward 1:3, kamu cuma perlu bener 30% buat break-even. Dengan 1:5, cuma 18%. Edge-nya bukan prediksi — tapi membiarkan profit lari lebih jauh dari loss.",
      },
      {
        type: "callout",
        en: "Your job isn't to be right. Your job is to manage what happens after you click buy or sell.",
        id: "Tugas kamu bukan bener. Tugas kamu adalah manage apa yang terjadi setelah klik buy atau sell.",
      },
    ],
  },
  {
    id: "journaling",
    title_en: "Journaling — Your Most Valuable Tool",
    title_id: "Journaling — Tool Paling Berharga",
    summary_en: "What you don't measure, you can't improve.",
    summary_id: "Yang nggak kamu ukur, nggak bisa kamu perbaiki.",
    read_minutes: 3,
    blocks: [
      {
        type: "p",
        en: "Every trade should be journaled with at least: instrument, timeframe, entry & exit reason, what you felt during the trade, and what you'd do differently. Three months of this and patterns emerge that no course can teach you.",
        id: "Tiap trade harus dijurnal minimal: instrument, timeframe, alasan entry & exit, apa yang kamu rasakan saat trade, dan apa yang akan kamu lakukan beda. Tiga bulan begini dan polanya keluar — pola yang nggak akan diajari kursus mana pun.",
      },
      { type: "h", en: "Patterns the journal usually reveals", id: "Pola yang biasa keluar dari jurnal" },
      {
        type: "list",
        en: [
          "You make money on one specific setup — and lose on the other 4 you try.",
          "You overtrade on Mondays (revenge from a bad weekend) or Fridays (closing for the week).",
          "Your win rate is 60% on planned trades, 20% on impulse trades.",
          "You move stops on trades opened after 9pm.",
        ],
        id: [
          "Kamu cuan di satu setup spesifik — dan loss di 4 setup lain yang kamu coba.",
          "Kamu overtrading hari Senin (revenge weekend buruk) atau Jumat (mau tutup minggu).",
          "Win rate kamu 60% di planned trade, 20% di impulse trade.",
          "Kamu geser stop di trade yang dibuka setelah jam 9 malam.",
        ],
      },
    ],
  },
  {
    id: "patience",
    title_en: "Patience — Doing Nothing Is a Trade",
    title_id: "Sabar — Diam Itu Juga Pilihan Trading",
    summary_en: "Sitting in cash is a position. The hardest one.",
    summary_id: "Tetap cash itu posisi. Posisi tersulit.",
    read_minutes: 3,
    blocks: [
      {
        type: "p",
        en: "The market generates maybe 3-5 high-quality setups per week per instrument. The other 80% of the time it's chop — sideways noise where edge is near zero.",
        id: "Pasar menghasilkan mungkin 3-5 setup berkualitas tinggi per minggu per instrument. 80% sisanya itu chop — noise sideways di mana edge mendekati nol.",
      },
      {
        type: "p",
        en: "If you only trade the 20%, you win consistently. If you trade the 100%, the 80% chop bleeds your account dry while the 20% pays for it. Most beginners trade 100%.",
        id: "Kalau kamu cuma trading di 20% itu, kamu menang konsisten. Kalau kamu trading 100%, 80% chop ngehabisin akun sementara 20% yang bayarin. Mayoritas pemula trading 100%.",
      },
      {
        type: "callout",
        en: "A trader who places 3 trades per week and wins 60% earns more than one who places 30 trades per week and wins 50%. Boring beats busy.",
        id: "Trader yang masuk 3 trade per minggu dengan win rate 60% earning lebih dari yang masuk 30 trade per minggu dengan win rate 50%. Bosan kalahin sibuk.",
      },
    ],
  },
];

export function getModule(id: string): MindsetModule | undefined {
  return MINDSET_MODULES.find((m) => m.id === id);
}
