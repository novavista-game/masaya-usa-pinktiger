/* ==========================================================================
   Masaya USA Pinktiger - Interactive Enhancements & Multi-language Support
   ========================================================================== */

// 1. Multilingual Translation Database
const translations = {
  en: {
    "nav-home": "Home",
    "nav-about": "About Masaya",
    "nav-mascot": "Our Mascot",
    "nav-support": "Support & Channels",
    "hero-title": "Masaya USA Pinktiger <img src=\"./assets/pinktiger.png?v=4\" alt=\"Pinktiger Mascot\" class=\"custom-hero-mascot emoji-bounce\"><span class=\"emoji-pulse\">💖</span>",
    "hero-subtitle": "Experience the voice, vibes, and humanity of Masaya.",
    "hero-tagline": "The US fanbase dedicated to supporting Japanese vocalist Masaya Horikawa's global journey.",
    "hero-btn-join": "Join the Pride 🎀",
    "hero-btn-learn": "Learn More 🐯",
    "video-caption": "<span class=\"label\">Featured Performance:</span> Masaya singing \"첫눈처럼 너에게 가겠다 (I Will Go to You Like the First Snow)\" with English lyrics ❄️🎶",
    "about-section-title": "Masaya's Journey 🐯✨",
    "about-bio-h3": "The Voice that Crosses Borders",
    "about-bio-p1": "<strong>Masaya Horikawa (堀川雅也)</strong> is a powerhouse vocalist from Japan whose emotional range and brilliant stage presence have captured hearts across Asia. Known for his flawless pitch, soaring high notes, and passionate deliveries, he brings a deep sense of vulnerability to every song he sings.",
    "about-bio-p2": "His participation in high-profile singing programs like Japan's <em>THE Karaoke ☆ Battle</em> and the cross-border television sensation <em>Han-Il King of Song / Korea-Japan Top Ten Show</em> established him as a premier vocalist. Masaya performs not just with technique, but with his whole heart, sharing his raw humanity through every lyric.",
    "about-quote": "Singing is the bridge that connects different languages, cultures, and souls. Let's walk this musical path together!",
    "about-stats-h3": "Why We Love Masaya",
    "stat-h4-1": "Vocal Versatility",
    "stat-p-1": "From power ballads to emotional J-Pop covers, his resonance is unmatched.",
    "stat-h4-2": "Warm Personality",
    "stat-p-2": "Always humble, connected, and deeply appreciative of his global fanbase.",
    "stat-h4-3": "Fierce Passion",
    "stat-p-3": "Like a tiger, his determination on stage commands attention and inspires us.",
    "mascot-title": "Meet Pinktiger! 🎀🐯",
    "mascot-desc": "Created as the mascot of the US Fanbase, **Pinktiger** represents the energy, cute kawaii aesthetic, and bold presence of Masaya's American fanbase.",
    "mascot-label-name": "Name:",
    "mascot-val-name": "Pinktiger",
    "mascot-label-skill": "Special Skill:",
    "mascot-val-skill": "Bouncing to Masaya's high notes 🎶",
    "mascot-label-acc": "Favorite Accessory:",
    "mascot-val-acc": "Polka dot pink bow 🎀",
    "mascot-label-goal": "Goal:",
    "mascot-val-goal": "Spreading love for Masaya across the globe! 🌎💖",
    "mascot-bubble": "\"Roar! Let's cheer for Masaya together! 🐯🎀\"",
    "channels-title": "Support Masaya",
    "channels-subtitle": "🐯 This is an unofficial, fan-made website created out of pure love to support Masaya. (이곳은 순수한 팬심을 함께 나누는 비공식 팬 사이트입니다. / ここはマサヤを応援する純粋なファン心から作られた非公式ファンサイトです。)",
    "btn-yt-main": "Masaya's YouTube",
    "btn-yt-sub": "Subscribe for Cover & Vlogs",
    "btn-ig-main": "Masaya's Instagram",
    "btn-ig-sub": "Follow daily life & updates",
    "btn-sp-main": "Spotify Artist Page",
    "btn-sp-sub": "Stream original music",
    "btn-tk-main": "TikTok Channel",
    "btn-tk-sub": "Watch short music clips",
    "fan-actions-title": "How to Help as a Fan:",
    "fan-action-p-1": "Share video clips on TikTok & Shorts",
    "fan-action-p-2": "Leave encouraging comments in EN/JA/KO",
    "fan-action-p-3": "Add Masaya's covers to your playlists",
    "fan-action-p-4": "Join the USA Pinktiger discussions",
    "footer-desc": "Creating a global home for US-based fans of Japanese vocal sensation Masaya Horikawa.",
    "footer-copyright": "© 2026 Masaya USA Pinktiger - Unofficial Fanbase built with love. 💖",
    "footer-disclaimer": "Disclaimer: All rights belong to Masaya Horikawa. This site is completely fan-run and non-profit."
  },
  ja: {
    "nav-home": "ホーム",
    "nav-about": "マサヤについて",
    "nav-mascot": "マスコット",
    "nav-support": "応援＆公式リンク",
    "hero-title": "Masaya USA Pinktiger <img src=\"./assets/pinktiger.png?v=4\" alt=\"Pinktiger Mascot\" class=\"custom-hero-mascot emoji-bounce\"><span class=\"emoji-pulse\">💖</span>",
    "hero-subtitle": "マサヤの歌声、雰囲気、そして人間性を感じてください。",
    "hero-tagline": "日本のボーカリスト堀川雅也のグローバルな旅路を応援する全米ファンベースです。",
    "hero-btn-join": "ファンクラブに入る 🎀",
    "hero-btn-learn": "もっと知る 🐯",
    "video-caption": "<span class=\"label\">注目パフォーマンス:</span> 英語字幕付きで歌う「첫눈처럼 너에게 가겠다 (初雪のように君に行く)」 ❄️🎶",
    "about-section-title": "マサヤの歩み 🐯✨",
    "about-bio-h3": "国境を越える歌声",
    "about-bio-p1": "<strong>堀川雅也 (Masaya Horikawa)</strong> は、アジア全域で心を揺さぶるエモーショナルな歌声と圧倒的なステージ存在感を持つ日本の実力派ボーカリストです。完璧なピッチ、伸びやかなハイトーン、そして情熱的な表現力で、歌うすべての楽曲に深い感動をもたらします。",
    "about-bio-p2": "日本のテレビ番組『THEカラオケ★バトル』での活躍や、国境を越えた歌唱バラエティ『日韓歌王戦／日韓トップテンショー』への出演により、一躍トップボーカリストとしての地位を確立。技術だけでなく、ありのままの人間性を込めて心から歌い上げます。",
    "about-quote": "歌は異なる言語、文化、そして魂を繋ぐ架け橋です。一緒にこの音楽の道を歩みましょう！",
    "about-stats-h3": "マサヤを愛する理由",
    "stat-h4-1": "多彩なボーカル",
    "stat-p-1": "パワーバラードから感性豊かなJ-Popカバーまで、彼の響きは唯一無二です。",
    "stat-h4-2": "温かい人柄",
    "stat-p-2": "常に謙虚で親しみやすく、世界中のファンに深く感謝しています。",
    "stat-h4-3": "熱い情熱",
    "stat-p-3": "虎のように、ステージでの彼の決意は目を引き、私たちにインスピレーションを与えます。",
    "mascot-title": "ピンクタイガーをご紹介！ 🎀🐯",
    "mascot-desc": "全米ファンベースのマスコットとして誕生した**ピンクタイガー**は、アメリカのファンたちのエネルギー、可愛いカワイイ感性、そして大胆な存在感を表現しています。",
    "mascot-label-name": "名前:",
    "mascot-val-name": "ピンクタイガー",
    "mascot-label-skill": "特技:",
    "mascot-val-skill": "マ사야의 고음 샤우팅에 맞춰 춤추기 🎶",
    "mascot-label-acc": "お気に入り:",
    "mascot-val-acc": "水玉ピンクのリボン 🎀",
    "mascot-label-goal": "目標:",
    "mascot-val-goal": "世界中にマサヤへの愛を広げること！ 🌎💖",
    "mascot-bubble": "「ガオー！一緒にマサヤを応援しよう！ 🐯🎀」",
    "channels-title": "Support Masaya",
    "channels-subtitle": "🐯 This is an unofficial, fan-made website created out of pure love to support Masaya. (이곳은 순수한 팬심을 함께 나누는 비공식 팬 사이트입니다. / ここはマサヤを応援する純粋なファン心から作られた非公式ファンサイトです。)",
    "btn-yt-main": "Masaya's YouTube",
    "btn-yt-sub": "カバー動画＆日常Vlogはこちら",
    "btn-ig-main": "Masaya's Instagram",
    "btn-ig-sub": "日常写真や最新情報はこちら",
    "btn-sp-main": "Spotify アーティストページ",
    "btn-sp-sub": "オリジナル曲を配信中",
    "btn-tk-main": "TikTok チャンネル",
    "btn-tk-sub": "ショート歌唱動画はこちら",
    "fan-actions-title": "ファンとしてできること：",
    "fan-action-p-1": "TikTokやShortsで動画クリップを共有する",
    "fan-action-p-2": "英語・日本語・韓国語で応援コメントを残す",
    "fan-action-p-3": "プレイリストにマサヤのカバー曲を追加する",
    "fan-action-p-4": "USA Pinktigerのコミュニティに参加する",
    "footer-desc": "日本の実力派ボーカリスト堀川雅也の全米ファンが繋がるグローバルなコミュニティを作ります。",
    "footer-copyright": "© 2026 Masaya USA Pinktiger - 愛を込めて作られた非公式ファンベース 💖",
    "footer-disclaimer": "免責事項：すべての権利は堀川雅也に帰属します。当サイトはファンによって運営されており、非営利です。"
  },
  ko: {
    "nav-home": "홈",
    "nav-about": "마사야 소개",
    "nav-mascot": "마스코트",
    "nav-support": "응원 & 공식 채널",
    "hero-title": "Masaya USA Pinktiger <img src=\"./assets/pinktiger.png?v=4\" alt=\"Pinktiger Mascot\" class=\"custom-hero-mascot emoji-bounce\"><span class=\"emoji-pulse\">💖</span>",
    "hero-subtitle": "마사야의 목소리, 분위기, 그리고 인간미를 느껴보세요.",
    "hero-tagline": "일본의 보컬리스트 호리카와 마사야의 글로벌 여정을 응원하는 미국 팬베이스입니다.",
    "hero-btn-join": "팬클럽 가입하기 🎀",
    "hero-btn-learn": "자세히 보기 🐯",
    "video-caption": "<span class=\"label\">주요 무대:</span> 영어 자막과 함께 감상하는 마사야의 \"첫눈처럼 너에게 가겠다\" ❄️🎶",
    "about-section-title": "마사야의 여정 🐯✨",
    "about-bio-h3": "국경을 넘는 목소리",
    "about-bio-p1": "<strong>호리카와 마사야(堀川雅야)</strong>는 아시아 전역에서 감성적인 가창력과 압도적인 무대 매너로 사랑받는 일본의 실력파 보컬리스트입니다. 완벽한 음정, 가슴을 울리는 고음, 그리고 폭발적인 가창력으로 노래하는 매 순간 깊은 감동을 선사합니다.",
    "about-bio-p2": "일본의 인기 가창 프로그램 『THE 가라오케☆배틀』에서의 대활약과 국경을 넘어 큰 인기를 끈 MBN 방송 『한일가왕전 / 한일톱텐쇼』에 참가하여 한국에서도 큰 화제를 불러일으켰습니다. 뛰어난 가창 기교뿐만 아니라 노래에 진심 어린 인간미를 듬뿍 담아 부릅니다.",
    "about-quote": "노래는 다른 언어, 문화, 그리고 영혼을 잇는 가교입니다. 이 아름다운 음악의 여정을 함께 걸어갑시다!",
    "about-stats-h3": "마사야를 사랑하는 이유",
    "stat-h4-1": "다채로운 보컬",
    "stat-p-1": "파워 발라드부터 감성적인 J-Pop 커버까지 독보적인 울림을 선사합니다.",
    "stat-h4-2": "따뜻한 성품",
    "stat-p-2": "언제나 겸손하고 팬들과 깊이 소통하며 글로벌 팬들을 아낍니다.",
    "stat-h4-3": "뜨거운 열정",
    "stat-p-3": "호랑이처럼 무대 위에서의 결연한 의지와 폭발적인 열정으로 영감을 줍니다.",
    "mascot-title": "핑크타이거를 소개합니다! 🎀🐯",
    "mascot-desc": "미국 팬베이스의 마스코트인 **핑크타이거**는 미국 팬들의 열정적인 에너지, 귀여운 카와이 감성, 그리고 대담한 매력을 상징합니다.",
    "mascot-label-name": "이름:",
    "mascot-val-name": "핑크타이거",
    "mascot-label-skill": "특기:",
    "mascot-val-skill": "마사야의 고음 샤우팅에 맞춰 춤추기 🎶",
    "mascot-label-acc": "최애 아이템:",
    "mascot-val-acc": "땡땡이 핑크 리본 🎀",
    "mascot-label-goal": "목표:",
    "mascot-val-goal": "전 세계에 마사야의 매력 전파하기! 🌎💖",
    "mascot-bubble": "“어흥! 우리 같이 마사야를 응원해요! 🐯🎀”",
    "channels-title": "Support Masaya",
    "channels-subtitle": "🐯 This is an unofficial, fan-made website created out of pure love to support Masaya. (이곳은 순수한 팬심을 함께 나누는 비공식 팬 사이트입니다. / ここはマサヤを応援する純粋なファン心から作られた非公式ファンサイトです。)",
    "btn-yt-main": "Masaya's YouTube",
    "btn-yt-sub": "커버 영상 및 일상 브이로그 구독",
    "btn-ig-main": "Masaya's Instagram",
    "btn-ig-sub": "일상 사진 및 최신 정보 확인",
    "btn-sp-main": "스포티파이 아티스트 페이지",
    "btn-sp-sub": "오리지널 음원 스트리밍",
    "btn-tk-main": "틱톡 채널",
    "btn-tk-sub": "노래 숏폼 영상 감상",
    "fan-actions-title": "팬으로서 함께하는 방법:",
    "fan-action-p-1": "틱톡 및 쇼츠에 무대 영상 공유하기",
    "fan-action-p-2": "영문/일문/국문으로 따뜻한 응원 댓글 달기",
    "fan-action-p-3": "마사야의 노래들을 개인 플레이리스트에 담기",
    "fan-action-p-4": "USA Pinktiger 소통 공간 함께 참여하기",
    "footer-desc": "일본의 보컬 신성 호리카와 마사야의 미국 팬들이 모이는 글로벌 소통 커뮤니티입니다.",
    "footer-copyright": "© 2026 Masaya USA Pinktiger - 사랑으로 만든 비공식 팬베이스 💖",
    "footer-disclaimer": "주의사항: 모든 권리는 호리카와 마사야에게 있습니다. 본 사이트는 팬들이 운영하는 비영리 사이트입니다."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSparkleEffect();
  initCuteAudio();
  initLanguageSwitcher();
  initHeroCarousel();
});

