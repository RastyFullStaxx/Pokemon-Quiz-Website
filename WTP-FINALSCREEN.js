// ====== AUDIO ======
const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const score1to3 = document.getElementById('score-1to3');
const score4to6 = document.getElementById('score-4to6');
const scorePerfect = document.getElementById('score-perfect');
const trophyScreenSound = new Audio("assets/shared/TrophyScreenSound.mp3");

// ====== VARIABLES ======
const score = parseInt(sessionStorage.getItem("wtpScore")) || 0;

const greeter = document.getElementById("greeter");
const dialogText = document.getElementById("dialog-text");
const options = document.querySelectorAll(".option");
const selectorArrow = document.getElementById("selector-arrow");

const dialogBox = document.querySelector(".dialog-box");
const trophyContainer = document.getElementById("trophy-unlock-container");
const trophyImage = document.getElementById("trophy-image");
const nextButton = document.getElementById("next-button");
const dialogWrapper = document.querySelector(".dialog-wrapper");
const fadeOverlay = document.getElementById("fade-overlay");

let currentIndex = 0;

// ====== FADE IN SCREEN ======
document.addEventListener("DOMContentLoaded", () => {
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  // Start by playing the score sound first
  playScoreSoundThenTheme();
});

// ====== FUNCTIONS ======

// Play correct score sound based on score
function playScoreSoundThenTheme() {
  let scoreSound = score1to3;

  if (score >= 4 && score <= 6) {
    scoreSound = score4to6;
  } else if (score === 7) {
    scoreSound = scorePerfect;
  }

  scoreSound.volume = 1;
  scoreSound.play().catch(() => {
    console.log("Score sound will play after interaction.");
  });

  // After score sound ends, fade in background music
  scoreSound.addEventListener('ended', () => {
    bgMusic.volume = 0;
    bgMusic.loop = true;
    bgMusic.play().then(() => {
      fadeInMusic(bgMusic);
    }).catch(() => {
      console.log("Background music will start after interaction.");
    });
  });

  // In case of browser autoplay restriction
  document.body.addEventListener('click', () => {
    if (scoreSound.paused) {
      scoreSound.play();
    }
    if (bgMusic.paused) {
      bgMusic.play();
    }
  }, { once: true });
}

// Fade in music
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

// Pause theme music, play trophy sound, resume theme
function playTrophyClaimEffect() {
  // Fade out bg music quickly
  const fadeOutInterval = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      clearInterval(fadeOutInterval);
      bgMusic.pause();
    }
  }, 30);

  // Play trophy screen sound
  trophyScreenSound.volume = 1;
  trophyScreenSound.play().then(() => {
    console.log("Trophy screen sound playing...");
  }).catch(() => {
    console.log("Trophy screen sound will play after interaction.");
  });

  // Show trophy visuals first (but NOT next button yet)
  trophyContainer.classList.remove("hidden");
  setTimeout(() => {
    trophyContainer.style.opacity = "1";
    trophyContainer.style.transform = "translate(-50%, -50%) scale(1) translateY(0)";
  }, 50);

  // After trophy sound ends, reveal NEXT button
  trophyScreenSound.addEventListener('ended', () => {
    setTimeout(() => {
      nextButton.classList.add("visible");  // <<< Add .visible for slide up
      nextButton.style.opacity = "1";

      // Add hover sound effect
      nextButton.addEventListener('mouseenter', () => {
        clickSound.currentTime = 0;
        clickSound.play();
      });

      // Add click sound + fade out + navigation
      nextButton.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();

        // Disable next button to prevent double click
        nextButton.style.pointerEvents = "none";

        fadeOverlay.style.transition = 'opacity 0.8s ease';
        fadeOverlay.style.opacity = '1';

        setTimeout(() => {
          window.location.href = "trophy-page.html";
        }, 600);
      });

    }, 100); // slight delay after sound ends
  });

  // Resume background music after trophy sound ends
  trophyScreenSound.addEventListener('ended', () => {
    bgMusic.currentTime = 0;
    bgMusic.play();
    fadeInMusic(bgMusic);
  });
}

// ====== SETUP BASED ON SCORE ======
if (score === 7) {
  greeter.src = "assets/WtpPage/BirchPerfectScore.png";
  greeter.style.top = "430px";
  greeter.style.width = "420px";

  dialogBox.style.top = "750px";

  dialogText.textContent = "Congratulations, Pokémon Master! You got all the answers right and proved you know your Pokémon by their shadows. Claim your trophy now!";
  options[0].textContent = "Claim Trophy";
  options[0].onclick = () => {
    // Hide Birch and dialog
    greeter.style.display = "none";
    dialogWrapper.style.display = "none";

    // Play trophy claim effect
    playTrophyClaimEffect();

    // Show Trophy
    trophyContainer.classList.remove("hidden");

    setTimeout(() => {
      trophyContainer.style.opacity = "1";
      trophyContainer.style.transform = "translate(-50%, -50%) scale(1) translateY(0)";
      
      setTimeout(() => {
        nextButton.style.opacity = "1";
      }, 600);
    }, 50);

    nextButton.onclick = () => {
      sessionStorage.setItem("wtpTrophy", "unlocked");
      window.location.href = "trophy-page.html";
    };
  };

} else if (score === 6) {
  greeter.src = "assets/WtpPage/Birch1Error.png";
  greeter.style.top = "410px";
  greeter.style.width = "600px";

  dialogBox.style.top = "750px";

  dialogText.textContent = `You got ${score} answers correct! You’re one step closer to becoming a Pokémon Master!`;
  options[0].textContent = "Try Again";
  options[0].onclick = () => {
    window.location.href = "WTP-page.html";
  };

} else {
  greeter.src = "assets/WtpPage/BirchThreeErrors.png";
  greeter.style.top = "380px";
  greeter.style.width = "420px";

  dialogBox.style.top = "750px";

  dialogText.textContent = `You got ${score} answers correct. That’s okay, you just need to train more and become stronger!`;
  options[0].textContent = "Try Again";
  options[0].onclick = () => {
    window.location.href = "WTP-page.html";
  };
}

// Always include Menu
options[1].textContent = "Menu";
options[1].onclick = () => {
  window.location.href = "select-quiz-type.html";
};

// ====== ARROW MOVEMENT ======
function updateArrowPosition() {
  const topBase = 30;
  const offset = 35;
  selectorArrow.style.top = `${topBase + offset * currentIndex}px`;
}
updateArrowPosition();

// Mouse hover sound on options
options.forEach((option, index) => {
  option.addEventListener("mouseenter", () => {
    currentIndex = index;
    updateArrowPosition();
    selectorArrow.style.animation = "none";
    selectorArrow.style.opacity = "1";

    // Play hover sound
    clickSound.currentTime = 0;
    clickSound.play();
  });

  option.addEventListener("mouseleave", () => {
    selectorArrow.style.animation = "blink 1s step-start infinite";
  });
});

// Keyboard control
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
