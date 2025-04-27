// ====== QUIZ DATA ======
const questions = [
  {
    question: "Who is the creator of Pokémon?",
    options: ["Satoshi Tajiri", "Ken Sugimori", "Shigeru Miyamoto", "Junichi Masuda"],
    answer: "Satoshi Tajiri",
    hiddenImage: "assets/KyplPage/SatoshiHidden.png",
    shownImage: "assets/KyplPage/SatoshiShown.png"
  },
  {
    question: "What year was the first Pokémon game released in Japan?",
    options: ["1995", "1996", "1997", "1998"],
    answer: "1996",
    hiddenImage: "assets/KyplPage/FirstPokemonGameHidden.png",
    shownImage: "assets/KyplPage/FirstPokemonShown.png"
  },
  {
    question: "What is the name of the first region in the Pokémon world?",
    options: ["Johto", "Sinnoh", "Kanto", "Hoenn"],
    answer: "Kanto",
    hiddenImage: null,
    shownImage: "assets/KyplPage/KantoRegionShown.png"
  },
  {
    question: "What are the names of the original Pokémon games?",
    options: ["Red & Blue", "Gold & Silver", "Ruby & Sapphire", "Diamond & Pearl"],
    answer: "Red & Blue",
    hiddenImage: null,
    shownImage: "assets/KyplPage/OriginalPokemonNameShown.png"
  },
  {
    question: "Which Pokémon is #001 in the Pokédex?",
    options: ["Pikachu", "Bulbasaur", "Charmander", "Caterpie"],
    answer: "Bulbasaur",
    hiddenImage: "assets/KyplPage/001PokemonHidden.png",
    shownImage: "assets/KyplPage/001PokemonShown.png"
  },
  {
    question: "Which Pokémon is known as the mascot of the franchise?",
    options: ["Meowth", "Charizard", "Pikachu", "Lucario"],
    answer: "Pikachu",
    hiddenImage: "assets/KyplPage/MascotHidden.png",
    shownImage: "assets/KyplPage/MascotShown.png"
  },
  {
    question: "What type combination is Charizard?",
    options: ["Fire/Flying", "Fire/Dragon", "Fire/Ground", "Fire/Steel"],
    answer: "Fire/Flying",
    hiddenImage: null,
    shownImage: "assets/KyplPage/Charizard.png"
  }
];

// ====== AUDIO ======
const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const correctSfx = document.getElementById('correct-sound');
const wrongSfx = document.getElementById('wrong-sound');

const pikachuCry = new Audio("assets/WtpPage/Pikachu.mp3");
const charizardCry = new Audio("assets/WtpPage/Charizard.mp3");
const bulbasaurCry = new Audio("assets/WtpPage/Bulbasaur.mp3");

// ====== VARIABLES ======
let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const questionImage = document.getElementById("question-image");
const progressBars = document.querySelectorAll(".progress-bar");
const choiceButtons = [
  document.getElementById("choice1"),
  document.getElementById("choice2"),
  document.getElementById("choice3"),
  document.getElementById("choice4"),
];

const feedbackOverlay = document.getElementById("feedback-overlay");
const feedbackMessage = document.getElementById("feedback-message");
const nextButton = document.getElementById("next-button");
const fadeOverlay = document.getElementById("fade-overlay");

// ====== START QUIZ ======
document.addEventListener("DOMContentLoaded", () => {
  // Fade-in effect
  fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    fadeOverlay.style.transition = 'opacity 0.8s ease';
    fadeOverlay.style.opacity = '0';
  }, 100);

  // Background music setup
  bgMusic.volume = 0;
  bgMusic.loop = true;
  bgMusic.play().then(() => {
    fadeInMusic(bgMusic);
  }).catch(() => {
    console.log("Music will start after user interaction.");
  });

  document.body.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
    }
  }, { once: true });

  shuffleArray(questions);
  loadQuestion();
});

// ====== LOAD A QUESTION ======
function loadQuestion() {
  const q = questions[currentQuestion];
  const shuffledOptions = [...q.options];
  shuffleArray(shuffledOptions);

  questionText.textContent = q.question;

  // Set the initial hidden image
  if (q.hiddenImage) {
    questionImage.src = q.hiddenImage;
  } else {
    questionImage.src = q.shownImage;
  }

  // Update progress bar
  progressBars.forEach((bar, i) => {
    bar.classList.toggle("current", i === currentQuestion);
  });

  // Set up the choice buttons
  choiceButtons.forEach((btn, i) => {
    btn.textContent = shuffledOptions[i];
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.border = "4px solid black";

    // Hover Sound
    btn.onmouseenter = () => {
      clickSound.currentTime = 0;
      clickSound.play();
    };

    btn.onclick = () => handleAnswer(btn.textContent, q.answer);
  });
}

// ====== HANDLE ANSWER ======
function handleAnswer(selected, correct) {
  const q = questions[currentQuestion];
  const isCorrect = selected === correct;

  if (isCorrect) {
    if (correct === "Pikachu") {
      pikachuCry.currentTime = 0;
      pikachuCry.play();
    } else if (correct === "Bulbasaur") {
      bulbasaurCry.currentTime = 0;
      bulbasaurCry.play();
    } else if (correct === "Fire/Flying") {
      charizardCry.currentTime = 0;
      charizardCry.play();
    } else {
      correctSfx.currentTime = 0;
      correctSfx.play();
    }
  } else {
    wrongSfx.currentTime = 0;
    wrongSfx.play();
  }

  // Reveal the correct image
  questionImage.src = q.shownImage;

  // Lock the button states
  choiceButtons.forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === correct) {
      btn.style.border = "4px solid #4CAF50";
    }
    if (btn.textContent === selected && !isCorrect) {
      btn.style.border = "4px solid red";
      btn.classList.add("shake"); // Only add shake, do not touch transform scale
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

  // Setup next question
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
  sessionStorage.setItem("kyplScore", score);
  window.location.href = "KYPL-FINALSCREEN.html";
}

// ====== Helper: Shuffle any array ======
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ====== Helper: Fade in music volume ======
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