/* ==========================================================================
   2. Scroll Reveal Animation (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const sections = document.querySelectorAll('.fade-in-section');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12 // Trigger when 12% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stop observing once it's revealed
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

/* ==========================================================================
   3. Kawaii Sparkle Particle Effect
   ========================================================================== */
function initSparkleEffect() {
  const container = document.getElementById('sparkle-container');
  const sparkleToggle = document.getElementById('sparkle-toggle');
  
  let particlesEnabled = true;
  let autoSparkleInterval = null;
  const particlesPool = ['✨', '💖', '🐯', '🎀', '⭐', '🌸'];

  // Toggle sparkles on and off
  sparkleToggle.addEventListener('click', (e) => {
    particlesEnabled = !particlesEnabled;
    
    if (particlesEnabled) {
      sparkleToggle.classList.remove('disabled');
      sparkleToggle.style.opacity = '1';
      startAutoSparkles();
      createSparkleExplosion(e.clientX, e.clientY, 15);
    } else {
      sparkleToggle.classList.add('disabled');
      sparkleToggle.style.opacity = '0.5';
      stopAutoSparkles();
    }
  });

  // Spawn sparkle explosion on click
  window.addEventListener('click', (e) => {
    if (!particlesEnabled) return;
    
    // Do not spawn on buttons or links to prevent clutter, except we spawn custom explosions
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
      createSparkleExplosion(e.clientX, e.clientY, 12);
    } else {
      createSparkleExplosion(e.clientX, e.clientY, 6);
    }
  });

  function createSparkleExplosion(x, y, count) {
    for (let i = 0; i < count; i++) {
      createParticle(x, y);
    }
  }

  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'sparkle-particle';
    
    // Pick random symbol
    const symbol = particlesPool[Math.floor(Math.random() * particlesPool.length)];
    particle.innerText = symbol;

    // Randomize movement angles and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    
    // Set styles
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);
    
    // Randomize rotation speed and initial rotation
    particle.style.transform = `translate(0, 0) scale(0) rotate(${Math.random() * 360}deg)`;

    container.appendChild(particle);

    // Clean up particle element after animation completes
    setTimeout(() => {
      particle.remove();
    }, 1500);
  }

  // Automatic background sparkles drifting down
  function startAutoSparkles() {
    autoSparkleInterval = setInterval(() => {
      const rx = Math.random() * window.innerWidth;
      const ry = Math.random() * window.innerHeight;
      createSparkleExplosion(rx, ry, 1);
    }, 2000);
  }

  function stopAutoSparkles() {
    if (autoSparkleInterval) {
      clearInterval(autoSparkleInterval);
    }
  }

  // Start the background sparkles automatically
  startAutoSparkles();
}

