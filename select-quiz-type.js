document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.quiz-button');
  const loreButton = document.getElementById('lore-button');
  const cryButton = document.getElementById('cry-button');

  // === Unlock KYPL if WTP perfected ===
  if (sessionStorage.getItem('kyplUnlocked') === "true") {
    loreButton.classList.remove('locked');
    loreButton.addEventListener('click', () => {
      window.location.href = "KYPL-page.html"; 
    });
  } else {
    loreButton.addEventListener('click', () => {
      alert("Perfect Who's That Pokémon first to unlock this quiz!");
    });
  }

  // === Unlock NTC if KYPL perfected ===
  if (sessionStorage.getItem('ntcUnlocked') === "true") {
    cryButton.classList.remove('locked');
    cryButton.addEventListener('click', () => {
      window.location.href = "NTC-page.html"; 
    });
  } else {
    cryButton.addEventListener('click', () => {
      alert("Perfect Know Your Pokémon Lore first to unlock this quiz!");
    });
  }

  // === Arrow hover control (your original effect)
  buttons.forEach(button => {
    const arrow = button.querySelector('.arrow');

    button.addEventListener('mouseenter', () => {
      if (!button.classList.contains('locked')) {
        arrow.style.visibility = 'visible';
      }
    });

    button.addEventListener('mouseleave', () => {
      arrow.style.visibility = 'hidden';
    });
  });
});

// === Shake animation for locked buttons
function shakeButton(button) {
  button.classList.add('shake');
  setTimeout(() => {
    button.classList.remove('shake');
  }, 500);
}
