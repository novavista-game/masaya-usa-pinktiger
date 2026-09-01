function initInteractiveMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || typeof L === 'undefined') return;
  
  const map = L.map('map', { 
    worldCopyJump: true,
    maxBounds: [[-90, -180], [90, 180]],
    minZoom: 2,
    maxBoundsViscosity: 1.0
  }).setView([20, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    noWrap: true
  }).addTo(map);

  const pawIcon = L.divIcon({
    html: `
      <div style="color: #FF69B4; font-size: 20px; filter: drop-shadow(0px 4px 6px rgba(255, 105, 180, 0.8)); display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; transform: translate(-10px, -20px); animation: pulse-paw 2s infinite;">
        <i class="fa-solid fa-paw"></i>
      </div>
      <style>
        @keyframes pulse-paw {
          0% { transform: translate(-10px, -20px) scale(1); }
          50% { transform: translate(-10px, -20px) scale(1.15); }
          100% { transform: translate(-10px, -20px) scale(1); }
        }
      </style>
    `,
    className: 'custom-paw-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20]
  });

  const clusterPawIcon = L.divIcon({
    html: `
      <div style="color: #FF69B4; font-size: 26px; filter: drop-shadow(0px 0px 10px rgba(255, 105, 180, 1)); display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; transform: translate(-13px, -26px); animation: pulse-cluster 1.5s infinite;">
        <i class="fa-solid fa-paw"></i>
        <div style="position: absolute; width: 40px; height: 40px; border: 2px solid rgba(255, 105, 180, 0.8); border-radius: 50%; box-shadow: 0 0 15px rgba(255, 105, 180, 0.6);"></div>
      </div>
      <style>
        @keyframes pulse-cluster {
          0% { transform: translate(-13px, -26px) scale(1); }
          50% { transform: translate(-13px, -26px) scale(1.1); }
          100% { transform: translate(-13px, -26px) scale(1); }
        }
      </style>
    `,
    className: 'custom-cluster-icon',
    iconSize: [26, 26],
    iconAnchor: [13, 26]
  });

  const markerCluster = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50,
    spiderLegPolylineOptions: { weight: 3, color: 'rgba(255, 105, 180, 0.7)', opacity: 0.8 },
    iconCreateFunction: function(cluster) {
      return clusterPawIcon;
    }
  });
  map.addLayer(markerCluster);

  const hardcodedMarkers = [
    { lat: 34.0522, lng: -118.2437, nickname: "PinkTiger_LA", message: "Been listening to his covers on repeat! Can't wait for a US tour! ?맦?뮇" },
    { lat: 40.7128, lng: -74.0060, nickname: "Melody_NY", message: "His vocal range is absolutely insane. This new fan site is gorgeous! ?렎?? },
    { lat: 48.8566, lng: 2.3522, nickname: "Paris_PinkTiger", message: "Growing fanbase in Paris! Your vocal tone is incredibly trendy in Europe. ?눏?눟?? },
    { lat: 40.4168, lng: -3.7038, nickname: "Madrid_MasayaFan", message: "Strong support from Spain! Latin fans are streaming your songs every day. ?눎?눡?뵦" },
    { lat: 39.9042, lng: 116.4074, nickname: "Beijing_Tiger", message: "Huge potential for the global Asian market! Cheering from China! ?눊?눛?맦" },
    { lat: -23.5505, lng: -46.6333, nickname: "BR_PinkTigers", message: "South American fans are here! We need a global tour soon! ?눉?눟?뮇" },
    { lat: 51.5074, lng: -0.1278, nickname: "London_Pop", message: "Amazing talent. UK fans are definitely tuned in! ?눐?눉?렦" },
    { lat: 35.6762, lng: 139.6503, nickname: "Tokyo_PinkTiger", message: "Always waiting for your next Tokyo live! The fan energy here is amazing! ?눓?눝?맦" },
    { lat: 37.5665, lng: 126.9780, nickname: "Seoul_MasayaFan", message: "K-fans are completely mesmerized by your vocal color! Come to Korea soon! ?눖?눟?? },
    { lat: 47.6062, lng: -122.3321, nickname: "Seattle_PinkTiger", message: "Streaming your songs every day from the rainy city! We love you Masaya! ?뺩윇? },
    { lat: 33.9367, lng: -118.0278, nickname: "SoCal_Roar", message: "Huge fan from Southern California! Your high notes are amazing! ?뙱?? }
  ];

  hardcodedMarkers.forEach(item => {
    const marker = L.marker([item.lat, item.lng], { icon: pawIcon });
    
    let popupContent = `<div style="text-align:center; max-width: 250px;">`;
    popupContent += `<h4 style="color: var(--brand-pink); margin-bottom: 10px; font-size: 1.2rem; font-weight: bold;">${item.nickname}</h4>`;
    popupContent += `<p style="font-family:'Quicksand', sans-serif; color:#333; margin:0;">"${item.message}"</p>`;
    popupContent += `</div>`;
    
    marker.bindPopup(popupContent);
    markerCluster.addLayer(marker);
  });
}

/* ==========================================================================
   10. Mascot Easter Egg
   ========================================================================== */
function initMascotEasterEgg() {
  const mascotTrigger = document.getElementById('mascot-trigger');
  const eeModal = document.getElementById('easter-egg-modal');
  const eeImage = document.getElementById('ee-image');
  const eeModalContent = document.getElementById('ee-modal-content');
  
  if (!mascotTrigger || !eeModal || !eeImage) return;

  let eeCount = 0;
  const eeTotal = 7;
  let eeTimeout = null;

  const hideModal = () => {
    eeModal.style.opacity = '0';
    eeModal.style.pointerEvents = 'none';
    eeModal.style.visibility = 'hidden';
    if (eeTimeout) {
      clearTimeout(eeTimeout);
      eeTimeout = null;
    }
  };

  mascotTrigger.addEventListener('click', () => {
    eeCount = (eeCount % eeTotal) + 1; // cycles 1 to 7
    // Properly encode URI for spaces and Korean characters
    eeImage.src = encodeURI(`assets/留덉궗???ъ쭊 ${eeCount}.png`);
    
    // Show modal with fade
    eeModal.style.opacity = '1';
    eeModal.style.pointerEvents = 'auto';
    eeModal.style.visibility = 'visible';
    
    // Reset animation
    eeModalContent.classList.remove('heart-pop-anim');
    void eeModalContent.offsetWidth; // Trigger reflow
    eeModalContent.classList.add('heart-pop-anim');

    // Auto-hide after 2 seconds
    if (eeTimeout) clearTimeout(eeTimeout);
    eeTimeout = setTimeout(hideModal, 2000);
  });

  // Close modal when clicking anywhere on the modal
  eeModal.addEventListener('click', hideModal);
}

/* ==========================================================================
   11. Fan Letter Carousel
   ========================================================================== */

window.scrollFanLetters = function(amount) {
  const container = document.getElementById('home-letters-container');
  if (container) {
    // On mobile, scroll by the full width of the container instead of fixed pixel amount
    let scrollAmount = amount;
    if (window.innerWidth <= 768) {
      scrollAmount = amount > 0 ? container.clientWidth : -container.clientWidth;
    }
    
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => {
      if (window.updateFanLetterButtons) window.updateFanLetterButtons();
    }, 400); // Wait for smooth scroll to finish
  }
};

function initFanLetterCarousel() {
  const container = document.getElementById('home-letters-container');
  const prevBtn = document.getElementById('fanletter-prev');
  const nextBtn = document.getElementById('fanletter-next');
  
  if (!container || !prevBtn || !nextBtn) return;

  const updateButtons = () => {
    // Disable prev if at start
    prevBtn.disabled = container.scrollLeft <= 0;
    // Disable next if at end (allow 1px rounding error)
    nextBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
  };

  container.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  
  // Initial check (delay slightly to allow Firebase injection)
  setTimeout(updateButtons, 1000);
  
  // Expose update function to be called after Firebase injection
  window.updateFanLetterButtons = updateButtons;
}

document.addEventListener('DOMContentLoaded', () => {
  initMascotEasterEgg();
  initFanLetterCarousel();
});
