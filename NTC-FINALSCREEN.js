// ====== Grab elements ======
const score = parseInt(sessionStorage.getItem("ntcScore")) || 0;

const greeter = document.getElementById("greeter");
const dialogText = document.getElementById("dialog-text");
const options = document.querySelectorAll(".option");
const selectorArrow = document.getElementById("selector-arrow");
const trophyContainer = document.getElementById("trophy-unlock-container");
const trophyImage = document.getElementById("trophy-image");
const nextButton = document.getElementById("next-button");
const dialogWrapper = document.querySelector(".dialog-wrapper");
const fadeOverlay = document.getElementById("fade-overlay");

// ====== Audio ======
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const oneToThreeSound = new Audio("assets/shared/1to3ScoreSound.mp3");
const fourToSixSound = new Audio("assets/shared/4to6ScoreSound.mp3");
const perfectSound = new Audio("assets/shared/PerfectScoreSound.mp3");
const trophySound = new Audio("assets/shared/TrophyScreenSound.mp3");

// ====== Variables ======
let currentIndex = 0;

// ====== Initial Fade In ======
window.addEventListener("DOMContentLoaded", () => {
  fadeOverlay.style.opacity = "1";
  setTimeout(() => {
    fadeOverlay.style.transition = "opacity 0.8s ease";
    fadeOverlay.style.opacity = "0";
  }, 100);

  bgMusic.volume = 0;
  bgMusic.loop = true;
  bgMusic.play().then(() => {
    fadeInMusic(bgMusic);
  }).catch(() => {
    console.log("Background music will start after interaction.");
  });

  document.body.addEventListener("click", () => {
    if (bgMusic.paused) bgMusic.play();
  }, { once: true });

  setupScreen();
});

// ====== Setup Screen Based on Score ======
function setupScreen() {
  if (score === 7) {
    greeter.src = "assets/NtcPage/JuniperPerfectScore.png";
    dialogText.textContent = "Outstanding! You recognized every cry perfectly! Claim your trophy!";
    options[0].textContent = "Claim Trophy";
    options[0].onclick = claimTrophy;
    playAfterResultMusic(perfectSound);
  } else if (score >= 4) {
    greeter.src = "assets/NtcPage/JuniperFewErrors.png";
    dialogText.textContent = `You got ${score} answers right! Almost there!`;
    options[0].textContent = "Try Again";
    options[0].onclick = () => window.location.href = "NTC-page.html";
    playAfterResultMusic(fourToSixSound);
  } else {
    greeter.src = "assets/NtcPage/JuniperManyErrors.png";
    dialogText.textContent = `You got ${score} correct. Keep practicing those cries!`;
    options[0].textContent = "Try Again";
    options[0].onclick = () => window.location.href = "NTC-page.html";
    playAfterResultMusic(oneToThreeSound);
  }

  options[1].textContent = "Menu";
  options[1].onclick = () => window.location.href = "select-quiz-type.html";

  updateArrowPosition();
}

// ====== Claim Trophy ======
function claimTrophy() {
  bgMusic.pause();
  trophySound.play();

  greeter.style.display = "none";
  dialogWrapper.style.display = "none";

  trophyContainer.classList.remove("hidden");
  setTimeout(() => {
    trophyContainer.style.opacity = "1";
    trophyContainer.style.transform = "translate(-50%, -50%) scale(1) translateY(0)";
    setTimeout(() => {
      nextButton.style.opacity = "1";
    }, 600);
  }, 50);

  nextButton.onclick = () => {
    sessionStorage.setItem("ntcTrophy", "unlocked");
    window.location.href = "trophy-page.html";
  };
}

// ====== Fade in Music ======
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

// ====== Play After Result Music ======
function playAfterResultMusic(music) {
  bgMusic.pause();
  music.volume = 1;
  music.play();
}

// ====== Arrow Movement ======
function updateArrowPosition() {
  const topBase = 30;
  const offset = 35;
  selectorArrow.style.top = `${topBase + offset * currentIndex}px`;
}

// ====== Controls ======
options.forEach((option, index) => {
  option.addEventListener("mouseenter", () => {
    currentIndex = index;
    updateArrowPosition();
    selectorArrow.style.animation = "none";
    selectorArrow.style.opacity = "1";
    playButtonHover();
  });

  option.addEventListener("mouseleave", () => {
    selectorArrow.style.animation = "blink 1s step-start infinite";
  });
});

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

// ====== Play Button Hover Sound ======
function playButtonHover() {
  clickSound.currentTime = 0;
  clickSound.play();
}
