document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.quiz-button');
  const loreButton = document.getElementById('lore-button');
  const cryButton = document.getElementById('cry-button');
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');
  const fadeOverlay = document.getElementById('fade-overlay');

  // ==== Initial fade in from black ====
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  // ==== Try muted autoplay
  bgMusic.volume = 0.5;
  bgMusic.muted = true;
  bgMusic.play().then(() => {
    setTimeout(() => { bgMusic.muted = false; }, 300);
  }).catch(() => {
    console.log("Music will start after first interaction");
  });

  // ==== Force music play on first user click
  document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.muted = false;
      bgMusic.play();
    }
  }, { once: true });

  // ==== Handle button locking/unlocking
  if (sessionStorage.getItem('kyplUnlocked') === "true") {
    loreButton.classList.remove('locked');
    restoreLink(loreButton, 'KYPL-page.html');
  } else {
    removeParentLink(loreButton);
  }

  if (sessionStorage.getItem('ntcUnlocked') === "true") {
    cryButton.classList.remove('locked');
    restoreLink(cryButton, 'NTC-page.html');
  } else {
    removeParentLink(cryButton);
  }

  // ==== Button hover and click behavior
  buttons.forEach(button => {
    const arrow = button.querySelector('.arrow');

    button.addEventListener('mouseenter', () => {
      if (!button.classList.contains('locked')) {
        arrow.style.visibility = 'visible';
        clickSound.currentTime = 0;
        clickSound.play();
      }
    });

    button.addEventListener('mouseleave', () => {
      arrow.style.visibility = 'hidden';
    });

    button.addEventListener('click', (e) => {
      if (button.classList.contains('locked')) {
        e.preventDefault();
        shakeButton(button);
        showUnlockAlert(button.id);
      } else {
        e.preventDefault();
        playClickAndFade(getButtonDestination(button));
      }
    });
  });

  // ==== Trophy button
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

// ==== Helpers

function playClickAndFade(destinationUrl) {
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');
  const fadeOverlay = document.getElementById('fade-overlay');

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

function shakeButton(button) {
  button.classList.add('shake');
  setTimeout(() => {
    button.classList.remove('shake');
  }, 500);
}

function getButtonDestination(button) {
  const parentLink = button.closest('a');
  if (parentLink) {
    return parentLink.href;
  }
  return null;
}

function showUnlockAlert(buttonId) {
  if (buttonId === 'lore-button') {
    alert("Perfect Who's That Pokémon first to unlock this quiz!");
  } else if (buttonId === 'cry-button') {
    alert("Perfect Know Your Pokémon Lore first to unlock this quiz!");
  }
}

// ==== New: Remove <a> wrapper for locked buttons
function removeParentLink(button) {
  const parentLink = button.closest('a');
  if (parentLink) {
    const wrapper = parentLink.parentNode;
    wrapper.replaceChild(button, parentLink); // Replace <a> with <button> itself
  }
}

// ==== New: Restore <a> link when unlocked
function restoreLink(button, destinationUrl) {
  const parent = button.parentNode;
  if (parent && parent.tagName !== 'A') {
    const link = document.createElement('a');
    link.href = destinationUrl;
    link.appendChild(button);
    parent.appendChild(link);
  }
}
