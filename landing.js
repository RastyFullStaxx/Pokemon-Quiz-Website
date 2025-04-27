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
    clickSound.currentTime = 0; 
    clickSound.play();
  });

  // ==== Fade in content after short delay ====
  setTimeout(() => {
    fadeOverlay.style.opacity = '0';
  }, 200);

// ==== Try playing background music immediately ====
bgMusic.volume = 0;
bgMusic.muted = false;

bgMusic.play().then(() => {
  console.log("Background music started immediately.");

  fadeInMusic(bgMusic); // <== New function to fade in volume
}).catch((error) => {
  console.log("Autoplay blocked. Waiting for user click...");

  document.body.addEventListener('click', () => {
    bgMusic.play().then(() => {
      console.log("Background music started after user click.");
      fadeInMusic(bgMusic); // <== Also fade in when started
    });
  }, { once: true });
});

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

    fadeOverlay.style.opacity = '3'; // Fade to black

    // Fade music out gradually
    const fadeOutMusic = setInterval(() => {
      if (bgMusic.volume > 0.05) {
        bgMusic.volume -= 0.05;
      } else {
        clearInterval(fadeOutMusic);
        bgMusic.pause();
        bgMusic.volume = 0.5;
      }
    }, 50);

    setTimeout(() => {
      window.location.href = startLink.href;
    }, 800);
  });
});

function fadeInMusic(audio) {
  let targetVolume = 0.5;
  let currentVolume = 0;
  const fadeInterval = setInterval(() => {
    if (currentVolume < targetVolume) {
      currentVolume += 0.05;
      audio.volume = Math.min(currentVolume, targetVolume);
    } else {
      clearInterval(fadeInterval);
    }
  }, 100);
}

