/* ==========================================================================
   Masaya USA Pinktiger - Interactive Enhancements
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSparkleEffect();
  initCuteAudio();
});

/* ==========================================================================
   1. Scroll Reveal Animation (Intersection Observer)
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
   2. Kawaii Sparkle Particle Effect
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
   3. Cute Synthesizer Audio (Web Audio API)
   ========================================================================== */
function initCuteAudio() {
  const soundBtn = document.getElementById('sound-btn');
  
  soundBtn.addEventListener('click', () => {
    playCuteChime();
    
    // Visual button action feedback
    soundBtn.classList.add('playing');
    setTimeout(() => soundBtn.classList.remove('playing'), 300);
  });
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
