const score = parseInt(sessionStorage.getItem("kyplScore")) || 0;

// DOM Elements
const greeter = document.getElementById("greeter");
const dialogText = document.getElementById("dialog-text");
const options = document.querySelectorAll(".option");
const selectorArrow = document.getElementById("selector-arrow");
const trophyContainer = document.getElementById("trophy-unlock-container");
const trophyImage = document.getElementById("trophy-image");
const nextButton = document.getElementById("next-button");
const dialogWrapper = document.querySelector(".dialog-wrapper");
const fadeOverlay = document.getElementById("fade-overlay");

// Audios
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const trophySound = document.getElementById("trophy-sound");
const score1to3Sound = document.getElementById("score-1to3");
const score4to6Sound = document.getElementById("score-4to6");
const scorePerfectSound = document.getElementById("score-perfect");

let currentIndex = 0;

// ===== Fade in screen =====
document.addEventListener('DOMContentLoaded', () => {
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  bgMusic.volume = 0;
  bgMusic.loop = true;

  // Don't start music immediately yet — wait until score sound finishes
  playScoreSound();
});

// ===== Play Score SFX and then Background Music =====
function playScoreSound() {
  let scoreSound = null;

  if (score >= 1 && score <= 3) {
    scoreSound = score1to3Sound;
  } else if (score >= 4 && score <= 6) {
    scoreSound = score4to6Sound;
  } else if (score === 7) {
    scoreSound = scorePerfectSound;
  }

  if (scoreSound) {
    bgMusic.pause(); // Pause the theme while score sfx plays

    scoreSound.play().then(() => {
      console.log("Score sound playing...");
    }).catch(() => {
      console.log("Score sound will play after interaction.");
    });

    scoreSound.addEventListener('ended', () => {
      bgMusic.play().then(() => {
        fadeInMusic(bgMusic);
      }).catch(() => {
        console.log("Background music will start after user interaction.");
      });
    });
  } else {
    // If no scoreSound, directly play bg music
    bgMusic.play().then(() => {
      fadeInMusic(bgMusic);
    });
  }

  document.body.addEventListener('click', () => {
    if (bgMusic.paused) bgMusic.play();
  }, { once: true });
}

// ===== Setup based on score =====
if (score === 7) {
  greeter.src = "assets/KyplPage/OakPerfectScore.png";
  dialogText.textContent = "Congratulations, Pokémon Professor! You got all the lore questions right! Claim your trophy now!";
  options[0].textContent = "Claim Trophy";
  options[0].onclick = claimTrophy;
} else if (score === 6) {
  greeter.src = "assets/KyplPage/OakFewErrors.png";
  dialogText.textContent = `You got ${score} answers correct! You're almost a Pokémon lore master!`;
  options[0].textContent = "Try Again";
  options[0].onclick = retryQuiz;
} else {
  greeter.src = "assets/KyplPage/OakMultipleErrors.png";
  dialogText.textContent = `You got ${score} answers correct. Keep studying to master the Pokémon world!`;
  options[0].textContent = "Try Again";
  options[0].onclick = retryQuiz;
}

// Always include Menu
options[1].textContent = "Menu";
options[1].onclick = () => {
  fadeAndRedirect("select-quiz-type.html");
};

// ===== Claim Trophy =====
function claimTrophy() {
  greeter.style.display = "none";
  dialogWrapper.style.display = "none";
  trophyContainer.classList.remove("hidden");

  // Pause music softly and play trophy sound
  bgMusic.volume = 0.2;
  trophySound.currentTime = 0;
  trophySound.play();

  setTimeout(() => {
    trophyContainer.style.opacity = "1";
    trophyContainer.style.transform = "translate(-50%, -50%) scale(1) translateY(0)";

    setTimeout(() => {
      nextButton.style.opacity = "1";

      nextButton.addEventListener('mouseenter', () => {
        clickSound.currentTime = 0;
        clickSound.play();
      });

      nextButton.onclick = () => {
        sessionStorage.setItem("kyplTrophy", "unlocked");
        sessionStorage.setItem("ntcUnlocked", "true");
        fadeAndRedirect("trophy-page.html");
      };
    }, 600);
  }, 300);
}

// ===== Retry Quiz =====
function retryQuiz() {
  fadeAndRedirect("KYPL-page.html");
}

// ===== Fade then Redirect Helper =====
function fadeAndRedirect(destination) {
  fadeOverlay.style.transition = 'opacity 0.8s ease';
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    window.location.href = destination;
  }, 800);
}

// ===== Arrow Movement =====
function updateArrowPosition() {
  const topBase = 30;
  const offset = 35;
  selectorArrow.style.top = `${topBase + offset * currentIndex}px`;
}
updateArrowPosition();

// ===== Mouse hover on options =====
options.forEach((option, index) => {
  option.addEventListener('mouseenter', () => {
    currentIndex = index;
    updateArrowPosition();
    selectorArrow.style.animation = "none";
    selectorArrow.style.opacity = "1";

    clickSound.currentTime = 0;
    clickSound.play();
  });

  option.addEventListener('mouseleave', () => {
    selectorArrow.style.animation = "blink 1s step-start infinite";
  });
});

// ===== Keyboard control =====
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    currentIndex = (currentIndex - 1 + options.length) % options.length;
    updateArrowPosition();
  } else if (e.key === "ArrowDown") {
    currentIndex = (currentIndex + 1) % options.length;
    updateArrowPosition();
  } else if (e.key === "Enter") {
    options[currentIndex].click();
  }
});

// ===== Fade In Music Helper =====
function fadeInMusic(audio) {
  let volume = 0;
  const fadeInterval = setInterval(() => {
    if (volume < 0.5) {
      volume += 0.01;
      audio.volume = volume;
    } else {
      clearInterval(fadeInterval);
      audio.volume = 0.5;
    }
  }, 50);
}
