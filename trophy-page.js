document.addEventListener("DOMContentLoaded", () => {

  const fadeOverlay = document.getElementById('fade-overlay');
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');
  const backButton = document.querySelector('.back-button');

  // ==== Initial fade in from black ====
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  // === Handle background music (fresh play) ===
  bgMusic.volume = 0.5;
  bgMusic.muted = true;
  bgMusic.play().then(() => {
    setTimeout(() => { bgMusic.muted = false; }, 300);
  }).catch(() => {
    console.log("Music will start after first interaction.");
  });

  // Force play on first user click
  document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.muted = false;
      bgMusic.play();
    }
  }, { once: true });

  // === Back button hover and click effects ===
  if (backButton) {
    const button = backButton.querySelector('button');

    button.addEventListener('mouseenter', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });

    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      playClickAndFade(backButton.href);
    });
  }

  // ==== TROPHY UNLOCK SYSTEM ====

  // WTP Trophy
  handleTrophyUnlock({
    trophyKey: "wtpTrophy",
    trophyId: "wtp-trophy",
    unlockedSrc: "assets/TrophyPage/wtp-trophy-unlocked.png",
    popupMessage: "Who's That Pokémon Trophy Unlocked!",
    animationFlag: "wtpAnimationPlayed"
  });

  // KYPL Trophy
  handleTrophyUnlock({
    trophyKey: "kyplTrophy",
    trophyId: "kypl-trophy",
    unlockedSrc: "assets/TrophyPage/kypl-trophy-unlocked.png",
    popupMessage: "Know Your Pokémon Lore Trophy Unlocked!",
    animationFlag: "kyplAnimationPlayed"
  });

  // NTC Trophy
  handleTrophyUnlock({
    trophyKey: "ntcTrophy",
    trophyId: "ntc-trophy",
    unlockedSrc: "assets/TrophyPage/ntc-trophy-unlocked.png",
    popupMessage: "Name That Cry Trophy Unlocked!",
    animationFlag: "ntcAnimationPlayed"
  });

});

// === Helper: Play click, fade out, then navigate
function playClickAndFade(destinationUrl) {
  const fadeOverlay = document.getElementById('fade-overlay');
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');

  clickSound.currentTime = 0;
  clickSound.play();

  fadeOverlay.style.transition = 'opacity 0.8s ease';
  fadeOverlay.style.opacity = '1';

  // Fade out music gently
  let fadeOutMusic = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      clearInterval(fadeOutMusic);
      bgMusic.pause();
      bgMusic.volume = 0.5;
    }
  }, 50);

  setTimeout(() => {
    window.location.href = destinationUrl;
  }, 800);
}

// === EXISTING FUNCTIONS you already had (no change) ===

function handleTrophyUnlock({ trophyKey, trophyId, unlockedSrc, popupMessage, animationFlag }) {
  const trophy = document.getElementById(trophyId);

  if (sessionStorage.getItem(trophyKey) === "unlocked") {
    if (sessionStorage.getItem(animationFlag) === "true") {
      trophy.src = unlockedSrc;
      addEnergyShine(trophy);
    } else {
      setTimeout(() => {
        trophy.style.animation = "trophyShake 0.6s ease, trophyFlash 0.6s ease";

        setTimeout(() => {
          trophy.src = unlockedSrc;
          trophy.style.animation = "";
          createBurstEffect(trophy);
          showUnlockPopup(popupMessage);
          sessionStorage.setItem(animationFlag, "true");
          addEnergyShine(trophy);
        }, 600);
      }, 700);
    }
  }
}

function showUnlockPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("unlock-popup");
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

function createBurstEffect(trophyElement) {
  const burst = document.createElement("div");
  burst.classList.add("burst-ring");
  trophyElement.parentElement.appendChild(burst);

  setTimeout(() => {
    burst.remove();
  }, 800);
}

function addEnergyShine(trophyElement) {
  const slot = trophyElement.parentElement;

  const shine = document.createElement("div");
  shine.classList.add("energy-shine");
  slot.appendChild(shine);

  for (let i = 0; i < 6; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.style.top = `${Math.random() * 80 + 10}%`;
    sparkle.style.left = `${Math.random() * 80 + 10}%`;
    sparkle.style.animationDuration = `${3 + Math.random() * 2}s`;
    slot.appendChild(sparkle);
  }
}
