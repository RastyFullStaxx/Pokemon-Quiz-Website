document.addEventListener('DOMContentLoaded', () => {

  const buttons = document.querySelectorAll('.quiz-button');
  const loreButton = document.getElementById('lore-button');
  const cryButton = document.getElementById('cry-button');
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');
  const fadeOverlay = document.getElementById('fade-overlay'); // NEW

  // ==== Initial fade in from black ====
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  // === Try muted autoplay
  bgMusic.volume = 0.5;
  bgMusic.muted = true;
  bgMusic.play().then(() => {
    setTimeout(() => { bgMusic.muted = false; }, 300);
  }).catch(() => {
    console.log("Music will start after first interaction");
  });

  // === Force music play on first user action
  document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.muted = false;
      bgMusic.play();
    }
  }, { once: true });

  // === Unlock KYPL if WTP perfected ===
  if (sessionStorage.getItem('kyplUnlocked') === "true") {
    loreButton.classList.remove('locked');
    loreButton.addEventListener('click', (e) => {
      e.preventDefault();
      playClickAndFade('KYPL-page.html');
    });
  } else {
    loreButton.addEventListener('click', () => {
      alert("Perfect Who's That Pokémon first to unlock this quiz!");
    });
  }

  // === Unlock NTC if KYPL perfected ===
  if (sessionStorage.getItem('ntcUnlocked') === "true") {
    cryButton.classList.remove('locked');
    cryButton.addEventListener('click', (e) => {
      e.preventDefault();
      playClickAndFade('NTC-page.html');
    });
  } else {
    cryButton.addEventListener('click', () => {
      alert("Perfect Know Your Pokémon Lore first to unlock this quiz!");
    });
  }

  // === Arrow hover control and sound control
  buttons.forEach(button => {
    const arrow = button.querySelector('.arrow');

    button.addEventListener('mouseenter', () => {
      if (!button.classList.contains('locked')) {
        arrow.style.visibility = 'visible';

        // Play hover sound
        clickSound.currentTime = 0;
        clickSound.play();
      }
    });

    button.addEventListener('mouseleave', () => {
      arrow.style.visibility = 'hidden';
    });

    button.addEventListener('click', (e) => {
      if (!button.classList.contains('locked')) {
        e.preventDefault();
        playClickAndFade(getButtonDestination(button));
      } else {
        shakeButton(button);
      }
    });
  });

  // === Trophy button click setup
  const trophyButton = document.querySelector('.trophy-button');
  if (trophyButton) {
    trophyButton.addEventListener('mouseenter', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });

    trophyButton.addEventListener('click', (e) => {
      e.preventDefault();
      playClickAndFade(trophyButton.href);
    });
  }

});

// === Helper to fade music, fade out screen, and navigate
function playClickAndFade(destinationUrl) {
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');
  const fadeOverlay = document.getElementById('fade-overlay');

  // Play click sound
  clickSound.currentTime = 0;
  clickSound.play();

  // Fade screen to black
  fadeOverlay.style.transition = 'opacity 0.8s ease';
  fadeOverlay.style.opacity = '1';

  // Fade music out
  let fadeOutMusic = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      clearInterval(fadeOutMusic);
      bgMusic.pause();
      bgMusic.volume = 0.5;
    }
  }, 50);

  // After fade-out, navigate
  setTimeout(() => {
    window.location.href = destinationUrl;
  }, 800);
}

// === Shake animation for locked buttons
function shakeButton(button) {
  button.classList.add('shake');
  setTimeout(() => {
    button.classList.remove('shake');
  }, 500);
}

// === Helper to get destination URL from button inside <a>
function getButtonDestination(button) {
  const parentLink = button.closest('a');
  if (parentLink) {
    return parentLink.href;
  }
  return null;
}
