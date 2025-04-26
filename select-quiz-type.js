document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.quiz-button');
  const loreButton = document.getElementById('lore-button');

  // === 1. Unlock KYPL if perfected WTP ===
  if (sessionStorage.getItem('kyplUnlocked') === "true") {
    loreButton.classList.remove('locked');

    loreButton.addEventListener('click', () => {
      window.location.href = "KYPL-page.html"; // <<< Redirect to KYPL page
    });
  } else {
    loreButton.addEventListener('click', () => {
      alert("Perfect Who's That Pokémon first to unlock this quiz!");
    });
  }

  // === 2. Arrow hover control (your original code) ===
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