/* ==========================================================================
   4. Cute Synthesizer Audio (Web Audio API)
   ========================================================================== */
function initCuteAudio() {
  const soundBtn = document.getElementById('sound-btn');
  
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      playCuteChime();
      
      // Visual button action feedback
      soundBtn.classList.add('playing');
      setTimeout(() => soundBtn.classList.remove('playing'), 300);
    });
  }
}

function playCuteChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioCtx = new AudioContext();
    
    // Sequence notes frequencies (J-pop game chime chords: C5, E5, G5, C6)
    const notes = [
      { freq: 523.25, timeOffset: 0, duration: 0.12 },   // C5
      { freq: 659.25, timeOffset: 0.08, duration: 0.12 },  // E5
      { freq: 783.99, timeOffset: 0.16, duration: 0.12 },  // G5
      { freq: 1046.50, timeOffset: 0.24, duration: 0.25 }  // C6
    ];

    const now = audioCtx.currentTime;

    notes.forEach(note => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine'; // Soft rounded sound, like a bubble chime
      oscillator.frequency.setValueAtTime(note.freq, now + note.timeOffset);

      // Sweet fadeout envelope
      gainNode.gain.setValueAtTime(0, now + note.timeOffset);
      gainNode.gain.linearRampToValueAtTime(0.12, now + note.timeOffset + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + note.timeOffset + note.duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(now + note.timeOffset);
      oscillator.stop(now + note.timeOffset + note.duration);
    });

  } catch (error) {
    console.warn('Web Audio API not supported or blocked by permissions:', error);
  }
}

