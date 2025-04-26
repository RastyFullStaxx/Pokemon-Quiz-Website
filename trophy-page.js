document.addEventListener("DOMContentLoaded", () => {
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

// === Handle Trophy Unlock Logic ===
function handleTrophyUnlock({ trophyKey, trophyId, unlockedSrc, popupMessage, animationFlag }) {
  const trophy = document.getElementById(trophyId);

  if (sessionStorage.getItem(trophyKey) === "unlocked") {
    // Check if animation already played this session
    if (sessionStorage.getItem(animationFlag) === "true") {
      // Instantly show unlocked trophy quietly
      trophy.src = unlockedSrc;
      addEnergyShine(trophy);
    } else {
      // Play full morph animation
      setTimeout(() => {
        trophy.style.animation = "trophyShake 0.6s ease, trophyFlash 0.6s ease";

        setTimeout(() => {
          // Morph the trophy
          trophy.src = unlockedSrc;
          trophy.style.animation = "";

          // Create burst ring
          createBurstEffect(trophy);

          // Show "Trophy Unlocked!" popup
          showUnlockPopup(popupMessage);

          // Save that animation played this session
          sessionStorage.setItem(animationFlag, "true");

          // Add soft shine after morph
          addEnergyShine(trophy);
        }, 600);
      }, 700); // 700ms delay before shake starts
    }
  }
}

// === Popup for Trophy Unlocked ===
function showUnlockPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("unlock-popup");
  popup.textContent = message;
  document.body.appendChild(popup);

  // Remove popup after animation
  setTimeout(() => {
    popup.remove();
  }, 2000);
}

// === Create Burst Ring Behind Trophy ===
function createBurstEffect(trophyElement) {
  const burst = document.createElement("div");
  burst.classList.add("burst-ring");

  // Insert burst inside trophy slot
  trophyElement.parentElement.appendChild(burst);

  setTimeout(() => {
    burst.remove();
  }, 800); // Match burst animation time
}

function addEnergyShine(trophyElement) {
  const slot = trophyElement.parentElement; // .trophy-slot

  // Add Energy Shine
  const shine = document.createElement("div");
  shine.classList.add("energy-shine");
  slot.appendChild(shine);

  // Add multiple floating sparkles
  for (let i = 0; i < 6; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    // Random starting position
    sparkle.style.top = `${Math.random() * 80 + 10}%`;
    sparkle.style.left = `${Math.random() * 80 + 10}%`;
    sparkle.style.animationDuration = `${3 + Math.random() * 2}s`; // Random speed 3–5s

    slot.appendChild(sparkle);
  }
}

