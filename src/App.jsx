import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ══════════ Fonts ══════════ */
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+KR:wght@400;600;700&family=Shippori+Mincho:wght@400;600;700&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap";
fl.rel = "stylesheet";
document.head.appendChild(fl);

/* ══════════ CSS ══════════ */
const css = document.createElement("style");
css.textContent = `
@font-face {
  font-family: 'KotraDoYak';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2110@1.0/KOTRALEAP.woff2') format('woff2');
  font-weight: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Playlist Script';
  src: url('/fonts/PlaylistScript.otf') format('opentype');
  font-weight: normal;
  font-display: swap;
}
:root {
  --bg:#E8E0D0; --bg2:#DDD5C4; --bgc:#F2ECE0;
  --midnight:#0C1A2E; --mid2:#1E3A5C; --mid3:#152840;
  --gold:#C8A84E; --goldl:#E8D892; --goldd:#8B6914;
  --tx:#0C1A2E; --tx2:#4A4236; --txd:#8A7C66;
  --blue:#6CBEEB; --blued:#3A8BBF;
  --brd:rgba(200,168,78,0.2);
  --fd:'Playfair Display','Noto Serif KR','Shippori Mincho',serif;
  --fk:'KotraDoYak','Noto Serif KR',serif;
  --fs:'Playlist Script',cursive;
  --fb:'Noto Sans KR','Noto Sans JP',sans-serif;
}
* { margin:0; padding:0; box-sizing:border-box; }
html { --vh:100vh; --vh:100dvh; }
body { background:var(--midnight); color:var(--tx); font-family:var(--fb); overflow:hidden; -webkit-font-smoothing:antialiased; height:var(--vh); }
::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--gold); border-radius:2px; }
.iscroll { scrollbar-width:thin; scrollbar-color:var(--gold) transparent; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes goldDust { 0%{opacity:0;transform:translateY(-10px) scale(.5)} 15%{opacity:.6} 85%{opacity:.2} 100%{opacity:0;transform:translateY(100vh) scale(1)} }
@keyframes glowPulse { 0%,100%{text-shadow:0 0 20px rgba(200,168,78,.2)} 50%{text-shadow:0 0 40px rgba(200,168,78,.5),0 0 80px rgba(200,168,78,.15)} }
@keyframes langFade { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@keyframes scrollBounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(6px);opacity:.8} }
@keyframes spinHighlight { 0%{box-shadow:0 0 0 transparent} 50%{box-shadow:0 0 18px rgba(200,168,78,.5)} 100%{box-shadow:0 0 0 transparent} }
@keyframes burstLight { 0%{width:0;height:0;opacity:1} 50%{width:250vmax;height:250vmax;opacity:.9} 100%{width:300vmax;height:300vmax;opacity:0} }
@keyframes lidFloat { 0%{transform:translateY(0)} 100%{transform:translateY(-120px) scale(1.05);opacity:0} }
@media(max-width:600px) { .gem-chain-wrap { right:6px!important; } .gem-chain-wrap .gem-tip { display:none!important; } }
`;
document.head.appendChild(css);

/* ═══════════════════════════════════════════
   i18n — UI
   ═══════════════════════════════════════════ */
const T = {
  ko:{
    nav:["인트로","보석들","세계관","시스템","입장"],
    charT:"보석 쇼케이스", charS:"JEWELS", charTap:"보석에 빛을 비추어 인물을 확인하세요",
    worldT:"보석함 안내", worldS:"ISLAND", worldDesc:"보석함 파티가 열리는 마법의 섬입니다. 장소를 눌러 자세히 알아보세요.",
    evtT:"보석함 이벤트", evtS:"EVENTS", evtTap:"블루 아울을 눌러 룰렛을 돌리거나, 이벤트를 직접 선택하세요",
    sysT:"시스템 가이드", sysS:"SYSTEM", cmdL:"COMMANDS",
    sm:"스토리 모드", smd:"보석함 파티의 시작부터 최종선택까지 순차 진행.",
    fm:"자유 모드", fmd:"챕터 제약 없이 자유롭게 보석함을 탐험한다.",
    c1:"!요약", c1d:"현재까지의 호감도·이벤트·관계를 키워드로 정리",
    c2:"!챕터", c2d:"현재 챕터 진행도와 다음 챕터 조건을 확인",
    c3:"!지도", c3d:"보석함 섬 지역과 9왕국 정보를 출력",
    c4:"!디버그", c4d:"이미지 출력 오류를 점검하고 수정·재출력",
    ctaT:"보석함에 참가하시겠습니까?", ctaB:"입장하기", ctaN:"URL 추후 연결 예정",
    credit:"흑요석의 신부",
    per:"성격", tone:"말투", goal:"목표",
    scroll:"아래로 스크롤",
    kingdoms:"9왕국 개요", kingdomsS:"KINGDOMS",
  },
  en:{
    nav:["Intro","Jewels","World","System","Enter"],
    charT:"Gem Showcase", charS:"JEWELS", charTap:"Hover over a gem to reveal the character",
    worldT:"Jewel Box Guide", worldS:"ISLAND", worldDesc:"A magical island where the Jewel Box party takes place. Tap a location to learn more.",
    evtT:"Jewel Box Events", evtS:"EVENTS", evtTap:"Click Blue Owl to spin, or select an event directly",
    sysT:"System Guide", sysS:"SYSTEM", cmdL:"COMMANDS",
    sm:"Story Mode", smd:"Follow the Jewel Box party from start to the Final Choice.",
    fm:"Free Mode", fmd:"Explore the Jewel Box freely with no chapter restrictions.",
    c1:"!summary", c1d:"Summarize affinity, events, and relationships so far",
    c2:"!chapter", c2d:"Check current chapter progress and next chapter conditions",
    c3:"!map", c3d:"Display Jewel Box island locations and Nine Kingdoms info",
    c4:"!debug", c4d:"Fix image output errors",
    ctaT:"Will you enter the Jewel Box?", ctaB:"Enter", ctaN:"URL coming soon",
    credit:"The Obsidian Bride",
    per:"Personality", tone:"Tone", goal:"Goal",
    scroll:"Scroll Down",
    kingdoms:"Nine Kingdoms", kingdomsS:"KINGDOMS",
  },
  ja:{
    nav:["イントロ","宝石","世界観","システム","開始"],
    charT:"宝石ショーケース", charS:"JEWELS", charTap:"宝石に光を当てて人物を確認してください",
    worldT:"宝石箱案内", worldS:"ISLAND", worldDesc:"宝石箱パーティーが開催される魔法の島です。場所をタップして詳しく見てください。",
    evtT:"宝石箱イベント", evtS:"EVENTS", evtTap:"ブルーアウルをクリックしてルーレットを回すか、イベントを直接選択してください",
    sysT:"システムガイド", sysS:"SYSTEM", cmdL:"COMMANDS",
    sm:"ストーリーモード", smd:"宝石箱パーティーの開始から最終選択まで順次進行。",
    fm:"フリーモード", fmd:"チャプター制限なく自由に宝石箱を探索する。",
    c1:"!あらすじ", c1d:"現在までの好感度・イベント・関係をキーワードで整理",
    c2:"!チャプター", c2d:"現在のチャプター進行度と次の条件を確認",
    c3:"!マップ", c3d:"宝石箱の島の施設と九王国の情報を表示",
    c4:"!デバッグ", c4d:"画像出力エラーの修正",
    ctaT:"宝石箱に参加しますか？", ctaB:"入場する", ctaN:"URLは後日追加予定",
    credit:"黒曜石の花嫁",
    per:"性格", tone:"口調", goal:"目標",
    scroll:"下にスクロール",
    kingdoms:"九王国概要", kingdomsS:"KINGDOMS",
  },
};

/* ═══════════════════════════════════════════
   i18n — 캐릭터
   ═══════════════════════════════════════════ */
