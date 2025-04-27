document.addEventListener("DOMContentLoaded", () => {

  const fadeOverlay = document.getElementById('fade-overlay');
  const dimOverlay = document.getElementById('dim-overlay'); // <<< new dim overlay
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');
  const backButton = document.querySelector('.back-button');

  const ultimateDialog = document.querySelector('.ultimate-dialog-wrapper');
  const ultimateOption = document.getElementById('ultimate-option');
  const titlesContainer = document.getElementById('titles-container');

  // ==== Initial Fade-in ====
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  // ==== Background Music ====
  bgMusic.volume = 0.5;
  bgMusic.muted = true;
  bgMusic.play().then(() => {
    setTimeout(() => { bgMusic.muted = false; }, 300);
  }).catch(() => {
    console.log("Music will start after user interaction.");
  });

  document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.muted = false;
      bgMusic.play();
    }
  }, { once: true });

  // ==== Back Button Hover and Click ====
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

  // ==== Trophy Unlocks ====
  handleTrophyUnlock({
    trophyKey: "wtpTrophy",
    trophyId: "wtp-trophy",
    unlockedSrc: "assets/TrophyPage/wtp-trophy-unlocked.png",
    popupMessage: "Who's That Pokémon Trophy Unlocked!",
    animationFlag: "wtpAnimationPlayed"
  });

  handleTrophyUnlock({
    trophyKey: "kyplTrophy",
    trophyId: "kypl-trophy",
    unlockedSrc: "assets/TrophyPage/kypl-trophy-unlocked.png",
    popupMessage: "Know Your Pokémon Lore Trophy Unlocked!",
    animationFlag: "kyplAnimationPlayed"
  });

  handleTrophyUnlock({
    trophyKey: "ntcTrophy",
    trophyId: "ntc-trophy",
    unlockedSrc: "assets/TrophyPage/ntc-trophy-unlocked.png",
    popupMessage: "Name That Cry Trophy Unlocked!",
    animationFlag: "ntcAnimationPlayed"
  });

  // ==== Ultimate Titles and Dialog ====
  const allUnlocked = sessionStorage.getItem('wtpTrophy') === "unlocked"
                    && sessionStorage.getItem('kyplTrophy') === "unlocked"
                    && sessionStorage.getItem('ntcTrophy') === "unlocked";

  if (allUnlocked) {
    titlesContainer.classList.remove('hidden');

    if (!sessionStorage.getItem('ultimateCongratulationsShown')) {
      setTimeout(() => {
        dimOverlay.classList.add('active');    // <<< Dim screen
        ultimateDialog.classList.remove('hidden');
      }, 2500);

      sessionStorage.setItem('ultimateCongratulationsShown', 'true');
    }
  }

  // ==== Close Ultimate Dialog ====
  if (ultimateOption) {
    ultimateOption.addEventListener('mouseenter', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });

    ultimateOption.addEventListener('click', () => {
      ultimateDialog.classList.add('hidden');
      dimOverlay.classList.remove('active');   // <<< Remove dim
    });
  }

});

// ==== Fade-out helper ====
function playClickAndFade(destinationUrl) {
  const fadeOverlay = document.getElementById('fade-overlay');
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');

  clickSound.currentTime = 0;
  clickSound.play();

  fadeOverlay.style.transition = 'opacity 0.8s ease';
  fadeOverlay.style.opacity = '1';

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

// ==== Trophy Shine/Unlock Effects ====
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
