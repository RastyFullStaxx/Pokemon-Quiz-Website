document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.quiz-button');
  const loreButton = document.getElementById('lore-button');

  // === Unlock KYPL if perfected WTP ===
  if (sessionStorage.getItem('kyplUnlocked') === "true") {
    loreButton.classList.remove('locked');
    loreButton.style.pointerEvents = "auto";
    loreButton.style.opacity = "1";

    // Rebind click
    loreButton.addEventListener('click', () => {
      window.location.href = "KYPL-page.html"; 
    });
  } else {
    loreButton.addEventListener('click', () => {
      shakeButton(loreButton); // Use shake instead of alert
    });
  }

  // === Arrow hover control
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