const CHARS = {
  ko:[
    { gem:"페리도트", per:"다정한 가면 아래 치밀한 설계자", tone:"정중한 존댓말", goal:"보석함의 진정한 지배자가 되는 것", intro:"온화한 미소 뒤에 숨겨진 포식자. 모든 것을 설계하고 지배한다.", color:"#A0E88C", gemBg:"radial-gradient(circle at 35% 35%,#c8f5b8,#6cc45c,#3a8a2c)", img:"/images/chars/p_pp.webp", modalImg:"/images/chars/p_pp.webp" },
    { gem:"모이사나이트", per:"불안한 연기자, 열등감, 발각 공포", tone:"우아하지만 날 선 말투", goal:"진짜 왕족이 되는 것. 그리고 진정한 사랑", intro:"화려한 외모 아래 비천한 출생을 숨긴 대역. 완벽한 연기가 무너지는 순간을 두려워한다.", color:"#E0E0F0", gemBg:"radial-gradient(circle at 35% 35%,#f8f8ff,#c8c8e0,#9898b8)", img:"/images/chars/m_pp.webp", modalImg:"/images/chars/m_pp.webp" },
    { gem:"브론즈", per:"순도 100% 솔직함, 야성적 전사", tone:"솔직담백한 반말", goal:"전사로서의 강함을 증명하고 살아남기", intro:"사막에서 태어난 가공되지 않은 야성. 음모 가득한 파티의 이질적 존재.", color:"#E0A050", gemBg:"radial-gradient(circle at 35% 35%,#f0c878,#cd7f32,#8b5a20)", img:"/images/chars/b_pp.webp", modalImg:"/images/chars/b_pp.webp" },
    { gem:"헤마타이트", per:"감정을 숫자로 치환하는 현실주의자", tone:"사무적·건조한 말투", goal:"제국의 의도를 파악하고 자국 이익 수호", intro:"냉철한 눈동자 너머 모든 것을 계산하는 설계자. 사랑은 비효율이라 여긴다.", color:"#808890", gemBg:"radial-gradient(circle at 35% 35%,#a8b0b8,#606870,#3a4048)", img:"/images/chars/h_pp.webp", modalImg:"/images/chars/h_pp.webp" },
    { gem:"코랄", per:"호탕한 지도자, 거부할 수 없는 위엄", tone:"당당하고 시원시원함", goal:"조국 국방을 책임질 강인한 동반자 영입", intro:"해군 제독 출신 후계자. 바다처럼 거침없고, 누구보다 강하다.", color:"#FF8070", gemBg:"radial-gradient(circle at 35% 35%,#ffb0a0,#ff6f61,#cc4040)", img:"/images/chars/c_pp.webp", modalImg:"/images/chars/c_pp.webp" },
    { gem:"라벤더쿼츠", per:"순수·소심, 낮은 자존감, 사랑에 맹목적", tone:"처연하고 조심스러운 경어", goal:"자신을 있는 그대로 사랑해 줄 존재를 찾는 것", intro:"신전에서 봉인되어 있던 성녀. 처음 보는 세상에서 사랑을 꿈꾼다.", color:"#D0B8E8", gemBg:"radial-gradient(circle at 35% 35%,#e8d8f8,#b8a0d0,#7a5ca0)", img:"/images/chars/l_pp.webp", modalImg:"/images/chars/l_pp.webp" },
    { gem:"???", mystery:true, per:"■■■", tone:"■■■", goal:"■■■", intro:"■■■■■■■■■■", color:"#2A2A2A", gemBg:"#222", img:"/images/chars/o_pp.webp", modalImg:"/images/chars/o_pp.webp" },
    { gem:"???", mystery:true, per:"■■■", tone:"■■■", goal:"■■■", intro:"■■■■■■■■■■", color:"#5A4A2A", gemBg:"#333", img:"/images/chars/f_pp.webp", modalImg:"/images/chars/f_pp.webp" },
  ],
  en:[
    { gem:"Peridot", per:"A meticulous schemer behind a gentle mask", tone:"Polite, formal", goal:"To become the true master of the Jewel Box", intro:"A predator hidden behind a warm smile. He designs and dominates everything.", color:"#A0E88C", gemBg:"radial-gradient(circle at 35% 35%,#c8f5b8,#6cc45c,#3a8a2c)", img:"/images/chars/p_pp.webp", modalImg:"/images/chars/p_pp.webp" },
    { gem:"Moissanite", per:"An anxious actor, consumed by fear of exposure", tone:"Elegant yet sharp", goal:"To become true royalty — and find true love", intro:"A stand-in hiding lowly birth beneath dazzling beauty. He dreads the moment his perfect act crumbles.", color:"#E0E0F0", gemBg:"radial-gradient(circle at 35% 35%,#f8f8ff,#c8c8e0,#9898b8)", img:"/images/chars/m_pp.webp", modalImg:"/images/chars/m_pp.webp" },
    { gem:"Bronze", per:"100% honest, wild warrior", tone:"Blunt, straightforward", goal:"To prove his strength and survive", intro:"Raw wildness born in the desert. A misfit in a party full of schemes.", color:"#E0A050", gemBg:"radial-gradient(circle at 35% 35%,#f0c878,#cd7f32,#8b5a20)", img:"/images/chars/b_pp.webp", modalImg:"/images/chars/b_pp.webp" },
    { gem:"Hematite", per:"A realist who converts emotions into numbers", tone:"Businesslike, dry", goal:"To uncover the Empire's intentions and protect his nation", intro:"Behind cold eyes, a mind that calculates everything. Love is inefficiency.", color:"#808890", gemBg:"radial-gradient(circle at 35% 35%,#a8b0b8,#606870,#3a4048)", img:"/images/chars/h_pp.webp", modalImg:"/images/chars/h_pp.webp" },
    { gem:"Coral", per:"Bold leader with undeniable presence", tone:"Confident, refreshing", goal:"To recruit a strong partner for national defense", intro:"A naval admiral's heir. Relentless as the sea, stronger than anyone.", color:"#FF8070", gemBg:"radial-gradient(circle at 35% 35%,#ffb0a0,#ff6f61,#cc4040)", img:"/images/chars/c_pp.webp", modalImg:"/images/chars/c_pp.webp" },
    { gem:"Lavender Quartz", per:"Pure, timid, blindly devoted to love", tone:"Wistful, cautious", goal:"To find someone who loves her as she is", intro:"A saint once sealed in a temple. She dreams of love in a world she's seeing for the first time.", color:"#D0B8E8", gemBg:"radial-gradient(circle at 35% 35%,#e8d8f8,#b8a0d0,#7a5ca0)", img:"/images/chars/l_pp.webp", modalImg:"/images/chars/l_pp.webp" },
    { gem:"???", mystery:true, per:"■■■", tone:"■■■", goal:"■■■", intro:"■■■■■■■■■■", color:"#2A2A2A", gemBg:"#222", img:"/images/chars/o_pp.webp", modalImg:"/images/chars/o_pp.webp" },
    { gem:"???", mystery:true, per:"■■■", tone:"■■■", goal:"■■■", intro:"■■■■■■■■■■", color:"#5A4A2A", gemBg:"#333", img:"/images/chars/f_pp.webp", modalImg:"/images/chars/f_pp.webp" },
  ],
  ja:[
    { gem:"ペリドット", per:"優しい仮面の下の緻密な設計者", tone:"丁寧な敬語", goal:"宝石箱の真の支配者になること", intro:"温和な微笑みの裏に潜む捕食者。すべてを設計し、支配する。", color:"#A0E88C", gemBg:"radial-gradient(circle at 35% 35%,#c8f5b8,#6cc45c,#3a8a2c)", img:"/images/chars/p_pp.webp", modalImg:"/images/chars/p_pp.webp" },
    { gem:"モアッサナイト", per:"不安な演者、劣等感、発覚の恐怖", tone:"優雅だが鋭い口調", goal:"本物の王族になること。そして真の愛", intro:"華やかな外見の下に卑しい出生を隠す代役。完璧な演技が崩れる瞬間を恐れている。", color:"#E0E0F0", gemBg:"radial-gradient(circle at 35% 35%,#f8f8ff,#c8c8e0,#9898b8)", img:"/images/chars/m_pp.webp", modalImg:"/images/chars/m_pp.webp" },
    { gem:"ブロンズ", per:"純度100%の正直さ、野性的な戦士", tone:"率直でぶっきらぼう", goal:"戦士としての強さを証明し生き残ること", intro:"砂漠で生まれた加工されていない野性。陰謀だらけのパーティーの異質な存在。", color:"#E0A050", gemBg:"radial-gradient(circle at 35% 35%,#f0c878,#cd7f32,#8b5a20)", img:"/images/chars/b_pp.webp", modalImg:"/images/chars/b_pp.webp" },
    { gem:"ヘマタイト", per:"感情を数字に変換する現実主義者", tone:"事務的で乾いた口調", goal:"帝国の意図を把握し自国の利益を守ること", intro:"冷徹な瞳の向こう、すべてを計算する設計者。愛は非効率だと考える。", color:"#808890", gemBg:"radial-gradient(circle at 35% 35%,#a8b0b8,#606870,#3a4048)", img:"/images/chars/h_pp.webp", modalImg:"/images/chars/h_pp.webp" },
    { gem:"コーラル", per:"豪快な指導者、抗えない威厳", tone:"堂々として爽快", goal:"祖国の国防を担う強靭な伴侶を迎えること", intro:"海軍提督出身の後継者。海のように容赦なく、誰よりも強い。", color:"#FF8070", gemBg:"radial-gradient(circle at 35% 35%,#ffb0a0,#ff6f61,#cc4040)", img:"/images/chars/c_pp.webp", modalImg:"/images/chars/c_pp.webp" },
    { gem:"ラベンダークォーツ", per:"純粋・臆病、低い自尊心、愛に盲目", tone:"哀愁のある丁寧語", goal:"ありのままの自分を愛してくれる存在を見つけること", intro:"神殿に封印されていた聖女。初めて見る世界で愛を夢見る。", color:"#D0B8E8", gemBg:"radial-gradient(circle at 35% 35%,#e8d8f8,#b8a0d0,#7a5ca0)", img:"/images/chars/l_pp.webp", modalImg:"/images/chars/l_pp.webp" },
    { gem:"???", mystery:true, per:"■■■", tone:"■■■", goal:"■■■", intro:"■■■■■■■■■■", color:"#2A2A2A", gemBg:"#222", img:"/images/chars/o_pp.webp", modalImg:"/images/chars/o_pp.webp" },
    { gem:"???", mystery:true, per:"■■■", tone:"■■■", goal:"■■■", intro:"■■■■■■■■■■", color:"#5A4A2A", gemBg:"#333", img:"/images/chars/f_pp.webp", modalImg:"/images/chars/f_pp.webp" },
  ],
};

/* ═══════════════════════════════════════════
   i18n — 이벤트
   ═══════════════════════════════════════════ */
