import { unlockTrophy } from './trophyManager.js';

// ====== QUIZ DATA ======
const questions = [
  {
    name: "Pikachu",
    options: ["Raichu", "Pikachu", "Pichu", "Eevee"],
    answer: "Pikachu"
  },
  {
    name: "Bulbasaur",
    options: ["Bulbasaur", "Ivysaur", "Oddish", "Bellsprout"],
    answer: "Bulbasaur"
  },
  {
    name: "Charmander",
    options: ["Charmeleon", "Charmander", "Vulpix", "Growlithe"],
    answer: "Charmander"
  },
  {
    name: "Squirtle",
    options: ["Wartortle", "Totodile", "Psyduck", "Squirtle"],
    answer: "Squirtle"
  },
  {
    name: "Jigglypuff",
    options: ["Clefairy", "Chansey", "Jigglypuff", "Snubbull"],
    answer: "Jigglypuff"
  },
  {
    name: "Meowth",
    options: ["Skitty", "Meowth", "Espurr", "Glameow"],
    answer: "Meowth"
  },
  {
    name: "Psyduck",
    options: ["Psyduck", "Golduck", "Magikarp", "Slowpoke"],
    answer: "Psyduck"
  }
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

// ====== CREATE RESULT CONTAINER ======
const resultContainer = document.createElement("div");
resultContainer.id = "result-container";
resultContainer.classList.add("hidden");
document.body.appendChild(resultContainer);

resultContainer.innerHTML = `
  <p id="result-text"></p>
  <button id="restart-button">Play Again</button>
`;

const resultText = document.getElementById("result-text");
const restartButton = document.getElementById("restart-button");

// ====== LOAD A QUESTION ======
function loadQuestion() {
  const q = questions[currentQuestion];
  image.src = `assets/WtpPage/${q.name}1.png`;

  // Update progress bar
  progressBars.forEach((bar, i) => {
    bar.classList.toggle("current", i === currentQuestion);
  });

  // Load options
  choiceButtons.forEach((btn, i) => {
    btn.textContent = q.options[i];
    btn.disabled = false;
    btn.style.opacity = 1;

    btn.onclick = () => handleAnswer(btn.textContent, q.answer);
  });
}

// ====== HANDLE ANSWER ======
function handleAnswer(selected, correct) {
    const isCorrect = selected === correct;
  
    // Play sound
    if (isCorrect) {
      correctSfx.play();
    } else {
      wrongSfx.play();
    }
  
    // Swap image
    image.src = `assets/WtpPage/${questions[currentQuestion].name}2.png`;
  
    // Update buttons
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
  
    // Show feedback
    feedbackMessage.src = isCorrect
      ? "assets/shared/CorrectAnsMessage.png"
      : "assets/shared/WrongAnsMessage.png";
  
    feedbackOverlay.classList.add("active");
  
    // Next
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
    choicesContainer.classList.add("hidden");
  
    if (score === questions.length) {
      unlockTrophy("wtp");
      resultText.textContent = `Perfect! ${score}/7 — You unlocked the WTP trophy! 🎉`;
    } else {
      resultText.textContent = `You scored ${score}/7. Try again to unlock the trophy!`;
    }
  
    resultContainer.classList.remove("hidden");
  }
  
  // ====== RESTART ======
  restartButton.onclick = () => {
    currentQuestion = 0;
    score = 0;
    resultContainer.classList.add("hidden");
    choicesContainer.classList.remove("hidden");
    loadQuestion();
  };
  
  // ====== START ======
  document.addEventListener("DOMContentLoaded", () => {
    loadQuestion();
  });