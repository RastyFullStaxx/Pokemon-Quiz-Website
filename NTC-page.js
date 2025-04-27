// ====== QUIZ DATA ======
const questions = [
  { name: "Pikachu", options: ["Pikachu", "Pichu", "Raichu", "Eevee"], answer: "Pikachu", cry: "assets/NtcPage/PikachuCry.mp3" },
  { name: "Snorlax", options: ["Snorlax", "Gengar", "Clefairy", "Mewtwo"], answer: "Snorlax", cry: "assets/NtcPage/SnorlaxCry.mp3" },
  { name: "Charizard", options: ["Charizard", "Pikachu", "Psyduck", "Mewtwo"], answer: "Charizard", cry: "assets/NtcPage/CharizardCry.mp3" },
  { name: "Psyduck", options: ["Gengar", "Psyduck", "Mewtwo", "Clefairy"], answer: "Psyduck", cry: "assets/NtcPage/PsyduckCry.mp3" },
  { name: "Gengar", options: ["Mewtwo", "Snorlax", "Gengar", "Clefairy"], answer: "Gengar", cry: "assets/NtcPage/GengarCry.mp3" },
  { name: "Clefairy", options: ["Clefairy", "Eevee", "Pikachu", "Charizard"], answer: "Clefairy", cry: "assets/NtcPage/ClefairyCry.mp3" },
  { name: "Mewtwo", options: ["Mewtwo", "Gengar", "Psyduck", "Charizard"], answer: "Mewtwo", cry: "assets/NtcPage/MewtwoCry.mp3" }
];

// ====== AUDIO ======
const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const wrongSfx = document.getElementById('wrong-sound');
const correctSfx = document.getElementById('correct-sound');

// ====== VARIABLES ======
let currentQuestion = 0;
let score = 0;
let currentCry = null;

const audioButton = document.getElementById("audio-button");
const choiceButtons = [
  document.getElementById("choice1"),
  document.getElementById("choice2"),
  document.getElementById("choice3"),
  document.getElementById("choice4"),
];
const progressBars = document.querySelectorAll(".progress-bar");
const feedbackOverlay = document.getElementById("feedback-overlay");
const feedbackMessage = document.getElementById("feedback-message");
const nextButton = document.getElementById("next-button");
const fadeOverlay = document.getElementById("fade-overlay");

// ====== START ======
document.addEventListener("DOMContentLoaded", () => {
  fadeOverlay.style.opacity = "1";
  setTimeout(() => {
    fadeOverlay.style.transition = "opacity 0.8s ease";
    fadeOverlay.style.opacity = "0";
  }, 100);

  bgMusic.volume = 0;
  bgMusic.loop = true;

  bgMusic.play()
    .then(() => fadeInMusic(bgMusic))
    .catch(() => {
      console.log("Background music will start after user interaction.");
    });

  shuffleArray(questions);
  loadQuestion();

  // User first click to rescue both bgMusic and cry
  document.body.addEventListener("click", () => {
    if (bgMusic.paused) bgMusic.play();
    if (currentCry && currentCry.paused) {
      currentCry.play().catch(err => console.log("Cry retry failed:", err));
    }
  }, { once: true });
});

// ====== LOAD A QUESTION ======
function loadQuestion() {
  const q = questions[currentQuestion];
  const shuffledOptions = [...q.options];
  shuffleArray(shuffledOptions);

  // Load choices
  choiceButtons.forEach((btn, i) => {
    btn.textContent = shuffledOptions[i];
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.border = "4px solid black";

    btn.onmouseenter = () => {
      clickSound.currentTime = 0;
      clickSound.play();
    };

    btn.onclick = () => handleAnswer(btn.textContent, q.answer);
  });

  // Play cry
  if (currentCry) currentCry.pause();
  currentCry = new Audio(q.cry);
  currentCry.volume = 1;
  currentCry.play().catch(() => {
    console.log("Cry will wait for user interaction.");
  });

  // Replay cry on audio button
  audioButton.onclick = () => {
    if (currentCry) {
      currentCry.currentTime = 0;
      currentCry.play().catch(err => console.log("Cry replay error:", err));
    }
    clickSound.currentTime = 0;
    clickSound.play();
  };

  // Update progress bar
  progressBars.forEach((bar, i) => {
    bar.classList.toggle("current", i === currentQuestion);
  });
}

// ====== HANDLE ANSWER ======
function handleAnswer(selected, correct) {
  const isCorrect = selected === correct;

  if (isCorrect) {
    correctSfx.currentTime = 0;
    correctSfx.play();
  } else {
    wrongSfx.currentTime = 0;
    wrongSfx.play();
  }

  choiceButtons.forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === correct) {
      btn.style.border = "4px solid #4CAF50";
    }
    if (btn.textContent === selected && !isCorrect) {
      btn.style.border = "4px solid red";
      btn.classList.add("shake");
    }
    if (btn.textContent !== correct && btn.textContent !== selected) {
      btn.style.opacity = 0.4;
    }
  });

  if (isCorrect) score++;

  feedbackMessage.src = isCorrect
    ? "assets/shared/CorrectAnsMessage.png"
    : "assets/shared/WrongAnsMessage.png";

  feedbackOverlay.classList.add("active");

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
  sessionStorage.setItem("ntcScore", score);
  window.location.href = "NTC-FINALSCREEN.html";
}

// ====== HELPERS ======
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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