/* ==========================================================================
   5. Language Switcher & Localization Logic
   ========================================================================== */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  // Set default language from localStorage or URL hash or browser setting
  let currentLang = 'en';
  const urlHash = window.location.hash.replace('#', '');
  const savedLang = localStorage.getItem('preferredLang');
  
  if (translations[urlHash]) {
    currentLang = urlHash;
  } else if (translations[savedLang]) {
    currentLang = savedLang;
  } else {
    // Check browser default language (en, ja, ko)
    const browserLang = navigator.language.slice(0, 2);
    if (translations[browserLang]) {
      currentLang = browserLang;
    }
  }

  // Update layout immediately
  updateLanguage(currentLang);

  // Set event listeners for language selection buttons
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Fetch selected language
      const selectedLang = btn.getAttribute('data-lang');
      if (translations[selectedLang]) {
        updateLanguage(selectedLang);
        playCuteLanguageChime();
      }
    });
  });

  // Listen to hash change events for seamless anchor link transitions
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (translations[hash]) {
      updateLanguage(hash);
    }
  });
}

function updateLanguage(lang) {
  // Save chosen language preference
  localStorage.setItem('preferredLang', lang);
  
  // Set HTML lang attribute
  document.documentElement.lang = lang;
  
  // Update class of lang switcher buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Translate all marked elements
  const translateElements = document.querySelectorAll('[data-translate]');
  translateElements.forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

function playCuteLanguageChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioCtx = new AudioContext();
    const now = audioCtx.currentTime;
    
    // Play a single high sweet ding for lang switch
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5 note
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.log('Audio error:', e);
  }
}

/* ==========================================================================
   6. Hero Image Carousel
   ========================================================================== */
function initHeroCarousel() {
  const track = document.getElementById('hero-carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.getElementById('carousel-next');
  const prevButton = document.getElementById('carousel-prev');
  const captionEl = document.getElementById('carousel-caption');
  
  const captions = [
    '<p><span class="label">🔥 This Week\'s Hot Pick:</span> Hello Kitty Food Storage Set for Masaya 💖🐯</p>',
    '<p><span class="label">🔥 This Week\'s Hot Pick:</span> 헬로키티 아이템 컬렉션 💖🐯</p>'
  ];

  let currentIndex = 0;

  function updateSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (captionEl) {
      captionEl.innerHTML = captions[index];
    }
  }

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(currentIndex);
  });

  // Touch / Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 30) {
      // Swiped left
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlide(currentIndex);
    }
    if (touchEndX > touchStartX + 30) {
      // Swiped right
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlide(currentIndex);
    }
  }
}
