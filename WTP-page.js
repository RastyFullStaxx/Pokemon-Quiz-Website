// ====== QUIZ DATA ======
const questions = [
  { name: "Pikachu", options: ["Raichu", "Pikachu", "Pichu", "Eevee"], answer: "Pikachu" },
  { name: "Bulbasaur", options: ["Bulbasaur", "Ivysaur", "Oddish", "Bellsprout"], answer: "Bulbasaur" },
  { name: "Charmander", options: ["Charmeleon", "Charmander", "Vulpix", "Growlithe"], answer: "Charmander" },
  { name: "Squirtle", options: ["Wartortle", "Totodile", "Psyduck", "Squirtle"], answer: "Squirtle" },
  { name: "Jigglypuff", options: ["Clefairy", "Chansey", "Jigglypuff", "Snubbull"], answer: "Jigglypuff" },
  { name: "Meowth", options: ["Skitty", "Meowth", "Espurr", "Glameow"], answer: "Meowth" },
  { name: "Psyduck", options: ["Psyduck", "Golduck", "Magikarp", "Slowpoke"], answer: "Psyduck" }
];

// ====== AUDIO ======
const whoSound = new Audio("assets/WtpPage/WhosThatPokemon.mp3");
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const wrongSfx = document.getElementById("wrong-sound");
const correctSfx = document.getElementById("correct-sound");


// ====== VARIABLES ======
let currentQuestion = 0;
let score = 0;

const image = document.getElementById("pokemon-image");
const progressBars = document.querySelectorAll(".progress-bar");
const choicesContainer = document.querySelector(".choices-container");
const choiceButtons = [
  document.getElementById("choice1"),
  document.getElementById("choice2"),
  document.getElementById("choice3"),
  document.getElementById("choice4"),
];

const feedbackOverlay = document.getElementById("feedback-overlay");
const feedbackMessage = document.getElementById("feedback-message");
const nextButton = document.getElementById("next-button");
const fadeOverlay = document.getElementById("fade-overlay"); // for transition

// ====== START QUIZ ======
document.addEventListener("DOMContentLoaded", () => {
  const fadeOverlay = document.getElementById("fade-overlay");

  // Fade in screen
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  // Play "Who's That Pokémon" first
  whoSound.volume = 1;
  whoSound.play().then(() => {
    console.log("WhoSound playing...");
  }).catch(() => {
    console.log("WhosThatPokemon.mp3 will play after interaction.");
  });

  // After Who's That Pokémon Yell finishes
  whoSound.addEventListener('ended', () => {
    // Only after whoSound ends, we play bgMusic
    bgMusic.volume = 0;
    bgMusic.loop = true;
    bgMusic.preload = 'auto';
    bgMusic.play().then(() => {
      fadeInMusic(bgMusic);
    }).catch(() => {
      console.log("Background music will start after user interaction.");
    });
  });

  // Force play on first user interaction if needed
  document.body.addEventListener('click', () => {
    if (whoSound.paused) {
      whoSound.play();
    }
    if (bgMusic.paused) {
      bgMusic.play();
    }
  }, { once: true });

  shuffleArray(questions);
  loadQuestion();
});

// ====== Fade in background music gradually ======
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

// ====== LOAD A QUESTION ======
function loadQuestion() {
  const q = questions[currentQuestion];

  const shuffledOptions = [...q.options];
  shuffleArray(shuffledOptions);

  image.src = `assets/WtpPage/${q.name}1.png`;

  progressBars.forEach((bar, i) => {
    bar.classList.toggle("current", i === currentQuestion);
  });

  choiceButtons.forEach((btn, i) => {
    btn.textContent = shuffledOptions[i];
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.border = "4px solid black";

    // Hover sound
    btn.addEventListener('mouseenter', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });

    btn.onclick = () => handleAnswer(btn.textContent, q.answer);
  });
}

// ====== HANDLE ANSWER ======
function handleAnswer(selected, correct) {
  const isCorrect = selected === correct;

  // Dynamic correct sound based on Pokémon name
  const correctCry = new Audio(`assets/WtpPage/${questions[currentQuestion].name}.mp3`);
  correctCry.preload = 'auto';

  if (isCorrect) {
    correctCry.currentTime = 0;
    correctCry.play();
  } else {
    wrongSfx.currentTime = 0;
    wrongSfx.play();
  }

  // Swap image to revealed form
  image.src = `assets/WtpPage/${questions[currentQuestion].name}2.png`;

  choiceButtons.forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === correct) {
      btn.style.border = "4px solid #4CAF50";
      btn.style.opacity = 1;
    }
    if (btn.textContent === selected && !isCorrect) {
      btn.style.border = "4px solid red";
      btn.style.transform = "scale(1.04)";
      btn.style.opacity = 1;
      btn.classList.add("shake");
    }
    if (btn.textContent !== correct && btn.textContent !== selected) {
      btn.style.opacity = 0.4;
    }
  });

  if (isCorrect) score++;

  // Show feedback overlay
  feedbackMessage.src = isCorrect
    ? "assets/shared/CorrectAnsMessage.png"
    : "assets/shared/WrongAnsMessage.png";

  feedbackOverlay.classList.add("active");

  // Next question or end
  nextButton.onclick = () => {
    feedbackOverlay.classList.remove("active");

    choiceButtons.forEach(btn => {
      btn.style.border = "4px solid black";
      btn.style.opacity = 1;
      btn.classList.remove("shake");
    });

    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      endQuiz();
    }
  };
}

// ====== END QUIZ ======
function endQuiz() {
  sessionStorage.setItem("wtpScore", score);

  if (score === questions.length) {
    sessionStorage.setItem("wtpTrophy", "unlocked");
    sessionStorage.setItem("kyplUnlocked", "true");
  }

  // Fade out before navigating to final screen
  fadeOverlay.style.transition = 'opacity 0.8s ease';
  fadeOverlay.style.opacity = '1';

  setTimeout(() => {
    window.location.href = "WTP-FINALSCREEN.html";
  }, 800);
}

// ====== HELPER: Shuffle any array ======
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
