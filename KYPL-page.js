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
  const correctSfx = new Audio("assets/sfx/correct.mp3");
  const wrongSfx = new Audio("assets/sfx/wrong.mp3");
  
  // ====== VARIABLES ======
  let currentQuestion = 0;
  let score = 0;
  
  const questionText = document.getElementById("question-text");
  const questionImage = document.getElementById("question-image");
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
    shuffleArray(questions);
    loadQuestion();
  });
  
  // ====== LOAD A QUESTION ======
  function loadQuestion() {
    const q = questions[currentQuestion];
  
    // Shuffle the choices
    const shuffledOptions = [...q.options];
    shuffleArray(shuffledOptions);
  
    // Update the question text
    questionText.textContent = q.question;
  
    // Set hidden image if exists, otherwise show final image
    if (q.hiddenImage) {
      questionImage.src = q.hiddenImage;
    } else {
      questionImage.src = q.shownImage;
    } 
  
    // Update progress bar
    progressBars.forEach((bar, i) => {
      bar.classList.toggle("current", i === currentQuestion);
    });
  
    // Load shuffled options into buttons
    choiceButtons.forEach((btn, i) => {
      btn.textContent = shuffledOptions[i];
      btn.disabled = false;
      btn.style.opacity = 1;
      btn.style.border = "4px solid black"; 
      btn.style.transform = "scale(1)";
  
      btn.onclick = () => handleAnswer(btn.textContent, q.answer);
    });
  }
  
  // ====== HANDLE ANSWER ======
  function handleAnswer(selected, correct) {
    const q = questions[currentQuestion];
    const isCorrect = selected === correct;
  
    // Play sound
    isCorrect ? correctSfx.play() : wrongSfx.play();
  
    // Button visuals
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
  
    // Show correct/reveal image
    questionImage.src = q.shownImage;
  
    // Show feedback overlay
    feedbackMessage.src = isCorrect
      ? "assets/shared/CorrectAnsMessage.png"
      : "assets/shared/WrongAnsMessage.png";
  
    feedbackOverlay.classList.add("active");
  
    // Next Question or End
    nextButton.onclick = () => {
      feedbackOverlay.classList.remove("active");
  
      choiceButtons.forEach(btn => {
        btn.style.border = "4px solid black";
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
    sessionStorage.setItem("kyplScore", score); // Save score
    window.location.href = "KYPL-FINALSCREEN.html"; // Redirect to final result page
  }
  
  // ====== HELPER: Shuffle any array ======
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  