const EVENTS = {
  ko:[
    { n:"호감도 투표", ic:"💌", d:"매일 밤 카드에 메시지를 적어 호감 상대에게 전달. 마법진으로 실시간 전송, 즉시 결과 발표. 1인당 1표." },
    { n:"게임", ic:"⚔️", d:"승리자 1인이 원하는 이성 2명을 데이트 상대로 지목. 해상 검술시합, 기마사격, 해저 탐색 등 다양한 경기." },
    { n:"진실의 만남", ic:"💎", d:"쌍방향 호감 커플 탄생 시, 섬 외부 극한 환경으로 순간이동. 설원·사막·해저에서 생존 미션 수행." },
    { n:"쇼핑 데이트", ic:"🛍️", d:"마법으로 랜덤 짝을 이뤄 9왕국으로 쇼핑 데이트. 원하는 상대에게 줄 선물을 파트너와 함께 선택." },
    { n:"최종선택", ic:"💍", d:"사랑하는 상대에게 각국의 보물로 청혼. 수락 시 공식 커플이 되어 한쪽 모국의 독립을 되찾을 수 있다." },
  ],
  en:[
    { n:"Affinity Vote", ic:"💌", d:"Each night, write a message on a card and deliver it to your crush. Transmitted instantly via magic circle. One vote per person." },
    { n:"Games", ic:"⚔️", d:"The winner nominates 2 people of the opposite sex for a date. Sea duels, mounted archery, undersea exploration, and more." },
    { n:"Moment of Truth", ic:"💎", d:"When mutual affinity is confirmed, the couple teleports to extreme environments outside the island for survival missions." },
    { n:"Shopping Date", ic:"🛍️", d:"Randomly paired via magic for a shopping date across the nine kingdoms. Choose a gift for your crush with your partner." },
    { n:"Final Choice", ic:"💍", d:"Propose to your beloved with a national treasure. If accepted, the couple earns independence for one homeland." },
  ],
  ja:[
    { n:"好感度投票", ic:"💌", d:"毎晩カードにメッセージを書いて好きな相手に送る。魔法陣でリアルタイム送信、即座に結果発表。一人一票。" },
    { n:"ゲーム", ic:"⚔️", d:"勝者1人が異性2人をデート相手に指名。海上剣術試合、騎馬射撃、海底探索など多様な競技。" },
    { n:"真実の出会い", ic:"💎", d:"双方向の好感カップル誕生時、島外の極限環境へ瞬間移動。雪原・砂漠・海底でサバイバルミッション。" },
    { n:"ショッピングデート", ic:"🛍️", d:"魔法でランダムペアを組み九王国へショッピングデート。好きな相手へのプレゼントをパートナーと一緒に選ぶ。" },
    { n:"最終選択", ic:"💍", d:"愛する相手に各国の宝物でプロポーズ。受諾されれば公式カップルとなり、一方の祖国の独立を取り戻せる。" },
  ],
};

/* ═══════════════════════════════════════════
   i18n — 섬 지역
   ═══════════════════════════════════════════ */
const LOCATIONS = {
  ko:[
    { n:"중앙홀", d:"보석함 파티의 중심. 호감도 투표와 공식 발표가 이루어지는 곳.", ic:"🏛", center:true },
    { n:"숙소", d:"남녀 구분 공용 휴게실과 개인 침실. 휴식과 비밀 대화의 공간.", ic:"🏠" },
    { n:"식당", d:"모든 참가자가 함께 식사하는 공간. 요리 이벤트의 무대.", ic:"🍽" },
    { n:"댄스홀", d:"화려한 무도회가 열리는 공간. 커플의 첫 만남이 시작되기도.", ic:"💃" },
    { n:"정원", d:"산책과 밀담을 위한 아름다운 정원. 비밀 고백의 명소.", ic:"🌹" },
    { n:"해변", d:"섬을 둘러싼 백사장. 게임 이벤트와 데이트 장소.", ic:"🏖" },
    { n:"연무장", d:"무예 훈련과 게임 이벤트가 벌어지는 투기장.", ic:"⚔" },
  ],
  en:[
    { n:"Central Hall", d:"The heart of the Jewel Box party. Affinity votes and official announcements.", ic:"🏛", center:true },
    { n:"Dormitory", d:"Gender-separated lounges and private rooms. A space for rest and secret conversations.", ic:"🏠" },
    { n:"Dining Hall", d:"Where all participants dine together. Stage for cooking events.", ic:"🍽" },
    { n:"Dance Hall", d:"Where grand balls take place. First encounters between couples begin here.", ic:"💃" },
    { n:"Garden", d:"Beautiful gardens for strolls and whispers. A famous spot for secret confessions.", ic:"🌹" },
    { n:"Beach", d:"White sand surrounding the island. Game events and date location.", ic:"🏖" },
    { n:"Arena", d:"An arena for martial training and game events.", ic:"⚔" },
  ],
  ja:[
    { n:"中央ホール", d:"宝石箱パーティーの中心。好感度投票と公式発表の場。", ic:"🏛", center:true },
    { n:"宿舎", d:"男女別共用ラウンジと個室。休息と秘密の会話の空間。", ic:"🏠" },
    { n:"食堂", d:"全参加者が共に食事をする場所。料理イベントの舞台。", ic:"🍽" },
    { n:"ダンスホール", d:"華やかな舞踏会が開かれる空間。カップルの出会いが始まる場所。", ic:"💃" },
    { n:"庭園", d:"散歩と密談のための美しい庭園。秘密の告白の名所。", ic:"🌹" },
    { n:"ビーチ", d:"島を囲む白い砂浜。ゲームイベントとデートスポット。", ic:"🏖" },
    { n:"演武場", d:"武芸の訓練とゲームイベントが行われる闘技場。", ic:"⚔" },
  ],
};

/* ═══════════════════════════════════════════
   i18n — 9왕국
   ═══════════════════════════════════════════ */
const KINGDOMS = {
  ko:[
    { n:"엘 페디움", d:"마법 절대주의 제국", detail:"인어 학살로 마력을 탈취해 대륙을 통일한 제국. 대반역 진압 중 황족 멸절 위기에 처했다.", color:"#C8A84E", img:"/images/kingdoms/elpedium.webp" },
    { n:"살파도르", d:"사막의 무도 강국", detail:"대륙 최강의 검술과 용병을 보유한 사막 국가. 대반역 시 가장 치열하게 저항했다.", color:"#E0A050", img:"/images/kingdoms/salpador.webp" },
    { n:"세레", d:"신권 통치 교황령", detail:"왕족의 신성력을 교황이 착취하는 나라. 성녀와 사제를 신전에 감금한다.", color:"#D0B8E8", img:"/images/kingdoms/sere.webp" },
    { n:"데메테리아", d:"풍요의 대지", detail:"최대 농축산지이나 제국에 식량을 수탈당한다. 기회주의적 생존 전략으로 전환.", color:"#8BC47C", img:"/images/kingdoms/demeteria.webp" },
    { n:"우라칸", d:"대륙의 무기고", detail:"북부 고산지대의 철광산과 무기 제조 특화 국가. 극도의 실리주의.", color:"#808890", img:"/images/kingdoms/uracan.webp" },
    { n:"카일리아", d:"최대 부유국", detail:"보석 광산이 풍부하고 화려한 왕궁. 제국의 부역자로 막대한 뇌물을 바친다.", color:"#E8D892", img:"/images/kingdoms/kailia.webp" },
    { n:"헤티스", d:"해양 강국", detail:"거대 항구와 막강한 해군을 보유. 제국에 대한 혐오가 강하고 독자 노선을 고수.", color:"#FF8070", img:"/images/kingdoms/hetis.webp" },
    { n:"시에리스", d:"무역 중심지", detail:"물자와 지식의 요람. 학문과 상업이 발달했으며, 쇠락한 국권 회복을 위해 전략적으로 참가.", color:"#6CBEEB", img:"/images/kingdoms/sieris.webp" },
    { n:"오르테라", d:"마석의 나라", detail:"마법석 채굴지이자 대반역 주도국. 진압 후 국토가 수몰되고 왕족이 노예화되었다.", color:"#2A2A2A", img:"/images/kingdoms/ortera.webp" },
  ],
  en:[
    { n:"El Pedium", d:"Empire of absolute magic", detail:"An empire that unified the continent by slaughtering merfolk and seizing their magic. Nearly lost its royal line suppressing the Great Rebellion.", color:"#C8A84E", img:"/images/kingdoms/elpedium.webp" },
    { n:"Salpador", d:"Desert martial powerhouse", detail:"A desert nation boasting the continent's finest swordsmanship and mercenaries. Fought most fiercely during the Great Rebellion.", color:"#E0A050", img:"/images/kingdoms/salpador.webp" },
    { n:"Sere", d:"Theocratic papal state", detail:"A nation where the Pope exploits the royals' sacred power. Saints and priests are imprisoned in temples.", color:"#D0B8E8", img:"/images/kingdoms/sere.webp" },
    { n:"Demeteria", d:"Land of abundance", detail:"The largest agricultural region, but its food is plundered by the Empire. Has shifted to opportunistic survival.", color:"#8BC47C", img:"/images/kingdoms/demeteria.webp" },
    { n:"Uracan", d:"The continent's armory", detail:"Specializes in iron mines and weapon manufacturing in the northern highlands. Extremely pragmatic.", color:"#808890", img:"/images/kingdoms/uracan.webp" },
    { n:"Kailia", d:"Wealthiest kingdom", detail:"Rich in gem mines with a lavish palace. Serves the Empire as a collaborator, offering massive bribes.", color:"#E8D892", img:"/images/kingdoms/kailia.webp" },
    { n:"Hetis", d:"Maritime power", detail:"Commands a massive port and powerful navy. Deeply hostile to the Empire, maintaining an independent course.", color:"#FF8070", img:"/images/kingdoms/hetis.webp" },
    { n:"Sieris", d:"Center of trade", detail:"A cradle of goods and knowledge. Participates strategically to restore its declining sovereignty.", color:"#6CBEEB", img:"/images/kingdoms/sieris.webp" },
    { n:"Ortera", d:"Land of magic stones", detail:"A magic-stone mining nation that led the Great Rebellion. After suppression, its lands were submerged and royals enslaved.", color:"#2A2A2A", img:"/images/kingdoms/ortera.webp" },
  ],
  ja:[
    { n:"エル・ペディウム", d:"魔法絶対主義帝国", detail:"人魚を虐殺し魔力を奪い大陸を統一した帝国。大反逆の鎮圧中に皇族が滅亡の危機に。", color:"#C8A84E", img:"/images/kingdoms/elpedium.webp" },
    { n:"サルパドール", d:"砂漠の武道強国", detail:"大陸最強の剣術と傭兵を擁する砂漠の国。大反逆で最も激しく抵抗した。", color:"#E0A050", img:"/images/kingdoms/salpador.webp" },
    { n:"セレ", d:"神権統治教皇領", detail:"王族の神聖力を教皇が搾取する国。聖女や司祭を神殿に監禁する。", color:"#D0B8E8", img:"/images/kingdoms/sere.webp" },
    { n:"デメテリア", d:"豊穣の大地", detail:"最大の農畜産地だが帝国に食料を収奪される。機会主義的な生存戦略に転換。", color:"#8BC47C", img:"/images/kingdoms/demeteria.webp" },
    { n:"ウラカン", d:"大陸の武器庫", detail:"北部高山地帯の鉄鉱山と武器製造に特化した国家。極度の実利主義。", color:"#808890", img:"/images/kingdoms/uracan.webp" },
    { n:"カイリア", d:"最大の富裕国", detail:"宝石鉱山が豊富で華やかな王宮。帝国の手先として莫大な賄賂を捧げる。", color:"#E8D892", img:"/images/kingdoms/kailia.webp" },
    { n:"ヘティス", d:"海洋強国", detail:"巨大な港と強大な海軍を保有。帝国への嫌悪が強く独自路線を堅持。", color:"#FF8070", img:"/images/kingdoms/hetis.webp" },
    { n:"シエリス", d:"貿易の中心地", detail:"物資と知識の揺りかご。衰退した国権回復のため戦略的に参加。", color:"#6CBEEB", img:"/images/kingdoms/sieris.webp" },
    { n:"オルテラ", d:"魔石の国", detail:"魔法石の採掘地であり大反逆の主導国。鎮圧後、国土は水没し王族は奴隷化された。", color:"#2A2A2A", img:"/images/kingdoms/ortera.webp" },
  ],
};

