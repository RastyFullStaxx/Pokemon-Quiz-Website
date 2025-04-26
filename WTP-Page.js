import { unlockTrophy } from './trophyManager.js';

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
const correctSfx = new Audio("assets/sfx/correct.mp3");
const wrongSfx = new Audio("assets/sfx/wrong.mp3");

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

// ====== START QUIZ ======
document.addEventListener("DOMContentLoaded", () => {
  shuffleArray(questions); // Shuffle questions at start
  loadQuestion();
});

// ====== LOAD A QUESTION ======
function loadQuestion() {
  const q = questions[currentQuestion];

  // Shuffle the options for this question
  const shuffledOptions = [...q.options];
  shuffleArray(shuffledOptions);

  // Update the Pokémon guessing image
  image.src = `assets/WtpPage/${q.name}1.png`;

  // Update progress bar
  progressBars.forEach((bar, i) => {
    bar.classList.toggle("current", i === currentQuestion);
  });

  // Load shuffled options into buttons
  choiceButtons.forEach((btn, i) => {
    btn.textContent = shuffledOptions[i];
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.border = "4px solid black"; // <<< ADD THIS line here
    btn.style.transform = "scale(1)"; // (optional reset if you want clean)
  
    btn.onclick = () => handleAnswer(btn.textContent, q.answer);
  });
  
}

// ====== HANDLE ANSWER ======
function handleAnswer(selected, correct) {
  const isCorrect = selected === correct;

  // Play sound
  isCorrect ? correctSfx.play() : wrongSfx.play();

  // Swap image to revealed form
  image.src = `assets/WtpPage/${questions[currentQuestion].name}2.png`;

  // Update button visuals
  choiceButtons.forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === correct) {
      btn.style.border = "4px solid #4CAF50";
      btn.style.transform = "scale(1.04)";
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

  // Next Question or End
  nextButton.onclick = () => {
    feedbackOverlay.classList.remove("active");

    choiceButtons.forEach(btn => {
      btn.style.border = "2px solid black";
      btn.style.transform = "scale(1)";
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
  sessionStorage.setItem("wtpScore", score); // Save score
  window.location.href = "WTP-FINALSCREEN.html"; // Redirect to final result screen
}

// ====== HELPER: Shuffle any array ======
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
