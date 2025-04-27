// landing.js

document.addEventListener('DOMContentLoaded', () => {
  const landingVideo = document.getElementById('landingVideo');
  const headerImage = document.querySelector('.header-image');
  const startButton = document.getElementById('start-button');
  const startLink = document.getElementById('start-link');
  const bgMusic = document.getElementById('bg-music');
  const clickSound = document.getElementById('click-sound');
  const fadeOverlay = document.getElementById('fade-overlay');

  // ==== Initial reset states ====
  landingVideo.style.transform = 'scale(3.2) translateY(12%)'; // Zoomed in
  headerImage.style.opacity = '0';
  headerImage.style.transform = 'translateY(-50px)';
  startButton.style.opacity = '0';
  startButton.style.transform = 'translateY(30px)';
  fadeOverlay.style.opacity = '1'; // Full black to start

  // === Hover Sound ===
  startButton.addEventListener('mouseenter', () => {
    clickSound.currentTime = 0; // rewind sound to start
    clickSound.play();
  });


  // ==== Fade in content after short delay ====
  setTimeout(() => {
    fadeOverlay.style.opacity = '0'; // Fade to show content
  }, 200); 

  // ==== Try to play music muted first ====
  bgMusic.volume = 0.5;
  bgMusic.muted = true;
  bgMusic.play().then(() => {
    setTimeout(() => { bgMusic.muted = false; }, 500);
  }).catch(() => {
    console.log("Music will start after user interaction.");
  });

  // ==== Force music play on click or touch ====
  const forcePlayMusic = () => {
    if (bgMusic.paused) {
      bgMusic.muted = false;
      bgMusic.play();
    }
  };
  document.body.addEventListener('click', forcePlayMusic, { once: true });
  window.addEventListener('touchstart', forcePlayMusic, { once: true });

  // ==== Animate video zoom-out ====
  setTimeout(() => {
    landingVideo.style.transform = 'scale(1) translateY(0%)';
  }, 100);

  // ==== Animate Header and Button appearance ====
  setTimeout(() => {
    headerImage.style.opacity = '1';
    headerImage.style.transform = 'translateY(0)';
    startButton.style.opacity = '1';
    startButton.style.transform = 'translateY(0)';
  }, 3000);

  // ==== Fade out music, play click sound, fade screen, THEN change page ====
  startLink.addEventListener('click', (e) => {
    e.preventDefault();

    clickSound.currentTime = 0;
    clickSound.play();

    // Fade out the screen
    fadeOverlay.style.opacity = '3';

    // Fade music out gradually
    const fadeOutMusic = setInterval(() => {
      if (bgMusic.volume > 0.05) {
        bgMusic.volume -= 0.05;
      } else {
        clearInterval(fadeOutMusic);
        bgMusic.pause();
        bgMusic.volume = 0.5; // Reset volume
      }
    }, 50);

    // After fade duration, go to next page
    setTimeout(() => {
      window.location.href = startLink.href;
    }, 800); // Match fade overlay speed
  });
});