/* ═══════════════════════════════════════════
   Context & Hooks
   ═══════════════════════════════════════════ */
const LangCtx = createContext("ko");
const useLang = () => useContext(LangCtx);
const useT = () => { const l = useLang(); return T[l]; };
const useIsMobile = () => {
  const [m, setM] = useState(window.innerWidth <= 640);
  useEffect(() => { const h = () => setM(window.innerWidth <= 640); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return m;
};

/* ═══════════════════════════════════════════
   공통 — 금빛 파티클 (아래로 내려감)
   ═══════════════════════════════════════════ */
function GoldDust({ count = 10, dark = false }) {
  return <>{[...Array(count)].map((_, i) => (
    <div key={i} style={{
      position:"absolute",
      width:`${1 + Math.random() * 2.5}px`,
      height:`${1 + Math.random() * 2.5}px`,
      borderRadius:"50%",
      background: dark ? (i % 2 === 0 ? "rgba(200,168,78,0.5)" : "rgba(232,216,146,0.3)") : (i % 2 === 0 ? "rgba(200,168,78,0.25)" : "rgba(139,105,20,0.15)"),
      left:`${Math.random() * 100}%`,
      top:"-5%",
      animation:`goldDust ${5 + Math.random() * 8}s linear infinite`,
      animationDelay:`${Math.random() * 10}s`,
      opacity:0, zIndex:1,
    }}/>
  ))}</>;
}

/* 섹션 타이틀 */
function STitle({ sub, main }) {
  const l = useLang();
  const hf = l === "ko" ? "var(--fk)" : "var(--fd)";
  return (
    <div style={{ textAlign:"center", marginBottom:"clamp(24px,4vw,40px)" }}>
      <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(11px,1.5vw,13px)", letterSpacing:"6px", color:"var(--gold)", marginBottom:"12px", fontWeight:600 }}>{sub}</div>
      <h2 style={{ fontFamily:hf, fontSize:"clamp(24px,5vw,44px)", fontWeight:700, lineHeight:1.3, color:"var(--midnight)" }}>{main}</h2>
      <div style={{ width:"36px", height:"1px", margin:"18px auto 0", background:"linear-gradient(90deg,transparent,var(--gold),transparent)" }}/>
    </div>
  );
}

/* 타이틀 SVG */
function TitleSVG({ dark = false }) {
  return (
    <svg viewBox="0 0 600 130" style={{ width:"min(540px,80vw)", height:"auto" }}>
      <defs>
        <linearGradient id="jtg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8A84E"/><stop offset="50%" stopColor="#E8D892"/><stop offset="100%" stopColor="#8B6914"/>
        </linearGradient>
      </defs>
      <text x="300" y="60" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="52" fontWeight="900" fill={dark?"url(#jtg)":"var(--midnight)"} letterSpacing="6" style={{ animation: dark ? "none" : "glowPulse 4s ease-in-out infinite" }}>
        OBSIDIAN BRIDE
      </text>
      <text x="300" y="100" textAnchor="middle" fontFamily="'KotraDoYak','Noto Serif KR',serif" fontSize="22" fontWeight="400" fill={dark?"var(--gold)":"var(--txd)"} letterSpacing="8">
        흑요석의 신부
      </text>
    </svg>
  );
}

/* 스크롤 다운 */
function ScrollDown() {
  const t = useT();
  return (
    <div style={{ position:"absolute", bottom:"clamp(8px,1.5vw,14px)", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", zIndex:50, pointerEvents:"none" }}>
      <span style={{ fontSize:"clamp(10px,1.3vw,12px)", color:"var(--txd)", letterSpacing:"3px", fontFamily:"var(--fd)", fontWeight:600 }}>{t.scroll}</span>
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ animation:"scrollBounce 2s ease-in-out infinite" }}>
        <path d="M8 4 L8 18" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <path d="M2 14 L8 20 L14 14" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   언어 선택 + 보석함 인트로 (통합)
   ═══════════════════════════════════════════ */
function LangSelect({ onPick, onStartBGM }) {
  const [show, setShow] = useState(false);
  const [hv, setHv] = useState(-1);
  const [picked, setPicked] = useState(null);
  const [opening, setOpening] = useState(false);
  const [burst, setBurst] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [langHover, setLangHover] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 300); }, []);

  const pick = (lang) => {
    if (picked) return;
    setPicked(lang);
    if (onStartBGM) onStartBGM();
    setTimeout(() => setOpening(true), 300);
    setTimeout(() => setBurst(true), 800);
    setTimeout(() => setHidden(true), 1600);
    setTimeout(() => onPick(lang), 1800);
  };

  if (hidden) return null;

  const items = [{ c:"ko", label:"한국어" },{ c:"en", label:"ENGLISH" },{ c:"ja", label:"日本語" }];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"var(--midnight)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", opacity:burst?0:1, transition:"opacity 0.8s ease" }}>
      <GoldDust count={16} dark/>
      <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center" }}>
        {/* 타이틀 — 언어 선택 후 위로 올라가며 페이드 */}
        <div style={{ opacity:picked?0:show?1:0, transform:picked?"translateY(-30px)":"translateY(0)", transition:"all 0.6s ease", marginBottom:"24px" }}>
          <div style={{ width:"1px", height:"40px", background:"linear-gradient(180deg,transparent,var(--gold))", margin:"0 auto 20px" }}/>
          <TitleSVG dark/>
          <div style={{ width:"clamp(40px,12vw,80px)", height:"1px", margin:"16px auto 0", background:"linear-gradient(90deg,transparent,var(--gold),transparent)" }}/>
        </div>

        {/* 보석함 */}
        <div style={{ position:"relative", width:"280px", height:"160px", marginBottom:"24px" }}>
          {/* Lid */}
          <div style={{
            position:"absolute", top:0, left:"-10px", width:"300px", height:"90px", zIndex:2,
            transform: langHover && !opening ? "translateY(-12px)" : "translateY(0)",
            transition: opening ? "none" : "transform 0.5s cubic-bezier(.34,1.56,.64,1)",
            animation: opening ? "lidFloat 0.8s cubic-bezier(.22,1,.36,1) forwards" : "none",
          }}>
            <img src="/images/jb_lid.webp" alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }}
              onError={e => { e.target.style.display="none"; e.target.parentElement.style.background="linear-gradient(135deg,#353060,#1a1a3e)"; e.target.parentElement.style.border="2px solid var(--gold)"; e.target.parentElement.style.borderRadius="6px 6px 0 0"; }}/>
          </div>
          {/* Glow */}
          <div style={{ position:"absolute", top:"68px", left:"50%", transform:"translateX(-50%)", width:"160px", height:"20px", background:"radial-gradient(ellipse,rgba(200,168,78,0.5),transparent)", borderRadius:"50%", opacity:langHover||opening?1:0, transition:"opacity 0.4s", zIndex:1 }}/>
          {/* Body */}
          <div style={{ position:"absolute", bottom:0, left:"0", width:"280px", height:"162px" }}>
            <img src="/images/jb_body.webp" alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }}
              onError={e => { e.target.style.display="none"; e.target.parentElement.style.background="linear-gradient(135deg,#1a1a3e,#12122e)"; e.target.parentElement.style.border="2px solid var(--gold)"; e.target.parentElement.style.borderRadius="4px 4px 8px 8px"; }}/>
          </div>
        </div>

        {/* 언어 선택 버튼 — 선택 후 아래로 내려가며 페이드 */}
        <div onMouseEnter={() => setLangHover(true)} onMouseLeave={() => setLangHover(false)}
          style={{ opacity:picked?0:show?1:0, transform:picked?"translateY(20px)":"translateY(0)", transition:"all 0.5s ease" }}>
          <p style={{ fontFamily:"var(--fd)", fontSize:"clamp(10px,1.3vw,12px)", color:"var(--gold)", marginBottom:"clamp(16px,3vw,24px)", fontWeight:600, letterSpacing:"5px", textAlign:"center" }}>SELECT LANGUAGE</p>
          <div style={{ display:"flex", gap:"clamp(8px,2vw,16px)", animation:show?"langFade 0.6s ease 0.4s both":"none" }}>
            {items.map((x,i) => (
              <button key={x.c} onClick={() => pick(x.c)} onMouseEnter={() => setHv(i)} onMouseLeave={() => setHv(-1)}
                style={{ padding:"clamp(10px,1.8vw,14px) clamp(18px,3vw,28px)", background:hv===i?"rgba(200,168,78,0.06)":"transparent", border:hv===i?"1px solid var(--gold)":"1px solid rgba(200,168,78,0.2)", cursor:"pointer", transition:"all 0.4s", color:hv===i?"var(--gold)":"var(--goldl)" }}>
                <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(14px,2vw,18px)", fontWeight:600, letterSpacing:"2px" }}>{x.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {burst && <div style={{ position:"fixed", top:"50%", left:"50%", borderRadius:"50%", background:"radial-gradient(circle,rgba(232,216,146,.95),rgba(200,168,78,.5),transparent)", zIndex:999, pointerEvents:"none", transform:"translate(-50%,-50%)", animation:"burstLight 1.5s ease-out forwards" }}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   BGM 플레이어
   ═══════════════════════════════════════════ */
function BGMPlayer({ audioRef }) {
  const [p, setP] = useState(true);
  const [v, setV] = useState(0.3);

  useEffect(() => {
    if (!audioRef?.current) return;
    audioRef.current.volume = v;
    if (p) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [p, v, audioRef]);

  return (
    <div style={{ position:"fixed", bottom:"clamp(12px,2vw,20px)", left:"clamp(12px,2vw,20px)", zIndex:900, display:"flex", alignItems:"center", gap:"8px", padding:"8px clamp(10px,1.5vw,14px)", background:"rgba(232,224,208,0.9)", backdropFilter:"blur(12px)", border:"1px solid var(--brd)", borderRadius:"24px" }}>
      <button onClick={() => setP(!p)} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontSize:"14px", padding:"2px" }}>{p ? "⏸" : "▶"}</button>
      <input type="range" min="0" max="1" step="0.05" value={v} onChange={e => setV(+e.target.value)} style={{ width:"48px", accentColor:"var(--gold)", cursor:"pointer", opacity:0.7 }}/>
      <span style={{ fontSize:"10px", color:"var(--txd)", letterSpacing:"1px" }}>BGM</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Gem Chain 네비게이션 (우측 세로)
   ═══════════════════════════════════════════ */
function GemChain({ cur, total, onGo }) {
  const t = useT();
  return (
    <div className="gem-chain-wrap" style={{ position:"fixed", right:"clamp(10px,1.5vw,18px)", top:"50%", transform:"translateY(-50%)", zIndex:800, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          <button onClick={() => onGo(i)} style={{ position:"relative", width:cur===i?"14px":"9px", height:cur===i?"14px":"9px", borderRadius:"50%", border:`1.5px solid ${cur===i?"var(--gold)":"var(--goldd)"}`, background:cur===i?"var(--gold)":"transparent", cursor:"pointer", transition:"all 0.4s", boxShadow:cur===i?"0 0 10px rgba(200,168,78,0.4)":"none", padding:0 }}>
            <span className="gem-tip" style={{ position:"absolute", right:"22px", top:"50%", transform:"translateY(-50%)", fontSize:"10px", color:"var(--tx)", whiteSpace:"nowrap", opacity:cur===i?1:0, transition:"opacity 0.3s", pointerEvents:"none", background:"var(--bgc)", padding:"2px 8px", borderRadius:"6px", border:"1px solid var(--brd)", letterSpacing:"1px" }}>{t.nav[i]}</span>
          </button>
          {i < total - 1 && <div style={{ width:"1px", height:"8px", background:"var(--gold)", opacity:0.2 }}/>}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 1 — 히어로
   ═══════════════════════════════════════════ */
function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);
  const l = useLang();
  const hf = l === "ko" ? "var(--fk)" : "var(--fd)";
  const copy = { ko:["정략결혼의 시대는 끝났다.","진정한 사랑의 시대가 시작된다."], en:["The age of political marriage is over.","The age of true love begins."], ja:["政略結婚の時代は終わった。","真の愛の時代が始まる。"] };
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background:"var(--bg)" }}>
      <GoldDust count={15}/>
      <div style={{ position:"relative", zIndex:2, textAlign:"center", opacity:show?1:0, transform:show?"translateY(0)":"translateY(20px)", transition:"all 1s ease" }}>
        <div style={{ width:"1px", height:"44px", background:"linear-gradient(180deg,transparent,var(--gold))", margin:"0 auto 28px" }}/>
        <TitleSVG/>
        <div style={{ width:"clamp(60px,20vw,120px)", height:"1px", margin:"20px auto", background:"linear-gradient(90deg,transparent,var(--gold),transparent)" }}/>
        <p style={{ fontFamily:"var(--fd)", fontSize:"clamp(14px,2.5vw,20px)", color:"var(--tx2)", lineHeight:1.8, maxWidth:"500px", margin:"0 auto", fontStyle:"italic", fontWeight:400 }}>{copy[l][0]}<br/>{copy[l][1]}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 2 — 캐릭터 (겹친 카드 덱 → 호버 리빌 → 누끼 팝업)
   ═══════════════════════════════════════════ */
function CharModal({ c, onClose }) {
  const t = useT();
  const l = useLang();
  const mob = useIsMobile();
  const hf = l === "ko" ? "var(--fk)" : "var(--fd)";
  if (!c) return null;
  const imgSrc = c.modalImg || c.img;
  const enName = (CHARS.en.find(e => e.img === c.img) || {}).gem || c.gem;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, background:"#0C1A2E", animation:"fadeIn 0.3s ease", overflow:"hidden" }}>
      {/* 고스트 이미지 */}
      {imgSrc && <img src={imgSrc} alt="" style={{ position:"absolute", bottom:mob?"-10%":"-5%", left:mob?"50%":"clamp(120px,25vw,300px)", transform:mob?"translateX(-50%)":"none", height:mob?"100%":"115%", objectFit:"contain", opacity:mob?0.12:0.15, pointerEvents:"none" }}/>}
      {/* 그라데이션 오버레이 */}
      <div style={{ position:"absolute", inset:0, background:mob
        ? "linear-gradient(180deg,rgba(12,26,46,0.5) 0%,transparent 25%,rgba(12,26,46,0.3) 55%,rgba(12,26,46,0.95) 85%)"
        : "linear-gradient(90deg,rgba(12,26,46,0.5) 0%,rgba(12,26,46,0.1) 35%,rgba(12,26,46,0.4) 65%,rgba(12,26,46,0.7) 100%), linear-gradient(180deg,rgba(12,26,46,0.4) 0%,transparent 30%,rgba(12,26,46,0.3) 70%,rgba(12,26,46,0.95) 100%)" }}/>

      {/* 닫기 버튼 */}
      <button onClick={onClose} style={{ position:"absolute", top:"12px", right:"12px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontSize:"18px", cursor:"pointer", zIndex:20, width:"36px", height:"36px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>✕</button>

      {/* 메인 캐릭터 이미지 */}
      <div onClick={e => e.stopPropagation()} style={mob
        ? { position:"absolute", bottom:"clamp(160px,30vh,220px)", left:"50%", transform:"translateX(-50%)", height:"clamp(280px,50vh,400px)", zIndex:5, animation:"fadeUp 0.5s ease" }
        : { position:"absolute", bottom:"clamp(50px,8vh,90px)", left:"clamp(100px,25vw,260px)", height:"clamp(450px,82vh,780px)", zIndex:5, animation:"fadeUp 0.5s ease" }
      }>
        {imgSrc
          ? <img src={imgSrc} alt={c.gem} style={{ height:"100%", objectFit:"contain", filter:`drop-shadow(0 8px 30px rgba(0,0,0,0.5)) drop-shadow(0 0 40px ${c.color}25)` }}/>
          : <div style={{ height:"100%", aspectRatio:"2/3", background:c.gemBg, borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"var(--fd)", fontSize:mob?"48px":"80px", fontWeight:700, color:"rgba(255,255,255,0.25)" }}>{c.gem[0]}</span>
            </div>
        }
      </div>

      {/* 캐릭터 이름 */}
      <div style={mob
        ? { position:"absolute", left:"50%", transform:"translateX(-50%)", bottom:"clamp(150px,28vh,210px)", zIndex:8, textAlign:"center", animation:"fadeUp 0.6s ease 0.1s both" }
        : { position:"absolute", right:"clamp(80px,18vw,240px)", top:"clamp(40%,45%,50%)", transform:"translateY(-50%)", zIndex:8, textAlign:"right", animation:"fadeUp 0.6s ease 0.1s both" }
      }>
        <div style={{ fontFamily:"var(--fs)", fontSize:mob?"clamp(32px,10vw,48px)":"clamp(48px,10vw,96px)", fontWeight:400, color:"#fff", lineHeight:1, letterSpacing:mob?"1px":"clamp(2px,0.5vw,6px)", textShadow:`0 4px 30px rgba(0,0,0,0.7), 0 0 60px ${c.color}20`, opacity:0.95 }}>{enName}</div>
        <div style={{ width:mob?"40px":"clamp(40px,8vw,80px)", height:"2px", background:c.color, margin:mob?"8px auto 0":"12px 0 0 auto", opacity:0.6 }}/>
      </div>

      {/* 대사창 */}
      <div onClick={e => e.stopPropagation()} style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:10, padding:mob?"0 12px 12px":"0 clamp(16px,4vw,40px) clamp(20px,3vw,32px)" }}>
        <div style={{ background:"rgba(12,26,46,0.88)", backdropFilter:"blur(16px)", border:`1px solid ${c.color}22`, borderRadius:"12px", padding:mob?"14px":"clamp(16px,3vw,24px)", maxHeight:mob?"clamp(120px,22vh,160px)":"clamp(130px,22vh,180px)", overflowY:"auto" }} className="iscroll">
          {c.mystery
            ? <div style={{ color:"rgba(255,255,255,0.3)", fontSize:mob?"14px":"16px", letterSpacing:"4px", textAlign:"center" }}>■■■■■■ ■■■ ■■■■ ■■■■■■■■</div>
            : <>
                <div style={{ fontSize:mob?"11px":"12px", color:c.color, fontWeight:600, letterSpacing:"1px", marginBottom:mob?"8px":"10px" }}>{c.gem}</div>
                <div style={{ display:"flex", gap:mob?"10px":"clamp(12px,3vw,24px)", flexWrap:"wrap", marginBottom:mob?"8px":"12px" }}>
                  {[{ label:t.per, v:c.per },{ label:t.tone, v:c.tone },{ label:t.goal, v:c.goal }].map((x,i) => (
                    <div key={i} style={{ flex:mob?"1 1 100%":"1 1 140px" }}>
                      <span style={{ fontSize:mob?"9px":"10px", color:c.color, letterSpacing:"2px", fontWeight:600 }}>{x.label}</span>
                      <p style={{ fontSize:mob?"12px":"clamp(12px,1.5vw,14px)", color:"rgba(232,224,208,0.85)", lineHeight:1.6, fontWeight:300, marginTop:"2px" }}>{x.v}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize:mob?"13px":"clamp(13px,1.6vw,15px)", lineHeight:1.8, fontWeight:400, fontStyle:"italic", color:"rgba(232,224,208,0.95)", borderTop:"1px solid rgba(200,168,78,0.15)", paddingTop:"10px" }}>{c.intro}</p>
              </>
          }
        </div>
      </div>
    </div>
  );
}

function Chars({ onOpen }) {
  const t = useT(), l = useLang();
  const mob = useIsMobile();
  const allChars = CHARS[l];
  const enChars = CHARS.en;
  const [revealed, setRevealed] = useState(new Set());
  const [hv, setHv] = useState(-1);
  const blueOwl = { ko:"블루 아울", en:"Blue Owl", ja:"ブルーアウル" };

  const reveal = (idx) => { setHv(idx); setRevealed(prev => { const s = new Set(prev); s.add(idx); return s; }); };
  const cW = mob ? "clamp(70px,20vw,95px)" : "clamp(160px,28vw,220px)";
  const cM = mob ? "clamp(-22px,-5vw,-32px)" : "clamp(-60px,-12vw,-85px)";
  const nSize = mob ? "clamp(8px,2.2vw,10px)" : "clamp(11px,1.6vw,15px)";
  const nBot = mob ? "-20px" : "-28px";
  const hvUp = mob ? "translateY(-10px) scale(1.04)" : "translateY(-20px) scale(1.06)";
  const boW = mob ? "clamp(60px,16vw,80px)" : "clamp(120px,20vw,160px)";

  const boImg = "/images/chars/bo_pp.webp";
  const boRevealed = revealed.has(99);
  const boHovered = hv === 99;
  const row1 = allChars.slice(0, 4);
  const row2 = allChars.slice(4, 8);

  const renderChar = (c, idx) => {
    const isRevealed = revealed.has(idx);
    const isHovered = hv === idx;
    const enName = enChars[idx] ? enChars[idx].gem : "???";
    return (
      <div key={idx}
        onMouseEnter={() => reveal(idx)} onMouseLeave={() => setHv(-1)}
        onClick={() => { reveal(idx); onOpen(c); }}
        style={{
          width:cW, aspectRatio:"2/3",
          cursor:"pointer", flexShrink:0, position:"relative",
          marginLeft: idx % 4 === 0 ? 0 : cM,
          filter: isHovered
            ? `drop-shadow(0 8px 16px rgba(0,0,0,0.25)) drop-shadow(0 0 12px ${c.color}40)`
            : isRevealed ? "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
          transform: isHovered ? hvUp : "translateY(0) scale(1)",
          transition: "all 0.4s cubic-bezier(.34,1.56,.64,1)",
          zIndex: isHovered ? 20 : idx % 4,
        }}>
        {c.img
          ? <img src={c.img} alt={c.mystery?"???":c.gem} style={{ width:"100%", height:"100%", objectFit:"contain", filter: isRevealed ? "grayscale(0) brightness(1)" : "grayscale(1) brightness(0.12) contrast(1.5)", transition:"filter 0.6s ease" }}/>
          : <div style={{ width:"100%", height:"100%", background:c.gemBg, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", filter: isRevealed ? "grayscale(0) brightness(1)" : "grayscale(1) brightness(0.12) contrast(1.5)", transition:"filter 0.6s ease" }}>
              <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(28px,6vw,42px)", fontWeight:700, color:"rgba(255,255,255,0.4)" }}>{c.mystery?"?":c.gem[0]}</span>
            </div>
        }
        <div style={{ position:"absolute", bottom:nBot, left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", opacity: isRevealed ? 1 : 0, transition:"opacity 0.4s", textAlign:"center" }}>
          <div style={{ fontFamily:"var(--fs)", fontSize:nSize, fontWeight:400, color: isHovered ? c.color : "var(--tx)", transition:"color 0.3s", textShadow:"0 1px 3px rgba(232,224,208,0.8)" }}>{enName}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", background:"var(--bg2)" }}>
      <div style={{ padding:"clamp(20px,3vw,32px) clamp(12px,3vw,16px) 0", flexShrink:0 }}>
        <STitle sub={t.charS} main={t.charT}/>
        <p style={{ fontSize:"clamp(11px,1.4vw,13px)", color:"var(--tx2)", textAlign:"center", marginTop:"-20px", marginBottom:"clamp(4px,1vw,8px)", fontWeight:300 }}>{t.charTap}</p>
      </div>
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:"clamp(8px,1.5vw,16px) clamp(12px,3vw,16px) 60px", gap:"0" }} className="iscroll">

        {/* 블루 아울 — MC, 상단 단독 배치 */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:mob?"12px":"20px" }}>
          <div
            onMouseEnter={() => reveal(99)} onMouseLeave={() => setHv(-1)}
            onClick={() => { reveal(99); onOpen({ gem:blueOwl[l], per:{ ko:"보석함 파티 진행 MC",en:"Jewel Box Party MC",ja:"宝石箱パーティー MC" }[l], tone:"—", goal:"—", intro:{ ko:"귀여운 부엉이 홀로그램. 호감도 투표 관리, 이벤트 생성, 보석함 실황 전국 방영, 정보 안내를 담당한다.", en:"A cute owl hologram managing votes, events, broadcasting, and information.", ja:"可愛いフクロウのホログラム。投票管理、イベント生成、実況放映、情報案内を担当する。" }[l], color:"#6CBEEB", gemBg:"radial-gradient(circle at 40% 35%,#9dd5f5,#6CBEEB,#3a8bbf)", img:boImg, modalImg:boImg }); }}
            style={{
              width:boW, aspectRatio:"2/3", cursor:"pointer", position:"relative",
              filter: boHovered
                ? "drop-shadow(0 8px 16px rgba(0,0,0,0.25)) drop-shadow(0 0 12px rgba(108,190,235,0.4))"
                : boRevealed ? "drop-shadow(0 4px 8px rgba(108,190,235,0.2))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
              transform: boHovered ? hvUp : "translateY(0) scale(1)",
              transition: "all 0.4s cubic-bezier(.34,1.56,.64,1)",
            }}>
            <img src={boImg} alt={blueOwl[l]} style={{ width:"100%", height:"100%", objectFit:"contain", filter: boRevealed ? "grayscale(0) brightness(1)" : "grayscale(1) brightness(0.12) contrast(1.5)", transition:"filter 0.6s ease" }}/>
            <div style={{ position:"absolute", bottom:nBot, left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", opacity: boRevealed ? 1 : 0, transition:"opacity 0.4s", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--fs)", fontSize:nSize, fontWeight:400, color:"#6CBEEB" }}>Blue Owl</div>
            </div>
          </div>
          <div style={{ fontSize:mob?"9px":"11px", color:"var(--gold)", letterSpacing:"3px", fontWeight:600, marginTop:mob?"24px":"32px" }}>MC</div>
        </div>

        {/* 구분선 */}
        <div style={{ width:"clamp(40px,12vw,80px)", height:"1px", background:"linear-gradient(90deg,transparent,var(--gold),transparent)", margin:mob?"8px auto 16px":"12px auto 24px" }}/>

        {/* 출연자 1열 (4명) */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", marginBottom:mob?"28px":"40px" }}>
          {row1.map((c, i) => renderChar(c, i))}
        </div>

        {/* 출연자 2열 (4명) */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          {row2.map((c, i) => renderChar(c, i + 4))}
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 3 — 세계관 (인터랙티브 맵 + 9왕국)
   ═══════════════════════════════════════════ */
/* 왕국 모달 */
function KingdomModal({ k, onClose }) {
  const l = useLang();
  const hf = l === "ko" ? "var(--fk)" : "var(--fd)";
  if (!k) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(12,26,46,0.75)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.3s ease", padding:"clamp(12px,3vw,20px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:"400px", background:"var(--bgc)", border:`2px solid ${k.color}44`, borderRadius:"16px", overflow:"hidden", position:"relative", animation:"fadeUp 0.4s ease" }}>
        <button onClick={onClose} style={{ position:"absolute", top:"12px", right:"14px", background:"rgba(255,255,255,0.7)", border:"none", color:"var(--tx2)", fontSize:"18px", cursor:"pointer", zIndex:10, width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        {/* Kingdom image */}
        <div style={{ width:"100%", aspectRatio:"16/9", overflow:"hidden", borderBottom:"1px solid var(--brd)" }}>
          {k.img
            ? <img src={k.img} alt={k.n} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,${k.color}20,var(--bgc))`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"var(--fd)", fontSize:"36px", fontWeight:700, color:`${k.color}30` }}>{k.n[0]}</span>
              </div>
          }
        </div>
        <div style={{ padding:"clamp(20px,4vw,28px)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:k.color, boxShadow:`0 0 8px ${k.color}60` }}/>
            <h3 style={{ fontFamily:hf, fontSize:"clamp(20px,3.5vw,26px)", fontWeight:700, color:"var(--midnight)" }}>{k.n}</h3>
          </div>
          <div style={{ fontSize:"clamp(11px,1.4vw,13px)", color:k.color, letterSpacing:"1px", fontWeight:600, marginBottom:"12px" }}>{k.d}</div>
          <p style={{ fontSize:"clamp(13px,1.6vw,15px)", color:"var(--tx2)", lineHeight:1.8, fontWeight:300 }}>{k.detail}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 3 — 세계관 (섬 방사형 + 9왕국, 통합 스크롤)
   ═══════════════════════════════════════════ */
function World({ onKingdom }) {
  const t = useT(), l = useLang();
  const hf = l === "ko" ? "var(--fk)" : "var(--fd)";
  const locs = LOCATIONS[l], kings = KINGDOMS[l], events = EVENTS[l];
  const [selLoc, setSelLoc] = useState(null);
  const [hvLoc, setHvLoc] = useState(-1);
  const [hvK, setHvK] = useState(-1);
  const [selEvt, setSelEvt] = useState(null);
  const [hvEvt, setHvEvt] = useState(-1);

  const centerLoc = locs.find(l => l.center);
  const outerLocs = locs.filter(l => !l.center);
  const locAngles = [0, 60, 120, 180, 240, 300];

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", background:"var(--bg)" }}>
      <div style={{ padding:"clamp(20px,3vw,28px) clamp(12px,3vw,16px) 0", flexShrink:0 }}>
        <STitle sub={t.worldS} main={t.worldT}/>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 clamp(12px,3vw,16px) 44px", maxWidth:"760px", margin:"0 auto", width:"100%" }} className="iscroll">

        {/* ── 섬 지역: 방사형 카드 ── */}
        <p style={{ fontSize:"clamp(11px,1.4vw,13px)", color:"var(--tx2)", textAlign:"center", marginBottom:"clamp(8px,1.5vw,14px)", fontWeight:300 }}>{t.worldDesc}</p>
        <div style={{ position:"relative", width:"clamp(240px,55vw,320px)", aspectRatio:"1/1", margin:"0 auto clamp(12px,2vw,20px)" }}>
          {centerLoc && (
            <button onClick={() => setSelLoc(selLoc===0?null:0)} onMouseEnter={() => setHvLoc(0)} onMouseLeave={() => setHvLoc(-1)}
              style={{ position:"absolute", top:"50%", left:"50%", transform:`translate(-50%,-50%) ${hvLoc===0?"scale(1.08)":"scale(1)"}`, width:"clamp(68px,17vw,90px)", height:"clamp(68px,17vw,90px)", borderRadius:"50%", border:selLoc===0?"2px solid var(--gold)":"2px solid var(--brd)", background:selLoc===0?"rgba(200,168,78,0.12)":"var(--bgc)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"2px", transition:"all 0.3s", boxShadow:selLoc===0?"0 0 24px rgba(200,168,78,0.3)":"0 2px 12px rgba(0,0,0,0.06)", zIndex:5, padding:0 }}>
              <span style={{ fontSize:"clamp(18px,4vw,24px)" }}>{centerLoc.ic}</span>
              <span style={{ fontSize:"clamp(8px,1.2vw,10px)", color:selLoc===0?"var(--gold)":"var(--tx)", fontWeight:600 }}>{centerLoc.n}</span>
            </button>
          )}
          <svg viewBox="0 0 400 400" style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }}>
            {outerLocs.map((_, i) => { const rad = (locAngles[i] - 90) * Math.PI / 180; return <line key={i} x1="200" y1="200" x2={200 + 140 * Math.cos(rad)} y2={200 + 140 * Math.sin(rad)} stroke="var(--gold)" strokeWidth="0.5" opacity="0.15"/>; })}
          </svg>
          {outerLocs.map((loc, i) => {
            const rad = (locAngles[i] - 90) * Math.PI / 180; const r = 38;
            const cx = 50 + r * Math.cos(rad), cy = 50 + r * Math.sin(rad);
            const idx = i + 1; const active = selLoc === idx;
            return (
              <button key={i} onClick={() => setSelLoc(active?null:idx)} onMouseEnter={() => setHvLoc(idx)} onMouseLeave={() => setHvLoc(-1)}
                style={{ position:"absolute", left:`${cx}%`, top:`${cy}%`, transform:`translate(-50%,-50%) ${hvLoc===idx?"scale(1.1)":"scale(1)"}`, width:"clamp(52px,13vw,68px)", height:"clamp(52px,13vw,68px)", borderRadius:"50%", border:active?"2px solid var(--gold)":"1.5px solid var(--brd)", background:active?"rgba(200,168,78,0.1)":"var(--bgc)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1px", transition:"all 0.3s", boxShadow:active?"0 0 16px rgba(200,168,78,0.25)":"0 2px 8px rgba(0,0,0,0.05)", zIndex:3, padding:0 }}>
                <span style={{ fontSize:"clamp(12px,3vw,16px)" }}>{loc.ic}</span>
                <span style={{ fontSize:"clamp(7px,1vw,9px)", color:active?"var(--gold)":"var(--tx2)", fontWeight:500, lineHeight:1.2 }}>{loc.n}</span>
              </button>
            );
          })}
        </div>
        {selLoc !== null && (
          <div style={{ maxWidth:"340px", margin:"-4px auto clamp(16px,3vw,24px)", background:"var(--bgc)", border:"1px solid var(--brd)", borderRadius:"12px", padding:"12px 16px", animation:"fadeUp 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
              <span style={{ fontSize:"16px" }}>{locs[selLoc].ic}</span>
              <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(14px,2vw,17px)", fontWeight:700, color:"var(--midnight)" }}>{locs[selLoc].n}</span>
            </div>
            <p style={{ fontSize:"clamp(11px,1.4vw,13px)", color:"var(--tx2)", lineHeight:1.7, fontWeight:300 }}>{locs[selLoc].d}</p>
          </div>
        )}

        {/* ── 구분선 ── */}
        <div style={{ width:"40px", height:"1px", background:"linear-gradient(90deg,transparent,var(--gold),transparent)", margin:"clamp(16px,3vw,24px) auto" }}/>

        {/* ── 9왕국: 3×3 그리드 ── */}
        <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(11px,1.5vw,13px)", letterSpacing:"6px", color:"var(--gold)", textAlign:"center", marginBottom:"12px", fontWeight:600 }}>{t.kingdomsS}</div>
        <h3 style={{ fontFamily:hf, fontSize:"clamp(18px,3vw,24px)", fontWeight:700, textAlign:"center", color:"var(--midnight)", marginBottom:"clamp(16px,3vw,24px)" }}>{t.kingdoms}</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"clamp(8px,1.5vw,14px)" }}>
          {kings.map((k, i) => (
            <div key={i} onClick={() => onKingdom(k)} onMouseEnter={() => setHvK(i)} onMouseLeave={() => setHvK(-1)}
              style={{ cursor:"pointer", background:"var(--bgc)", border:hvK===i?`1.5px solid ${k.color}`:"1.5px solid var(--brd)", borderRadius:"12px", overflow:"hidden", transition:"all 0.3s", transform:hvK===i?"translateY(-4px)":"translateY(0)", boxShadow:hvK===i?"0 8px 24px rgba(0,0,0,0.08)":"0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ width:"100%", aspectRatio:"1/1", overflow:"hidden", borderBottom:"1px solid var(--brd)", position:"relative" }}>
                {k.img
                  ? <img src={k.img} alt={k.n} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,${k.color}18,var(--bgc))`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(22px,5vw,36px)", fontWeight:700, color:`${k.color}25` }}>{k.n[0]}</span>
                    </div>
                }
                <div style={{ position:"absolute", bottom:"4px", left:"4px", width:"8px", height:"8px", borderRadius:"50%", background:k.color, boxShadow:`0 0 6px ${k.color}50` }}/>
              </div>
              <div style={{ padding:"clamp(8px,1.5vw,12px)" }}>
                <div style={{ fontFamily:hf, fontSize:"clamp(11px,1.6vw,14px)", fontWeight:700, color:"var(--midnight)", marginBottom:"2px", lineHeight:1.3 }}>{k.n}</div>
                <p style={{ fontSize:"clamp(9px,1.2vw,11px)", color:"var(--tx2)", fontWeight:300, lineHeight:1.4 }}>{k.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 구분선 ── */}
        <div style={{ width:"40px", height:"1px", background:"linear-gradient(90deg,transparent,var(--gold),transparent)", margin:"clamp(20px,4vw,32px) auto" }}/>

        {/* ── 이벤트: 카드형 아코디언 ── */}
        <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(11px,1.5vw,13px)", letterSpacing:"6px", color:"var(--gold)", textAlign:"center", marginBottom:"12px", fontWeight:600 }}>{t.evtS}</div>
        <h3 style={{ fontFamily:hf, fontSize:"clamp(18px,3vw,24px)", fontWeight:700, textAlign:"center", color:"var(--midnight)", marginBottom:"clamp(16px,3vw,24px)" }}>{t.evtT}</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:"clamp(8px,1.5vw,12px)", maxWidth:"520px", margin:"0 auto" }}>
          {events.map((ev, i) => {
            const isOpen = selEvt === i;
            return (
              <div key={i} onClick={() => setSelEvt(isOpen ? null : i)} onMouseEnter={() => setHvEvt(i)} onMouseLeave={() => setHvEvt(-1)}
                style={{ background: isOpen ? "rgba(200,168,78,0.1)" : "var(--bgc)", border: isOpen ? "1.5px solid var(--gold)" : hvEvt===i ? "1.5px solid rgba(200,168,78,0.4)" : "1.5px solid var(--brd)", borderRadius:"14px", padding:"clamp(14px,2.5vw,20px)", cursor:"pointer", transition:"all 0.3s", transform:hvEvt===i?"translateX(4px)":"translateX(0)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"clamp(10px,2vw,14px)" }}>
                  <div style={{ width:"clamp(36px,8vw,48px)", height:"clamp(36px,8vw,48px)", borderRadius:"50%", background: isOpen ? "rgba(200,168,78,0.15)" : "rgba(200,168,78,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"clamp(16px,3vw,22px)", flexShrink:0, border:"1px solid var(--brd)" }}>{ev.ic}</div>
                  <div style={{ flex:1 }}>
                    <h4 style={{ fontFamily:hf, fontSize:"clamp(15px,2.5vw,19px)", fontWeight:700, color: isOpen ? "var(--gold)" : "var(--midnight)", marginBottom:isOpen?"6px":"0", transition:"color 0.3s" }}>{ev.n}</h4>
                    {isOpen && (
                      <p style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", lineHeight:1.8, fontWeight:300, animation:"fadeUp 0.3s ease" }}>{ev.d}</p>
                    )}
                  </div>
                  <div style={{ fontSize:"12px", color:"var(--gold)", opacity:isOpen?1:0.4, transition:"all 0.3s", transform:isOpen?"rotate(90deg)":"rotate(0)", flexShrink:0 }}>▶</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 4 — 시스템 가이드
   ═══════════════════════════════════════════ */
function System() {
  const t = useT();
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px)", background:"var(--bg)" }}>
      <div style={{ maxWidth:"680px", width:"100%" }}>
        <STitle sub={t.sysS} main={t.sysT}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))", gap:"14px", marginBottom:"clamp(28px,5vw,44px)" }}>
          {[{ l:t.sm, d:t.smd, ic:"📖" },{ l:t.fm, d:t.fmd, ic:"💎" }].map((m,i) => (
            <div key={i} style={{ padding:"clamp(18px,3vw,24px)", background:"var(--bgc)", border:"1px solid var(--brd)", borderRadius:"12px" }}>
              <div style={{ fontSize:"24px", marginBottom:"10px" }}>{m.ic}</div>
              <h3 style={{ fontFamily:"var(--fd)", fontSize:"clamp(16px,2vw,19px)", fontWeight:700, marginBottom:"8px", color:"var(--midnight)" }}>{m.l}</h3>
              <p style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", lineHeight:1.8, fontWeight:300 }}>{m.d}</p>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(10px,1.3vw,12px)", letterSpacing:"4px", color:"var(--gold)", textAlign:"center", marginBottom:"16px", fontWeight:600 }}>{t.cmdL}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {[{ c:t.c1, d:t.c1d },{ c:t.c2, d:t.c2d },{ c:t.c3, d:t.c3d },{ c:t.c4, d:t.c4d }].map((x,i) => (
            <div key={i} style={{ display:"flex", gap:"clamp(8px,2vw,14px)", alignItems:"baseline", padding:"12px clamp(12px,2vw,16px)", background:"var(--bgc)", border:"1px solid var(--brd)", borderRadius:"8px", flexWrap:"wrap" }}>
              <code style={{ fontFamily:"monospace", fontSize:"clamp(12px,1.5vw,14px)", color:"var(--gold)", fontWeight:600, background:"rgba(200,168,78,0.08)", padding:"3px 8px", borderRadius:"4px", flexShrink:0 }}>{x.c}</code>
              <span style={{ fontSize:"clamp(11px,1.4vw,13px)", color:"var(--tx2)", fontWeight:300, lineHeight:1.6 }}>{x.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 6 — CTA
   ═══════════════════════════════════════════ */
function CTA() {
  const t = useT();
  const l = useLang();
  const hf = l === "ko" ? "var(--fk)" : "var(--fd)";
  const [hv, setHv] = useState(false);
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", padding:"0 clamp(12px,3vw,16px)", background:"var(--bg)" }}>
      <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"min(450px,90vw)", height:"250px", background:"radial-gradient(ellipse at center bottom,rgba(200,168,78,0.08) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:2, textAlign:"center" }}>
        <div style={{ width:"1px", height:"40px", background:"linear-gradient(180deg,transparent,var(--gold))", margin:"0 auto 28px" }}/>
        <div style={{ fontFamily:hf, fontSize:"clamp(22px,4vw,38px)", fontWeight:700, color:"var(--midnight)", marginBottom:"clamp(28px,5vw,44px)" }}>{t.ctaT}</div>
        <button onMouseEnter={() => setHv(true)} onMouseLeave={() => setHv(false)} onClick={() => alert("URL 추후 삽입")}
          style={{ padding:"clamp(14px,2vw,18px) clamp(40px,8vw,64px)", background:hv?"var(--gold)":"transparent", border:"2px solid var(--gold)", color:hv?"var(--midnight)":"var(--gold)", fontFamily:"var(--fd)", fontSize:"clamp(15px,2vw,18px)", fontWeight:600, letterSpacing:"clamp(2px,0.5vw,4px)", cursor:"pointer", transition:"all 0.4s", borderRadius:"40px" }}>{t.ctaB}</button>
        <p style={{ fontSize:"clamp(9px,1.2vw,11px)", color:"var(--txd)", marginTop:"20px", letterSpacing:"1px" }}>{t.ctaN}</p>
      </div>
      <div style={{ position:"absolute", bottom:"20px", width:"100%", textAlign:"center", fontSize:"clamp(9px,1.2vw,11px)", color:"var(--txd)", letterSpacing:"2px" }}>{t.credit}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */
const SECS = [Hero, Chars, World, System, CTA];
const TOTAL = SECS.length;

export default function App() {
  const [lang, setLang] = useState(null);
  const [cur, setCur] = useState(0);
  const [modal, setModal] = useState(null);
  const [kModal, setKModal] = useState(null);
  const tr = useRef(false);
  const audioRef = useRef(null);

  const startBGM = () => {
    if (audioRef.current) return;
    const a = new Audio("/bgm.mp3");
    a.loop = true; a.volume = 0.3;
    a.play().catch(() => {});
    audioRef.current = a;
  };

  const pickLang = (l) => {
    setLang(l);
    document.body.style.background = "var(--bg)";
  };

  const anyModal = modal || kModal;
  const goTo = useCallback(i => {
    if (i < 0 || i >= TOTAL || tr.current) return;
    tr.current = true; setCur(i);
    setTimeout(() => { tr.current = false; }, 850);
  }, []);

  useEffect(() => {
    if (!lang) return;
    const onW = e => {
      if (anyModal) return;
      const s = e.target.closest('.iscroll');
      if (s) {
        const { scrollTop: t, scrollHeight: h, clientHeight: c } = s;
        if (e.deltaY > 0 && t + c < h - 4) return;
        if (e.deltaY < 0 && t > 4) return;
      }
      e.preventDefault();
      if (e.deltaY > 0) goTo(cur + 1); else if (e.deltaY < 0) goTo(cur - 1);
    };
    let ty = 0, tEl = null, scrolled = false, startST = 0;
    const tS = e => { ty = e.touches[0].clientY; tEl = e.target.closest ? e.target.closest('.iscroll') : null; scrolled = false; startST = tEl ? tEl.scrollTop : 0; };
    const tM = () => { if (tEl && tEl.scrollTop !== startST) scrolled = true; };
    const tE = e => {
      if (anyModal) return;
      const d = ty - e.changedTouches[0].clientY;
      if (Math.abs(d) < 100) return;
      if (tEl) { const { scrollTop: t, scrollHeight: h, clientHeight: c } = tEl; if (d > 0 && t + c < h - 8) return; if (d < 0 && t > 8) return; if (scrolled) return; }
      if (d > 0) goTo(cur + 1); else goTo(cur - 1);
    };
    const kD = e => {
      if (anyModal) return;
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); goTo(cur + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); goTo(cur - 1); }
    };
    window.addEventListener("wheel", onW, { passive: false });
    window.addEventListener("touchstart", tS, { passive: true });
    window.addEventListener("touchmove", tM, { passive: true });
    window.addEventListener("touchend", tE, { passive: true });
    window.addEventListener("keydown", kD);
    return () => { window.removeEventListener("wheel", onW); window.removeEventListener("touchstart", tS); window.removeEventListener("touchmove", tM); window.removeEventListener("touchend", tE); window.removeEventListener("keydown", kD); };
  }, [lang, cur, goTo, anyModal]);

  if (!lang) return <LangSelect onPick={pickLang} onStartBGM={startBGM}/>;

  const secProps = (S, i) => {
    if (S === Chars) return { onOpen: setModal };
    if (S === World) return { onKingdom: setKModal };
    return {};
  };

  return (
    <LangCtx.Provider value={lang}>
      <div style={{ width:"100vw", height:"var(--vh)", overflow:"hidden", background:"var(--bg)", position:"relative" }}>
        <BGMPlayer audioRef={audioRef}/>
        <GemChain cur={cur} total={TOTAL} onGo={goTo}/>
        <div style={{ transform:`translateY(calc(-${cur} * var(--vh)))`, transition:"transform 0.8s cubic-bezier(0.65,0,0.35,1)", height:`calc(${TOTAL} * var(--vh))` }}>
          {SECS.map((S, i) => (
            <div key={i} style={{ height:"var(--vh)", width:"100vw", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"relative", zIndex:1, height:"100%" }}><S {...secProps(S, i)}/></div>
              {i < TOTAL - 1 && <ScrollDown/>}
            </div>
          ))}
        </div>
        <CharModal c={modal} onClose={() => setModal(null)}/>
        <KingdomModal k={kModal} onClose={() => setKModal(null)}/>
      </div>
    </LangCtx.Provider>
  );
}
